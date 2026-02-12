/**
 * Webhook Payload Sanitization
 * Removes sensitive data before storing webhook payloads in database
 */

import type { WebhookSource } from './event-types'

/**
 * Sensitive field patterns to remove from all webhook payloads
 */
const GLOBAL_SENSITIVE_FIELDS = [
  // Authentication & Secrets
  'password',
  'token',
  'secret',
  'api_key',
  'apiKey',
  'access_token',
  'accessToken',
  'refresh_token',
  'refreshToken',
  'private_key',
  'privateKey',
  'ssh_key',
  'sshKey',
  'webhook_secret',
  'webhookSecret',
  'client_secret',
  'clientSecret',

  // Payment Information
  'cvv',
  'cvc',
  'card_number',
  'cardNumber',
  'account_number',
  'accountNumber',
  'routing_number',
  'routingNumber',
  'bank_account',
  'bankAccount',

  // Personal Identification
  'ssn',
  'social_security_number',
  'passport',
  'drivers_license',
  'driversLicense',
  'national_id',
  'nationalId',
]

/**
 * Source-specific sensitive fields to remove
 */
const SOURCE_SENSITIVE_FIELDS: Record<WebhookSource, string[]> = {
  stripe: [
    'card',
    'payment_method_details',
    'billing_details',
    'customer_details',
    'last4',
    'exp_month',
    'exp_year',
    'fingerprint',
    'sources',
    'default_source',
  ],
  github: [
    'installation_access_token',
    'app_key',
    'credentials',
    'authorization',
  ],
  clerk: [
    'email_addresses',
    'phone_numbers',
    'external_accounts',
    'profile_image_url',
    'unsafe_metadata',
  ],
  test: [], // Test webhooks can store everything
}

/**
 * Sanitize webhook payload by removing sensitive fields
 * @param payload The webhook payload to sanitize
 * @param source The webhook source type
 * @returns Sanitized payload safe for database storage
 */
export function sanitizeWebhookPayload(
  payload: unknown,
  source: WebhookSource
): unknown {
  if (!payload || typeof payload !== 'object') {
    return payload
  }

  // Clone to avoid mutating original
  const sanitized = JSON.parse(JSON.stringify(payload))

  // Get sensitive fields for this source
  const sensitiveFields = [
    ...GLOBAL_SENSITIVE_FIELDS,
    ...(SOURCE_SENSITIVE_FIELDS[source] || []),
  ]

  // Recursively remove sensitive fields
  removeSensitiveFields(sanitized, sensitiveFields)

  return sanitized
}

/**
 * Recursively remove sensitive fields from an object
 * @param obj The object to sanitize (mutates in place)
 * @param sensitiveFields Array of field names to remove
 */
function removeSensitiveFields(
  obj: Record<string, unknown>,
  sensitiveFields: string[]
): void {
  for (const key in obj) {
    // Check if this field should be removed
    const isFieldSensitive = sensitiveFields.some(
      (field) => key.toLowerCase().includes(field.toLowerCase())
    )

    if (isFieldSensitive) {
      obj[key] = '[REDACTED]'
      continue
    }

    // Recursively process nested objects
    const value = obj[key]
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      removeSensitiveFields(value as Record<string, unknown>, sensitiveFields)
    } else if (Array.isArray(value)) {
      // Process arrays
      value.forEach((item) => {
        if (item && typeof item === 'object') {
          removeSensitiveFields(item as Record<string, unknown>, sensitiveFields)
        }
      })
    }
  }
}

/**
 * Sanitize Stripe-specific sensitive data
 * Additional layer of protection for Stripe webhooks
 */
export function sanitizeStripePayload(payload: unknown): unknown {
  if (!payload || typeof payload !== 'object') {
    return payload
  }

  const sanitized = JSON.parse(JSON.stringify(payload))
  const data = sanitized as Record<string, unknown>

  // Redact customer email but keep domain for analytics
  if (data.customer_email && typeof data.customer_email === 'string') {
    const domain = data.customer_email.split('@')[1]
    data.customer_email = `***@${domain}`
  }

  // Redact billing details but keep country/postal code for analytics
  if (data.billing_details && typeof data.billing_details === 'object') {
    const billing = data.billing_details as Record<string, unknown>
    if (billing.address && typeof billing.address === 'object') {
      const address = billing.address as Record<string, unknown>
      address.line1 = '[REDACTED]'
      address.line2 = '[REDACTED]'
      // Keep country and postal_code for analytics
    }
    if (billing.email) {
      billing.email = '[REDACTED]'
    }
    if (billing.name) {
      billing.name = '[REDACTED]'
    }
    if (billing.phone) {
      billing.phone = '[REDACTED]'
    }
  }

  // Keep last4 but redact full card number if present
  if (data.card && typeof data.card === 'object') {
    const card = data.card as Record<string, unknown>
    if (card.number) {
      card.number = '[REDACTED]'
    }
    // Keep last4, brand, exp for support purposes
  }

  return sanitized
}

/**
 * Sanitize GitHub-specific sensitive data
 * Additional layer of protection for GitHub webhooks
 */
export function sanitizeGitHubPayload(payload: unknown): unknown {
  if (!payload || typeof payload !== 'object') {
    return payload
  }

  const sanitized = JSON.parse(JSON.stringify(payload))
  const data = sanitized as Record<string, unknown>

  // Redact user email but keep username
  if (data.sender && typeof data.sender === 'object') {
    const sender = data.sender as Record<string, unknown>
    if (sender.email) {
      sender.email = '[REDACTED]'
    }
  }

  // Redact commit author/committer emails
  if (data.commits && Array.isArray(data.commits)) {
    data.commits.forEach((commit: unknown) => {
      if (commit && typeof commit === 'object') {
        const c = commit as Record<string, unknown>
        if (c.author && typeof c.author === 'object') {
          const author = c.author as Record<string, unknown>
          if (author.email) {
            author.email = '[REDACTED]'
          }
        }
        if (c.committer && typeof c.committer === 'object') {
          const committer = c.committer as Record<string, unknown>
          if (committer.email) {
            committer.email = '[REDACTED]'
          }
        }
      }
    })
  }

  return sanitized
}
