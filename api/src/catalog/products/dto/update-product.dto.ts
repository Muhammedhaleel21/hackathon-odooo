import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsUUID()
  @IsOptional()
  categoryId?: string | null;

  @IsIn(['service', 'goods', 'addon'])
  @IsOptional()
  productType?: 'service' | 'goods' | 'addon';

  @IsInt()
  @Min(0)
  @IsOptional()
  salesPrice?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  costPrice?: number;

  @IsString()
  @IsOptional()
  notes?: string | null;

  @IsIn(['active', 'archived'])
  @IsOptional()
  status?: 'active' | 'archived';
}

