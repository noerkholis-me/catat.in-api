import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Decimal } from "@prisma/client/runtime/library";
class CategoryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  type: string;

  @ApiPropertyOptional()
  icon?: string;

  @ApiPropertyOptional()
  color?: string;
}

class BudgetSummaryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  month: number;

  @ApiProperty()
  year: number;
}

export class ExpenseResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  amount: Decimal;

  @ApiProperty()
  quantity: Decimal;

  @ApiPropertyOptional()
  unit?: string;

  @ApiProperty()
  expenseDate: Date;

  @ApiPropertyOptional()
  expenseTime?: string;

  @ApiPropertyOptional()
  notes?: string;

  @ApiPropertyOptional()
  location?: string;

  @ApiPropertyOptional()
  paymentMethod?: string;

  @ApiPropertyOptional()
  receiptUrl?: string;

  @ApiProperty()
  isGroup: boolean;

  @ApiProperty({ type: CategoryDto })
  category: CategoryDto;

  @ApiPropertyOptional({ type: BudgetSummaryDto })
  budget?: BudgetSummaryDto;

  @ApiPropertyOptional({ type: [ExpenseResponseDto] })
  childExpenses?: ExpenseResponseDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
