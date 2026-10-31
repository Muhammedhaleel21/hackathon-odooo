import { IsIn, IsOptional, IsString, IsUUID } from 'class-validator';

export class QuerySubscriptionDto {
  @IsOptional()
  @IsIn(['draft', 'quotation', 'confirmed', 'active', 'closed'])
  status?: 'draft' | 'quotation' | 'confirmed' | 'active' | 'closed';

  @IsOptional()
  @IsUUID()
  customerId?: string;

  @IsOptional()
  @IsString()
  search?: string;
}

export class CloseSubscriptionDto {
  @IsOptional()
  @IsString()
  reason?: string;
}

