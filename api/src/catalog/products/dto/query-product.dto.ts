import { IsIn, IsOptional, IsString } from 'class-validator';

export class QueryProductDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsIn(['service', 'goods', 'addon'])
  @IsOptional()
  type?: 'service' | 'goods' | 'addon';

  @IsIn(['active', 'archived'])
  @IsOptional()
  status?: 'active' | 'archived';

  @IsString()
  @IsOptional()
  categoryId?: string;
}

