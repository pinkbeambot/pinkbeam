import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { Prisma } from '@prisma/client'

// GET /api/labs/quotes/[id] - Get a single quote
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const quote = await prisma.quote.findUnique({
      where: { id },
      include: {
        client: {
          select: { id: true, name: true, email: true, company: true, phone: true }
        },
        project: {
          select: { id: true, title: true, status: true }
        },
        lineItems: {
          orderBy: { id: 'asc' }
        },
      }
    })

    if (!quote) {
      return NextResponse.json(
        { success: false, error: 'Quote not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: quote })
  } catch (error) {
    console.error('Error fetching quote:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch quote' },
      { status: 500 }
    )
  }
}

// PUT /api/labs/quotes/[id] - Update a quote
const updateQuoteSchema = z.object({
  title: z.string().min(1, 'Quote title is required').optional(),
  description: z.string().optional(),
  clientId: z.string().min(1, 'Client ID is required').optional(),
  projectId: z.string().optional().nullable(),
  lineItems: z.array(z.object({
    id: z.string().optional(),
    description: z.string().min(1, 'Description is required'),
    quantity: z.number().int().min(1, 'Quantity must be at least 1'),
    unitPrice: z.number().min(0, 'Unit price must be positive'),
  })).optional(),
  taxRate: z.number().min(0).max(100).optional().nullable(),
  validUntil: z.string().datetime().optional().nullable(),
  notes: z.string().optional(),
  terms: z.string().optional(),
  status: z.enum(['DRAFT', 'SENT', 'VIEWED', 'ACCEPTED', 'DECLINED', 'EXPIRED']).optional(),
})

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const result = updateQuoteSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.flatten() },
        { status: 400 }
      )
    }

    const existingQuote = await prisma.quote.findUnique({
      where: { id },
      include: { lineItems: true }
    })

    if (!existingQuote) {
      return NextResponse.json(
        { success: false, error: 'Quote not found' },
        { status: 404 }
      )
    }

    // Calculate totals if line items are provided
    let subtotal = existingQuote.subtotal
    let taxAmount = existingQuote.taxAmount
    let total = existingQuote.total
    let lineItemsUpdate = undefined

    if (result.data.lineItems) {
      const lineItemsData = result.data.lineItems.map(item => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: new Prisma.Decimal(item.unitPrice),
        total: new Prisma.Decimal(item.quantity * item.unitPrice),
      }))

      const subtotalNum = result.data.lineItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
      const taxRate = result.data.taxRate !== undefined ? (result.data.taxRate || 0) : (existingQuote.taxRate?.toNumber() || 0)
      const taxAmountNum = subtotalNum * (taxRate / 100)
      const totalNum = subtotalNum + taxAmountNum
      
      subtotal = new Prisma.Decimal(subtotalNum)
      taxAmount = new Prisma.Decimal(taxAmountNum)
      total = new Prisma.Decimal(totalNum)

      // Delete existing line items and create new ones
      await prisma.quoteLineItem.deleteMany({
        where: { quoteId: id }
      })

      lineItemsUpdate = {
        create: lineItemsData
      }
    } else if (result.data.taxRate !== undefined) {
      const taxRate = result.data.taxRate || 0
      const subtotalNum = existingQuote.subtotal.toNumber()
      const taxAmountNum = subtotalNum * (taxRate / 100)
      const totalNum = subtotalNum + taxAmountNum
      
      taxAmount = new Prisma.Decimal(taxAmountNum)
      total = new Prisma.Decimal(totalNum)
    }

    const quote = await prisma.quote.update({
      where: { id },
      data: {
        title: result.data.title,
        description: result.data.description,
        clientId: result.data.clientId,
        projectId: result.data.projectId,
        subtotal,
        taxRate: result.data.taxRate,
        taxAmount,
        total,
        validUntil: result.data.validUntil ? new Date(result.data.validUntil) : undefined,
        notes: result.data.notes,
        terms: result.data.terms,
        status: result.data.status,
        ...(lineItemsUpdate && { lineItems: lineItemsUpdate }),
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

    return NextResponse.json({ success: true, data: quote })
  } catch (error) {
    console.error('Error updating quote:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update quote' },
      { status: 500 }
    )
  }
}

// DELETE /api/labs/quotes/[id] - Delete a quote
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const existingQuote = await prisma.quote.findUnique({
      where: { id }
    })

    if (!existingQuote) {
      return NextResponse.json(
        { success: false, error: 'Quote not found' },
        { status: 404 }
      )
    }

    await prisma.quote.delete({
      where: { id }
    })

    return NextResponse.json({ success: true, message: 'Quote deleted successfully' })
  } catch (error) {
    console.error('Error deleting quote:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete quote' },
      { status: 500 }
    )
  }
}