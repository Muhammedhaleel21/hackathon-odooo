import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateQuotationLineDto {
  @IsUUID()
  @IsNotEmpty()
  productId!: string;

  @IsUUID()
  @IsOptional()
  variantValueId?: string;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  quantity!: number;
}

export class CreateQuotationDto {
  @IsUUID()
  @IsNotEmpty()
  customerId!: string;

  @IsUUID()
  @IsNotEmpty()
  planId!: string;

  @IsUUID()
  @IsOptional()
  quotationTemplateId?: string;

  @IsString()
  @IsOptional()
  paymentTerms?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuotationLineDto)
  @IsNotEmpty()
  lines!: CreateQuotationLineDto[];
}

