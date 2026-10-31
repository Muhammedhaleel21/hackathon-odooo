import {
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DRIZZLE } from '../../database/database.constants';
import { AppDatabase } from '../../database/database.provider';
import { productCategories } from '../../database/schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(@Inject(DRIZZLE) private readonly db: AppDatabase) {}

  async create(dto: CreateCategoryDto) {
    const [category] = await this.db
      .insert(productCategories)
      .values({
        name: dto.name.trim(),
        description: dto.description?.trim(),
      })
      .returning();

    return category;
  }

  async findAll() {
    return this.db.select().from(productCategories).orderBy(productCategories.name);
  }

  async findOne(id: string) {
    const [category] = await this.db
      .select()
      .from(productCategories)
      .where(eq(productCategories.id, id));

    if (!category) {
      throw new NotFoundException(`Product category with ID ${id} not found`);
    }

    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.findOne(id);

    const [updated] = await this.db
      .update(productCategories)
      .set({
        ...(dto.name ? { name: dto.name.trim() } : {}),
        ...(dto.description !== undefined
          ? { description: dto.description?.trim() }
          : {}),
        updatedAt: new Date(),
      })
      .where(eq(productCategories.id, id))
      .returning();

    return updated;
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.db
      .delete(productCategories)
      .where(eq(productCategories.id, id));

    return { message: 'Category deleted successfully' };
  }
}

