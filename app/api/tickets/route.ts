import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calculateSlaDeadline } from '@/lib/sla'
import { sendTicketCreatedEmail, sendTicketAdminNotification } from '@/lib/email'
import { ticketCreateSchema } from '@/lib/validation'
import { createNotification } from '@/lib/notifications'

// GET /api/tickets — List tickets with filters
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const category = searchParams.get('category')
    const clientId = searchParams.get('clientId')
    const assigneeId = searchParams.get('assigneeId')

    const where: Record<string, unknown> = {}
    if (status) where.status = status
    if (priority) where.priority = priority
    if (category) where.category = category
    if (clientId) where.clientId = clientId
    if (assigneeId) where.assigneeId = assigneeId

    const tickets = await prisma.supportTicket.findMany({
      where,
      include: {
        client: { select: { id: true, name: true, email: true, company: true } },
        assignee: { select: { id: true, name: true, email: true } },
        _count: { select: { comments: true } },
      },
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    })

    return NextResponse.json({ success: true, data: tickets })
  } catch (error) {
    console.error('Error fetching tickets:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tickets' },
      { status: 500 }
    )
  }
}

// POST /api/tickets — Create ticket
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = ticketCreateSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.flatten() },
        { status: 400 }
      )
    }

    const data = result.data
    const slaDeadline = calculateSlaDeadline(data.priority)

    const ticket = await prisma.supportTicket.create({
      data: {
        clientId: data.clientId,
        title: data.title,
        description: data.description,
        priority: data.priority,
        category: data.category,
        projectId: data.projectId || null,
        slaDeadline,
      },
      include: {
        client: { select: { id: true, name: true, email: true, company: true } },
      },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'ticket_created',
        entityType: 'SupportTicket',
        entityId: ticket.id,
        userId: data.clientId,
        metadata: { priority: data.priority, category: data.category },
      },
    })

    // Send email notifications (fire and forget) with structured error handling
    const emailData = {
      id: ticket.id,
      title: data.title,
      clientName: ticket.client?.name || '',
      clientEmail: ticket.client?.email || '',
      status: 'OPEN',
      priority: data.priority,
      category: data.category,
    }
    sendTicketCreatedEmail(emailData).catch(async (err) => {
      console.error('[email-error] Ticket created notification failed:', {
        ticketId: ticket.id,
        recipient: ticket.client?.email,
        error: err instanceof Error ? err.message : String(err),
        timestamp: new Date().toISOString(),
      })
      await prisma.activityLog.create({
        data: {
          action: 'email_failed',
          entityType: 'SupportTicket',
          entityId: ticket.id,
          userId: data.clientId,
          metadata: {
            emailType: 'ticket_created',
            recipient: ticket.client?.email,
            error: err instanceof Error ? err.message : String(err),
          },
        },
      }).catch((logErr) => console.error('[activitylog] Failed to log email error:', logErr))
    })

    sendTicketAdminNotification(emailData).catch(async (err) => {
      console.error('[email-error] Ticket admin notification failed:', {
        ticketId: ticket.id,
        recipient: process.env.SUPPORT_NOTIFY_EMAIL || process.env.QUOTE_NOTIFY_EMAIL || 'team@pinkbeam.ai',
        error: err instanceof Error ? err.message : String(err),
        timestamp: new Date().toISOString(),
      })
      await prisma.activityLog.create({
        data: {
          action: 'email_failed',
          entityType: 'SupportTicket',
          entityId: ticket.id,
          userId: data.clientId,
          metadata: {
            emailType: 'ticket_admin_notification',
            recipient: process.env.SUPPORT_NOTIFY_EMAIL || process.env.QUOTE_NOTIFY_EMAIL || 'team@pinkbeam.ai',
            error: err instanceof Error ? err.message : String(err),
          },
        },
      }).catch((logErr) => console.error('[activitylog] Failed to log email error:', logErr))
    })

    // Create in-app notification for client
    createNotification({
      userId: data.clientId,
      type: 'TICKET_REPLY',
      title: `Ticket created: "${data.title}"`,
      message: `Your support ticket has been created. We'll respond within our SLA timeframe.`,
      data: {
        ticketId: ticket.id,
        ticketTitle: data.title,
        priority: data.priority,
        category: data.category,
        link: `/portal/support`,
      },
    }).catch((err) => console.error('[notifications] Failed to create ticket notification:', err))

    return NextResponse.json({ success: true, data: ticket }, { status: 201 })
  } catch (error) {
    console.error('Error creating ticket:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create ticket' },
      { status: 500 }
    )
  }
}
