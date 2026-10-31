import {
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreatePlanDto {
  @IsUUID()
  @IsNotEmpty()
  productId!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(0)
  price!: number; // Stored in minor units (paise)

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
  @IsNotEmpty()
  availableFrom!: string;

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

