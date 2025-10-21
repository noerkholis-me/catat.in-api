import { BudgetResponseDto } from "./budget-response.dto";
import { ApiProperty } from "@nestjs/swagger";

export class SpendingDto {
  @ApiProperty()
  totalSpent: number;

  @ApiProperty()
  needsSpent: number;

  @ApiProperty()
  wantsSpent: number;

  @ApiProperty()
  savingsSpent: number;
}

export class RemainingDto {
  @ApiProperty()
  total: number;

  @ApiProperty()
  needs: number;

  @ApiProperty()
  wants: number;

  @ApiProperty()
  savings: number;
}

export class BudgetSummaryDto {
  @ApiProperty({ type: () => BudgetResponseDto })
  budget: BudgetResponseDto;

  @ApiProperty({ type: () => SpendingDto })
  spending: SpendingDto;

  @ApiProperty({ type: () => RemainingDto })
  remaining: RemainingDto;

  @ApiProperty({ enum: ["on_track", "warning", "over_budget"] })
  status: "on_track" | "warning" | "over_budget";

  @ApiProperty({ description: "Adherence percentage: (spent / budget) * 100", example: 75.5 })
  adherencePercentage: number;
}
