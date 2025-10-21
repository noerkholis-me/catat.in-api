import { ConflictException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { CreateBudgetDto, UpdateBudgetDto } from "./dto";
import { PrismaService } from "@/prisma/prisma.service";
import { BudgetResponseDto } from "./dto/budget-response.dto";
import { Budget, Prisma } from "@prisma/client";

@Injectable()
export class BudgetsService {
  private readonly logger = new Logger(BudgetsService.name);

  constructor(private prisma: PrismaService) {}

  async create(userId: string, createBudgetDto: CreateBudgetDto) {
    const {
      month,
      year,
      totalIncome,
      needsPercentage,
      wantsPercentage,
      savingsPercentage,
      goalId,
    } = createBudgetDto;

    try {
      const { needsAmount, wantsAmount, savingsAmount } = this.calculateAmount(totalIncome, {
        needsPercentage,
        wantsPercentage,
        savingsPercentage,
      });

      if (goalId) await this.findGoalById(goalId);

      const budget = await this.prisma.budget.create({
        data: {
          userId,
          needsAmount,
          wantsAmount,
          savingsAmount,
          ...createBudgetDto,
        },
        include: {
          goal: {
            select: {
              id: true,
              title: true,
              targetAmount: true,
            },
          },
        },
      });

      return this.transformBudgetResponse(budget);
    } catch (error) {
      if (error.code === "P2002")
        throw new ConflictException(`Budget untuk ${month}/${year} sudah ada`);

      throw new Error(error.message);
    }
  }

  async findAll(userId: string) {
    const budget = await this.prisma.budget.findMany({
      where: { userId },
      orderBy: [{ year: "desc" }, { month: "desc" }],
      include: {
        goal: {
          select: {
            id: true,
            title: true,
            targetAmount: true,
          },
        },
      },
    });

    return budget.map((item) => this.transformBudgetResponse(item));
  }

  async getCurrentMonth(userId: string) {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    const budget = await this.prisma.budget.findFirst({
      where: { userId, year, month },
      include: { goal: true },
    });
    if (!budget) return null;

    return this.transformBudgetResponse(budget);
  }

  async getByMonthYear(userId: string, year: number, month: number) {
    const budget = await this.prisma.budget.findFirst({
      where: { userId, year, month },
      include: { goal: true },
    });
    if (!budget)
      throw new NotFoundException(`Budget pada tahun ${year} di bulan ${month} tidak ditemukan`);

    return this.transformBudgetResponse(budget);
  }

  async findOne(userId: string, id: string) {
    const budget = await this.prisma.budget.findUnique({
      where: { id, userId },
      include: {
        goal: {
          select: {
            id: true,
            title: true,
            targetAmount: true,
          },
        },
      },
    });
    if (!budget) throw new NotFoundException("Budget tidak ditemukan");

    return this.transformBudgetResponse(budget);
  }

  async update(id: string, userId: string, updateBudgetDto: UpdateBudgetDto) {
    try {
      const budget = await this.findOne(userId, id);

      const needsPercentage = updateBudgetDto.needsPercentage ?? budget.needsPercentage;
      const wantsPercentage = updateBudgetDto.wantsPercentage ?? budget.wantsPercentage;
      const savingsPercentage = updateBudgetDto.savingsPercentage ?? budget.savingsPercentage;
      const totalIncome = updateBudgetDto.totalIncome ?? budget.totalIncome;

      const { needsAmount, wantsAmount, savingsAmount } = this.calculateAmount(totalIncome, {
        needsPercentage,
        wantsPercentage,
        savingsPercentage,
      });

      if (updateBudgetDto.goalId) await this.findGoalById(updateBudgetDto.goalId);

      const updated = await this.prisma.budget.update({
        where: { id, userId },
        data: {
          needsAmount,
          wantsAmount,
          savingsAmount,
          ...updateBudgetDto,
        },
        include: {
          goal: {
            select: { id: true, title: true, targetAmount: true },
          },
        },
      });

      return this.transformBudgetResponse(updated);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async remove(id: string, userId: string) {
    await this.findOne(userId, id);

    const budgetExpenseCount = await this.prisma.expense.count({
      where: { budgetId: id },
    });

    await this.prisma.budget.delete({
      where: { id },
    });

    return {
      message: budgetExpenseCount
        ? `Budget berhasil dihapus. Namun terdapat ${budgetExpenseCount} linked pada expenses`
        : "Budget berhasil dihapus",
    };
  }

  async getSummary(id: string, userId: string) {
    const budget = await this.findOne(userId, id);
    const startDate = new Date(budget.year, budget.month - 1, 1);
    const endDate = new Date(budget.year, budget.month, 0, 23, 59, 59);

    const expenses = await this.prisma.expense.findMany({
      where: {
        budgetId: budget.id,
        expenseDate: {
          gte: startDate,
          lte: endDate,
        },
        deletedAt: null,
      },
      include: { category: true },
    });

    const needsSpent = expenses
      .filter((e) => e.category.type === "needs")
      .reduce((sum, e) => sum + Number(e.amount), 0);

    const wantsSpent = expenses
      .filter((e) => e.category.type === "wants")
      .reduce((sum, e) => sum + Number(e.amount), 0);

    const savingsSpent = expenses
      .filter((e) => e.category.type === "savings")
      .reduce((sum, e) => sum + Number(e.amount), 0);

    const totalSpent = needsSpent + wantsSpent + savingsSpent;

    const needsRemaining = budget.needsAmount - needsSpent;
    const wantsRemaining = budget.wantsAmount - wantsSpent;
    const savingsRemaining = budget.savingsAmount - savingsSpent;
    const totalRemaining = needsRemaining + wantsRemaining + savingsRemaining;
    return {
      budget: {
        ...budget,
        totalIncome: budget.totalIncome,
      },
      spending: {
        totalSpent,
        needsSpent,
        wantsSpent,
        savingsSpent,
      },
      remaining: {
        total: totalRemaining,
        needs: needsRemaining,
        wants: wantsRemaining,
        savings: savingsRemaining,
      },
      status: this.determineBudgetStatus(totalSpent, budget.totalIncome),
      adherencePercentage: (totalSpent / budget.totalIncome) * 100,
    };
  }

  async findGoalById(goalId: string) {
    const goal = await this.prisma.goal.findUnique({ where: { id: goalId } });
    if (!goal) throw new NotFoundException("Goal tidak ditemukan");
  }

  private calculateAmount(
    totalIncome: number,
    percentages: { needsPercentage: number; wantsPercentage: number; savingsPercentage: number },
  ) {
    return {
      needsAmount: (totalIncome * percentages.needsPercentage) / 100,
      wantsAmount: (totalIncome * percentages.wantsPercentage) / 100,
      savingsAmount: (totalIncome * percentages.savingsPercentage) / 100,
    };
  }

  private determineBudgetStatus(spent: number, budget: number) {
    const percentage = (spent / budget) * 100;
    if (percentage >= 100) return "over_budget";
    if (percentage >= 90) return "warning";
    return "on_track";
  }

  private transformBudgetResponse(
    budget: Budget & { goal?: { id: string; title: string; targetAmount: Prisma.Decimal } | null },
  ) {
    return {
      ...budget,
      totalIncome: budget.totalIncome.toNumber(),
      needsPercentage: budget.needsPercentage.toNumber(),
      wantsPercentage: budget.wantsPercentage.toNumber(),
      savingsPercentage: budget.savingsPercentage.toNumber(),
      needsAmount: budget.needsAmount.toNumber(),
      wantsAmount: budget.wantsAmount.toNumber(),
      savingsAmount: budget.savingsAmount.toNumber(),
      dailyBudget: budget.dailyBudget?.toNumber() ?? null,
      goal: budget.goal
        ? {
            ...budget.goal,
            targetAmount: budget.goal.targetAmount.toNumber(),
          }
        : null,
    };
  }
}
