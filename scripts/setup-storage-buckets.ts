import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local', override: true })

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(url, serviceRoleKey)

const buckets = [
  { id: 'attachments', public: false, fileSizeLimit: 50 * 1024 * 1024 },
  { id: 'deliverables', public: false, fileSizeLimit: 50 * 1024 * 1024 },
  { id: 'public-assets', public: true, fileSizeLimit: 50 * 1024 * 1024 },
]

async function main() {
  for (const bucket of buckets) {
    const { error } = await supabase.storage.createBucket(bucket.id, {
      public: bucket.public,
      fileSizeLimit: bucket.fileSizeLimit,
    })
    if (error) {
      if (error.message.includes('already exists')) {
        console.log(`  ✓ Bucket "${bucket.id}" already exists`)
      } else {
        console.error(`  ✗ Failed to create "${bucket.id}":`, error.message)
      }
    } else {
      console.log(`  ✓ Created bucket "${bucket.id}" (public: ${bucket.public})`)
    }
  }
  console.log('\nDone.')
}

main()
