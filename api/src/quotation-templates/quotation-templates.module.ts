import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';
import { QuotationTemplatesController } from './quotation-templates.controller';
import { QuotationTemplatesService } from './quotation-templates.service';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [QuotationTemplatesController],
  providers: [QuotationTemplatesService],
  exports: [QuotationTemplatesService],
})
export class QuotationTemplatesModule {}

