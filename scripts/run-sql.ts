#!/usr/bin/env tsx
import { Pool } from 'pg';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';

dotenv.config({ path: '.env.local', override: true });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function runSQL() {
  try {
    const sql = readFileSync(process.argv[2] || 'scripts/create-plan-table.sql', 'utf-8');

    console.log('🔧 Running SQL script...\n');
    await pool.query(sql);
    console.log('✅ SQL script executed successfully!\n');
  } catch (error) {
    console.error('❌ SQL execution failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

runSQL();
