import { Pool } from 'pg';
import { resolve } from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: resolve(__dirname, '../.env.local'), override: true });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL not found in environment');
  process.exit(1);
}

async function main() {
  const pool = new Pool({ connectionString });

  try {
    // Get all users
    const users = await pool.query(`
      SELECT id, email, name, role, "createdAt"
      FROM users
      ORDER BY "createdAt" DESC;
    `);

    console.log('=== USERS ===');
    console.table(users.rows);

    // Get all subscriptions
    const subscriptions = await pool.query(`
      SELECT
        s.id,
        s."userId",
        u.email as "userEmail",
        s.status,
        s."billingCycle",
        s."stripeSubscriptionId",
        s."createdAt",
        p.name as "planName",
        p."serviceType"
      FROM subscriptions s
      LEFT JOIN users u ON s."userId" = u.id
      LEFT JOIN plans p ON s."planId" = p.id
      ORDER BY s."createdAt" DESC;
    `);

    console.log('\n=== SUBSCRIPTIONS ===');
    console.table(subscriptions.rows);

    if (subscriptions.rows.length === 0) {
      console.log('\n⚠️  No subscriptions found in database!');
      console.log('This means the webhook either:');
      console.log('1. Didn\'t fire');
      console.log('2. Failed to create the subscription');
      console.log('3. Created it for a different user');
    }
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

main();
