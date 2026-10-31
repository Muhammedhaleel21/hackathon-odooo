import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import * as argon2 from 'argon2';
import { users } from '../database/schema/users.schema';

async function seedAdmin() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('❌ Error: DATABASE_URL is not set.');
    process.exit(1);
  }

  const name = process.env.INITIAL_ADMIN_NAME || 'System Administrator';
  const email = (
    process.env.INITIAL_ADMIN_EMAIL || 'admin@brightloop.local'
  )
    .toLowerCase()
    .trim();
  const password = process.env.INITIAL_ADMIN_PASSWORD || 'Admin@Brightloop123';

  // Validate password rules (min 9 chars, upper, lower, special)
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{9,128}$/;
  if (!passwordRegex.test(password)) {
    console.error(
      '❌ Error: INITIAL_ADMIN_PASSWORD does not meet complexity requirements (min 9 chars, uppercase, lowercase, special character).',
    );
    process.exit(1);
  }

  const client = neon(databaseUrl);
  const db = drizzle({ client });

  // Check if ANY admin already exists
  const [existingAdmin] = await db
    .select({ id: users.id, email: users.email })
    .from(users)
    .where(eq(users.role, 'admin'))
    .limit(1);

  if (existingAdmin) {
    console.log(
      `ℹ️  An administrator account already exists (${existingAdmin.email}). Skipping initial seed.`,
    );
    process.exit(0);
  }

  // Check if user with this email exists with another role
  const [existingEmail] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingEmail) {
    console.error(
      `❌ Error: A user with email ${email} already exists with a non-admin role.`,
    );
    process.exit(1);
  }

  console.log(`🔐 Hashing admin password with Argon2id...`);
  const passwordHash = await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4,
  });

  const [newAdmin] = await db
    .insert(users)
    .values({
      name,
      email,
      passwordHash,
      role: 'admin',
      isActive: true,
      emailVerifiedAt: new Date(),
    })
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
    });

  console.log('✅ Admin account seeded successfully:');
  console.log(`   ID:    ${newAdmin.id}`);
  console.log(`   Name:  ${newAdmin.name}`);
  console.log(`   Email: ${newAdmin.email}`);
  console.log(`   Role:  ${newAdmin.role}`);
  console.log('🔒 Password set securely from environment configuration.');
}

seedAdmin().catch((err) => {
  console.error('❌ Failed to seed admin account:', err);
  process.exit(1);
});
