import dotenv from 'dotenv'
import { readFileSync } from 'fs'
import { join } from 'path'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

dotenv.config({ path: '.env.local', override: true })

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function runMigration() {
  try {
    const sql = readFileSync(join(__dirname, 'add-onetime-columns.sql'), 'utf-8')

    console.log('🔧 Adding priceOneTime and stripePriceIdOneTime columns...\n')

    await prisma.$executeRawUnsafe(sql)

    console.log('✅ Columns added successfully!\n')
  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
    await pool.end()
  }
}

runMigration()
