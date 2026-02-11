/**
 * Webhook Retry API
 * Retry failed webhook events
 */

import { NextResponse } from 'next/server'
import { retryWebhookEvent, handleStripeEvent, handleGitHubEvent } from '@/lib/webhooks'
import type { StripeWebhookPayload, GitHubWebhookPayload } from '@/lib/webhooks'

// POST /api/webhooks/retry - Retry a webhook event
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { eventId } = body

    if (!eventId) {
      return NextResponse.json(
        { success: false, error: 'Event ID is required' },
        { status: 400 }
      )
    }

    // Determine the source from the event ID prefix or fetch from DB
    let result

    if (eventId.startsWith('evt_')) {
      // Stripe event ID format
      result = await retryWebhookEvent(eventId, async (payload, eventType) => {
        return handleStripeEvent(payload as StripeWebhookPayload, eventType)
      })
    } else if (eventId.startsWith('github:')) {
      // GitHub event ID format
      result = await retryWebhookEvent(eventId, async (payload, eventType) => {
        return handleGitHubEvent(payload as GitHubWebhookPayload, eventType)
      })
    } else {
      return NextResponse.json(
        { success: false, error: 'Unknown event source' },
        { status: 400 }
      )
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        eventId,
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error || result.message,
          eventId,
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error retrying webhook event:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to retry webhook event' },
      { status: 500 }
    )
  }
}
