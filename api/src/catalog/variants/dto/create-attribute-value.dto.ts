import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateAttributeValueDto {
  @IsString()
  @IsNotEmpty()
  value!: string; // e.g., 'Standard', 'Odoo', 'Premium'

  @IsInt()
  @Min(0)
  @IsOptional()
  additionalPrice?: number; // In minor units (paise), e.g. 56000 for ₹560

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

