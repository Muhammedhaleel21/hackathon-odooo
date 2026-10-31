import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DRIZZLE } from '../../database/database.constants';
import { AppDatabase } from '../../database/database.provider';
import {
  products,
  productAttributes,
  productAttributeValues,
} from '../../database/schema';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { CreateAttributeValueDto } from './dto/create-attribute-value.dto';
import { UpdateAttributeValueDto } from './dto/update-attribute-value.dto';

@Injectable()
export class VariantsService {
  constructor(@Inject(DRIZZLE) private readonly db: AppDatabase) {}

  async createAttribute(productId: string, dto: CreateAttributeDto) {
    const [product] = await this.db
      .select()
      .from(products)
      .where(eq(products.id, productId));

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const [attribute] = await this.db
      .insert(productAttributes)
      .values({
        productId,
        name: dto.name.trim(),
      })
      .returning();

    return attribute;
  }

  async createAttributeValue(attributeId: string, dto: CreateAttributeValueDto) {
    const [attribute] = await this.db
      .select()
      .from(productAttributes)
      .where(eq(productAttributes.id, attributeId));

    if (!attribute) {
      throw new NotFoundException(
        `Attribute with ID ${attributeId} not found`,
      );
    }

    if (dto.additionalPrice !== undefined && dto.additionalPrice < 0) {
      throw new BadRequestException('Additional price cannot be negative');
    }

    const [val] = await this.db
      .insert(productAttributeValues)
      .values({
        attributeId,
        value: dto.value.trim(),
        additionalPrice: dto.additionalPrice ?? 0,
        isActive: dto.isActive ?? true,
      })
      .returning();

    return val;
  }

  async getProductVariants(productId: string) {
    const [product] = await this.db
      .select()
      .from(products)
      .where(eq(products.id, productId));

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const attributes = await this.db
      .select()
      .from(productAttributes)
      .where(eq(productAttributes.productId, productId))
      .orderBy(productAttributes.createdAt);

    const attributesWithCalculatedPrices = await Promise.all(
      attributes.map(async (attr) => {
        const values = await this.db
          .select()
          .from(productAttributeValues)
          .where(eq(productAttributeValues.attributeId, attr.id))
          .orderBy(productAttributeValues.createdAt);

        const enrichedValues = values.map((val) => ({
          ...val,
          basePrice: product.salesPrice,
          additionalPrice: val.additionalPrice,
          totalPrice: product.salesPrice + val.additionalPrice,
        }));

        return {
          ...attr,
          values: enrichedValues,
        };
      }),
    );

    return {
      productId: product.id,
      productName: product.name,
      baseSalesPrice: product.salesPrice,
      attributes: attributesWithCalculatedPrices,
    };
  }

  async updateAttributeValue(id: string, dto: UpdateAttributeValueDto) {
    const [existing] = await this.db
      .select()
      .from(productAttributeValues)
      .where(eq(productAttributeValues.id, id));

    if (!existing) {
      throw new NotFoundException(
        `Attribute option value with ID ${id} not found`,
      );
    }

    if (dto.additionalPrice !== undefined && dto.additionalPrice < 0) {
      throw new BadRequestException('Additional price cannot be negative');
    }

    const [updated] = await this.db
      .update(productAttributeValues)
      .set({
        ...(dto.value ? { value: dto.value.trim() } : {}),
        ...(dto.additionalPrice !== undefined
          ? { additionalPrice: dto.additionalPrice }
          : {}),
        ...(dto.isActive !== undefined ? { isActive: dto.isActive } : {}),
        updatedAt: new Date(),
      })
      .where(eq(productAttributeValues.id, id))
      .returning();

    return updated;
  }

  async deleteAttribute(attributeId: string) {
    const [existing] = await this.db
      .select()
      .from(productAttributes)
      .where(eq(productAttributes.id, attributeId));

    if (!existing) {
      throw new NotFoundException(
        `Attribute with ID ${attributeId} not found`,
      );
    }

    await this.db
      .delete(productAttributes)
      .where(eq(productAttributes.id, attributeId));

    return { message: 'Attribute deleted successfully' };
  }

  async deleteAttributeValue(valueId: string) {
    const [existing] = await this.db
      .select()
      .from(productAttributeValues)
      .where(eq(productAttributeValues.id, valueId));

    if (!existing) {
      throw new NotFoundException(
        `Attribute value with ID ${valueId} not found`,
      );
    }

    await this.db
      .delete(productAttributeValues)
      .where(eq(productAttributeValues.id, valueId));

    return { message: 'Attribute value deleted successfully' };
  }
}

