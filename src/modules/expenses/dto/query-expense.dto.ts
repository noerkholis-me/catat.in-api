import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDateString, IsInt, IsOptional, IsUUID, Min } from "class-validator";

export class QueryExpenseDto {
  @ApiPropertyOptional({
    description: "Filter dari tanggal (format: YYYY-MM-DD)",
    example: "2025-09-20",
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: "Filter sampai tanggal (format: YYYY-MM-DD)",
    example: "2025-10-01",
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({
    description: "Filter berdasarkan kategori",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  @IsOptional()
  @IsUUID()
  categoryId: string;

  @ApiPropertyOptional({
    description: "Filter berdasarkan budget",
    example: "550e8400-e29b-41d4-a716-446655440001",
  })
  @IsOptional()
  @IsUUID()
  budgetId: string;

  @ApiPropertyOptional({
    description: "Nomor halaman",
    example: 5,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: number;

  @ApiPropertyOptional({
    description: "Jumlah data per-halaman",
    example: 20,
    minimum: 1,
    default: 20,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit: number;
}
