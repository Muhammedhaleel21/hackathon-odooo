import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTemplateLineDto {
  @IsUUID()
  @IsNotEmpty()
  productId!: string;

  @IsUUID()
  @IsOptional()
  variantValueId?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  defaultQuantity?: number;
}

export class CreateQuotationTemplateDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  @IsOptional()
  defaultPlanId?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  validityDays?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTemplateLineDto)
  @IsOptional()
  lines?: CreateTemplateLineDto[];
}

