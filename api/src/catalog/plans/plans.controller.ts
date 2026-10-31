import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { PlansService } from './plans.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { QueryPlanDto } from './dto/query-plan.dto';

@Controller('plans')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Post()
  @Roles('admin')
  async create(@Body() dto: CreatePlanDto) {
    return this.plansService.create(dto);
  }

  @Get()
  @Roles('admin', 'staff')
  async findAll(@Query() query: QueryPlanDto) {
    return this.plansService.findAll(query);
  }

  @Get(':id')
  @Roles('admin', 'staff')
  async findOne(@Param('id') id: string) {
    return this.plansService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin')
  async update(@Param('id') id: string, @Body() dto: UpdatePlanDto) {
    return this.plansService.update(id, dto);
  }

  @Patch(':id/publish')
  @Roles('admin')
  async publish(@Param('id') id: string) {
    return this.plansService.publish(id);
  }

  @Patch(':id/deactivate')
  @Roles('admin')
  async deactivate(@Param('id') id: string) {
    return this.plansService.deactivate(id);
  }
}

