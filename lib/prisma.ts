import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import { env } from './env' // Validates environment variables at import time

// Ensure .env.local values override any system-level env vars (e.g., from `supabase link`).
dotenv.config({ path: '.env.local', override: true })

// Use validated DATABASE_URL from env
const pool = new Pool({
  connectionString: env.DATABASE_URL,
})

const adapter = new PrismaPg(pool)

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
