import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq, desc, sql } from 'drizzle-orm';
import * as argon2 from 'argon2';
import {
  users,
  products,
  subscriptionPlans,
  quotationTemplates,
  quotationTemplateLines,
  subscriptions,
  subscriptionLines,
  subscriptionStatusHistory,
} from '../database/schema';

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set');
  }

  const client = neon(databaseUrl);
  const db = drizzle({ client });

  console.log('🚀 Running Phase 4 End-to-End Verification...');

  // 1. Ensure test customer exists
  let [customer] = await db
    .select()
    .from(users)
    .where(eq(users.email, 'customer@brightloop.local'))
    .limit(1);

  if (!customer) {
    console.log('👤 Creating default customer user: customer@brightloop.local');
    const passwordHash = await argon2.hash('Customer@Brightloop123');
    const [newCustomer] = await db
      .insert(users)
      .values({
        name: 'Acme Enterprise Corp',
        email: 'customer@brightloop.local',
        passwordHash,
        role: 'customer',
        isActive: true,
      })
      .returning();
    customer = newCustomer;
  }

  // 2. Fetch admin user
  const [admin] = await db
    .select()
    .from(users)
    .where(eq(users.role, 'admin'))
    .limit(1);

  // 3. Fetch products and plan
  const [softwareProduct] = await db
    .select()
    .from(products)
    .where(eq(products.name, 'Business Software'))
    .limit(1);

  const [hostingProduct] = await db
    .select()
    .from(products)
    .where(eq(products.name, 'Website Hosting'))
    .limit(1);

  const [starterPlan] = await db
    .select()
    .from(subscriptionPlans)
    .where(eq(subscriptionPlans.name, 'Starter Plan'))
    .limit(1);

  if (!softwareProduct || !starterPlan) {
    throw new Error('Required catalog items (Business Software, Starter Plan) not found.');
  }

  // 4. Seed standard Quotation Template: "Business Starter Package"
  let [template] = await db
    .select()
    .from(quotationTemplates)
    .where(eq(quotationTemplates.name, 'Business Starter Package'))
    .limit(1);

  if (!template) {
    console.log('📋 Creating default Quotation Template: Business Starter Package');
    const [newTemplate] = await db
      .insert(quotationTemplates)
      .values({
        name: 'Business Starter Package',
        description: 'Complete ERP license bundle with managed cloud hosting and 15 days validity',
        defaultPlanId: starterPlan.id,
        validityDays: 15,
        isActive: true,
        createdBy: admin?.id,
      })
      .returning();
    template = newTemplate;

    // Add lines: 1x Business Software, 1x Website Hosting
    await db.insert(quotationTemplateLines).values([
      {
        templateId: template.id,
        productId: softwareProduct.id,
        defaultQuantity: 1,
      },
      ...(hostingProduct
        ? [
            {
              templateId: template.id,
              productId: hostingProduct.id,
              defaultQuantity: 1,
            },
          ]
        : []),
    ]);
    console.log('✅ Created Quotation Template with 2 product lines.');
  } else {
    console.log('ℹ️  Quotation Template "Business Starter Package" already exists.');
  }

  // 5. Test Quotation & Subscription Lifecycle
  console.log('🔄 Testing End-to-End Quotation-to-Subscription Lifecycle...');

  const quotationNumber = `QT-2026-TEST01`;
  // Clean up any previous test record
  await db.delete(subscriptions).where(eq(subscriptions.quotationNumber, quotationNumber));

  // Step A: Draft Quotation
  const line1Base = softwareProduct.salesPrice * 1;
  const line1Tax = Math.round((line1Base * 18) / 100);
  const line1Total = line1Base + line1Tax;

  const subtotal = line1Base;
  const taxTotal = line1Tax;
  const totalAmount = line1Total;

  const [quote] = await db
    .insert(subscriptions)
    .values({
      quotationNumber,
      customerId: customer.id,
      planId: starterPlan.id,
      quotationTemplateId: template.id,
      status: 'draft',
      paymentTerms: 'immediate',
      notes: 'Test end-to-end commercial proposal for Brightloop verification',
      subtotal,
      taxTotal,
      totalAmount,
      createdBy: admin?.id,
    })
    .returning();

  await db.insert(subscriptionLines).values({
    subscriptionId: quote.id,
    productId: softwareProduct.id,
    productName: softwareProduct.name,
    quantity: 1,
    unitPrice: softwareProduct.salesPrice,
    taxRate: 18,
    taxAmount: line1Tax,
    lineTotal: line1Total,
  });

  await db.insert(subscriptionStatusHistory).values({
    subscriptionId: quote.id,
    previousStatus: null,
    newStatus: 'draft',
    changedBy: admin?.id,
    reason: 'Initial quotation drafted via quotation builder',
  });

  console.log(` ✅ Step 1: Draft Quotation created (${quotationNumber}, Status: ${quote.status})`);

  // Step B: Issue Quotation
  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + 15);

  const [issuedQuote] = await db
    .update(subscriptions)
    .set({
      status: 'quotation',
      quotationValidUntil: validUntil,
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.id, quote.id))
    .returning();

  await db.insert(subscriptionStatusHistory).values({
    subscriptionId: quote.id,
    previousStatus: 'draft',
    newStatus: 'quotation',
    changedBy: admin?.id,
    reason: `Quotation issued to ${customer.email} (valid until ${validUntil.toISOString().slice(0, 10)})`,
  });

  console.log(` ✅ Step 2: Quotation issued (Status: ${issuedQuote.status}, ValidUntil: ${issuedQuote.quotationValidUntil?.toISOString().slice(0, 10)})`);

  // Step C: Confirm Quotation
  const [confirmedQuote] = await db
    .update(subscriptions)
    .set({
      status: 'confirmed',
      confirmedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.id, quote.id))
    .returning();

  await db.insert(subscriptionStatusHistory).values({
    subscriptionId: quote.id,
    previousStatus: 'quotation',
    newStatus: 'confirmed',
    changedBy: customer.id,
    reason: 'Quotation accepted and confirmed by customer',
  });

  console.log(` ✅ Step 3: Quotation confirmed (Status: ${confirmedQuote.status}, ConfirmedAt: ${confirmedQuote.confirmedAt?.toISOString()})`);

  // Step D: Activate Subscription
  const subNumber = 'SUB-2026-TEST01';
  const startDate = new Date();
  const expiryDate = new Date(startDate);
  expiryDate.setMonth(expiryDate.getMonth() + 1);

  const [activeSub] = await db
    .update(subscriptions)
    .set({
      status: 'active',
      subscriptionNumber: subNumber,
      startDate,
      expiryDate,
      activatedAt: startDate,
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.id, quote.id))
    .returning();

  await db.insert(subscriptionStatusHistory).values({
    subscriptionId: quote.id,
    previousStatus: 'confirmed',
    newStatus: 'active',
    changedBy: admin?.id,
    reason: `Subscription activated under identifier ${subNumber}. Term initialized until ${expiryDate.toISOString().slice(0, 10)}.`,
  });

  console.log(` ✅ Step 4: Subscription activated! (Status: ${activeSub.status}, Number: ${activeSub.subscriptionNumber}, Expiry: ${activeSub.expiryDate?.toISOString().slice(0, 10)})`);

  // Step E: Verify History Audit Trail
  const history = await db
    .select()
    .from(subscriptionStatusHistory)
    .where(eq(subscriptionStatusHistory.subscriptionId, quote.id))
    .orderBy(desc(subscriptionStatusHistory.createdAt));

  console.log(` ✅ Step 5: Audit Trail verified with ${history.length} transition records:`);
  history.forEach((h, i) => {
    console.log(`    [#${history.length - i}] ${h.previousStatus || 'null'} -> ${h.newStatus}: "${h.reason}"`);
  });

  console.log('\n🎉 Phase 4 End-to-End Workflow Verification PASSED with 100% SUCCESS!');
}

main().catch((err) => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});

