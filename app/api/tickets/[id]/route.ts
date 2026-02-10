import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { calculateSlaDeadline, isSlaBreached } from '@/lib/sla'
import { sendTicketStatusUpdateEmail } from '@/lib/email'

const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  OPEN: ['IN_PROGRESS', 'CLOSED'],
  IN_PROGRESS: ['WAITING_CLIENT', 'RESOLVED', 'OPEN'],
  WAITING_CLIENT: ['IN_PROGRESS', 'RESOLVED', 'CLOSED'],
  RESOLVED: ['CLOSED', 'OPEN'],
  CLOSED: ['OPEN'], // reopen
}

const updateTicketSchema = z.object({
  status: z
    .enum(['OPEN', 'IN_PROGRESS', 'WAITING_CLIENT', 'RESOLVED', 'CLOSED'])
    .optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  category: z
    .enum(['GENERAL', 'BUG', 'FEATURE_REQUEST', 'BILLING', 'TECHNICAL'])
    .optional(),
  assigneeId: z.string().nullable().optional(),
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
})

// GET /api/tickets/[id] — Get ticket detail
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const ticket = await prisma.supportTicket.findUnique({
      where: { id },
      include: {
        client: { select: { id: true, name: true, email: true, company: true } },
        assignee: { select: { id: true, name: true, email: true } },
        comments: {
          include: {
            author: { select: { id: true, name: true, email: true, role: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    if (!ticket) {
      return NextResponse.json(
        { success: false, error: 'Ticket not found' },
        { status: 404 }
      )
    }

    // Check SLA breach in real time
    const breached = isSlaBreached(ticket.slaDeadline)
    if (breached && !ticket.slaBreach) {
      await prisma.supportTicket.update({
        where: { id },
        data: { slaBreach: true, slaBreachedAt: new Date() },
      })
      ticket.slaBreach = true
    }

    // Fetch activity log
    const activity = await prisma.activityLog.findMany({
      where: { entityType: 'SupportTicket', entityId: id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: ticket, activity })
  } catch (error) {
    console.error('Error fetching ticket:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch ticket' },
      { status: 500 }
    )
  }
}

// PUT /api/tickets/[id] — Update ticket
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const result = updateTicketSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.flatten() },
        { status: 400 }
      )
    }

    const existing = await prisma.supportTicket.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Ticket not found' },
        { status: 404 }
      )
    }

    const updates = result.data

    // Validate status transition
    if (updates.status && updates.status !== existing.status) {
      const allowed = ALLOWED_TRANSITIONS[existing.status] ?? []
      if (!allowed.includes(updates.status)) {
        return NextResponse.json(
          {
            success: false,
            error: `Cannot transition from ${existing.status} to ${updates.status}. Allowed: ${allowed.join(', ') || 'none'}`,
          },
          { status: 400 }
        )
      }
    }

    // Build update data
    const data: Record<string, unknown> = {}
    if (updates.title !== undefined) data.title = updates.title
    if (updates.description !== undefined) data.description = updates.description
    if (updates.category !== undefined) data.category = updates.category
    if (updates.assigneeId !== undefined) data.assigneeId = updates.assigneeId

    if (updates.status) {
      data.status = updates.status
      if (updates.status === 'RESOLVED') data.resolvedAt = new Date()
      if (updates.status === 'CLOSED') data.closedAt = new Date()
      if (updates.status === 'OPEN' && existing.status === 'CLOSED') {
        // Reopening — clear resolved/closed timestamps
        data.resolvedAt = null
        data.closedAt = null
      }
    }

    // Recalculate SLA if priority changes
    if (updates.priority && updates.priority !== existing.priority) {
      data.priority = updates.priority
      data.slaDeadline = calculateSlaDeadline(updates.priority, existing.createdAt)
      data.slaBreach = isSlaBreached(data.slaDeadline as Date)
      if (data.slaBreach && !existing.slaBreach) {
        data.slaBreachedAt = new Date()
      }
    }

    const ticket = await prisma.supportTicket.update({
      where: { id },
      data,
      include: {
        client: { select: { id: true, name: true, email: true, company: true } },
        assignee: { select: { id: true, name: true, email: true } },
      },
    })

    // Log changes
    if (updates.status && updates.status !== existing.status) {
      await prisma.activityLog.create({
        data: {
          action: 'status_change',
          entityType: 'SupportTicket',
          entityId: id,
          metadata: { from: existing.status, to: updates.status },
        },
      })
      // Send status update email to client
      sendTicketStatusUpdateEmail(
        {
          id,
          title: ticket.title ?? existing.title,
          clientName: ticket.client?.name || '',
          clientEmail: ticket.client?.email || '',
        },
        updates.status
      ).catch((err) => console.error('[email] ticket status update failed:', err))
    }
    if (updates.priority && updates.priority !== existing.priority) {
      await prisma.activityLog.create({
        data: {
          action: 'priority_change',
          entityType: 'SupportTicket',
          entityId: id,
          metadata: { from: existing.priority, to: updates.priority },
        },
      })
    }
    if (updates.assigneeId !== undefined && updates.assigneeId !== existing.assigneeId) {
      await prisma.activityLog.create({
        data: {
          action: 'assignment_change',
          entityType: 'SupportTicket',
          entityId: id,
          metadata: {
            from: existing.assigneeId ?? 'unassigned',
            to: updates.assigneeId ?? 'unassigned',
          },
        },
      })
    }

    return NextResponse.json({ success: true, data: ticket })
  } catch (error) {
    console.error('Error updating ticket:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update ticket' },
      { status: 500 }
    )
  }
}

// DELETE /api/tickets/[id] — Delete ticket
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.supportTicket.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting ticket:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete ticket' },
      { status: 500 }
    )
  }
}
