import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendTicketCommentEmail } from '@/lib/email'
import { ticketCommentCreateSchema } from '@/lib/validation'
import { createNotification } from '@/lib/notifications'

// GET /api/tickets/[id]/comments — List comments for a ticket
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const includeInternal = searchParams.get('internal') === 'true'

    const where: Record<string, unknown> = { ticketId: id }
    if (!includeInternal) {
      where.isInternal = false
    }

    const comments = await prisma.ticketComment.findMany({
      where,
      include: {
        author: { select: { id: true, name: true, email: true, role: true } },
      },
      orderBy: { createdAt: 'asc' },
    })

    return NextResponse.json({ success: true, data: comments })
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}

// POST /api/tickets/[id]/comments — Add comment to ticket
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const result = ticketCommentCreateSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.flatten() },
        { status: 400 }
      )
    }

    // Verify ticket exists
    const ticket = await prisma.supportTicket.findUnique({ where: { id } })
    if (!ticket) {
      return NextResponse.json(
        { success: false, error: 'Ticket not found' },
        { status: 404 }
      )
    }

    const comment = await prisma.ticketComment.create({
      data: {
        ticketId: id,
        authorId: result.data.authorId,
        body: result.data.body,
        isInternal: result.data.isInternal,
      },
      include: {
        author: { select: { id: true, name: true, email: true, role: true } },
      },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: result.data.isInternal ? 'internal_note_added' : 'comment_added',
        entityType: 'SupportTicket',
        entityId: id,
        userId: result.data.authorId,
      },
    })

    // Update ticket's updatedAt
    await prisma.supportTicket.update({
      where: { id },
      data: { updatedAt: new Date() },
    })

    // Send email notification to client for non-internal comments by non-clients
    if (!result.data.isInternal && comment.author?.role !== 'CLIENT') {
      const ticketWithClient = await prisma.supportTicket.findUnique({
        where: { id },
        include: { client: { select: { id: true, name: true, email: true } } },
      })
      if (ticketWithClient?.client) {
        sendTicketCommentEmail(
          {
            id,
            title: ticketWithClient.title,
            clientName: ticketWithClient.client.name || '',
            clientEmail: ticketWithClient.client.email,
          },
          result.data.body,
          comment.author?.name || 'Support Team'
        ).catch(async (err) => {
          console.error('[email-error] Ticket comment notification failed:', {
            ticketId: id,
            commentId: comment.id,
            recipient: ticketWithClient.client.email,
            error: err instanceof Error ? err.message : String(err),
            timestamp: new Date().toISOString(),
          })
          await prisma.activityLog.create({
            data: {
              action: 'email_failed',
              entityType: 'SupportTicket',
              entityId: id,
              userId: ticketWithClient.client.id,
              metadata: {
                emailType: 'ticket_comment',
                commentId: comment.id,
                recipient: ticketWithClient.client.email,
                error: err instanceof Error ? err.message : String(err),
              },
            },
          }).catch((logErr) => console.error('[activitylog] Failed to log email error:', logErr))
        })

        // Create in-app notification for the client
        createNotification({
          userId: ticketWithClient.client.id,
          type: 'TICKET_REPLY',
          title: `New reply on "${ticketWithClient.title}"`,
          message: `${comment.author?.name || 'Support Team'} replied to your support ticket.`,
          data: {
            ticketId: id,
            ticketTitle: ticketWithClient.title,
            commentId: comment.id,
            authorName: comment.author?.name || 'Support Team',
            link: `/portal/support`,
          },
        }).catch((err) => console.error('[notifications] Failed to create ticket notification:', err))
      }
    }

    return NextResponse.json({ success: true, data: comment }, { status: 201 })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create comment' },
      { status: 500 }
    )
  }
}
