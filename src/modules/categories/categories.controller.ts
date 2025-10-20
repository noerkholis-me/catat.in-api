import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { CategoriesService } from "./categories.service";
import { CategoryResponseDto, CreateCategoryDto, UpdateCategoryDto } from "./dto";

@ApiTags("Categories")
@ApiBearerAuth("JWT-auth")
@Controller("categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: "Membuat kategori baru" })
  @ApiResponse({
    status: 201,
    description: "Kategori berhasil dibuat",
  })
  create(
    @CurrentUser("id") userId: string,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    return this.categoriesService.create(userId, createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: "Get semua kategori user dan sistem" })
  @ApiResponse({
    status: 200,
    description: "List kategori",
    type: [CategoryResponseDto],
  })
  findAll(@CurrentUser("id") userId: string) {
    return this.categoriesService.findAll(userId);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get detail kategori by ID" })
  @ApiParam({ name: "id", description: "Category UUID" })
  @ApiResponse({
    status: 200,
    description: "Detail kategori",
    type: CategoryResponseDto,
  })
  findOne(@Param("id") id: string, @CurrentUser("id") userId: string) {
    return this.categoriesService.findOne(id, userId);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update kategori by ID" })
  @ApiParam({ name: "id", description: "Category UUID" })
  @ApiResponse({
    status: 201,
    description: "Kategori berhasil di update",
    type: CategoryResponseDto,
  })
  update(
    @Param("id") id: string,
    @CurrentUser("id") userId: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, userId, updateCategoryDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Hapus kategori by ID (soft delete)" })
  @ApiParam({ name: "id", description: "Category UUID" })
  @ApiResponse({ status: 200, description: "Delete kategori berhasil" })
  @ApiResponse({ status: 404, description: "Category not found" })
  remove(@Param("id") id: string, @CurrentUser("id") userId: string) {
    return this.categoriesService.remove(id, userId);
  }
}
