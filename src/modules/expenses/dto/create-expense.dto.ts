import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsBoolean,
  IsDate,
  IsDateString,
  IsDecimal,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";

export class CreateExpenseDto {
  @ApiProperty({
    description: "Nama pengeluaran",
    example: "Makan Siang",
    maxLength: 200,
  })
  @IsString()
  @MaxLength(200)
  name: string;

  @ApiProperty({
    description: "Jumlah yang dikeluarkan",
    example: "25000",
    minimum: 0,
  })
  @IsNumber({}, { message: "Amount harus berupa angka" })
  @Min(0, { message: "Jumlah harus lebih atau sama dengan 0" })
  @Type(() => Number)
  amount: number;

  @ApiProperty({
    description: "Jumlah barang/satuan (bisa desimal)",
    example: 1.5,
    default: 1,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber({}, { message: "Quantity harus berupa angka" })
  @Min(0, { message: "Quantity harus lebih dari atau sama dengan 0" })
  @Type(() => Number)
  quantity?: number;

  @ApiProperty({
    description: "Satuan (kg, liter, pcs, dll)",
    example: "Kg",
    maxLength: 20,
  })
  @MaxLength(20, { message: "Unit maksimal 20 karakter" })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiProperty({
    description: "Tanggal pengeluaran (format: YYYY-MM-DD)",
    example: "2025-09-19",
  })
  @IsDateString({}, { message: "Format tanggal tidak valid (gunakan YYYY-MM-DD)" })
  expenseDate: string;

  @ApiPropertyOptional({
    description: "Waktu pengeluaran (format: HH:mm atau HH:mm:ss)",
    example: "14:30:00",
    pattern: "^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$",
  })
  @IsOptional()
  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, {
    message: "Format waktu tidak valid (gunakan HH:mm atau HH:mm:ss)",
  })
  expenseTime?: string;

  @ApiPropertyOptional({
    description: "Catatan tambahan",
    example: "Makan bareng teman sekolah",
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description: "Lokasi pengeluaran",
    example: "Kantin sekolah",
  })
  @MaxLength(255, { message: "Lokasi maksimal 255 karakter" })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    description: "ID kategori",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  @IsUUID("4", { message: "Category ID harus UUID yang valid" })
  categoryId: string;

  @ApiPropertyOptional({
    description: "ID budget (opsional)",
    example: "550e8400-e29b-41d4-a716-446655440001",
  })
  @IsOptional()
  @IsUUID("4", { message: "Budget ID harus UUID yang valid" })
  budgetId?: string;

  @ApiPropertyOptional({
    description: "Metode pembayaran",
    example: "cash",
    enum: ["cash", "debit", "credit", "e-wallet", "other"],
  })
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: "Payment method maksimal 50 karakter" })
  paymentMethod?: string;

  @ApiPropertyOptional({
    description: "URL foto struk (dari cloud storage)",
    example: "https://storage.supabase.co/receipts/abc123.jpg",
  })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: "Receipt URL maksimal 500 karakter" })
  receiptUrl?: string;

  @ApiPropertyOptional({
    description: "ID parent expense (untuk grouping)",
    example: "550e8400-e29b-41d4-a716-446655440002",
  })
  @IsOptional()
  @IsUUID("4", { message: "Parent expense ID harus UUID yang valid" })
  parentExpenseId?: string;

  @ApiPropertyOptional({
    description: "Apakah expense ini adalah grup (punya detail items)",
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isGroup?: boolean;
}
