import { Pool } from 'pg';
import { readFileSync } from 'fs';
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
    // First, check current column types
    const result = await pool.query(`
      SELECT column_name, data_type, udt_name
      FROM information_schema.columns
      WHERE table_name = 'subscriptions'
      AND column_name IN ('status', 'billingCycle', 'paymentStatus')
      ORDER BY column_name;
    `);

    console.log('Current column types in subscriptions table:');
    console.table(result.rows);

    // Run the fix script
    const sql = readFileSync(
      resolve(__dirname, 'fix-subscription-table.sql'),
      'utf-8'
    );

    console.log('\nFixing subscription table columns...');
    await pool.query(sql);
    console.log('✅ Subscription table fixed successfully');

    // Check updated column types
    const resultAfter = await pool.query(`
      SELECT column_name, data_type, udt_name
      FROM information_schema.columns
      WHERE table_name = 'subscriptions'
      AND column_name IN ('status', 'billingCycle', 'paymentStatus')
      ORDER BY column_name;
    `);

    console.log('\nUpdated column types:');
    console.table(resultAfter.rows);
  } catch (error) {
    console.error('❌ Error fixing subscription table:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

main();
