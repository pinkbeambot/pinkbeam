import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { sendStatusUpdateEmail } from '@/lib/email'

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

      // Send status update email
      sendStatusUpdateEmail(quote, newStatus).catch((err) =>
        console.error('Status update email failed:', err)
      )
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
