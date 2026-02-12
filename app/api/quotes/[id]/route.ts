import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import {
  sendStatusUpdateEmail,
  sendQuoteAcceptedNotification,
  sendQuoteDeclinedNotification,
} from '@/lib/email'
import { createNotification } from '@/lib/notifications'
import type { QuoteRequest } from '@prisma/client'
import type { QuoteVariables } from '@/lib/email-templates'

// Helper to convert Prisma QuoteRequest to QuoteVariables
function toQuoteVariables(quote: QuoteRequest): QuoteVariables {
  return {
    id: quote.id,
    fullName: quote.fullName,
    email: quote.email,
    company: quote.company,
    projectType: quote.projectType,
    services: quote.services,
    budgetRange: quote.budgetRange,
    timeline: quote.timeline,
    description: quote.description,
    leadScore: quote.leadScore,
    leadQuality: quote.leadQuality as 'hot' | 'warm' | 'cold' | null | undefined,
    status: quote.status,
  }
}

// Valid status transitions: from → allowed destinations
const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  NEW: ['CONTACTED', 'DECLINED'],
  CONTACTED: ['QUALIFIED', 'DECLINED'],
  QUALIFIED: ['PROPOSAL', 'DECLINED'],
  PROPOSAL: ['ACCEPTED', 'DECLINED', 'QUALIFIED'],
  ACCEPTED: [],
  DECLINED: ['NEW'], // allow reopening
}

// GET /api/quotes/[id] - Get quote request detail + activity history
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const includeActivity = searchParams.get('activity') === 'true'

    const quote = await prisma.quoteRequest.findUnique({
      where: { id },
    })

    if (!quote) {
      return NextResponse.json(
        { success: false, error: 'Quote request not found' },
        { status: 404 }
      )
    }

    let activity = undefined
    if (includeActivity) {
      activity = await prisma.activityLog.findMany({
        where: { entityType: 'QuoteRequest', entityId: id },
        orderBy: { createdAt: 'desc' },
      })
    }

    return NextResponse.json({ success: true, data: quote, activity })
  } catch (error) {
    console.error('Error fetching quote request:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch quote request' },
      { status: 500 }
    )
  }
}

// PUT /api/quotes/[id] - Update quote request
const updateQuoteRequestSchema = z.object({
  status: z
    .enum(['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'ACCEPTED', 'DECLINED'])
    .optional(),
  notes: z.string().optional(),
  estimatedAmount: z.number().optional(),
})

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const result = updateQuoteRequestSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.flatten() },
        { status: 400 }
      )
    }

    // Fetch current quote to detect status change
    const existing = await prisma.quoteRequest.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Quote request not found' },
        { status: 404 }
      )
    }

    // Validate status transition
    const newStatus = result.data.status
    if (newStatus && newStatus !== existing.status) {
      const allowed = ALLOWED_TRANSITIONS[existing.status] ?? []
      if (!allowed.includes(newStatus)) {
        return NextResponse.json(
          {
            success: false,
            error: `Cannot transition from ${existing.status} to ${newStatus}. Allowed: ${allowed.join(', ') || 'none'}`,
          },
          { status: 400 }
        )
      }
    }

    const quote = await prisma.quoteRequest.update({
      where: { id },
      data: result.data,
    })

    // Log activity for status change
    if (newStatus && newStatus !== existing.status) {
      await prisma.activityLog.create({
        data: {
          action: 'status_change',
          entityType: 'QuoteRequest',
          entityId: id,
          metadata: { from: existing.status, to: newStatus },
        },
      })

      // Send status update email to client with structured error handling
      sendStatusUpdateEmail(toQuoteVariables(quote), newStatus).catch(async (err) => {
        console.error('[email-error] Quote status update email failed:', {
          quoteId: id,
          recipient: quote.email,
          newStatus,
          error: err instanceof Error ? err.message : String(err),
          timestamp: new Date().toISOString(),
        })
        await prisma.activityLog.create({
          data: {
            action: 'email_failed',
            entityType: 'QuoteRequest',
            entityId: id,
            metadata: {
              emailType: 'status_update',
              recipient: quote.email,
              newStatus,
              error: err instanceof Error ? err.message : String(err),
            },
          },
        }).catch((logErr) => console.error('[activitylog] Failed to log email error:', logErr))
      })

      // Send admin notification for ACCEPTED quotes (triggers onboarding)
      if (newStatus === 'ACCEPTED') {
        sendQuoteAcceptedNotification(toQuoteVariables(quote)).catch(async (err) => {
          console.error('[email-error] Quote accepted admin notification failed:', {
            quoteId: id,
            recipient: process.env.QUOTE_NOTIFY_EMAIL || 'team@pinkbeam.io',
            error: err instanceof Error ? err.message : String(err),
            timestamp: new Date().toISOString(),
          })
          await prisma.activityLog.create({
            data: {
              action: 'email_failed',
              entityType: 'QuoteRequest',
              entityId: id,
              metadata: {
                emailType: 'quote_accepted_admin',
                error: err instanceof Error ? err.message : String(err),
              },
            },
          }).catch((logErr) => console.error('[activitylog] Failed to log email error:', logErr))
        })
      }

      // Send admin notification for DECLINED quotes (for tracking)
      if (newStatus === 'DECLINED') {
        sendQuoteDeclinedNotification(toQuoteVariables(quote)).catch(async (err) => {
          console.error('[email-error] Quote declined admin notification failed:', {
            quoteId: id,
            recipient: process.env.QUOTE_NOTIFY_EMAIL || 'team@pinkbeam.io',
            error: err instanceof Error ? err.message : String(err),
            timestamp: new Date().toISOString(),
          })
          await prisma.activityLog.create({
            data: {
              action: 'email_failed',
              entityType: 'QuoteRequest',
              entityId: id,
              metadata: {
                emailType: 'quote_declined_admin',
                error: err instanceof Error ? err.message : String(err),
              },
            },
          }).catch((logErr) => console.error('[activitylog] Failed to log email error:', logErr))
        })
      }

      // Find the user by email to create notification
      const user = await prisma.user.findUnique({
        where: { email: existing.email },
        select: { id: true },
      })

      if (user) {
        // Create in-app notification
        const statusMessages: Record<string, { title: string; message: string }> = {
          CONTACTED: {
            title: 'Quote Request Update',
            message: `We've reviewed your quote request and will be in touch shortly.`,
          },
          QUALIFIED: {
            title: 'Quote Request Qualified',
            message: `Your project has been qualified. We're preparing your proposal.`,
          },
          PROPOSAL: {
            title: 'Proposal Ready',
            message: `A proposal has been prepared for your project. Check your email for details.`,
          },
          ACCEPTED: {
            title: 'Quote Accepted!',
            message: `Great news! Your quote has been accepted. Welcome aboard!`,
          },
          DECLINED: {
            title: 'Quote Update',
            message: `Unfortunately, we won't be able to move forward with this project at this time.`,
          },
        }

        const statusMessage = statusMessages[newStatus]
        if (statusMessage) {
          createNotification({
            userId: user.id,
            type: 'QUOTE_STATUS',
            title: statusMessage.title,
            message: statusMessage.message,
            data: {
              quoteId: id,
              quoteEmail: existing.email,
              previousStatus: existing.status,
              newStatus,
              link: `/portal/projects`,
            },
          }).catch((err) => console.error('[notifications] Failed to create quote notification:', err))
        }
      }
    }

    // Log activity for notes update
    if (result.data.notes !== undefined && result.data.notes !== existing.notes) {
      await prisma.activityLog.create({
        data: {
          action: 'notes_updated',
          entityType: 'QuoteRequest',
          entityId: id,
          metadata: { notes: result.data.notes },
        },
      })
    }

    // Log activity for estimated amount update
    if (result.data.estimatedAmount !== undefined) {
      await prisma.activityLog.create({
        data: {
          action: 'estimate_updated',
          entityType: 'QuoteRequest',
          entityId: id,
          metadata: {
            from: existing.estimatedAmount?.toString() ?? null,
            to: result.data.estimatedAmount.toString(),
          },
        },
      })
    }

    return NextResponse.json({ success: true, data: quote })
  } catch (error) {
    console.error('Error updating quote request:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update quote request' },
      { status: 500 }
    )
  }
}

// DELETE /api/quotes/[id] - Delete quote request
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.quoteRequest.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting quote request:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete quote request' },
      { status: 500 }
    )
  }
}
