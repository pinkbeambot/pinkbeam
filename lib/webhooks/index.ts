/**
 * Webhooks Library
 * Centralized webhook handling for external service integrations
 */

// Export all types
export type {
  BaseWebhookEvent,
  WebhookSource,
  WebhookEventLog,
  WebhookProcessResult,
  WebhookHandlerOptions,
  WebhookVerificationResult,
  // Stripe
  StripeEventType,
  StripeWebhookPayload,
  StripeInvoice,
  StripeInvoiceLineItem,
  StripePlan,
  StripePrice,
  StripeSubscription,
  StripeSubscriptionItem,
  // GitHub
  GitHubEventType,
  GitHubWebhookPayload,
  GitHubPushPayload,
  GitHubPullRequestPayload,
  GitHubIssuesPayload,
  GitHubUser,
  GitHubRepository,
  GitHubOrganization,
  GitHubInstallation,
  GitHubCommit,
  GitHubPullRequest,
  GitHubIssue,
  // Clerk
  ClerkEventType,
  ClerkWebhookPayload,
} from './event-types'

// Export signature verification
export {
  verifyStripeSignature,
  verifyGitHubSignature,
  verifyClerkSignature,
  verifyHmacSignature,
  getWebhookSecret,
} from './verify-signature'

// Export payload parsing
export {
  parseJsonPayload,
  parseStripePayload,
  parseGitHubPayload,
  parseClerkPayload,
  parseWebhookPayload,
  getPayloadSize,
  isPayloadSizeValid,
  extractEventId,
  type ParsedPayload,
} from './parse-payload'

// Export handler wrapper
export {
  createWebhookHandler,
  isEventProcessed,
  markEventProcessed,
  logWebhookEvent,
  retryWebhookEvent,
} from './handler-wrapper'

// Export event handlers
export {
  handleStripeEvent,
  handleGitHubEvent,
} from './handlers'
