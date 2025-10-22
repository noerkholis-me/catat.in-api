import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { BudgetsService } from "./budgets.service";
import { BudgetResponseDto, BudgetSummaryDto, CreateBudgetDto, UpdateBudgetDto } from "./dto";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

@ApiTags("Budgets")
@ApiBearerAuth("JWT-auth")
@Controller("budgets")
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Post()
  @ApiOperation({ summary: "Tambah budget baru" })
  @ApiResponse({ status: 400, description: "Data tidak valid" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({
    status: 201,
    description: "Budget berhasil ditambahkan",
    type: BudgetResponseDto,
  })
  create(@CurrentUser("id") userId: string, @Body() createBudgetDto: CreateBudgetDto) {
    return this.budgetsService.create(userId, createBudgetDto);
  }

  @Get()
  @ApiOperation({ summary: "Get semua budget" })
  @ApiResponse({
    status: 200,
    description: "List budget",
    type: [BudgetResponseDto],
  })
  findAll(@CurrentUser("id") userId: string) {
    return this.budgetsService.findAll(userId);
  }

  @Get("current-month")
  @ApiOperation({ summary: "Get budget bulan ini" })
  @ApiResponse({
    status: 200,
    description: "Budget bulan ini",
    type: BudgetResponseDto,
  })
  getCurrentMonth(@CurrentUser("id") userId: string) {
    return this.budgetsService.getCurrentMonth(userId);
  }

  @Get("monthly/:year/:month")
  @ApiOperation({ summary: "Get budget by tahun dan bulan" })
  @ApiParam({ name: "year", example: "2025" })
  @ApiParam({ name: "month", example: "09" })
  @ApiResponse({ status: 404, description: "Budget not found" })
  @ApiResponse({
    status: 200,
    description: "Get budget",
    type: BudgetResponseDto,
  })
  getByMonthYear(
    @CurrentUser("id") userId: string,
    @Param("year") year: number,
    @Param("month") month: number,
  ) {
    return this.budgetsService.getByMonthYear(userId, year, month);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get detail budget by ID" })
  @ApiParam({ name: "id", description: "Budget UUID" })
  @ApiResponse({ status: 404, description: "Budget not found" })
  @ApiResponse({
    status: 200,
    description: "Detail pengeluaran",
    type: BudgetResponseDto,
  })
  findOne(@CurrentUser("id") userId: string, @Param("id") id: string) {
    return this.budgetsService.findOne(userId, id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update budget by ID" })
  @ApiParam({ name: "id", description: "Budget UUID" })
  @ApiResponse({ status: 404, description: "Budget not found" })
  @ApiResponse({
    status: 200,
    description: "Detail update budget",
    type: BudgetResponseDto,
  })
  update(
    @Param("id") id: string,
    @CurrentUser("id") userId: string,
    @Body() updateBudgetDto: UpdateBudgetDto,
  ) {
    return this.budgetsService.update(id, userId, updateBudgetDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Hapus budget by ID (hard delete)" })
  @ApiParam({ name: "id", description: "Budget UUID" })
  @ApiResponse({ status: 404, description: "Budget not found" })
  @ApiResponse({ status: 200, description: "Delete budget berhasil" })
  remove(@Param("id") id: string, @CurrentUser("id") userId: string) {
    return this.budgetsService.remove(id, userId);
  }

  @Get(":id/summary")
  @ApiOperation({ summary: "Get summary pada bulan dan tahun ini" })
  @ApiParam({ name: "id", description: "Budget UUID" })
  @ApiResponse({
    status: 200,
    description: "Summary budget",
    type: BudgetSummaryDto,
  })
  @ApiResponse({ status: 404, description: "Budget not found" })
  getSummary(@Param("id") id: string, @CurrentUser("id") userId: string) {
    return this.budgetsService.getSummary(id, userId);
  }
}
