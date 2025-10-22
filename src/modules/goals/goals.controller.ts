import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { GoalsService } from "./goals.service";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import {
  GoalWithCalculateProgressResponseDto,
  CreateGoalDto,
  GoalResponseDto,
  UpdateGoalDto,
} from "./dto";

@ApiTags("Goals")
@ApiBearerAuth("JWT-auth")
@Controller("goals")
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Post()
  @ApiOperation({ summary: "Tambah goal baru" })
  @ApiResponse({ status: 400, description: "Data tidak valid" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({
    status: 201,
    description: "Goal berhasil ditambahkan",
    type: GoalResponseDto,
  })
  create(@CurrentUser("id") userId: string, @Body() createGoalDto: CreateGoalDto) {
    return this.goalsService.create(userId, createGoalDto);
  }

  @Get()
  @ApiOperation({ summary: "Get semua goal active dan achieve" })
  @ApiResponse({
    status: 200,
    description: "List goal",
    type: [GoalResponseDto],
  })
  findAll(@CurrentUser("id") userId: string) {
    return this.goalsService.findAll(userId);
  }

  @Get("active")
  @ApiOperation({ summary: "Get semua goal hanya yang active" })
  @ApiResponse({
    status: 200,
    description: "List goal",
    type: [GoalResponseDto],
  })
  findActiveGoals(@CurrentUser("id") userId: string) {
    return this.goalsService.findActiveGoals(userId);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get detail goal by ID with calculate progres" })
  @ApiParam({ name: "id", description: "Goal UUID" })
  @ApiResponse({ status: 404, description: "Goal not found" })
  @ApiResponse({
    status: 200,
    description: "Detail pengeluaran",
    type: GoalWithCalculateProgressResponseDto,
  })
  findOne(@CurrentUser("id") userId: string, @Param("id") id: string) {
    return this.goalsService.findOne(id, userId);
  }

  @Get(":id/progress")
  @ApiOperation({ summary: "Get detail progress goal" })
  @ApiParam({ name: "id", description: "Goal UUID" })
  @ApiResponse({
    status: 200,
    description: "Progress detail",
    type: GoalWithCalculateProgressResponseDto,
  })
  getProgress(@CurrentUser("id") userId: string, @Param("id") id: string) {
    return this.goalsService.getProgress(id, userId);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update goal by ID" })
  @ApiParam({ name: "id", description: "Goal UUID" })
  @ApiResponse({ status: 404, description: "Goal not found" })
  @ApiResponse({
    status: 200,
    description: "Detail update goal",
    type: GoalResponseDto,
  })
  update(
    @CurrentUser("id") userId: string,
    @Param("id") id: string,
    @Body() updateGoalDto: UpdateGoalDto,
  ) {
    return this.goalsService.update(id, userId, updateGoalDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Hapus goal by ID (hard delete)" })
  @ApiParam({ name: "id", description: "Goal UUID" })
  @ApiResponse({ status: 404, description: "Goal not found" })
  @ApiResponse({ status: 200, description: "Delete goal berhasil" })
  remove(@CurrentUser("id") userId: string, @Param("id") id: string) {
    return this.goalsService.remove(id, userId);
  }

  @Patch(":id/achieve")
  @ApiOperation({ summary: "Mark goal sebagai achieve" })
  @ApiParam({ name: "id", description: "Goal UUID" })
  @ApiResponse({ status: 404, description: "Goal not found" })
  @ApiResponse({
    status: 200,
    description: "Detail update goal",
    type: GoalResponseDto,
  })
  markAsAchieved(@CurrentUser("id") userId: string, @Param("id") id: string) {
    return this.goalsService.markAsAchieved(id, userId);
  }
}
