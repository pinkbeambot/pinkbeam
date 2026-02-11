/**
 * Stripe Webhook Handler
 * Processes Stripe events: invoice payments, subscriptions, etc.
 */

import { createWebhookHandler, handleStripeEvent } from '@/lib/webhooks'
import type { StripeWebhookPayload } from '@/lib/webhooks'

// Create the webhook handler using the shared handler
export const POST = createWebhookHandler('stripe', async (payload, eventType) => {
  return handleStripeEvent(payload as StripeWebhookPayload, eventType)
})

/**
 * GET handler for webhook verification
 * Returns webhook configuration info (for admin/debugging)
 */
export async function GET() {
  return Response.json({
    source: 'stripe',
    endpoint: '/api/webhooks/stripe',
    supportedEvents: [
      'invoice.paid',
      'invoice.payment_failed',
      'customer.subscription.created',
      'customer.subscription.updated',
      'customer.subscription.deleted',
    ],
    status: 'active',
  })
}
