import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// GET /api/support-tickets - List support tickets
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const clientId = searchParams.get('clientId')

    const where: any = {}
    if (status) where.status = status
    if (clientId) where.clientId = clientId

    const tickets = await prisma.supportTicket.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        client: {
          select: { id: true, name: true, email: true }
        }
      }
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

// POST /api/support-tickets - Create support ticket
const createTicketSchema = z.object({
  clientId: z.string().min(1, 'Client ID is required'),
  subject: z.string().min(1, 'Subject is required'),
  description: z.string().min(10, 'Please provide more details'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = createTicketSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.flatten() },
        { status: 400 }
      )
    }

    const ticket = await prisma.supportTicket.create({
      data: {
        clientId: result.data.clientId,
        subject: result.data.subject,
        description: result.data.description,
        priority: result.data.priority,
        status: 'open',
      },
      include: {
        client: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    return NextResponse.json({ success: true, data: ticket }, { status: 201 })
  } catch (error) {
    console.error('Error creating ticket:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create ticket' },
      { status: 500 }
    )
  }
}
