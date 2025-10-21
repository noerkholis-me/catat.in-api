import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Max,
  Min,
  Validate,
} from "class-validator";
import { PercentageSumConstraint } from "../validators/percentage-sum.constraint";

export class CreateBudgetDto {
  @ApiProperty({
    description: "bulan (1-12)",
    example: 2,
    minimum: 1,
    maximum: 12,
  })
  @IsInt({ message: "Month harus berupa angka" })
  @Min(1, { message: "Month minimal 1" })
  @Max(12, { message: "Month maksimal 12" })
  @Type(() => Number)
  month: number;

  @ApiProperty({
    description: "Tahun",
    example: 2025,
    minimum: 2024,
    maximum: 2030,
  })
  @IsInt({ message: "Year harus berupa angka" })
  @Min(new Date().getFullYear() - 1, { message: "Year minimal tahun lalu" })
  @Max(new Date().getFullYear() + 5, { message: "Year maksimal 5 tahun ke depan" })
  @Type(() => Number)
  year: number;

  @ApiProperty({
    description: "Total pendapatan yang akan dialokasikan",
    example: 8000000,
    minimum: 1,
  })
  @IsNumber({}, { message: "Total income harus berupa angka" })
  @Min(1, { message: "Total income minimal Rp 1" })
  @Type(() => Number)
  totalIncome: number;

  @ApiPropertyOptional({
    description: "Persentase kebutuhan (1-100)",
    example: 50,
    default: 50,
    minimum: 0,
    maximum: 100,
  })
  @IsInt({ message: "Needs percentage harus berupa angka" })
  @IsOptional()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  @Validate(PercentageSumConstraint)
  needsPercentage?: number;

  @ApiPropertyOptional({
    description: "Persentase keinginan (1-100)",
    example: 30,
    default: 30,
    minimum: 0,
    maximum: 100,
  })
  @IsInt({ message: "Wants percentage harus berupa angka" })
  @IsOptional()
  @Min(0)
  @Max(100)
  @IsInt()
  @Type(() => Number)
  wantsPercentage?: number;

  @ApiPropertyOptional({
    description: "Persentase simpanan (1-100)",
    example: 20,
    default: 20,
    minimum: 0,
    maximum: 100,
  })
  @IsInt({ message: "Savings percentage harus berupa angka" })
  @IsOptional()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  savingsPercentage?: number;

  @ApiPropertyOptional({
    description: "Budget harian (opsional, untuk mahasiswa/pelajar)",
    example: 20000,
    minimum: 0,
  })
  @IsNumber({}, { message: "Daily budget harus berupa angka" })
  @Min(0, { message: "Daily budget minimal 0" })
  @IsOptional()
  @Type(() => Number)
  dailyBudget?: number;

  @ApiPropertyOptional({
    description: "ID Goal (opsional)",
    example: "550e8400-e29b-41d4-a716-446655440001",
  })
  @IsOptional()
  @IsUUID("4", { message: "Goal ID harus UUID yang valid" })
  goalId?: string;

  @ApiPropertyOptional({
    description: "Catatan tambahan",
    example: "Budget bulan Oktober untuk persiapan nikah",
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
