import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async create(dto: CreateProductDto) {
    if (dto.salesPrice < 0) {
      throw new BadRequestException('Sales price cannot be negative');
    }
    if (dto.costPrice !== undefined && dto.costPrice < 0) {
      throw new BadRequestException('Cost price cannot be negative');
    }

    const product = await this.productsRepository.create({
      name: dto.name.trim(),
      categoryId: dto.categoryId || null,
      productType: dto.productType || 'service',
      salesPrice: dto.salesPrice,
      costPrice: dto.costPrice ?? 0,
      notes: dto.notes?.trim() || null,
      status: dto.status || 'active',
    });

    return product;
  }

  async findAll(query: QueryProductDto) {
    return this.productsRepository.findAll(query);
  }

  async findOne(id: string) {
    const product = await this.productsRepository.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findOne(id);

    if (dto.salesPrice !== undefined && dto.salesPrice < 0) {
      throw new BadRequestException('Sales price cannot be negative');
    }
    if (dto.costPrice !== undefined && dto.costPrice < 0) {
      throw new BadRequestException('Cost price cannot be negative');
    }

    const updated = await this.productsRepository.update(id, {
      ...(dto.name ? { name: dto.name.trim() } : {}),
      ...(dto.categoryId !== undefined ? { categoryId: dto.categoryId } : {}),
      ...(dto.productType ? { productType: dto.productType } : {}),
      ...(dto.salesPrice !== undefined ? { salesPrice: dto.salesPrice } : {}),
      ...(dto.costPrice !== undefined ? { costPrice: dto.costPrice } : {}),
      ...(dto.notes !== undefined ? { notes: dto.notes?.trim() || null } : {}),
      ...(dto.status ? { status: dto.status } : {}),
    });

    return updated;
  }

  async archive(id: string, status?: 'active' | 'archived') {
    const existing = await this.findOne(id);
    const newStatus = status || (existing.status === 'active' ? 'archived' : 'active');

    const updated = await this.productsRepository.update(id, {
      status: newStatus,
    });

    return {
      message: `Product ${newStatus === 'archived' ? 'archived' : 'activated'} successfully`,
      product: updated,
    };
  }
}

