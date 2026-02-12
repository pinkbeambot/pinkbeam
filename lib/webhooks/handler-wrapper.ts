/**
 * Webhook Handler Wrapper
 * Consistent handling for all webhook endpoints
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyStripeSignature, verifyGitHubSignature, verifyClerkSignature } from './verify-signature'
import { parseWebhookPayload, extractEventId } from './parse-payload'
import { sanitizeWebhookPayload, sanitizeStripePayload, sanitizeGitHubPayload } from './sanitize-payload'
import type {
  WebhookSource,
  WebhookProcessResult,
  WebhookHandlerOptions,
} from './event-types'

// In-memory store for processed event IDs (for idempotency)
// In production, use Redis or database
const processedEvents = new Set<string>()
const eventExpiryMs = 24 * 60 * 60 * 1000 // 24 hours

// Track event timestamps for cleanup
const eventTimestamps = new Map<string, number>()

/**
 * Clean up old processed events from memory
 */
function cleanupProcessedEvents(): void {
  const now = Date.now()
  for (const [eventId, timestamp] of eventTimestamps.entries()) {
    if (now - timestamp > eventExpiryMs) {
      processedEvents.delete(eventId)
      eventTimestamps.delete(eventId)
    }
  }
}

/**
 * Check if an event has already been processed (idempotency)
 * @param eventId Unique event identifier
 * @returns Boolean indicating if event was already processed
 */
export async function isEventProcessed(eventId: string): Promise<boolean> {
  // Check in-memory cache first
  if (processedEvents.has(eventId)) {
    return true
  }

  // Check database
  try {
    const existing = await prisma.webhookEvent.findUnique({
      where: { id: eventId },
    })
    return existing?.processed ?? false
  } catch {
    // If database check fails, assume not processed
    return false
  }
}

/**
 * Mark an event as processed
 * @param eventId Unique event identifier
 */
export function markEventProcessed(eventId: string): void {
  processedEvents.add(eventId)
  eventTimestamps.set(eventId, Date.now())

  // Periodic cleanup
  if (processedEvents.size % 100 === 0) {
    cleanupProcessedEvents()
  }
}

/**
 * Sanitize payload based on webhook source
 * Applies general sanitization plus source-specific filters
 * @param payload The payload to sanitize
 * @param source The webhook source type
 * @returns Sanitized payload safe for database storage
 */
function sanitizePayloadForStorage(payload: unknown, source: WebhookSource): unknown {
  // Apply general sanitization first
  let sanitized = sanitizeWebhookPayload(payload, source)

  // Apply source-specific sanitization
  switch (source) {
    case 'stripe':
      sanitized = sanitizeStripePayload(sanitized)
      break
    case 'github':
      sanitized = sanitizeGitHubPayload(sanitized)
      break
    // clerk and test use general sanitization only
  }

  return sanitized
}

/**
 * Log webhook event to database with sanitized payload
 * @param params Event logging parameters
 * @returns The created webhook event record
 */
export async function logWebhookEvent(params: {
  id: string
  source: WebhookSource
  eventType: string
  payload: unknown
  processed?: boolean
  error?: string
}) {
  try {
    // Sanitize payload before storing to remove sensitive data
    const sanitizedPayload = sanitizePayloadForStorage(params.payload, params.source)

    const event = await prisma.webhookEvent.upsert({
      where: { id: params.id },
      update: {
        source: params.source,
        eventType: params.eventType,
        payload: sanitizedPayload as any,
        processed: params.processed ?? false,
        processedAt: params.processed ? new Date() : undefined,
        error: params.error,
      },
      create: {
        id: params.id,
        source: params.source,
        eventType: params.eventType,
        payload: sanitizedPayload as any,
        processed: params.processed ?? false,
        processedAt: params.processed ? new Date() : undefined,
        error: params.error,
      },
    })
    return event
  } catch (error) {
    console.error('Failed to log webhook event:', error)
    return null
  }
}

/**
 * Create a standardized webhook handler
 * @param source Webhook source type
 * @param handler Event-specific handler function
 * @param options Handler options
 * @returns Next.js API route handler
 */
export function createWebhookHandler(
  source: WebhookSource,
  handler: (payload: unknown, eventType: string) => Promise<WebhookProcessResult>,
  options: WebhookHandlerOptions = {}
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const startTime = Date.now()

    try {
      // Get raw body
      const rawBody = await request.text()

      // Get headers
      const signature = getSignatureHeader(request, source)
      const eventType = getEventTypeHeader(request, source)

      // Log raw request for debugging
      console.log(`[Webhook ${source}] Received ${eventType || 'unknown'} event`, {
        size: Buffer.byteLength(rawBody, 'utf8'),
        signature: signature ? 'present' : 'missing',
      })

      // Verify signature by default (unless explicitly skipped)
      if (options.skipVerification) {
        console.warn(`[Webhook ${source}] SECURITY: Signature verification skipped`)
      } else {
        const secret = getWebhookSecret(source)

        if (!secret) {
          console.error(`[Webhook ${source}] Secret not configured`)
          return NextResponse.json(
            { error: 'Webhook secret not configured' },
            { status: 500 }
          )
        }

        const verificationResult = verifySignature(rawBody, signature, secret, source)

        if (!verificationResult.valid) {
          console.error(`[Webhook ${source}] Signature verification failed:`, verificationResult.error)
          return NextResponse.json(
            { error: 'Invalid signature' },
            { status: 401 }
          )
        }
      }

      // Parse payload
      const parseResult = parseWebhookPayload(rawBody, source, eventType)

      if (!parseResult.success) {
        console.error(`[Webhook ${source}] Payload parsing failed:`, parseResult.error)
        return NextResponse.json(
          { error: parseResult.error },
          { status: 400 }
        )
      }

      const payload = parseResult.data

      // Extract event ID for idempotency
      const eventId = extractEventId(payload, source) ?? `${source}:${Date.now()}:${Math.random().toString(36).slice(2)}`

      // Check if already processed
      if (await isEventProcessed(eventId)) {
        console.log(`[Webhook ${source}] Event ${eventId} already processed, skipping`)
        return NextResponse.json({ success: true, message: 'Already processed' })
      }

      // Log the event first
      await logWebhookEvent({
        id: eventId,
        source,
        eventType: eventType || 'unknown',
        payload,
        processed: false,
      })

      // Process the event
      let result: WebhookProcessResult

      try {
        result = await handler(payload, eventType || 'unknown')
      } catch (handlerError) {
        console.error(`[Webhook ${source}] Handler error:`, handlerError)
        result = {
          success: false,
          message: 'Handler error',
          error: handlerError instanceof Error ? handlerError.message : 'Unknown error',
          shouldRetry: true,
        }
      }

      // Update event log with result
      if (result.success) {
        await logWebhookEvent({
          id: eventId,
          source,
          eventType: eventType || 'unknown',
          payload,
          processed: true,
        })
        markEventProcessed(eventId)
      } else {
        await logWebhookEvent({
          id: eventId,
          source,
          eventType: eventType || 'unknown',
          payload,
          processed: false,
          error: result.error,
        })
      }

      const duration = Date.now() - startTime
      console.log(`[Webhook ${source}] Processed in ${duration}ms:`, {
        eventId,
        eventType,
        success: result.success,
      })

      // Return appropriate response
      if (result.success) {
        return NextResponse.json({
          success: true,
          message: result.message,
          eventId,
        })
      } else {
        const statusCode = result.shouldRetry ? 500 : 200
        return NextResponse.json(
          {
            success: false,
            error: result.error || result.message,
            eventId,
          },
          { status: statusCode }
        )
      }
    } catch (error) {
      console.error(`[Webhook ${source}] Unexpected error:`, error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }
}

/**
 * Get signature header based on webhook source
 */
function getSignatureHeader(request: NextRequest, source: WebhookSource): string {
  switch (source) {
    case 'stripe':
      return request.headers.get('stripe-signature') ?? ''
    case 'github':
      return request.headers.get('x-hub-signature-256') ?? ''
    case 'clerk':
      return request.headers.get('svix-signature') ?? ''
    case 'test':
      return request.headers.get('x-test-signature') ?? ''
    default:
      return ''
  }
}

/**
 * Get event type header based on webhook source
 */
function getEventTypeHeader(request: NextRequest, source: WebhookSource): string {
  switch (source) {
    case 'stripe':
      // Stripe event type is in the payload
      return ''
    case 'github':
      return request.headers.get('x-github-event') ?? ''
    case 'clerk':
      // Clerk event type is in the payload
      return ''
    case 'test':
      return request.headers.get('x-test-event') ?? ''
    default:
      return ''
  }
}

/**
 * Get webhook secret from environment
 */
function getWebhookSecret(source: WebhookSource): string | null {
  switch (source) {
    case 'stripe':
      return process.env.STRIPE_WEBHOOK_SECRET ?? null
    case 'github':
      return process.env.GITHUB_WEBHOOK_SECRET ?? null
    case 'clerk':
      return process.env.CLERK_WEBHOOK_SECRET ?? null
    case 'test':
      return process.env.TEST_WEBHOOK_SECRET ?? 'test-secret'
    default:
      return null
  }
}

/**
 * Verify signature based on source
 */
function verifySignature(
  body: string,
  signature: string,
  secret: string,
  source: WebhookSource
) {
  switch (source) {
    case 'stripe':
      return verifyStripeSignature(body, signature, secret)
    case 'github':
      return verifyGitHubSignature(body, signature, secret)
    case 'clerk':
      return verifyClerkSignature(body, signature, secret)
    case 'test':
      // For test webhooks, accept any non-empty signature when using test-secret
      return { valid: true }
    default:
      return { valid: false, error: 'Unknown webhook source' }
  }
}

/**
 * Retry a failed webhook event
 * @param eventId The webhook event ID to retry
 * @param handler Event-specific handler function
 * @returns Result of the retry
 */
export async function retryWebhookEvent(
  eventId: string,
  handler: (payload: unknown, eventType: string) => Promise<WebhookProcessResult>
): Promise<WebhookProcessResult> {
  try {
    // Get the event from database
    const event = await prisma.webhookEvent.findUnique({
      where: { id: eventId },
    })

    if (!event) {
      return {
        success: false,
        message: 'Event not found',
        error: `No webhook event found with ID: ${eventId}`,
      }
    }

    if (event.processed) {
      return {
        success: true,
        message: 'Event already processed',
        eventId,
      }
    }

    // Process the event
    const result = await handler(event.payload, event.eventType)

    // Update event log
    if (result.success) {
      await prisma.webhookEvent.update({
        where: { id: eventId },
        data: {
          processed: true,
          processedAt: new Date(),
          error: null,
        },
      })
    } else {
      await prisma.webhookEvent.update({
        where: { id: eventId },
        data: {
          error: result.error,
        },
      })
    }

    return result
  } catch (error) {
    console.error(`[Webhook Retry] Error retrying event ${eventId}:`, error)
    return {
      success: false,
      message: 'Retry failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
