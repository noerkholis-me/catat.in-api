import { Prisma } from "@prisma/client";
import { PrismaService } from "@/prisma/prisma.service";
import {
  Logger,
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import {
  CreateExpenseDto,
  ExpenseResponseDto,
  QueryExpenseDto,
  UpdateExpenseDto,
} from "./dto";

@Injectable()
export class ExpensesService {
  private readonly logger = new Logger(ExpensesService.name);

  constructor(private prisma: PrismaService) {}

  async create(userId: string, createExpenseDto: CreateExpenseDto) {
    const category = await this.prisma.category.findUnique({
      where: {
        id: createExpenseDto.categoryId,
      },
    });
    if (!category) throw new NotFoundException("Kategori tidak ditemukan");

    if (createExpenseDto.budgetId) {
      const budget = await this.prisma.budget.findFirst({
        where: {
          id: createExpenseDto.budgetId,
          userId,
        },
      });
      if (!budget) throw new BadRequestException("Budget tidak ditemukan");
    }

    const expense = await this.prisma.expense.create({
      data: {
        ...createExpenseDto,
        userId,
        expenseDate: new Date(createExpenseDto.expenseDate),
        quantity: createExpenseDto.quantity || 1,
      },
      include: {
        budget: true,
        category: true,
        childExpenses: true,
      },
    });
    await this.updateUserStreak(userId).catch((err) => {
      this.logger.warn("Streak update failed", err);
    });

    return expense;
  }

  async findAll(userId: string, queryExpenseDto: QueryExpenseDto) {
    const { startDate, endDate, page, limit, budgetId, categoryId } =
      queryExpenseDto;
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException("User tidak ditemukan");

    const where: Prisma.ExpenseWhereInput = {
      userId,
      deletedAt: null,
    };

    if (startDate && endDate) {
      where.expenseDate = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    } else if (startDate) {
      where.expenseDate = {
        gte: new Date(startDate),
      };
    } else if (endDate) {
      where.expenseDate = {
        lte: new Date(endDate),
      };
    }

    if (categoryId) where.categoryId = categoryId;
    if (budgetId) where.budgetId = budgetId;

    const skip = (page - 1) * limit;

    const [expenses, total] = await Promise.all([
      this.prisma.expense.findMany({
        where,
        include: {
          category: true,
          budget: {
            select: {
              id: true,
              month: true,
              year: true,
            },
          },
          childExpenses: { include: { category: true } },
        },
        orderBy: { expenseDate: "desc" },
      }),
      this.prisma.expense.count({ where }),
    ]);

    return {
      data: expenses,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.floor(total / limit),
      },
    };
  }

  async findOne(id: string, userId: string): Promise<ExpenseResponseDto> {
    const includeBudget: Prisma.BudgetSelect = {
      id: true,
      month: true,
      year: true,
    };

    const includeCategory: Prisma.CategorySelect = {
      id: true,
      name: true,
      type: true,
      icon: true,
      color: true,
    };

    const expense = this.prisma.expense.findUnique({
      where: { id, deletedAt: null },
      include: {
        budget: { select: includeBudget },
        category: { select: includeCategory },
        childExpenses: {
          include: {
            category: { select: includeCategory },
            budget: { select: includeBudget },
          },
        },
      },
    });
    if (!expense) throw new NotFoundException("Pengeluaran tidak ditemukan");

    return expense;
  }

  async update(id: string, userId: string, updateExpenseDto: UpdateExpenseDto) {
    await this.findOne(id, userId);

    if (updateExpenseDto.categoryId) {
      const category = this.prisma.category.findUnique({
        where: { id: updateExpenseDto.categoryId },
      });
      if (!category) throw new NotFoundException("Kategori tidak ditemukan");
    }

    const updated = await this.prisma.expense.update({
      where: { id },
      data: updateExpenseDto,
      include: {
        category: true,
        budget: true,
        childExpenses: true,
      },
    });

    return updated;
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    await this.prisma.expense.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return {
      message: "Pengeluaran berhasil dihapus",
    };
  }

  // Need to fix quick
  async getTodayTotal(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 2);

    console.log(tomorrow);
    const result = await this.prisma.expense.aggregate({
      where: {
        userId,
        expenseDate: {
          gte: today,
          lt: tomorrow,
        },
        deletedAt: null,
      },
      _sum: {
        amount: true,
      },
      _count: true,
    });

    console.log(result);

    return {
      total: result._sum.amount || 0,
      count: result._count,
      date: today.toISOString().split("T")[0],
    };
  }

  private async updateUserStreak(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        lastEntryDate: true,
        currentStreak: true,
        longestStreak: true,
      },
    });
    if (!user) return;
    console.log("User ===> ", user);

    const today = new Date();
    console.log("raw today ===> ", today);
    today.setHours(0, 0, 0, 0);

    const lastEntry = user.lastEntryDate ? new Date(user.lastEntryDate) : null;
    console.log("lastEntry ===> ", lastEntry);

    if (!lastEntry) {
      const firstStreak = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          currentStreak: 1,
          longestStreak: 1,
          lastEntryDate: today,
        },
      });
      console.log("First streak ===> ", firstStreak);

      return;
    }

    lastEntry.setHours(0, 0, 0, 0);
    const diffDays = Math.floor(
      (today.getTime() - lastEntry.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays === 0) return;

    if (diffDays === 1) {
      const newStreak = user.currentStreak + 1;
      const newLongestStreak = Math.max(newStreak, user.longestStreak);
      console.log("newLongestStreak ===> ", newLongestStreak);

      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          currentStreak: newStreak,
          longestStreak: newLongestStreak,
          lastEntryDate: today,
        },
      });
    } else {
      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          currentStreak: 1,
          lastEntryDate: today,
        },
      });
    }
  }
}
