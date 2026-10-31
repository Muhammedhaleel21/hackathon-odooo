import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionNumberService } from './subscription-number.service';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService, SubscriptionNumberService],
  exports: [SubscriptionsService, SubscriptionNumberService],
})
export class SubscriptionsModule {}

