import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @IsIn(['service', 'goods', 'addon'])
  @IsOptional()
  productType?: 'service' | 'goods' | 'addon';

  @IsInt()
  @Min(0)
  salesPrice!: number; // Stored in minor units (paise), e.g. 200000 for ₹2,000

  @IsInt()
  @Min(0)
  @IsOptional()
  costPrice?: number; // Stored in minor units (paise), e.g. 80000 for ₹800

  @IsString()
  @IsOptional()
  notes?: string;

  @IsIn(['active', 'archived'])
  @IsOptional()
  status?: 'active' | 'archived';
}

