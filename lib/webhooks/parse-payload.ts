/**
 * Webhook Payload Parser
 * Safely parse webhook payloads with validation and error handling
 */

import type {
  StripeWebhookPayload,
  GitHubWebhookPayload,
  GitHubPushPayload,
  GitHubPullRequestPayload,
  GitHubIssuesPayload,
  ClerkWebhookPayload,
} from './event-types'

export interface ParsedPayload<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

/**
 * Safely parse JSON payload
 * @param body Raw request body
 * @returns Parsed payload result
 */
export function parseJsonPayload<T = unknown>(body: string): ParsedPayload<T> {
  try {
    // Check for empty body
    if (!body || body.trim() === '') {
      return { success: false, error: 'Empty request body' }
    }

    // Parse JSON
    const data = JSON.parse(body) as T

    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: `Invalid JSON: ${error instanceof Error ? error.message : 'Unknown error'}`,
    }
  }
}

/**
 * Parse Stripe webhook payload with validation
 * @param body Raw request body
 * @returns Parsed Stripe payload
 */
export function parseStripePayload(body: string): ParsedPayload<StripeWebhookPayload> {
  const parsed = parseJsonPayload<StripeWebhookPayload>(body)

  if (!parsed.success) {
    return parsed
  }

  // Validate required Stripe fields
  const data = parsed.data
  if (!data) {
    return { success: false, error: 'Empty payload data' }
  }

  if (typeof data !== 'object') {
    return { success: false, error: 'Payload must be an object' }
  }

  if (data.object !== 'event') {
    return { success: false, error: 'Invalid Stripe event object' }
  }

  if (!data.id || typeof data.id !== 'string') {
    return { success: false, error: 'Missing or invalid event ID' }
  }

  if (!data.type || typeof data.type !== 'string') {
    return { success: false, error: 'Missing or invalid event type' }
  }

  if (!data.data || typeof data.data !== 'object') {
    return { success: false, error: 'Missing or invalid event data' }
  }

  return { success: true, data }
}

/**
 * Parse GitHub webhook payload with validation
 * @param body Raw request body
 * @param eventType X-GitHub-Event header value
 * @returns Parsed GitHub payload
 */
export function parseGitHubPayload(
  body: string,
  eventType: string
): ParsedPayload<GitHubWebhookPayload> {
  const parsed = parseJsonPayload<GitHubWebhookPayload>(body)

  if (!parsed.success) {
    return parsed
  }

  const data = parsed.data
  if (!data) {
    return { success: false, error: 'Empty payload data' }
  }

  if (typeof data !== 'object') {
    return { success: false, error: 'Payload must be an object' }
  }

  // Validate common GitHub fields
  if (!data.sender || typeof data.sender !== 'object') {
    return { success: false, error: 'Missing or invalid sender' }
  }

  if (!data.repository && !data.organization) {
    return { success: false, error: 'Missing repository or organization' }
  }

  // Type-specific validation
  switch (eventType) {
    case 'push': {
      const pushData = data as GitHubPushPayload
      if (!pushData.ref || typeof pushData.ref !== 'string') {
        return { success: false, error: 'Missing or invalid ref in push event' }
      }
      break
    }
    case 'pull_request': {
      const prData = data as GitHubPullRequestPayload
      if (!prData.pull_request || typeof prData.pull_request !== 'object') {
        return { success: false, error: 'Missing or invalid pull_request data' }
      }
      if (typeof prData.number !== 'number') {
        return { success: false, error: 'Missing or invalid PR number' }
      }
      break
    }
    case 'issues': {
      const issuesData = data as GitHubIssuesPayload
      if (!issuesData.issue || typeof issuesData.issue !== 'object') {
        return { success: false, error: 'Missing or invalid issue data' }
      }
      if (typeof issuesData.issue.number !== 'number') {
        return { success: false, error: 'Missing or invalid issue number' }
      }
      break
    }
  }

  return { success: true, data }
}

/**
 * Parse Clerk webhook payload with validation
 * @param body Raw request body
 * @returns Parsed Clerk payload
 */
export function parseClerkPayload(body: string): ParsedPayload<ClerkWebhookPayload> {
  const parsed = parseJsonPayload<ClerkWebhookPayload>(body)

  if (!parsed.success) {
    return parsed
  }

  const data = parsed.data
  if (!data) {
    return { success: false, error: 'Empty payload data' }
  }

  if (typeof data !== 'object') {
    return { success: false, error: 'Payload must be an object' }
  }

  if (data.object !== 'event') {
    return { success: false, error: 'Invalid Clerk event object' }
  }

  if (!data.type || typeof data.type !== 'string') {
    return { success: false, error: 'Missing or invalid event type' }
  }

  if (!data.data || typeof data.data !== 'object') {
    return { success: false, error: 'Missing or invalid event data' }
  }

  return { success: true, data }
}

/**
 * Safely extract payload size
 * @param body Raw request body
 * @returns Size in bytes or null if body is null/undefined
 */
export function getPayloadSize(body: string | null | undefined): number | null {
  if (!body) return null
  return Buffer.byteLength(body, 'utf8')
}

/**
 * Check if payload size is within limits
 * @param body Raw request body
 * @param maxSizeBytes Maximum allowed size (default: 1MB)
 * @returns Boolean indicating if payload is within limits
 */
export function isPayloadSizeValid(
  body: string | null | undefined,
  maxSizeBytes: number = 1024 * 1024
): boolean {
  const size = getPayloadSize(body)
  if (size === null) return false
  return size <= maxSizeBytes
}

/**
 * Parse webhook payload based on source type
 * @param body Raw request body
 * @param source Webhook source type
 * @param eventType Event type header (for GitHub)
 * @returns Parsed payload result
 */
export function parseWebhookPayload(
  body: string,
  source: 'stripe' | 'github' | 'clerk' | 'test',
  eventType?: string
): ParsedPayload<unknown> {
  // Check payload size first
  if (!isPayloadSizeValid(body)) {
    return { success: false, error: 'Payload exceeds maximum size of 1MB' }
  }

  switch (source) {
    case 'stripe':
      return parseStripePayload(body)
    case 'github':
      if (!eventType) {
        return { success: false, error: 'Missing GitHub event type header' }
      }
      return parseGitHubPayload(body, eventType)
    case 'clerk':
      return parseClerkPayload(body)
    case 'test':
      return parseJsonPayload(body)
    default:
      return { success: false, error: `Unknown webhook source: ${source}` }
  }
}

/**
 * Extract event ID from payload for idempotency
 * @param payload Parsed payload
 * @param source Webhook source
 * @returns Event ID or null
 */
export function extractEventId(
  payload: unknown,
  source: 'stripe' | 'github' | 'clerk' | 'test'
): string | null {
  if (!payload || typeof payload !== 'object') {
    return null
  }

  const p = payload as Record<string, unknown>

  switch (source) {
    case 'stripe':
      // Stripe events have unique IDs
      return typeof p.id === 'string' ? p.id : null
    case 'github':
      // GitHub uses delivery GUID from header, not payload
      // Return a combination of repository and event info
      if (p.repository && typeof p.repository === 'object') {
        const repo = p.repository as Record<string, unknown>
        const repoId = repo.id as number
        const eventType = (p as Record<string, unknown>).action as string
        if (repoId && eventType) {
          return `github:${repoId}:${eventType}:${Date.now()}`
        }
      }
      return `github:${Date.now()}:${Math.random().toString(36).slice(2)}`
    case 'clerk':
      // Clerk events have unique IDs in data
      if (p.data && typeof p.data === 'object') {
        const data = p.data as Record<string, unknown>
        return typeof data.id === 'string' ? data.id : null
      }
      return null
    case 'test':
      // Test events may have an ID field
      return typeof p.id === 'string' ? p.id : `test:${Date.now()}`
    default:
      return null
  }
}
