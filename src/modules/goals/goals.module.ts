import { Module } from "@nestjs/common";
import { GoalsService } from "./goals.service";
import { GoalsController } from "./goals.controller";
import { BudgetsService } from "../budgets/budgets.service";

@Module({
  controllers: [GoalsController],
  providers: [GoalsService, BudgetsService],
})
export class GoalsModule {}
