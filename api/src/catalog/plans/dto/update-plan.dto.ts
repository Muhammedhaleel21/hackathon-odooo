import {
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class UpdatePlanDto {
  @IsUUID()
  @IsOptional()
  productId?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  price?: number;

  @IsIn(['daily', 'weekly', 'monthly', 'yearly'])
  @IsOptional()
  billingInterval?: 'daily' | 'weekly' | 'monthly' | 'yearly';

  @IsInt()
  @Min(1)
  @IsOptional()
  billingIntervalCount?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  minQuantity?: number;

  @IsDateString()
  @IsOptional()
  availableFrom?: string;

  @IsDateString()
  @IsOptional()
  availableUntil?: string;

  @IsBoolean()
  @IsOptional()
  autoClose?: boolean;

  @IsBoolean()
  @IsOptional()
  earlyClosureAllowed?: boolean;

  @IsBoolean()
  @IsOptional()
  pauseAllowed?: boolean;

  @IsBoolean()
  @IsOptional()
  renewalAllowed?: boolean;

  @IsIn(['draft', 'published', 'deactivated'])
  @IsOptional()
  status?: 'draft' | 'published' | 'deactivated';
}

