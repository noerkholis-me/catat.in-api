import { PrismaService } from "@/prisma/prisma.service";
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { CategoryTypes, CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(private prisma: PrismaService) {}

  async create(userId: string, createCategoryDto: CreateCategoryDto) {
    if (createCategoryDto.parentCategoryId)
      await this.validateParentCategory(createCategoryDto.parentCategoryId);

    const category = await this.prisma.category.create({
      data: {
        userId,
        ...createCategoryDto,
      },
      include: { parentCategory: true, subCategories: { where: { deletedAt: null } } },
    });
    return category;
  }

  async findAll(userId: string) {
    const categories = await this.prisma.category.findMany({
      where: { OR: [{ userId }, { isSystem: true }] },
    });

    return categories;
  }

  async findOne(id: string, userId: string) {
    const category = await this.prisma.category.findUnique({
      where: {
        id,
        OR: [{ userId }, { isSystem: true }],
        deletedAt: null,
      },
      include: { parentCategory: true, subCategories: { where: { deletedAt: null } } },
    });
    if (!category) throw new NotFoundException("Kategori tidak ditemukan");

    return category;
  }

  async update(id: string, userId: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id, userId);

    if (category.isSystem)
      throw new ForbiddenException("Tidak update bisa sistem kategori");

    if (updateCategoryDto.parentCategoryId)
      await this.validateParentCategory(updateCategoryDto.parentCategoryId);

    const updated = await this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });

    return updated;
  }

  async remove(id: string, userId: string) {
    const category = await this.findOne(id, userId);
    if (category.isSystem)
      throw new ForbiddenException("Tidak bisa hapus sistem kategori");

    const expenseCount = await this.prisma.expense.count({
      where: { categoryId: id },
    });
    if (expenseCount > 0)
      throw new BadRequestException(
        `Tidak bisa hapus kategori dengan jumlah ${expenseCount} pengeluaran`,
      );

    const updated = await this.prisma.category.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    return { message: "Berhasil hapus kategori" };
  }

  private async validateParentCategory(parentCategoryId: string) {
    const parentCategory = await this.prisma.category.findUnique({
      where: {
        id: parentCategoryId,
        deletedAt: null,
      },
    });
    if (!parentCategory) throw new NotFoundException("Parent category tidak ditemukan");
    return parentCategory;
  }
}
