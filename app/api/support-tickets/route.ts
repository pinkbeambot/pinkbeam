import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma, TicketStatus } from '@prisma/client'
import { z } from 'zod'

// GET /api/support-tickets - List support tickets with pagination
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const clientId = searchParams.get('clientId')
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '50', 10)

    // Validate pagination params
    const validatedPage = Math.max(1, page)
    const validatedLimit = Math.min(Math.max(1, limit), 100) // Max 100 per page
    const skip = (validatedPage - 1) * validatedLimit

    const where: Prisma.SupportTicketWhereInput = {}
    if (status) where.status = status.toUpperCase() as TicketStatus
    if (clientId) where.clientId = clientId

    // Get total count
    const total = await prisma.supportTicket.count({ where })

    const tickets = await prisma.supportTicket.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: validatedLimit,
      include: {
        client: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: tickets,
      pagination: {
        page: validatedPage,
        limit: validatedLimit,
        total,
        totalPages: Math.ceil(total / validatedLimit),
        hasMore: validatedPage * validatedLimit < total
      }
    })
  } catch (error) {
    console.error('Error fetching tickets:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tickets' },
      { status: 500 }
    )
  }
}

// POST /api/support-tickets - Create support ticket
const prioritySchema = z.preprocess(
  (value) => (typeof value === 'string' ? value.toUpperCase() : value),
  z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
)

const categorySchema = z.preprocess(
  (value) => (typeof value === 'string' ? value.toUpperCase() : value),
  z.enum(['GENERAL', 'BUG', 'FEATURE_REQUEST', 'BILLING', 'TECHNICAL'])
)

const createTicketSchema = z.object({
  clientId: z.string().min(1, 'Client ID is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Please provide more details'),
  priority: prioritySchema.optional().default('MEDIUM'),
  category: categorySchema.optional().default('GENERAL'),
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
        title: result.data.title,
        description: result.data.description,
        priority: result.data.priority,
        category: result.data.category,
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
