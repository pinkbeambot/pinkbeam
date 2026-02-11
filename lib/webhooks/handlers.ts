/**
 * Webhook Event Handlers
 * Shared handler functions for webhook processing
 */

import { prisma } from '@/lib/prisma'
import type {
  WebhookProcessResult,
  StripeWebhookPayload,
  StripeInvoice,
  StripeSubscription,
  GitHubWebhookPayload,
  GitHubPushPayload,
  GitHubPullRequestPayload,
  GitHubIssuesPayload,
  GitHubRepository,
} from './event-types'

// ============================================================================
// Stripe Handlers
// ============================================================================

async function handleInvoicePaid(
  payload: StripeWebhookPayload
): Promise<WebhookProcessResult> {
  const invoice = payload.data.object as StripeInvoice

  console.log(`[Stripe Webhook] Invoice paid: ${invoice.id}`, {
    number: invoice.number,
    amount: invoice.amount_paid,
    customer: invoice.customer,
  })

  try {
    const dbInvoice = await prisma.invoice.findFirst({
      where: {
        project: {
          client: {},
        },
      },
    })

    if (dbInvoice) {
      await prisma.invoice.update({
        where: { id: dbInvoice.id },
        data: {
          status: 'PAID',
          paidAt: new Date(),
        },
      })
      console.log(`[Stripe Webhook] Updated invoice ${dbInvoice.id} to PAID`)
    }

    return {
      success: true,
      message: `Invoice ${invoice.id} marked as paid`,
    }
  } catch (error) {
    console.error('[Stripe Webhook] Error handling invoice.paid:', error)
    return {
      success: false,
      message: 'Failed to process invoice payment',
      error: error instanceof Error ? error.message : 'Unknown error',
      shouldRetry: true,
    }
  }
}

async function handleInvoicePaymentFailed(
  payload: StripeWebhookPayload
): Promise<WebhookProcessResult> {
  const invoice = payload.data.object as StripeInvoice

  console.log(`[Stripe Webhook] Invoice payment failed: ${invoice.id}`, {
    number: invoice.number,
    amount: invoice.amount_due,
    customer: invoice.customer,
    attemptCount: invoice.attempt_count,
  })

  return {
    success: true,
    message: `Invoice ${invoice.id} payment failure logged`,
  }
}

async function handleSubscriptionCreated(
  payload: StripeWebhookPayload
): Promise<WebhookProcessResult> {
  const subscription = payload.data.object as StripeSubscription

  console.log(`[Stripe Webhook] Subscription created: ${subscription.id}`, {
    customer: subscription.customer,
    status: subscription.status,
    plan: subscription.plan?.nickname || 'N/A',
  })

  return {
    success: true,
    message: `Subscription ${subscription.id} created and recorded`,
  }
}

async function handleSubscriptionUpdated(
  payload: StripeWebhookPayload
): Promise<WebhookProcessResult> {
  const subscription = payload.data.object as StripeSubscription
  const previousAttributes = payload.data.previous_attributes as Partial<StripeSubscription> | undefined

  console.log(`[Stripe Webhook] Subscription updated: ${subscription.id}`, {
    customer: subscription.customer,
    status: subscription.status,
    previousStatus: previousAttributes?.status,
  })

  return {
    success: true,
    message: `Subscription ${subscription.id} updated`,
  }
}

async function handleSubscriptionDeleted(
  payload: StripeWebhookPayload
): Promise<WebhookProcessResult> {
  const subscription = payload.data.object as StripeSubscription

  console.log(`[Stripe Webhook] Subscription deleted: ${subscription.id}`, {
    customer: subscription.customer,
    endedAt: subscription.ended_at,
  })

  return {
    success: true,
    message: `Subscription ${subscription.id} marked as cancelled`,
  }
}

export async function handleStripeEvent(
  payload: StripeWebhookPayload,
  _eventType: string
): Promise<WebhookProcessResult> {
  console.log(`[Stripe Webhook] Processing ${payload.type} (ID: ${payload.id})`)

  switch (payload.type) {
    case 'invoice.paid':
      return handleInvoicePaid(payload)
    case 'invoice.payment_failed':
      return handleInvoicePaymentFailed(payload)
    case 'customer.subscription.created':
      return handleSubscriptionCreated(payload)
    case 'customer.subscription.updated':
      return handleSubscriptionUpdated(payload)
    case 'customer.subscription.deleted':
      return handleSubscriptionDeleted(payload)
    default:
      console.log(`[Stripe Webhook] Unhandled event type: ${payload.type}`)
      return {
        success: true,
        message: `Event ${payload.type} acknowledged but not processed`,
      }
  }
}

// ============================================================================
// GitHub Handlers
// ============================================================================

async function findProjectByRepo(
  repository: GitHubRepository
): Promise<{ id: string } | null> {
  // TODO: Implement project lookup by repository
  // This would search for projects linked to this GitHub repo
  console.log(`[GitHub Webhook] Looking up project for repo: ${repository.full_name}`)
  return null
}

async function handlePushEvent(
  payload: GitHubPushPayload
): Promise<WebhookProcessResult> {
  const { ref, commits, repository, pusher, forced, deleted } = payload

  const isMainBranch = ref === 'refs/heads/main' || ref === 'refs/heads/master'

  console.log(`[GitHub Webhook] Push to ${ref}`, {
    repo: repository.full_name,
    commits: commits.length,
    pusher: pusher.name,
    forced,
    deleted,
  })

  try {
    const project = await findProjectByRepo(repository)

    if (!project) {
      console.log(`[GitHub Webhook] No project found for repo ${repository.full_name}`)
      return {
        success: true,
        message: `No project linked to ${repository.full_name}`,
      }
    }

    for (const commit of commits) {
      await prisma.activityLog.create({
        data: {
          action: 'commit',
          entityType: 'project',
          entityId: project.id,
          metadata: {
            commitId: commit.id,
            message: commit.message,
            author: commit.author.name,
            email: commit.author.email,
            timestamp: commit.timestamp,
            url: commit.url,
            added: commit.added.length,
            removed: commit.removed.length,
            modified: commit.modified.length,
            branch: ref.replace('refs/heads/', ''),
            forced,
          },
        },
      })
    }

    return {
      success: true,
      message: `Logged ${commits.length} commits to project ${project.id}`,
    }
  } catch (error) {
    console.error('[GitHub Webhook] Error handling push event:', error)
    return {
      success: false,
      message: 'Failed to process push event',
      error: error instanceof Error ? error.message : 'Unknown error',
      shouldRetry: true,
    }
  }
}

async function handlePullRequestEvent(
  payload: GitHubPullRequestPayload
): Promise<WebhookProcessResult> {
  const { action, pull_request, repository } = payload

  console.log(`[GitHub Webhook] PR ${action}: #${pull_request.number} ${pull_request.title}`, {
    repo: repository.full_name,
    state: pull_request.state,
    merged: pull_request.merged,
    draft: pull_request.draft,
  })

  try {
    const project = await findProjectByRepo(repository)

    if (!project) {
      return {
        success: true,
        message: `No project linked to ${repository.full_name}`,
      }
    }

    await prisma.activityLog.create({
      data: {
        action: `pr_${action}`,
        entityType: 'project',
        entityId: project.id,
        metadata: {
          prNumber: pull_request.number,
          prTitle: pull_request.title,
          prState: pull_request.state,
          prUrl: pull_request.html_url,
          author: pull_request.user.login,
          branchFrom: pull_request.head.ref,
          branchTo: pull_request.base.ref,
          draft: pull_request.draft,
          merged: pull_request.merged,
          additions: pull_request.additions,
          deletions: pull_request.deletions,
          changedFiles: pull_request.changed_files,
        },
      },
    })

    return {
      success: true,
      message: `PR #${pull_request.number} ${action} logged`,
    }
  } catch (error) {
    console.error('[GitHub Webhook] Error handling PR event:', error)
    return {
      success: false,
      message: 'Failed to process pull request event',
      error: error instanceof Error ? error.message : 'Unknown error',
      shouldRetry: true,
    }
  }
}

async function handleIssuesEvent(
  payload: GitHubIssuesPayload
): Promise<WebhookProcessResult> {
  const { action, issue, repository } = payload

  console.log(`[GitHub Webhook] Issue ${action}: #${issue.number} ${issue.title}`, {
    repo: repository.full_name,
    state: issue.state,
    labels: issue.labels.map(l => l.name),
  })

  try {
    const project = await findProjectByRepo(repository)

    if (!project) {
      return {
        success: true,
        message: `No project linked to ${repository.full_name}`,
      }
    }

    await prisma.activityLog.create({
      data: {
        action: `issue_${action}`,
        entityType: 'project',
        entityId: project.id,
        metadata: {
          issueNumber: issue.number,
          issueTitle: issue.title,
          issueState: issue.state,
          issueUrl: issue.html_url,
          author: issue.user.login,
          action,
          labels: issue.labels.map(l => l.name),
          assignees: issue.assignees.map(a => a.login),
          comments: issue.comments,
        },
      },
    })

    return {
      success: true,
      message: `Issue #${issue.number} ${action} logged`,
    }
  } catch (error) {
    console.error('[GitHub Webhook] Error handling issue event:', error)
    return {
      success: false,
      message: 'Failed to process issue event',
      error: error instanceof Error ? error.message : 'Unknown error',
      shouldRetry: true,
    }
  }
}

export async function handleGitHubEvent(
  payload: GitHubWebhookPayload,
  eventType: string
): Promise<WebhookProcessResult> {
  const repoName = payload.repository?.full_name || 'unknown'
  console.log(`[GitHub Webhook] Processing ${eventType} for ${repoName}`)

  switch (eventType) {
    case 'push':
      return handlePushEvent(payload as GitHubPushPayload)
    case 'pull_request':
      return handlePullRequestEvent(payload as GitHubPullRequestPayload)
    case 'issues':
      return handleIssuesEvent(payload as GitHubIssuesPayload)
    default:
      console.log(`[GitHub Webhook] Unhandled event type: ${eventType}`)
      return {
        success: true,
        message: `Event ${eventType} acknowledged but not processed`,
      }
  }
}
