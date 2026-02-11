/**
 * GitHub Webhook Handler
 * Processes GitHub events: push, pull_request, issues
 * For Pinkbeam Labs project integration
 */

import { createWebhookHandler, handleGitHubEvent } from '@/lib/webhooks'
import type { GitHubWebhookPayload } from '@/lib/webhooks'

// Create the webhook handler using the shared handler
export const POST = createWebhookHandler('github', async (payload, eventType) => {
  return handleGitHubEvent(payload as GitHubWebhookPayload, eventType)
})

/**
 * GET handler for webhook verification
 * Returns webhook configuration info (for admin/debugging)
 */
export async function GET() {
  return Response.json({
    source: 'github',
    endpoint: '/api/webhooks/github',
    supportedEvents: [
      'push',
      'pull_request',
      'issues',
    ],
    status: 'active',
  })
}
