import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PlansRepository } from './plans.repository';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { QueryPlanDto } from './dto/query-plan.dto';

@Injectable()
export class PlansService {
  constructor(private readonly plansRepository: PlansRepository) {}

  async create(dto: CreatePlanDto) {
    if (dto.price < 0) {
      throw new BadRequestException('Plan price cannot be negative');
    }

    if (dto.minQuantity !== undefined && dto.minQuantity < 1) {
      throw new BadRequestException('Minimum quantity must be at least 1');
    }

    const availableFromDate = new Date(dto.availableFrom);
    if (isNaN(availableFromDate.getTime())) {
      throw new BadRequestException('Invalid availableFrom date format');
    }

    let availableUntilDate: Date | null = null;
    if (dto.availableUntil) {
      availableUntilDate = new Date(dto.availableUntil);
      if (isNaN(availableUntilDate.getTime())) {
        throw new BadRequestException('Invalid availableUntil date format');
      }
      if (availableUntilDate < availableFromDate) {
        throw new BadRequestException(
          'Availability end date cannot be before start date',
        );
      }
    }

    const plan = await this.plansRepository.create({
      productId: dto.productId,
      name: dto.name.trim(),
      description: dto.description?.trim() || null,
      price: dto.price,
      billingInterval: dto.billingInterval || 'monthly',
      billingIntervalCount: dto.billingIntervalCount ?? 1,
      minQuantity: dto.minQuantity ?? 1,
      availableFrom: availableFromDate,
      availableUntil: availableUntilDate,
      autoClose: dto.autoClose ?? false,
      earlyClosureAllowed: dto.earlyClosureAllowed ?? true,
      pauseAllowed: dto.pauseAllowed ?? true,
      renewalAllowed: dto.renewalAllowed ?? true,
      status: dto.status || 'draft',
    });

    return plan;
  }

  async findAll(query: QueryPlanDto) {
    return this.plansRepository.findAll(query);
  }

  async findOne(id: string) {
    const plan = await this.plansRepository.findById(id);
    if (!plan) {
      throw new NotFoundException(`Subscription plan with ID ${id} not found`);
    }
    return plan;
  }

  async update(id: string, dto: UpdatePlanDto) {
    const existing = await this.findOne(id);

    if (dto.price !== undefined && dto.price < 0) {
      throw new BadRequestException('Plan price cannot be negative');
    }

    if (dto.minQuantity !== undefined && dto.minQuantity < 1) {
      throw new BadRequestException('Minimum quantity must be at least 1');
    }

    const fromDate = dto.availableFrom
      ? new Date(dto.availableFrom)
      : new Date(existing.availableFrom);

    const untilDate =
      dto.availableUntil !== undefined
        ? dto.availableUntil
          ? new Date(dto.availableUntil)
          : null
        : existing.availableUntil
          ? new Date(existing.availableUntil)
          : null;

    if (untilDate && untilDate < fromDate) {
      throw new BadRequestException(
        'Availability end date cannot be before start date',
      );
    }

    const updated = await this.plansRepository.update(id, {
      ...(dto.productId ? { productId: dto.productId } : {}),
      ...(dto.name ? { name: dto.name.trim() } : {}),
      ...(dto.description !== undefined
        ? { description: dto.description?.trim() || null }
        : {}),
      ...(dto.price !== undefined ? { price: dto.price } : {}),
      ...(dto.billingInterval ? { billingInterval: dto.billingInterval } : {}),
      ...(dto.billingIntervalCount !== undefined
        ? { billingIntervalCount: dto.billingIntervalCount }
        : {}),
      ...(dto.minQuantity !== undefined
        ? { minQuantity: dto.minQuantity }
        : {}),
      ...(dto.availableFrom ? { availableFrom: fromDate } : {}),
      ...(dto.availableUntil !== undefined
        ? { availableUntil: untilDate }
        : {}),
      ...(dto.autoClose !== undefined ? { autoClose: dto.autoClose } : {}),
      ...(dto.earlyClosureAllowed !== undefined
        ? { earlyClosureAllowed: dto.earlyClosureAllowed }
        : {}),
      ...(dto.pauseAllowed !== undefined
        ? { pauseAllowed: dto.pauseAllowed }
        : {}),
      ...(dto.renewalAllowed !== undefined
        ? { renewalAllowed: dto.renewalAllowed }
        : {}),
      ...(dto.status ? { status: dto.status } : {}),
    });

    return updated;
  }

  async publish(id: string) {
    await this.findOne(id);
    const updated = await this.plansRepository.update(id, {
      status: 'published',
    });
    return {
      message: 'Subscription plan published successfully',
      plan: updated,
    };
  }

  async deactivate(id: string) {
    await this.findOne(id);
    const updated = await this.plansRepository.update(id, {
      status: 'deactivated',
    });
    return {
      message: 'Subscription plan deactivated successfully',
      plan: updated,
    };
  }
}

