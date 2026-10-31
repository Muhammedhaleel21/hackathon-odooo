import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import * as fs from 'fs';
import * as path from 'path';

async function runMigration() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set');
  }

  const sql = neon(databaseUrl);
  const sqlFile = path.resolve(__dirname, '../../drizzle/0001_short_bushwacker.sql');
  const sqlContent = fs.readFileSync(sqlFile, 'utf8');

  // Split by statement breakpoints
  const statements = sqlContent
    .split('--> statement-breakpoint')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  console.log(`Executing ${statements.length} migration statements...`);

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    console.log(`[${i + 1}/${statements.length}] Running statement...`);
    try {
      await sql.query(stmt);
    } catch (err: any) {
      if (err.message && err.message.includes('already exists')) {
        console.log(`   (Notice: ${err.message})`);
      } else {
        throw err;
      }
    }
  }

  console.log('✅ Migration applied directly to Neon database!');

  // Verify tables
  const tables = await sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public';
  `;
  console.log('Verified tables in database:');
  tables.forEach((t: any) => console.log(` - ${t.table_name}`));
}

runMigration().catch((err) => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
