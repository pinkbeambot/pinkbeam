/**
 * Environment Variable Validation
 *
 * Validates critical environment variables at startup using Zod.
 * Fails fast with clear error messages if configuration is invalid.
 */

import { z } from 'zod'

// ============================================================================
// Custom Validators
// ============================================================================

/** Validate PostgreSQL connection string format */
const postgresUrlSchema = z.string().refine(
  (url) => {
    if (!url.startsWith('postgresql://') && !url.startsWith('postgres://')) {
      return false
    }
    // Check basic format: postgresql://user:password@host:port/database
    const regex = /^postgres(?:ql)?:\/\/[^:]+:[^@]+@[^:]+:\d+\/\w+/
    return regex.test(url)
  },
  {
    message:
      'Invalid PostgreSQL URL format. Expected: postgresql://user:password@host:port/database',
  }
)

/** Validate Supabase URL format */
const supabaseUrlSchema = z.string().url().refine(
  (url) => url.includes('supabase.co') || url.includes('localhost'),
  {
    message: 'URL does not appear to be a valid Supabase instance',
  }
)

/** Validate Supabase key format */
const supabaseKeySchema = z.string().min(40, 'Key appears too short to be valid')

/** Validate email address in "Name <email@domain.com>" or "email@domain.com" format */
const emailFromSchema = z.string().refine(
  (val) => {
    // Extract email from "Name <email>" format if present
    const match = val.match(/<(.+?)>/)
    const email = match ? match[1] : val
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },
  {
    message: 'Invalid email format',
  }
)

// ============================================================================
// Environment Schema
// ============================================================================

const envSchema = z.object({
  // Database - REQUIRED
  DATABASE_URL: postgresUrlSchema.describe(
    'PostgreSQL connection string (pooled connection for app queries)'
  ),
  DIRECT_URL: postgresUrlSchema
    .optional()
    .describe('PostgreSQL direct connection string (for migrations only)'),

  // Supabase Auth - REQUIRED
  NEXT_PUBLIC_SUPABASE_URL: supabaseUrlSchema.describe('Supabase project URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseKeySchema.describe(
    'Supabase anonymous/public key'
  ),
  SUPABASE_SERVICE_ROLE_KEY: supabaseKeySchema
    .optional()
    .describe('Supabase service role key (for admin operations)'),

  // Application URLs
  NEXT_PUBLIC_APP_URL: z
    .string()
    .url()
    .optional()
    .default('http://localhost:3000')
    .describe('Base URL for the application (used in emails and redirects)'),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development')
    .describe('Node environment'),

  // Email Configuration - OPTIONAL (has fallbacks)
  RESEND_API_KEY: z
    .string()
    .min(20, 'Resend API key appears too short')
    .optional()
    .describe('Resend API key for sending transactional emails'),
  EMAIL_FROM: emailFromSchema
    .optional()
    .describe('FROM address for outgoing emails'),
  QUOTE_NOTIFY_EMAIL: z
    .string()
    .email('Invalid email format')
    .optional()
    .describe('Email address for quote notifications'),
  SUPPORT_NOTIFY_EMAIL: z
    .string()
    .email('Invalid email format')
    .optional()
    .describe('Email address for support ticket notifications'),

  // Cron Jobs - OPTIONAL
  CRON_SECRET: z
    .string()
    .min(16, 'Cron secret should be at least 16 characters')
    .optional()
    .describe('Secret for authenticating cron job requests'),

  // Future: Stripe (commented out until Phase 4)
  // STRIPE_SECRET_KEY: z.string().optional(),
  // STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  // STRIPE_WEBHOOK_SECRET: z.string().optional(),
})

// ============================================================================
// Validation & Export
// ============================================================================

/**
 * Validate and parse environment variables
 * Throws with detailed error messages if validation fails
 */
function validateEnv() {
  try {
    const parsed = envSchema.parse(process.env)

    // Log success in development
    if (process.env.NODE_ENV !== 'production') {
      console.log('✅ Environment variables validated successfully')
    }

    return parsed
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('\n🚨 Environment Variable Validation Failed:\n')

      // Format Zod errors for readability
      error.issues.forEach((issue) => {
        const path = issue.path.join('.')
        console.error(`❌ ${path}: ${issue.message}`)
      })

      console.error('\n💡 Fix the errors above and restart the application.')
      console.error('📝 See .env.example for reference.\n')
    }

    throw new Error('Environment validation failed')
  }
}

/**
 * Validated environment variables
 * Access typed env vars via `env.DATABASE_URL`, etc.
 */
export const env = validateEnv()

/**
 * Type-safe environment variable access
 */
export type Env = z.infer<typeof envSchema>

// ============================================================================
// Runtime Helpers
// ============================================================================

/**
 * Get a required environment variable or throw at runtime
 * Use this for variables that must exist but aren't in the schema
 */
export function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(
      `Required environment variable ${name} is not set. Check your .env.local file.`
    )
  }
  return value
}

/**
 * Get an optional environment variable with a default value
 */
export function getEnv(name: string, defaultValue: string): string {
  return process.env[name] || defaultValue
}
