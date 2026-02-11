import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma, InvoiceStatus } from '@prisma/client'
import { z } from 'zod'

// GET /api/labs/invoices - List invoices
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const clientId = searchParams.get('clientId')
    const projectId = searchParams.get('projectId')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const overdue = searchParams.get('overdue') === 'true'

    const where: Prisma.InvoiceWhereInput = {}
    
    if (status && status !== 'ALL') {
      where.status = status.toUpperCase() as InvoiceStatus
    }
    
    if (clientId) {
      where.clientId = clientId
    }
    
    if (projectId) {
      where.projectId = projectId
    }

    if (overdue) {
      where.dueDate = { lt: new Date() }
      where.status = { in: ['SENT', 'VIEWED', 'PARTIAL'] }
    }
    
    if (search) {
      where.OR = [
        { invoiceNumber: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } },
        { client: { name: { contains: search, mode: 'insensitive' } } },
        { client: { email: { contains: search, mode: 'insensitive' } } },
      ]
    }

    const orderBy: Prisma.InvoiceOrderByWithRelationInput = {}
    if (sortBy === 'invoiceNumber') {
      orderBy.invoiceNumber = sortOrder as 'asc' | 'desc'
    } else if (sortBy === 'total') {
      orderBy.total = sortOrder as 'asc' | 'desc'
    } else if (sortBy === 'dueDate') {
      orderBy.dueDate = sortOrder as 'asc' | 'desc'
    } else if (sortBy === 'status') {
      orderBy.status = sortOrder as 'asc' | 'desc'
    } else if (sortBy === 'issueDate') {
      orderBy.issueDate = sortOrder as 'asc' | 'desc'
    } else {
      orderBy.createdAt = sortOrder as 'asc' | 'desc'
    }

    const invoices = await prisma.invoice.findMany({
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
          select: { lineItems: true, payments: true }
        }
      }
    })

    return NextResponse.json({ success: true, data: invoices })
  } catch (error) {
    console.error('Error fetching invoices:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch invoices' },
      { status: 500 }
    )
  }
}

// POST /api/labs/invoices - Create invoice
const createInvoiceSchema = z.object({
  clientId: z.string().min(1, 'Client ID is required'),
  projectId: z.string().optional().nullable(),
  lineItems: z.array(z.object({
    description: z.string().min(1, 'Description is required'),
    quantity: z.number().min(0, 'Quantity must be positive'),
    unitPrice: z.number().min(0, 'Unit price must be positive'),
    timeEntryId: z.string().optional(),
  })).min(1, 'At least one line item is required'),
  taxRate: z.number().min(0).max(100).optional().nullable(),
  dueDate: z.string().datetime().optional(),
  notes: z.string().optional(),
  terms: z.string().optional(),
  timeEntryIds: z.array(z.string()).optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = createInvoiceSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.flatten() },
        { status: 400 }
      )
    }

    // Generate invoice number (INV-YYYY-XXXX format)
    const year = new Date().getFullYear()
    const count = await prisma.invoice.count({
      where: {
        createdAt: {
          gte: new Date(year, 0, 1),
          lt: new Date(year + 1, 0, 1),
        }
      }
    })
    const invoiceNumber = `INV-${year}-${String(count + 1).padStart(4, '0')}`

    // Calculate totals
    const lineItemsData = result.data.lineItems.map(item => ({
      description: item.description,
      quantity: new Prisma.Decimal(item.quantity),
      unitPrice: new Prisma.Decimal(item.unitPrice),
      total: new Prisma.Decimal(item.quantity * item.unitPrice),
      timeEntryId: item.timeEntryId ?? null,
    }))

    const subtotal = lineItemsData.reduce((sum, item) => sum + item.total.toNumber(), 0)
    const taxRate = result.data.taxRate || 0
    const taxAmount = subtotal * (taxRate / 100)
    const total = subtotal + taxAmount

    // Calculate due date (default to 30 days from now)
    const dueDate = result.data.dueDate 
      ? new Date(result.data.dueDate)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

    // Get current user (in production, this would come from auth session)
    const createdById = result.data.clientId // Temporary - should be the actual logged-in user

    const invoice = await prisma.$transaction(async (tx) => {
      // Create invoice
      const inv = await tx.invoice.create({
        data: {
          invoiceNumber,
          clientId: result.data.clientId,
          projectId: result.data.projectId ?? null,
          subtotal: new Prisma.Decimal(subtotal),
          taxRate: taxRate || null,
          taxAmount: new Prisma.Decimal(taxAmount),
          total: new Prisma.Decimal(total),
          amountDue: new Prisma.Decimal(total),
          dueDate,
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

      // Mark time entries as invoiced if applicable
      if (result.data.timeEntryIds && result.data.timeEntryIds.length > 0) {
        await tx.timeEntry.updateMany({
          where: { id: { in: result.data.timeEntryIds } },
          data: { 
            invoiced: true,
            invoiceId: inv.id,
          }
        })
      }

      return inv
    })

    return NextResponse.json({ success: true, data: invoice }, { status: 201 })
  } catch (error) {
    console.error('Error creating invoice:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create invoice' },
      { status: 500 }
    )
  }
}
