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
    const sql = readFileSync(
      resolve(__dirname, 'create-subscription-enum.sql'),
      'utf-8'
    );

    console.log('Creating subscription enums...');
    await pool.query(sql);
    console.log('✅ Subscription enums created successfully');
  } catch (error) {
    console.error('❌ Error creating enums:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

main();
