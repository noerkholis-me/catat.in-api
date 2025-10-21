import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";

export class GoalResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ example: "10000000" })
  targetAmount: number;
}

export class BudgetResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  month: number;

  @ApiProperty({ example: "800000" })
  totalIncome: number;

  @ApiPropertyOptional({ example: "50" })
  needsPercentage: number;

  @ApiPropertyOptional({ example: "30" })
  wantsPercentage: number;

  @ApiPropertyOptional({ example: "20" })
  savingsPercentage: number;

  @ApiPropertyOptional({ example: "4000000" })
  needsAmount: number;

  @ApiPropertyOptional({ example: "2400000" })
  wantsAmount: number;

  @ApiPropertyOptional({ example: "1600000" })
  savingsAmount: number;

  @ApiPropertyOptional({ example: "20000" })
  dailyBudget: number;

  @ApiPropertyOptional()
  notes: string;

  @ApiPropertyOptional({ type: GoalResponseDto })
  goal?: GoalResponseDto;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
