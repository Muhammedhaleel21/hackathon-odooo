import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { VariantsService } from './variants.service';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { CreateAttributeValueDto } from './dto/create-attribute-value.dto';
import { UpdateAttributeValueDto } from './dto/update-attribute-value.dto';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class VariantsController {
  constructor(private readonly variantsService: VariantsService) {}

  @Post('products/:id/attributes')
  @Roles('admin')
  async createAttribute(
    @Param('id') productId: string,
    @Body() dto: CreateAttributeDto,
  ) {
    return this.variantsService.createAttribute(productId, dto);
  }

  @Post('attributes/:id/values')
  @Roles('admin')
  async createAttributeValue(
    @Param('id') attributeId: string,
    @Body() dto: CreateAttributeValueDto,
  ) {
    return this.variantsService.createAttributeValue(attributeId, dto);
  }

  @Get('products/:id/variants')
  @Roles('admin', 'staff')
  async getProductVariants(@Param('id') productId: string) {
    return this.variantsService.getProductVariants(productId);
  }

  @Patch('variant-values/:id')
  @Roles('admin')
  async updateAttributeValue(
    @Param('id') valueId: string,
    @Body() dto: UpdateAttributeValueDto,
  ) {
    return this.variantsService.updateAttributeValue(valueId, dto);
  }

  @Delete('attributes/:id')
  @Roles('admin')
  async deleteAttribute(@Param('id') attributeId: string) {
    return this.variantsService.deleteAttribute(attributeId);
  }

  @Delete('variant-values/:id')
  @Roles('admin')
  async deleteAttributeValue(@Param('id') valueId: string) {
    return this.variantsService.deleteAttributeValue(valueId);
  }
}

