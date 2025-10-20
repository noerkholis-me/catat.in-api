import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { CategoryTypes } from "./create-category.dto";

export class CategoryResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ enum: CategoryTypes })
  type: string;

  @ApiPropertyOptional()
  icon?: string;

  @ApiPropertyOptional()
  color?: string;

  @ApiProperty()
  isSystem: boolean;

  @ApiPropertyOptional()
  parentCategoryId?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
