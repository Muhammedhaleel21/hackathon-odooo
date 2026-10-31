import { FactoryProvider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createDatabase, AppDatabase } from './database.provider';
import { DRIZZLE } from './database.constants';

export const databaseProvider: FactoryProvider<AppDatabase> = {
  provide: DRIZZLE,
  inject: [ConfigService],
  useFactory: (configService: ConfigService): AppDatabase => {
    const databaseUrl = configService.getOrThrow<string>('DATABASE_URL');
    return createDatabase(databaseUrl);
  },
};
