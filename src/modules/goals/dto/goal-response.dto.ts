import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class GoalResponseDto {
  @ApiProperty({ example: "550e8400-e29b-41d4-a716-446655440000" })
  id: string;

  @ApiProperty({ example: "Buy a New House" })
  title: string;

  @ApiPropertyOptional({ example: "Save money for house down payment" })
  description?: string;

  @ApiPropertyOptional({ example: 500000000 })
  targetAmount?: number;

  @ApiPropertyOptional({ example: "2024-12-31T00:00:00Z" })
  targetDate?: Date;

  @ApiPropertyOptional({ example: "🏠" })
  icon?: string;

  @ApiPropertyOptional({ example: "#FF5733" })
  color?: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiPropertyOptional({ example: "2024-01-01T00:00:00Z" })
  achievedAt?: Date;

  @ApiProperty({ example: "2023-01-01T00:00:00Z" })
  createdAt: Date;

  @ApiProperty({ example: "2023-01-01T00:00:00Z" })
  updatedAt: Date;
}

export class GoalWithCalculateProgressResponseDto extends GoalResponseDto {
  @ApiPropertyOptional({ example: 250000000 })
  currentAmount?: number;

  @ApiPropertyOptional({ example: 50 })
  progressPercentage?: number;

  @ApiPropertyOptional({ example: 250000000 })
  remainingAmount?: number;

  @ApiPropertyOptional({ example: 365 })
  daysRemaining?: number;

  @ApiPropertyOptional({ enum: ["on_track", "warning", "overdue"] })
  status?: "on_track" | "warning" | "overdue" | null;
}
