import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
} from "class-validator";

export class CreateGoalDto {
  @ApiProperty({
    description: "Title goal",
    example: "Beli Macbook M4",
    maxLength: 200,
  })
  @IsString()
  @MaxLength(200)
  title: string;

  @ApiPropertyOptional({
    description: "Deskripsi goal",
    example: "Beli Macbook untuk upgrade laptop",
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: "Jumlah uang yang menjadi target",
    example: 300000000,
    minimum: 0,
  })
  @Min(0, { message: "Target Amount harus lebih dari atau sama dengan 0" })
  @IsNumber({}, { message: "Target Amount harus berupa angka" })
  @IsOptional()
  @Type(() => Number)
  targetAmount?: number;

  @ApiPropertyOptional({
    description: "Target date (format: YYYY-MM-DD)",
    example: "2025-09-19",
  })
  @IsDateString({}, { message: "Format tanggal tidak valid (gunakan YYYY-MM-DD)" })
  targetDate?: string;

  @ApiPropertyOptional({
    description: "Icon goal (emoji/nama icon)",
    example: "🚌",
    maxLength: 50,
  })
  @MaxLength(50)
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({
    description: "Warna goal (hex color)",
    example: "#10b981",
    pattern: "^#[0-9A-Fa-f]{6}$",
  })
  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: "Color harus format hex (contoh: #10b981)",
  })
  color?: string;
}
