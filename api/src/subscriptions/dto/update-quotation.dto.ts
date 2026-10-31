import {
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateQuotationLineDto } from './create-quotation.dto';

export class UpdateQuotationDto {
  @IsUUID()
  @IsOptional()
  customerId?: string;

  @IsUUID()
  @IsOptional()
  planId?: string;

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
  @IsOptional()
  lines?: CreateQuotationLineDto[];
}

