import dotenv from 'dotenv';
import { resolve } from 'path';
dotenv.config({ path: resolve(__dirname, '../.env.local'), override: true });

// Manually set required env vars if not set
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = process.env.DATABASE_URL || '';
}
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  process.env.NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
}

import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    // Get all users
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, createdAt: true }
    });

    console.log('Database users:');
    console.log(JSON.stringify(users, null, 2));

    const subscriptions = await prisma.subscription.findMany({
      select: { id: true, userId: true, status: true },
      include: { plan: { select: { name: true } } }
    });

    console.log('\nSubscriptions:');
    console.log(JSON.stringify(subscriptions, null, 2));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
