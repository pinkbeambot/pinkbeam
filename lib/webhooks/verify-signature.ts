/**
 * Webhook Signature Verification
 * Verify webhook signatures for Stripe, GitHub, and other services
 */

import { createHmac, timingSafeEqual } from 'crypto'
import type { WebhookVerificationResult } from './event-types'

/**
 * Verify Stripe webhook signature
 * @param payload Raw request body
 * @param signature Stripe-Signature header
 * @param secret Webhook secret from Stripe dashboard
 * @returns Verification result
 */
export function verifyStripeSignature(
  payload: string,
  signature: string,
  secret: string
): WebhookVerificationResult {
  try {
    if (!signature) {
      return { valid: false, error: 'Missing Stripe-Signature header' }
    }

    if (!secret) {
      return { valid: false, error: 'Stripe webhook secret not configured' }
    }

    // Parse the signature header
    const elements = signature.split(',')
    const signatureHash: Record<string, string> = {}

    for (const element of elements) {
      const [key, value] = element.split('=')
      if (key && value) {
        signatureHash[key.trim()] = value.trim()
      }
    }

    const timestamp = signatureHash['t']
    const signatureValue = signatureHash['v1']

    if (!timestamp || !signatureValue) {
      return { valid: false, error: 'Invalid Stripe-Signature header format' }
    }

    // Check timestamp tolerance (5 minutes)
    const timestampMs = parseInt(timestamp, 10) * 1000
    const now = Date.now()
    const tolerance = 5 * 60 * 1000 // 5 minutes

    if (Math.abs(now - timestampMs) > tolerance) {
      return { valid: false, error: 'Webhook timestamp too old' }
    }

    // Compute expected signature
    const signedPayload = `${timestamp}.${payload}`
    const expectedSignature = createHmac('sha256', secret)
      .update(signedPayload)
      .digest('hex')

    // Constant-time comparison to prevent timing attacks
    const expectedBuffer = Buffer.from(expectedSignature, 'hex')
    const providedBuffer = Buffer.from(signatureValue, 'hex')

    if (expectedBuffer.length !== providedBuffer.length) {
      return { valid: false, error: 'Invalid signature length' }
    }

    const isValid = timingSafeEqual(expectedBuffer, providedBuffer)

    if (!isValid) {
      return { valid: false, error: 'Invalid signature' }
    }

    return { valid: true }
  } catch (error) {
    return {
      valid: false,
      error: `Signature verification error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    }
  }
}

/**
 * Verify GitHub webhook signature
 * @param payload Raw request body
 * @param signature X-Hub-Signature-256 header
 * @param secret Webhook secret from GitHub settings
 * @returns Verification result
 */
export function verifyGitHubSignature(
  payload: string,
  signature: string,
  secret: string
): WebhookVerificationResult {
  try {
    if (!signature) {
      return { valid: false, error: 'Missing X-Hub-Signature-256 header' }
    }

    if (!secret) {
      return { valid: false, error: 'GitHub webhook secret not configured' }
    }

    // GitHub signatures are in format: sha256=<hex_digest>
    const prefix = 'sha256='
    if (!signature.startsWith(prefix)) {
      return { valid: false, error: 'Invalid GitHub signature format' }
    }

    const providedSignature = signature.slice(prefix.length)

    // Compute expected signature
    const expectedSignature = createHmac('sha256', secret)
      .update(payload, 'utf8')
      .digest('hex')

    // Constant-time comparison
    const expectedBuffer = Buffer.from(expectedSignature, 'hex')
    const providedBuffer = Buffer.from(providedSignature, 'hex')

    if (expectedBuffer.length !== providedBuffer.length) {
      return { valid: false, error: 'Invalid signature length' }
    }

    const isValid = timingSafeEqual(expectedBuffer, providedBuffer)

    if (!isValid) {
      return { valid: false, error: 'Invalid signature' }
    }

    return { valid: true }
  } catch (error) {
    return {
      valid: false,
      error: `Signature verification error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    }
  }
}

/**
 * Verify Clerk webhook signature
 * @param payload Raw request body
 * @param signature Svix-Signature header
 * @param secret Webhook secret from Clerk dashboard
 * @returns Verification result
 */
export function verifyClerkSignature(
  payload: string,
  signature: string,
  secret: string
): WebhookVerificationResult {
  try {
    if (!signature) {
      return { valid: false, error: 'Missing Svix-Signature header' }
    }

    if (!secret) {
      return { valid: false, error: 'Clerk webhook secret not configured' }
    }

    // Clerk uses Svix which has a specific signature format
    // Format: v1,<base64_encoded_signature>
    const parts = signature.split(',')
    const signatureMap: Record<string, string> = {}

    for (const part of parts) {
      const [key, value] = part.split('=')
      if (key && value) {
        signatureMap[key.trim()] = value.trim()
      }
    }

    const version = signatureMap['v1']
    if (!version) {
      return { valid: false, error: 'Invalid Svix-Signature format' }
    }

    // Compute expected signature
    const expectedSignature = createHmac('sha256', secret)
      .update(payload, 'utf8')
      .digest('base64')

    // Constant-time comparison
    const expectedBuffer = Buffer.from(expectedSignature, 'base64')
    const providedBuffer = Buffer.from(version, 'base64')

    if (expectedBuffer.length !== providedBuffer.length) {
      return { valid: false, error: 'Invalid signature length' }
    }

    const isValid = timingSafeEqual(expectedBuffer, providedBuffer)

    if (!isValid) {
      return { valid: false, error: 'Invalid signature' }
    }

    return { valid: true }
  } catch (error) {
    return {
      valid: false,
      error: `Signature verification error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    }
  }
}

/**
 * Generic HMAC signature verification
 * @param payload Raw request body
 * @param signature Signature header value
 * @param secret Webhook secret
 * @param algorithm Hash algorithm (default: sha256)
 * @param encoding Output encoding (default: hex)
 * @returns Verification result
 */
export function verifyHmacSignature(
  payload: string,
  signature: string,
  secret: string,
  algorithm: 'sha256' | 'sha512' | 'sha1' = 'sha256',
  encoding: 'hex' | 'base64' = 'hex'
): WebhookVerificationResult {
  try {
    if (!signature) {
      return { valid: false, error: 'Missing signature header' }
    }

    if (!secret) {
      return { valid: false, error: 'Webhook secret not configured' }
    }

    // Compute expected signature
    const expectedSignature = createHmac(algorithm, secret)
      .update(payload, 'utf8')
      .digest(encoding)

    // Constant-time comparison
    const expectedBuffer = Buffer.from(expectedSignature, encoding)
    const providedBuffer = Buffer.from(signature, encoding)

    if (expectedBuffer.length !== providedBuffer.length) {
      return { valid: false, error: 'Invalid signature length' }
    }

    const isValid = timingSafeEqual(expectedBuffer, providedBuffer)

    if (!isValid) {
      return { valid: false, error: 'Invalid signature' }
    }

    return { valid: true }
  } catch (error) {
    return {
      valid: false,
      error: `Signature verification error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    }
  }
}

/**
 * Get webhook secret from environment variables
 * @param source Webhook source ('stripe', 'github', 'clerk')
 * @returns The secret or null if not configured
 */
export function getWebhookSecret(source: 'stripe' | 'github' | 'clerk'): string | null {
  switch (source) {
    case 'stripe':
      return process.env.STRIPE_WEBHOOK_SECRET ?? null
    case 'github':
      return process.env.GITHUB_WEBHOOK_SECRET ?? null
    case 'clerk':
      return process.env.CLERK_WEBHOOK_SECRET ?? null
    default:
      return null
  }
}
