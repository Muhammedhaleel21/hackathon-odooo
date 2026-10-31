import { neon } from '@neondatabase/serverless';
import { drizzle, NeonHttpDatabase } from 'drizzle-orm/neon-http';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AppDatabase = NeonHttpDatabase<any>;

export function createDatabase(databaseUrl: string): AppDatabase {
  const client = neon(databaseUrl);
  return drizzle({ client });
}
