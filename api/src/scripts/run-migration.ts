import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
import { neon } from '@neondatabase/serverless';

async function runMigration() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set');
  }

  const sql = neon(databaseUrl);
  const sqlFile = path.resolve(
    __dirname,
    '../../drizzle/0002_tranquil_lilith.sql',
  );
  const sqlContent = fs.readFileSync(sqlFile, 'utf8');

  // Split by statement breakpoints
  const statements = sqlContent
    .split('--> statement-breakpoint')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  console.log(`Executing ${statements.length} migration statements for Phase 4...`);

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    console.log(`[${i + 1}/${statements.length}] Running statement...`);
    try {
      await sql.query(stmt);
    } catch (err: any) {
      if (err.message && (err.message.includes('already exists') || err.message.includes('duplicate'))) {
        console.log(`   (Notice: ${err.message})`);
      } else {
        throw err;
      }
    }
  }

  console.log('✅ Phase 4 migration applied directly to Neon database!');

  // Verify tables
  const tables = await sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    ORDER BY table_name;
  `;
  console.log('Verified tables in database:');
  tables.forEach((t: any) => console.log(` - ${t.table_name}`));
}

runMigration().catch((err) => {
  console.error('❌ Migration error:', err);
  process.exit(1);
});
