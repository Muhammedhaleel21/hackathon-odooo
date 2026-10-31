import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdateAttributeValueDto {
  @IsString()
  @IsOptional()
  value?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  additionalPrice?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

