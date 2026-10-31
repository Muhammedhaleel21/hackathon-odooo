import { Module } from '@nestjs/common';
import { databaseProvider } from './database.factory';

@Module({
  providers: [databaseProvider],
  exports: [databaseProvider.provide],
})
export class DatabaseModule {}
