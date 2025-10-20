import { ExpensesService } from "./expenses.service";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import {
  CreateExpenseDto,
  ExpenseResponseDto,
  ListExpensesResponseDto,
  MonthlySummaryDto,
  QueryExpenseDto,
  TodaySummaryDto,
  UpdateExpenseDto,
} from "./dto";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

@ApiTags("Expenses")
@ApiBearerAuth("JWT-auth")
@Controller("expenses")
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @ApiOperation({ summary: "Tambah pengeluaran baru" })
  @ApiResponse({
    status: 201,
    description: "Pengeluaran berhasil ditambahkan",
    type: ExpenseResponseDto,
  })
  @ApiResponse({ status: 400, description: "Data tidak valid" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  create(
    @CurrentUser("id") userId: string,
    @Body() createExpenseDto: CreateExpenseDto,
  ) {
    return this.expensesService.create(userId, createExpenseDto);
  }

  @Get()
  @ApiOperation({ summary: "Get semua pengeluaran dengan filter dan pagination" })
  @ApiResponse({
    status: 200,
    description: "List pengeluaran",
    type: ListExpensesResponseDto,
  })
  findAll(
    @CurrentUser("id") userId: string,
    @Query() queryExpenseDto: QueryExpenseDto,
  ) {
    return this.expensesService.findAll(userId, queryExpenseDto);
  }

  @Get("today")
  @ApiOperation({ summary: "Get total pengeluaran hari ini" })
  @ApiResponse({
    status: 200,
    description: "Summary hari ini",
    type: TodaySummaryDto,
  })
  getTodayTotal(@CurrentUser("id") userId: string) {
    return this.expensesService.getTodayTotal(userId);
  }

  @Get("monthly/:year/:month")
  @ApiOperation({ summary: "Get total pengeluaran per bulan" })
  @ApiParam({ name: "year", example: "2025" })
  @ApiParam({ name: "month", example: "09" })
  @ApiResponse({
    status: 200,
    description: "Summary bulanan",
    type: MonthlySummaryDto,
  })
  getMonthlyTotal(
    @CurrentUser("id") userId: string,
    @Param("year") year: number,
    @Param("month") month: number,
  ) {
    return this.expensesService.getTotalMonth(userId, year, month);
  }

  @Get("recent")
  @ApiOperation({ summary: "Get 10 pengeluaran terakhir" })
  @ApiResponse({
    status: 200,
    description: "Recent expenses",
    type: [ExpenseResponseDto],
  })
  getRecentExpenses(@CurrentUser("id") userId: string) {
    return this.expensesService.getRecentExpenses(userId, 10);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get detail pengeluaran by ID" })
  @ApiParam({ name: "id", description: "Expense UUID" })
  @ApiResponse({
    status: 200,
    description: "Detail pengeluaran",
    type: ExpenseResponseDto,
  })
  @ApiResponse({ status: 404, description: "Expense not found" })
  findOne(@Param("id") id: string, @CurrentUser("id") userId: string) {
    return this.expensesService.findOne(id, userId);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update pengeluaran by ID" })
  @ApiParam({ name: "id", description: "Expense UUID" })
  @ApiResponse({
    status: 200,
    description: "Detail update pengeluaran",
    type: ExpenseResponseDto,
  })
  @ApiResponse({ status: 404, description: "Expense not found" })
  update(
    @Param("id") id: string,
    @CurrentUser("id") userId: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ) {
    return this.expensesService.update(id, userId, updateExpenseDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Hapus pengeluaran by ID (soft delete)" })
  @ApiParam({ name: "id", description: "Expense UUID" })
  @ApiResponse({ status: 200, description: "Delete pengeluaran berhasil" })
  @ApiResponse({ status: 404, description: "Expense not found" })
  remove(@Param("id") id: string, @CurrentUser("id") userId: string) {
    return this.expensesService.remove(id, userId);
  }
}
