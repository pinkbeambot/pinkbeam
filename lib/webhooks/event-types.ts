/**
 * Webhook Event Types
 * TypeScript types for webhook events from various sources
 */

// Base webhook event structure
export interface BaseWebhookEvent {
  id: string
  source: WebhookSource
  eventType: string
  payload: unknown
  processed: boolean
  processedAt?: Date
  error?: string
  createdAt: Date
}

// Webhook sources
export type WebhookSource = 'stripe' | 'github' | 'clerk' | 'test'

// Stripe webhook events
export type StripeEventType =
  | 'invoice.paid'
  | 'invoice.payment_failed'
  | 'customer.subscription.created'
  | 'customer.subscription.updated'
  | 'customer.subscription.deleted'
  | 'payment_intent.succeeded'
  | 'payment_intent.payment_failed'
  | 'customer.created'
  | 'customer.updated'
  | 'charge.succeeded'
  | 'charge.failed'
  | string // Allow other Stripe event types

export interface StripeWebhookPayload {
  id: string
  object: 'event'
  api_version: string
  created: number
  data: {
    object: Record<string, unknown>
    previous_attributes?: Record<string, unknown>
  }
  livemode: boolean
  pending_webhooks: number
  request: {
    id: string | null
    idempotency_key: string | null
  }
  type: StripeEventType
}

// Stripe invoice object
export interface StripeInvoice {
  id: string
  object: 'invoice'
  amount_due: number
  amount_paid: number
  amount_remaining: number
  application_fee_amount: number | null
  attempt_count: number
  attempted: boolean
  charge: string | null
  collection_method: 'charge_automatically' | 'send_invoice'
  created: number
  currency: string
  customer: string
  description: string | null
  due_date: number | null
  ending_balance: number | null
  hosted_invoice_url: string | null
  invoice_pdf: string | null
  lines: {
    data: StripeInvoiceLineItem[]
  }
  number: string | null
  paid: boolean
  period_end: number
  period_start: number
  status: 'draft' | 'open' | 'paid' | 'uncollectible' | 'void'
  status_transitions: {
    paid_at: number | null
    voided_at: number | null
  }
  subscription: string | null
  total: number
  [key: string]: unknown
}

export interface StripeInvoiceLineItem {
  id: string
  object: 'line_item'
  amount: number
  currency: string
  description: string | null
  period: {
    end: number
    start: number
  }
  plan: StripePlan | null
  price: StripePrice | null
  proration: boolean
  quantity: number | null
  subscription: string | null
  [key: string]: unknown
}

export interface StripePlan {
  id: string
  object: 'plan'
  active: boolean
  amount: number
  currency: string
  interval: 'day' | 'week' | 'month' | 'year'
  interval_count: number
  nickname: string | null
  product: string
  [key: string]: unknown
}

export interface StripePrice {
  id: string
  object: 'price'
  active: boolean
  currency: string
  unit_amount: number
  product: string
  [key: string]: unknown
}

// Stripe subscription object
export interface StripeSubscription {
  id: string
  object: 'subscription'
  application_fee_percent: number | null
  automatic_tax: {
    enabled: boolean
  }
  billing_cycle_anchor: number
  billing_thresholds: unknown | null
  cancel_at: number | null
  cancel_at_period_end: boolean
  canceled_at: number | null
  collection_method: 'charge_automatically' | 'send_invoice'
  created: number
  currency: string
  current_period_end: number
  current_period_start: number
  customer: string
  days_until_due: number | null
  default_payment_method: string | null
  default_tax_rates: unknown[]
  description: string | null
  discount: unknown | null
  ended_at: number | null
  items: {
    data: StripeSubscriptionItem[]
  }
  latest_invoice: string | null
  livemode: boolean
  metadata: Record<string, string>
  next_pending_invoice_item_invoice: string | null
  pause_collection: unknown | null
  payment_settings: unknown
  pending_invoice_item_interval: unknown | null
  pending_setup_intent: string | null
  pending_update: unknown | null
  plan: StripePlan | null
  quantity: number | null
  schedule: string | null
  start_date: number
  status: 'incomplete' | 'incomplete_expired' | 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid' | 'paused'
  test_clock: string | null
  transfer_data: unknown | null
  trial_end: number | null
  trial_start: number | null
  [key: string]: unknown
}

export interface StripeSubscriptionItem {
  id: string
  object: 'subscription_item'
  billing_thresholds: unknown | null
  created: number
  metadata: Record<string, string>
  plan: StripePlan
  price: StripePrice
  quantity: number | null
  subscription: string
  tax_rates: unknown[]
  [key: string]: unknown
}

// GitHub webhook events
export type GitHubEventType =
  | 'push'
  | 'pull_request'
  | 'pull_request_review'
  | 'pull_request_review_comment'
  | 'issues'
  | 'issue_comment'
  | 'create'
  | 'delete'
  | 'release'
  | 'watch'
  | 'fork'
  | string // Allow other GitHub event types

export interface GitHubWebhookPayload {
  action?: string
  sender: GitHubUser
  repository: GitHubRepository
  organization?: GitHubOrganization
  installation?: GitHubInstallation
}

export interface GitHubPushPayload extends GitHubWebhookPayload {
  ref: string
  before: string
  after: string
  created: boolean
  deleted: boolean
  forced: boolean
  base_ref: string | null
  compare: string
  commits: GitHubCommit[]
  head_commit: GitHubCommit | null
  pusher: {
    name: string
    email: string
  }
}

export interface GitHubPullRequestPayload extends GitHubWebhookPayload {
  action: 'opened' | 'closed' | 'reopened' | 'edited' | 'assigned' | 'unassigned' | 'review_requested' | 'review_request_removed' | 'ready_for_review' | 'converted_to_draft' | 'locked' | 'unlocked' | 'enqueued' | 'dequeued' | string
  number: number
  pull_request: GitHubPullRequest
}

export interface GitHubIssuesPayload extends GitHubWebhookPayload {
  action: 'opened' | 'closed' | 'reopened' | 'edited' | 'assigned' | 'unassigned' | 'labeled' | 'unlabeled' | 'locked' | 'unlocked' | 'milestoned' | 'demilestoned' | 'transferred' | 'pinned' | 'unpinned' | 'deleted' | string
  issue: GitHubIssue
  changes?: {
    title?: { from: string }
    body?: { from: string }
  }
}

export interface GitHubUser {
  login: string
  id: number
  node_id: string
  avatar_url: string
  gravatar_id: string | null
  url: string
  html_url: string
  type: 'User' | 'Bot' | 'Organization'
  site_admin: boolean
}

export interface GitHubRepository {
  id: number
  node_id: string
  name: string
  full_name: string
  private: boolean
  owner: GitHubUser
  html_url: string
  description: string | null
  fork: boolean
  url: string
  created_at: string
  updated_at: string
  pushed_at: string
  git_url: string
  ssh_url: string
  clone_url: string
  svn_url: string
  homepage: string | null
  size: number
  stargazers_count: number
  watchers_count: number
  language: string | null
  has_issues: boolean
  has_projects: boolean
  has_downloads: boolean
  has_wiki: boolean
  has_pages: boolean
  has_discussions: boolean
  forks_count: number
  mirror_url: string | null
  archived: boolean
  disabled: boolean
  open_issues_count: number
  license: unknown | null
  allow_forking: boolean
  is_template: boolean
  web_commit_signoff_required: boolean
  topics: string[]
  visibility: 'public' | 'private' | 'internal'
  forks: number
  open_issues: number
  watchers: number
  default_branch: string
}

export interface GitHubOrganization {
  login: string
  id: number
  node_id: string
  url: string
  repos_url: string
  events_url: string
  hooks_url: string
  issues_url: string
  members_url: string
  public_members_url: string
  avatar_url: string
  description: string | null
}

export interface GitHubInstallation {
  id: number
  node_id: string
}

export interface GitHubCommit {
  id: string
  tree_id: string
  distinct: boolean
  message: string
  timestamp: string
  url: string
  author: {
    name: string
    email: string
    username?: string
  }
  committer: {
    name: string
    email: string
    username?: string
  }
  added: string[]
  removed: string[]
  modified: string[]
}

export interface GitHubPullRequest {
  url: string
  id: number
  node_id: string
  html_url: string
  diff_url: string
  patch_url: string
  issue_url: string
  number: number
  state: 'open' | 'closed'
  locked: boolean
  title: string
  user: GitHubUser
  body: string | null
  created_at: string
  updated_at: string
  closed_at: string | null
  merged_at: string | null
  merge_commit_sha: string | null
  assignee: GitHubUser | null
  assignees: GitHubUser[]
  requested_reviewers: GitHubUser[]
  requested_teams: unknown[]
  labels: unknown[]
  milestone: unknown | null
  draft: boolean
  commits_url: string
  review_comments_url: string
  review_comment_url: string
  comments_url: string
  statuses_url: string
  head: {
    label: string
    ref: string
    sha: string
    user: GitHubUser
    repo: GitHubRepository
  }
  base: {
    label: string
    ref: string
    sha: string
    user: GitHubUser
    repo: GitHubRepository
  }
  _links: {
    self: { href: string }
    html: { href: string }
    issue: { href: string }
    comments: { href: string }
    review_comments: { href: string }
    review_comment: { href: string }
    commits: { href: string }
    statuses: { href: string }
  }
  author_association: string
  auto_merge: unknown | null
  active_lock_reason: string | null
  merged: boolean
  mergeable: boolean | null
  rebaseable: boolean | null
  mergeable_state: string
  merged_by: GitHubUser | null
  comments: number
  review_comments: number
  maintainer_can_modify: boolean
  commits: number
  additions: number
  deletions: number
  changed_files: number
}

export interface GitHubIssue {
  id: number
  node_id: string
  url: string
  repository_url: string
  labels_url: string
  comments_url: string
  events_url: string
  html_url: string
  number: number
  state: 'open' | 'closed'
  state_reason: 'completed' | 'not_planned' | 'reopened' | null
  title: string
  body: string | null
  user: GitHubUser
  labels: unknown[]
  assignee: GitHubUser | null
  assignees: GitHubUser[]
  milestone: unknown | null
  locked: boolean
  active_lock_reason: string | null
  comments: number
  closed_at: string | null
  created_at: string
  updated_at: string
  author_association: string
  draft?: boolean
}

// Clerk webhook events
export type ClerkEventType =
  | 'user.created'
  | 'user.updated'
  | 'user.deleted'
  | 'session.created'
  | 'session.ended'
  | 'session.revoked'
  | 'email.created'
  | 'organization.created'
  | 'organization.updated'
  | 'organization.deleted'
  | 'organizationInvitation.created'
  | 'organizationInvitation.accepted'
  | 'organizationInvitation.revoked'
  | 'organizationMembership.created'
  | 'organizationMembership.updated'
  | 'organizationMembership.deleted'
  | string

export interface ClerkWebhookPayload {
  data: Record<string, unknown>
  object: 'event'
  type: ClerkEventType
}

// Webhook event log entry (database model)
export interface WebhookEventLog {
  id: string
  source: WebhookSource
  eventType: string
  payload: unknown
  processed: boolean
  processedAt?: Date
  error?: string
  createdAt: Date
}

// Result of webhook processing
export interface WebhookProcessResult {
  success: boolean
  message: string
  eventId?: string
  error?: string
  shouldRetry?: boolean
}

// Webhook handler options
export interface WebhookHandlerOptions {
  skipVerification?: boolean // Optional - verification is ON by default
  maxRetries?: number
  retryDelayMs?: number
  timeoutMs?: number
}

// Webhook verification result
export interface WebhookVerificationResult {
  valid: boolean
  payload?: unknown
  error?: string
}
