import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateTemplateLineDto } from './create-template.dto';

export class UpdateQuotationTemplateDto {
  @IsString()
  @IsOptional()
  name?: string;

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
