import { BadRequestException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { Goal } from "@prisma/client";
import { CreateGoalDto, UpdateGoalDto } from "./dto";

@Injectable()
export class GoalsService {
  private readonly logger = new Logger(GoalsService.name);

  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateGoalDto) {
    if (dto.targetDate) {
      const targetDate = new Date(dto.targetDate);
      this.validateTargetDate(targetDate);
    }

    const goal = await this.prisma.goal.create({
      data: {
        ...dto,
        userId,
        targetDate: dto.targetDate ? new Date(dto.targetDate) : null,
        isActive: true,
      },
    });

    return {
      ...goal,
      targetAmount: goal.targetAmount.toNumber() ?? null,
    };
  }

  async findAll(userId: string) {
    const goals = await this.prisma.goal.findMany({
      where: { userId, deletedAt: null },
      orderBy: [{ isActive: "desc" }, { createdAt: "desc" }],
    });

    return goals.map((goal) => ({
      ...goal,
      targetAmount: goal.targetAmount.toNumber() ?? null,
    }));
  }

  async findActiveGoals(userId: string) {
    const goals = await this.prisma.goal.findMany({
      where: { userId, isActive: true, deletedAt: null },
      orderBy: [{ isActive: "desc" }, { createdAt: "desc" }],
    });

    return goals.map((goal) => ({
      ...goal,
      targetAmount: goal.targetAmount.toNumber() ?? null,
    }));
  }

  async findOne(id: string, userId: string) {
    const goal = await this.findOneUnique(id, userId);

    const calculateGoalProgress = goal.targetAmount
      ? await this.calculateGoalProgress(goal, userId)
      : null;

    return {
      ...goal,
      ...calculateGoalProgress,
      targetAmount: goal.targetAmount.toNumber() ?? null,
    };
  }

  async update(id: string, userId: string, dto: UpdateGoalDto) {
    await this.findOneUnique(id, userId);
    if (dto.targetDate) {
      const targetDate = new Date(dto.targetDate);
      this.validateTargetDate(targetDate);
    }

    const updated = await this.prisma.goal.update({
      where: { id, userId },
      data: { ...dto, targetDate: dto.targetDate ? new Date(dto.targetDate) : null },
    });

    return {
      ...updated,
      targetAmount: updated.targetAmount.toNumber() ?? null,
    };
  }

  async remove(id: string, userId: string) {
    await this.findOneUnique(id, userId);

    await this.prisma.goal.update({
      where: { id, userId },
      data: { deletedAt: new Date() },
    });

    const goalLinkedBudgetCount = await this.prisma.budget.count({ where: { userId, goalId: id } });

    return {
      message: goalLinkedBudgetCount
        ? `Goal berhasil dihapus. Namun terdapat ${goalLinkedBudgetCount} linked pada budget`
        : "Goal berhasil dihapus",
    };
  }
  async markAsAchieved(id: string, userId: string) {
    const goal = await this.findOneUnique(id, userId);
    if (!goal.isActive) throw new BadRequestException("Goal sudah tidak aktif");

    const updated = await this.prisma.goal.update({
      where: { id, userId },
      data: { achievedAt: new Date(), isActive: false },
    });

    return {
      ...updated,
      targetAmount: updated.targetAmount.toNumber() ?? null,
    };
  }

  async getProgress(id: string, userId: string) {
    const goal = await this.findOneUnique(id, userId);

    const calculateGoalProgress = goal.targetAmount
      ? await this.calculateGoalProgress(goal, userId)
      : null;

    return {
      ...goal,
      ...calculateGoalProgress,
      targetAmount: goal.targetAmount.toNumber() ?? null,
    };
  }

  private async findOneUnique(id: string, userId: string) {
    const goal = await this.prisma.goal.findFirst({ where: { id, userId, deletedAt: null } });
    if (!goal) {
      throw new NotFoundException("Goal tidak ditemukan");
    }
    return goal;
  }

  private async calculateGoalProgress(goal: Goal, userId: string) {
    const goalTargetAmount = goal.targetAmount.toNumber();
    const linkedBudgets = await this.prisma.budget.findMany({
      where: { goalId: goal.id },
    });

    const currentAmount = linkedBudgets.reduce(
      (sum, budget) => sum + budget.savingsAmount.toNumber(),
      0,
    );

    const progressPercentage = goal.targetAmount ? (currentAmount / goalTargetAmount) * 100 : null;
    const remainingAmount = goal.targetAmount ? goalTargetAmount - currentAmount : null;
    const daysRemaining = goal.targetDate
      ? Math.ceil((new Date(goal.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      : null;

    let status: "on_track" | "warning" | "overdue" | null = null;

    if (daysRemaining !== null) {
      if (daysRemaining < 0) {
        status = "overdue";
      } else if (daysRemaining < 30) {
        status = "warning";
      } else {
        status = "on_track";
      }
    }

    return {
      currentAmount,
      progressPercentage,
      remainingAmount,
      daysRemaining,
      status,
    };
  }

  private validateTargetDate(targetDate: Date) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (targetDate < now) {
      throw new BadRequestException("Target date tidak boleh di masa lalu");
    }
  }
}
