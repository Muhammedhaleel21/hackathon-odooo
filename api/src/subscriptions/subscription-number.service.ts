import { Inject, Injectable } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { DRIZZLE } from '../database/database.constants';
import { AppDatabase } from '../database/database.provider';
import { subscriptions } from '../database/schema';

@Injectable()
export class SubscriptionNumberService {
  constructor(@Inject(DRIZZLE) private readonly db: AppDatabase) {}

  async generateQuotationNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `QT-${year}-`;

    const [result] = await this.db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(subscriptions)
      .where(sql`${subscriptions.quotationNumber} LIKE ${prefix + '%'}`);

    const nextSeq = (Number(result?.count) || 0) + 1;
    return `${prefix}${nextSeq.toString().padStart(4, '0')}`;
  }

  async generateSubscriptionNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `SUB-${year}-`;

    const [result] = await this.db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(subscriptions)
      .where(sql`${subscriptions.subscriptionNumber} LIKE ${prefix + '%'}`);

    const nextSeq = (Number(result?.count) || 0) + 1;
    return `${prefix}${nextSeq.toString().padStart(4, '0')}`;
  }
}

