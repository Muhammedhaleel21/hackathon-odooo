import { Inject, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { DRIZZLE } from '../database/database.constants';
import type { AppDatabase } from '../database/database.provider';

@Injectable()
export class HealthService {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: AppDatabase,
  ) {}

  async check() {
    try {
      await this.db.execute(sql`SELECT 1`);
      return {
        status: 'ok',
        service: 'api',
        database: 'connected',
        timestamp: new Date().toISOString(),
      };
    } catch {
      throw new ServiceUnavailableException({
        status: 'error',
        service: 'api',
        database: 'disconnected',
      });
    }
  }
}
