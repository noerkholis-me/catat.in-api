import { ApiProperty } from "@nestjs/swagger";

export class TodaySummaryDto {
  @ApiProperty({ description: "Total pengeluaran hari ini" })
  total: string;

  @ApiProperty({ description: "Jumlah transaksi hari ini" })
  count: number;

  @ApiProperty({ description: "Tanggal" })
  date: string;
}

export class MonthlySummaryDto {
  @ApiProperty({ description: "Total pengeluaran bulan ini" })
  total: number;

  @ApiProperty({ description: "Jumlah transaksi" })
  count: number;

  @ApiProperty({ description: "Bulan (1-12)" })
  month: number;

  @ApiProperty({ description: "Tahun" })
  year: number;
}

export class CategoryBreakdownDto {
  @ApiProperty({ description: "Detail kategori" })
  category: {
    id: string;
    name: string;
    type: string;
    icon?: string;
    color?: string;
  };

  @ApiProperty({ description: "Total pengeluaran kategori ini" })
  total: number;

  @ApiProperty({ description: "Jumlah transaksi" })
  count: number;
}
