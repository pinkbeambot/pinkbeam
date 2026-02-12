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

async function handleCheckoutCompleted(
  payload: StripeWebhookPayload
): Promise<WebhookProcessResult> {
  const session = payload.data.object as any

  console.log(`[Stripe Webhook] Checkout completed: ${session.id}`, {
    customer: session.customer,
    mode: session.mode,
    status: session.status,
    metadata: session.metadata,
  })

  try {
    const { userId, planId, planSlug, serviceType } = session.metadata || {}

    if (!userId) {
      console.error('[Stripe Webhook] No userId in session metadata')
      return {
        success: false,
        message: 'Missing userId in session metadata',
        shouldRetry: false,
      }
    }

    if (session.mode === 'subscription') {
      // Handle subscription checkout
      const subscriptionId = session.subscription as string

      if (!subscriptionId) {
        return {
          success: false,
          message: 'No subscription ID in session',
          shouldRetry: false,
        }
      }

      // Create subscription record
      const currentDate = new Date()
      const nextMonthDate = new Date(currentDate)
      nextMonthDate.setMonth(nextMonthDate.getMonth() + 1)

      await prisma.subscription.create({
        data: {
          userId,
          planId: planId || planSlug, // Use planSlug as fallback
          status: 'ACTIVE',
          billingCycle: 'monthly',
          currentPeriodStart: currentDate,
          currentPeriodEnd: nextMonthDate,
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: subscriptionId,
          stripePriceId: session.line_items?.data[0]?.price?.id,
          paymentStatus: 'ACTIVE',
        },
      })

      console.log(`[Stripe Webhook] Created subscription for user ${userId}`)

      // Log activity
      await prisma.activityLog.create({
        data: {
          action: 'subscription_created',
          entityType: 'subscription',
          entityId: subscriptionId,
          metadata: {
            userId,
            planSlug,
            serviceType,
            stripeSessionId: session.id,
          },
        },
      })

      return {
        success: true,
        message: `Subscription created for user ${userId}`,
      }
    } else if (session.mode === 'payment') {
      // Handle one-time payment
      const paymentIntentId = session.payment_intent as string

      await prisma.activityLog.create({
        data: {
          action: 'one_time_payment',
          entityType: 'payment',
          entityId: paymentIntentId,
          metadata: {
            userId,
            serviceType,
            amount: session.amount_total,
            stripeSessionId: session.id,
          },
        },
      })

      console.log(`[Stripe Webhook] Logged one-time payment for user ${userId}`)

      return {
        success: true,
        message: `One-time payment recorded for user ${userId}`,
      }
    }

    return {
      success: true,
      message: 'Checkout session processed',
    }
  } catch (error) {
    console.error('[Stripe Webhook] Error handling checkout.session.completed:', error)
    return {
      success: false,
      message: 'Failed to process checkout completion',
      error: error instanceof Error ? error.message : 'Unknown error',
      shouldRetry: true,
    }
  }
}

async function handleInvoicePaid(
  payload: StripeWebhookPayload
): Promise<WebhookProcessResult> {
  const invoice = payload.data.object as StripeInvoice

  console.log(`[Stripe Webhook] Invoice paid: ${invoice.id}`, {
    number: invoice.number,
    amount: invoice.amount_paid,
    customer: invoice.customer,
    subscription: invoice.subscription,
  })

  try {
    // Update subscription period if this is a recurring payment
    if (invoice.subscription) {
      const subscription = await prisma.subscription.findUnique({
        where: { stripeSubscriptionId: invoice.subscription as string },
      })

      if (subscription) {
        const currentDate = new Date()
        const nextMonthDate = new Date(currentDate)
        nextMonthDate.setMonth(nextMonthDate.getMonth() + 1)

        await prisma.subscription.update({
          where: { id: subscription.id },
          data: {
            currentPeriodStart: currentDate,
            currentPeriodEnd: nextMonthDate,
            paymentStatus: 'ACTIVE',
            failedAt: null,
          },
        })

        console.log(`[Stripe Webhook] Extended subscription ${subscription.id}`)
      }
    }

    return {
      success: true,
      message: `Invoice ${invoice.id} processed`,
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
    subscription: invoice.subscription,
  })

  try {
    // Mark subscription as past due
    if (invoice.subscription) {
      const subscription = await prisma.subscription.findUnique({
        where: { stripeSubscriptionId: invoice.subscription as string },
      })

      if (subscription) {
        const gracePeriodEnd = new Date()
        gracePeriodEnd.setDate(gracePeriodEnd.getDate() + 3) // 3-day grace period

        await prisma.subscription.update({
          where: { id: subscription.id },
          data: {
            paymentStatus: 'PAST_DUE',
            failedAt: new Date(),
            gracePeriodEnds: gracePeriodEnd,
          },
        })

        console.log(`[Stripe Webhook] Marked subscription ${subscription.id} as PAST_DUE`)

        // Log activity
        await prisma.activityLog.create({
          data: {
            action: 'payment_failed',
            entityType: 'subscription',
            entityId: subscription.id,
            metadata: {
              invoiceId: invoice.id,
              attemptCount: invoice.attempt_count,
              gracePeriodEnd: gracePeriodEnd.toISOString(),
            },
          },
        })
      }
    }

    return {
      success: true,
      message: `Invoice ${invoice.id} payment failure processed`,
    }
  } catch (error) {
    console.error('[Stripe Webhook] Error handling invoice.payment_failed:', error)
    return {
      success: false,
      message: 'Failed to process payment failure',
      error: error instanceof Error ? error.message : 'Unknown error',
      shouldRetry: true,
    }
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

  // Usually handled by checkout.session.completed, so just log
  return {
    success: true,
    message: `Subscription ${subscription.id} created (handled by checkout)`,
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

  try {
    const dbSubscription = await prisma.subscription.findUnique({
      where: { stripeSubscriptionId: subscription.id },
    })

    if (dbSubscription && previousAttributes?.status && subscription.status !== previousAttributes.status) {
      // Status changed
      const statusMap: Record<string, any> = {
        active: 'ACTIVE',
        past_due: 'PAST_DUE',
        canceled: 'CANCELED',
        unpaid: 'PAST_DUE',
        trialing: 'TRIALING',
      }

      const newStatus = statusMap[subscription.status] || 'ACTIVE'

      await prisma.subscription.update({
        where: { id: dbSubscription.id },
        data: {
          status: newStatus,
          paymentStatus: subscription.status === 'active' ? 'ACTIVE' : 'PAST_DUE',
        },
      })

      console.log(`[Stripe Webhook] Updated subscription ${dbSubscription.id} status to ${newStatus}`)
    }

    return {
      success: true,
      message: `Subscription ${subscription.id} updated`,
    }
  } catch (error) {
    console.error('[Stripe Webhook] Error handling subscription.updated:', error)
    return {
      success: false,
      message: 'Failed to update subscription',
      error: error instanceof Error ? error.message : 'Unknown error',
      shouldRetry: true,
    }
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

  try {
    const dbSubscription = await prisma.subscription.findUnique({
      where: { stripeSubscriptionId: subscription.id },
    })

    if (dbSubscription) {
      await prisma.subscription.update({
        where: { id: dbSubscription.id },
        data: {
          status: 'CANCELED',
          canceledAt: new Date(),
          paymentStatus: 'CANCELED',
        },
      })

      console.log(`[Stripe Webhook] Cancelled subscription ${dbSubscription.id}`)

      // Log activity
      await prisma.activityLog.create({
        data: {
          action: 'subscription_canceled',
          entityType: 'subscription',
          entityId: dbSubscription.id,
          metadata: {
            stripeSubscriptionId: subscription.id,
            endedAt: subscription.ended_at,
          },
        },
      })
    }

    return {
      success: true,
      message: `Subscription ${subscription.id} cancelled`,
    }
  } catch (error) {
    console.error('[Stripe Webhook] Error handling subscription.deleted:', error)
    return {
      success: false,
      message: 'Failed to process subscription cancellation',
      error: error instanceof Error ? error.message : 'Unknown error',
      shouldRetry: true,
    }
  }
}

export async function handleStripeEvent(
  payload: StripeWebhookPayload,
  _eventType: string
): Promise<WebhookProcessResult> {
  console.log(`[Stripe Webhook] Processing ${payload.type} (ID: ${payload.id})`)

  switch (payload.type) {
    case 'checkout.session.completed':
      return handleCheckoutCompleted(payload)
    case 'invoice.paid':
    case 'invoice.payment_succeeded':
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
    labels: issue.labels.map((l: any) => l.name),
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
          labels: issue.labels.map((l: any) => l.name),
          assignees: issue.assignees.map((a: any) => a.login),
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
