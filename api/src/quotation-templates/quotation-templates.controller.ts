import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/auth.types';
import { QuotationTemplatesService } from './quotation-templates.service';
import { CreateQuotationTemplateDto } from './dto/create-template.dto';
import { UpdateQuotationTemplateDto } from './dto/update-template.dto';

@Controller('quotation-templates')
@UseGuards(JwtAuthGuard, RolesGuard)
export class QuotationTemplatesController {
  constructor(
    private readonly templatesService: QuotationTemplatesService,
  ) {}

  @Post()
  @Roles('admin', 'staff')
  async create(
    @Body() dto: CreateQuotationTemplateDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.templatesService.create(dto, user.id);
  }

  @Get()
  @Roles('admin', 'staff')
  async findAll() {
    return this.templatesService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'staff')
  async findOne(@Param('id') id: string) {
    return this.templatesService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin', 'staff')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateQuotationTemplateDto,
  ) {
    return this.templatesService.update(id, dto);
  }

  @Patch(':id/toggle-status')
  @Roles('admin', 'staff')
  async toggleStatus(@Param('id') id: string) {
    return this.templatesService.toggleStatus(id);
  }

  @Post(':id/duplicate')
  @Roles('admin', 'staff')
  async duplicate(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.templatesService.duplicate(id, user.id);
  }
}

