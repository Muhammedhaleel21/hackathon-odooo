import { IsIn, IsOptional, IsString } from 'class-validator';

export class QueryPlanDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  productId?: string;

  @IsIn(['daily', 'weekly', 'monthly', 'yearly'])
  @IsOptional()
  interval?: 'daily' | 'weekly' | 'monthly' | 'yearly';

  @IsIn(['draft', 'published', 'deactivated'])
  @IsOptional()
  status?: 'draft' | 'published' | 'deactivated';
}

