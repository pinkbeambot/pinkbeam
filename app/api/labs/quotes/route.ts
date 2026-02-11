import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma, QuoteStatus } from '@prisma/client'
import { z } from 'zod'

// GET /api/labs/quotes - List quotes
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const clientId = searchParams.get('clientId')
    const projectId = searchParams.get('projectId')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const where: Prisma.QuoteWhereInput = {}
    
    if (status && status !== 'ALL') {
      where.status = status.toUpperCase() as QuoteStatus
    }
    
    if (clientId) {
      where.clientId = clientId
    }
    
    if (projectId) {
      where.projectId = projectId
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { quoteNumber: { contains: search, mode: 'insensitive' } },
      ]
    }

    const orderBy: Prisma.QuoteOrderByWithRelationInput = {}
    if (sortBy === 'title') {
      orderBy.title = sortOrder as 'asc' | 'desc'
    } else if (sortBy === 'total') {
      orderBy.total = sortOrder as 'asc' | 'desc'
    } else if (sortBy === 'validUntil') {
      orderBy.validUntil = sortOrder as 'asc' | 'desc'
    } else if (sortBy === 'status') {
      orderBy.status = sortOrder as 'asc' | 'desc'
    } else {
      orderBy.createdAt = sortOrder as 'asc' | 'desc'
    }

    const quotes = await prisma.quote.findMany({
      where,
      orderBy,
      include: {
        client: {
          select: { id: true, name: true, email: true, company: true }
        },
        project: {
          select: { id: true, title: true }
        },
        lineItems: {
          orderBy: { id: 'asc' }
        },
        _count: {
          select: { lineItems: true }
        }
      }
    })

    return NextResponse.json({ success: true, data: quotes })
  } catch (error) {
    console.error('Error fetching quotes:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch quotes' },
      { status: 500 }
    )
  }
}

// POST /api/labs/quotes - Create quote
const createQuoteSchema = z.object({
  title: z.string().min(1, 'Quote title is required'),
  description: z.string().optional(),
  clientId: z.string().min(1, 'Client ID is required'),
  projectId: z.string().optional().nullable(),
  lineItems: z.array(z.object({
    description: z.string().min(1, 'Description is required'),
    quantity: z.number().int().min(1, 'Quantity must be at least 1'),
    unitPrice: z.number().min(0, 'Unit price must be positive'),
  })).min(1, 'At least one line item is required'),
  taxRate: z.number().min(0).max(100).optional().nullable(),
  validUntil: z.string().datetime().optional().nullable(),
  notes: z.string().optional(),
  terms: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = createQuoteSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.flatten() },
        { status: 400 }
      )
    }

    // Generate quote number (QT-YYYY-XXXX format)
    const year = new Date().getFullYear()
    const count = await prisma.quote.count({
      where: {
        createdAt: {
          gte: new Date(year, 0, 1),
          lt: new Date(year + 1, 0, 1),
        }
      }
    })
    const quoteNumber = `QT-${year}-${String(count + 1).padStart(4, '0')}`

    // Calculate totals
    const lineItemsData = result.data.lineItems.map(item => ({
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      total: item.quantity * item.unitPrice,
    }))

    const subtotal = lineItemsData.reduce((sum, item) => sum + item.total, 0)
    const taxRate = result.data.taxRate || 0
    const taxAmount = subtotal * (taxRate / 100)
    const total = subtotal + taxAmount

    // Get current user (in production, this would come from auth session)
    // For now, we'll use a placeholder - this should be replaced with actual auth
    const createdById = result.data.clientId // Temporary - should be the actual logged-in user

    const quote = await prisma.quote.create({
      data: {
        quoteNumber,
        title: result.data.title,
        description: result.data.description ?? null,
        clientId: result.data.clientId,
        projectId: result.data.projectId ?? null,
        subtotal,
        taxRate: taxRate || null,
        taxAmount: taxAmount || null,
        total,
        validUntil: result.data.validUntil ? new Date(result.data.validUntil) : null,
        notes: result.data.notes ?? null,
        terms: result.data.terms ?? null,
        createdById,
        lineItems: {
          create: lineItemsData,
        },
      },
      include: {
        client: {
          select: { id: true, name: true, email: true, company: true }
        },
        project: {
          select: { id: true, title: true }
        },
        lineItems: {
          orderBy: { id: 'asc' }
        },
      }
    })

    return NextResponse.json({ success: true, data: quote }, { status: 201 })
  } catch (error) {
    console.error('Error creating quote:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create quote' },
      { status: 500 }
    )
  }
}