import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';
import { CategoriesController } from './categories/categories.controller';
import { CategoriesService } from './categories/categories.service';
import { ProductsController } from './products/products.controller';
import { ProductsService } from './products/products.service';
import { ProductsRepository } from './products/products.repository';
import { VariantsController } from './variants/variants.controller';
import { VariantsService } from './variants/variants.service';
import { PlansController } from './plans/plans.controller';
import { PlansService } from './plans/plans.service';
import { PlansRepository } from './plans/plans.repository';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [
    CategoriesController,
    ProductsController,
    VariantsController,
    PlansController,
  ],
  providers: [
    CategoriesService,
    ProductsService,
    ProductsRepository,
    VariantsService,
    PlansService,
    PlansRepository,
  ],
  exports: [
    CategoriesService,
    ProductsService,
    VariantsService,
    PlansService,
  ],
})
export class CatalogModule {}

