import { ApiProperty } from "@nestjs/swagger";
import { ExpenseResponseDto } from "./expense-response.dto";

class MetaDto {
  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;
}

export class ListExpensesResponseDto {
  @ApiProperty({ type: [ExpenseResponseDto] })
  data: ExpenseResponseDto[];

  @ApiProperty({ type: MetaDto })
  meta: MetaDto;
}
