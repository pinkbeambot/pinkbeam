/**
 * Webhook Test Endpoint
 * For development: simulate webhook events and test signature verification
 */

import { NextRequest, NextResponse } from 'next/server'
import { createHmac } from 'crypto'
import { createWebhookHandler } from '@/lib/webhooks'
import type { WebhookProcessResult } from '@/lib/webhooks'

// Test webhook secret (for development only)
const TEST_WEBHOOK_SECRET = process.env.TEST_WEBHOOK_SECRET || 'test-secret-dev-only'

/**
 * Generate a test signature for webhook payloads
 */
function generateTestSignature(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload, 'utf8').digest('hex')
}

/**
 * Handle test webhook events
 */
async function handleTestEvent(
  payload: Record<string, unknown>,
  eventType: string
): Promise<WebhookProcessResult> {
  console.log('[Test Webhook] Processing event:', eventType, payload)

  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 100))

  // Simulate random failures (10% chance) for testing retry logic
  if (Math.random() < 0.1) {
    return {
      success: false,
      message: 'Simulated processing failure',
      error: 'Random test failure - retry should work',
      shouldRetry: true,
    }
  }

  return {
    success: true,
    message: `Test event ${eventType} processed successfully`,
  }
}

// POST /api/webhooks/test - Receive test webhooks
export const POST = createWebhookHandler('test', async (payload, eventType) => {
  return handleTestEvent(payload as Record<string, unknown>, eventType)
})

/**
 * GET /api/webhooks/test - Get test endpoint info and generate test events
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')

  // Return endpoint info
  if (!action) {
    return NextResponse.json({
      endpoint: '/api/webhooks/test',
      description: 'Test webhook endpoint for development',
      usage: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Test-Signature': 'generated-signature',
          'X-Test-Event': 'event-type',
        },
        body: 'JSON payload',
      },
      generateSignature: 'Use POST with action=generateSignature',
      testEvents: [
        { type: 'test.invoice.paid', description: 'Simulate invoice payment' },
        { type: 'test.subscription.created', description: 'Simulate subscription creation' },
        { type: 'test.push', description: 'Simulate GitHub push' },
        { type: 'test.pull_request', description: 'Simulate PR event' },
      ],
    })
  }

  // Generate a test signature
  if (action === 'generateSignature') {
    const payloadParam = searchParams.get('payload')
    const payload = payloadParam || JSON.stringify({ test: true, timestamp: Date.now() })
    const signature = generateTestSignature(payload, TEST_WEBHOOK_SECRET)

    return NextResponse.json({
      secret: TEST_WEBHOOK_SECRET,
      payload,
      signature,
      curlExample: `curl -X POST ${request.nextUrl.origin}/api/webhooks/test \\
  -H "Content-Type: application/json" \\
  -H "X-Test-Signature: ${signature}" \\
  -H "X-Test-Event: test.event" \\
  -d '${payload}'`,
    })
  }

  // Generate a sample test event
  if (action === 'sample') {
    const eventType = searchParams.get('type') || 'test.event'

    const samples: Record<string, Record<string, unknown>> = {
      'test.invoice.paid': {
        id: `test_inv_${Date.now()}`,
        object: 'invoice',
        amount_due: 25000,
        amount_paid: 25000,
        currency: 'usd',
        customer: `cus_test_${Date.now()}`,
        status: 'paid',
        paid: true,
      },
      'test.subscription.created': {
        id: `test_sub_${Date.now()}`,
        object: 'subscription',
        customer: `cus_test_${Date.now()}`,
        status: 'active',
        plan: {
          id: 'plan_test',
          nickname: 'Test Plan',
        },
      },
      'test.push': {
        ref: 'refs/heads/main',
        before: 'abc123',
        after: 'def456',
        repository: {
          id: 12345,
          name: 'test-repo',
          full_name: 'test-org/test-repo',
          html_url: 'https://github.com/test-org/test-repo',
        },
        commits: [
          {
            id: 'def456',
            message: 'Test commit',
            author: { name: 'Test User', email: 'test@example.com' },
            timestamp: new Date().toISOString(),
          },
        ],
      },
      'test.pull_request': {
        action: 'opened',
        number: 1,
        pull_request: {
          id: 12345,
          title: 'Test PR',
          state: 'open',
          user: { login: 'testuser', id: 123 },
          html_url: 'https://github.com/test-org/test-repo/pull/1',
        },
        repository: {
          id: 12345,
          name: 'test-repo',
          full_name: 'test-org/test-repo',
        },
      },
    }

    const samplePayload = samples[eventType] || { test: true, event: eventType }
    const payload = JSON.stringify(samplePayload)
    const signature = generateTestSignature(payload, TEST_WEBHOOK_SECRET)

    return NextResponse.json({
      eventType,
      payload: samplePayload,
      headers: {
        'Content-Type': 'application/json',
        'X-Test-Signature': signature,
        'X-Test-Event': eventType,
      },
      curlExample: `curl -X POST ${request.nextUrl.origin}/api/webhooks/test \\
  -H "Content-Type: application/json" \\
  -H "X-Test-Signature: ${signature}" \\
  -H "X-Test-Event: ${eventType}" \\
  -d '${JSON.stringify(samplePayload)}'`,
    })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}

/**
 * POST /api/webhooks/test/send - Send a test webhook (utility endpoint)
 * This simulates an external service sending a webhook
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { eventType, payload, skipSignature } = body

    if (!eventType) {
      return NextResponse.json(
        { error: 'eventType is required' },
        { status: 400 }
      )
    }

    const testPayload = payload || { test: true, timestamp: Date.now() }
    const payloadString = JSON.stringify(testPayload)

    // Build headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Test-Event': eventType,
    }

    if (!skipSignature) {
      headers['X-Test-Signature'] = generateTestSignature(payloadString, TEST_WEBHOOK_SECRET)
    }

    // Make request to our own webhook endpoint
    const response = await fetch(`${request.nextUrl.origin}/api/webhooks/test`, {
      method: 'POST',
      headers,
      body: payloadString,
    })

    const result = await response.json()

    return NextResponse.json({
      success: response.ok,
      status: response.status,
      sent: {
        eventType,
        payload: testPayload,
        headers,
      },
      response: result,
    })
  } catch (error) {
    console.error('Error sending test webhook:', error)
    return NextResponse.json(
      { error: 'Failed to send test webhook' },
      { status: 500 }
    )
  }
}
