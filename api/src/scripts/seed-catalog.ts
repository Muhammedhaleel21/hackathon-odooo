import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import {
  productCategories,
  products,
  productAttributes,
  productAttributeValues,
  subscriptionPlans,
} from '../database/schema';

async function seedCatalog() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('❌ Error: DATABASE_URL is not set.');
    process.exit(1);
  }

  const client = neon(databaseUrl);
  const db = drizzle({ client });

  console.log('🌱 Seeding Phase 3 catalog items...');

  // 1. Seed Categories
  const [existingCat] = await db
    .select({ id: productCategories.id })
    .from(productCategories)
    .limit(1);

  let softwareCatId: string;
  let hostingCatId: string;
  let addonCatId: string;

  if (!existingCat) {
    console.log('📁 Creating product categories...');
    const [soft] = await db
      .insert(productCategories)
      .values({
        name: 'Business Software',
        description: 'Enterprise ERP, CRM and business workflow platforms',
      })
      .returning({ id: productCategories.id });
    softwareCatId = soft.id;

    const [host] = await db
      .insert(productCategories)
      .values({
        name: 'Cloud & Infrastructure',
        description: 'Managed server hosting, cloud nodes and domain services',
      })
      .returning({ id: productCategories.id });
    hostingCatId = host.id;

    const [addon] = await db
      .insert(productCategories)
      .values({
        name: 'Add-ons & Modules',
        description: 'Supplementary features, connectors and integrations',
      })
      .returning({ id: productCategories.id });
    addonCatId = addon.id;
  } else {
    softwareCatId = existingCat.id;
    hostingCatId = existingCat.id;
    addonCatId = existingCat.id;
  }

  // 2. Seed Products
  const [existingProduct] = await db
    .select({ id: products.id })
    .from(products)
    .where(eq(products.name, 'Business Software'))
    .limit(1);

  if (existingProduct) {
    console.log('ℹ️  Catalog products already exist. Skipping seed.');
    process.exit(0);
  }

  console.log('📦 Creating example products...');
  // Business Software: ₹2,000 (200000 paise), Cost: ₹800 (80000 paise)
  const [businessSoftware] = await db
    .insert(products)
    .values({
      name: 'Business Software',
      categoryId: softwareCatId,
      productType: 'service',
      salesPrice: 200000,
      costPrice: 80000,
      notes:
        'Flagship enterprise management software with multi-user subscriptions.',
      status: 'active',
    })
    .returning();

  // Website Hosting: ₹1,000 (100000 paise), Cost: ₹400 (40000 paise)
  const [websiteHosting] = await db
    .insert(products)
    .values({
      name: 'Website Hosting',
      categoryId: hostingCatId,
      productType: 'service',
      salesPrice: 100000,
      costPrice: 40000,
      notes: 'High-availability SSD cloud hosting with daily automated backups.',
      status: 'active',
    })
    .returning();

  // CRM Add-on: ₹500 (50000 paise), Cost: ₹150 (15000 paise)
  await db.insert(products).values({
    name: 'CRM Add-on',
    categoryId: addonCatId,
    productType: 'addon',
    salesPrice: 50000,
    costPrice: 15000,
    notes: 'Extended sales pipeline and lead scoring automation tools.',
    status: 'archived',
  });

  // 3. Seed Variant: Brand for Business Software
  console.log('🏷️ Adding Brand variants with additional pricing...');
  const [brandAttr] = await db
    .insert(productAttributes)
    .values({
      productId: businessSoftware.id,
      name: 'Brand',
    })
    .returning();

  // Standard: +₹0, Odoo: +₹560 (56000 paise), Premium: +₹1,000 (100000 paise)
  await db.insert(productAttributeValues).values([
    {
      attributeId: brandAttr.id,
      value: 'Standard',
      additionalPrice: 0,
      isActive: true,
    },
    {
      attributeId: brandAttr.id,
      value: 'Odoo',
      additionalPrice: 56000,
      isActive: true,
    },
    {
      attributeId: brandAttr.id,
      value: 'Premium',
      additionalPrice: 100000,
      isActive: true,
    },
  ]);

  // 4. Seed Subscription Plans
  console.log('📅 Adding subscription plans with recurrence intervals...');
  const availableFrom = new Date();
  const availableUntil = new Date();
  availableUntil.setFullYear(availableUntil.getFullYear() + 1);

  await db.insert(subscriptionPlans).values([
    {
      productId: businessSoftware.id,
      name: 'Starter Plan',
      description: 'Ideal for small growing teams and single businesses.',
      price: 200000, // ₹2,000 / month
      billingInterval: 'monthly',
      billingIntervalCount: 1,
      minQuantity: 1,
      availableFrom,
      availableUntil,
      autoClose: false,
      earlyClosureAllowed: true,
      pauseAllowed: true,
      renewalAllowed: true,
      status: 'published',
    },
    {
      productId: businessSoftware.id,
      name: 'Professional Plan',
      description: 'Full capabilities with advanced automations and priority SLAs.',
      price: 250000, // ₹2,500 / month
      billingInterval: 'monthly',
      billingIntervalCount: 1,
      minQuantity: 1,
      availableFrom,
      availableUntil,
      autoClose: false,
      earlyClosureAllowed: true,
      pauseAllowed: true,
      renewalAllowed: true,
      status: 'published',
    },
    {
      productId: businessSoftware.id,
      name: 'Annual Enterprise',
      description: 'Annual commitment with 20% discount and dedicated account manager.',
      price: 2400000, // ₹24,000 / year
      billingInterval: 'yearly',
      billingIntervalCount: 1,
      minQuantity: 1,
      availableFrom,
      availableUntil,
      autoClose: false,
      earlyClosureAllowed: true,
      pauseAllowed: true,
      renewalAllowed: true,
      status: 'published',
    },
    {
      productId: websiteHosting.id,
      name: 'Basic Cloud Hosting',
      description: 'Standard single-site hosting with 50GB NVMe storage.',
      price: 100000, // ₹1,000 / month
      billingInterval: 'monthly',
      billingIntervalCount: 1,
      minQuantity: 1,
      availableFrom,
      availableUntil,
      autoClose: true,
      earlyClosureAllowed: true,
      pauseAllowed: true,
      renewalAllowed: true,
      status: 'published',
    },
  ]);

  console.log('✅ Catalog successfully seeded!');
}

seedCatalog().catch((err) => {
  console.error('❌ Failed to seed catalog:', err);
  process.exit(1);
});

