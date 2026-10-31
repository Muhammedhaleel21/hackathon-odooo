import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

async function check() {
  const sql = neon(process.env.DATABASE_URL!);
  const tables = await sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public';
  `;
  console.log('Existing tables in public schema:', tables);

  const migrations = await sql`
    SELECT * FROM "__drizzle_migrations";
  `;
  console.log('Drizzle migrations:', migrations);
}

check().catch(console.error);

