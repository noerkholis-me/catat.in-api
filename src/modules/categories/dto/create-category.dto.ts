import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
} from "class-validator";

export enum CategoryTypes {
  NEEDS = "needs",
  WANTS = "wants",
  SAVINGS = "savings",
}

export class CreateCategoryDto {
  @ApiProperty({
    description: "Nama kategori",
    example: "Transportasi",
    maxLength: 100,
  })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: "Tipe kategori",
    example: "needs",
    enum: CategoryTypes,
  })
  @IsEnum(CategoryTypes, { message: "Type harus salah satu dari: needs, wants, savings" })
  @IsString()
  type: string;

  @ApiPropertyOptional({
    description: "Icon kategori (emoji/nama icon)",
    example: "🚌",
    maxLength: 50,
  })
  @MaxLength(50)
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({
    description: "Warna kategori (hex color)",
    example: "#10b981",
    pattern: "^#[0-9A-Fa-f]{6}$",
  })
  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: "Color harus format hex (contoh: #10b981)",
  })
  color?: string;

  @ApiPropertyOptional({
    description: "ID parent category (untuk grouping)",
    example: "550e8400-e29b-41d4-a716-446655440002",
  })
  @IsOptional()
  @IsUUID("4", { message: "Parent Category ID harus UUID yang valid" })
  parentCategoryId?: string;
}
