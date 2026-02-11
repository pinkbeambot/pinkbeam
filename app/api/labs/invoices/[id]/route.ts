import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { Prisma, InvoiceStatus } from '@prisma/client'

// GET /api/labs/invoices/[id] - Get a single invoice
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const invoice = await prisma.invoice.findUnique({
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
        payments: {
          orderBy: { paidAt: 'desc' }
        },
      }
    })

    if (!invoice) {
      return NextResponse.json(
        { success: false, error: 'Invoice not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: invoice })
  } catch (error) {
    console.error('Error fetching invoice:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch invoice' },
      { status: 500 }
    )
  }
}

// PUT /api/labs/invoices/[id] - Update an invoice
const updateInvoiceSchema = z.object({
  clientId: z.string().min(1, 'Client ID is required').optional(),
  projectId: z.string().optional().nullable(),
  lineItems: z.array(z.object({
    id: z.string().optional(),
    description: z.string().min(1, 'Description is required'),
    quantity: z.number().min(0, 'Quantity must be positive'),
    unitPrice: z.number().min(0, 'Unit price must be positive'),
    timeEntryId: z.string().optional(),
  })).optional(),
  taxRate: z.number().min(0).max(100).optional().nullable(),
  dueDate: z.string().datetime().optional().nullable(),
  notes: z.string().optional(),
  terms: z.string().optional(),
  status: z.enum(['DRAFT', 'SENT', 'VIEWED', 'PARTIAL', 'PAID', 'OVERDUE', 'CANCELLED']).optional(),
})

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const result = updateInvoiceSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.flatten() },
        { status: 400 }
      )
    }

    const existingInvoice = await prisma.invoice.findUnique({
      where: { id },
      include: { lineItems: true, payments: true }
    })

    if (!existingInvoice) {
      return NextResponse.json(
        { success: false, error: 'Invoice not found' },
        { status: 404 }
      )
    }

    // Don't allow editing if already paid
    if (existingInvoice.status === 'PAID' && result.data.status !== 'PAID') {
      return NextResponse.json(
        { success: false, error: 'Cannot edit a paid invoice' },
        { status: 400 }
      )
    }

    // Calculate totals if line items are provided
    let subtotal = existingInvoice.subtotal
    let taxAmount = existingInvoice.taxAmount
    let total = existingInvoice.total
    let amountDue = existingInvoice.amountDue
    let lineItemsUpdate = undefined

    if (result.data.lineItems) {
      const lineItemsData = result.data.lineItems.map(item => ({
        description: item.description,
        quantity: new Prisma.Decimal(item.quantity),
        unitPrice: new Prisma.Decimal(item.unitPrice),
        total: new Prisma.Decimal(item.quantity * item.unitPrice),
        timeEntryId: item.timeEntryId ?? null,
      }))

      const subtotalNum = result.data.lineItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
      const taxRate = result.data.taxRate !== undefined ? (result.data.taxRate || 0) : (existingInvoice.taxRate?.toNumber() || 0)
      const taxAmountNum = subtotalNum * (taxRate / 100)
      const totalNum = subtotalNum + taxAmountNum
      const amountPaid = existingInvoice.amountPaid.toNumber()
      const amountDueNum = totalNum - amountPaid
      
      subtotal = new Prisma.Decimal(subtotalNum)
      taxAmount = new Prisma.Decimal(taxAmountNum)
      total = new Prisma.Decimal(totalNum)
      amountDue = new Prisma.Decimal(amountDueNum)

      // Delete existing line items and create new ones
      await prisma.invoiceLineItem.deleteMany({
        where: { invoiceId: id }
      })

      lineItemsUpdate = {
        create: lineItemsData
      }
    } else if (result.data.taxRate !== undefined) {
      const taxRate = result.data.taxRate || 0
      const subtotalNum = existingInvoice.subtotal.toNumber()
      const taxAmountNum = subtotalNum * (taxRate / 100)
      const totalNum = subtotalNum + taxAmountNum
      const amountPaid = existingInvoice.amountPaid.toNumber()
      const amountDueNum = totalNum - amountPaid
      
      taxAmount = new Prisma.Decimal(taxAmountNum)
      total = new Prisma.Decimal(totalNum)
      amountDue = new Prisma.Decimal(amountDueNum)
    }

    // Auto-update status based on amountDue
    let newStatus = result.data.status
    if (!newStatus && amountDue.toNumber() <= 0 && existingInvoice.amountPaid.toNumber() > 0) {
      newStatus = 'PAID'
    } else if (!newStatus && existingInvoice.amountPaid.toNumber() > 0 && amountDue.toNumber() > 0) {
      newStatus = 'PARTIAL'
    }

    const invoice = await prisma.invoice.update({
      where: { id },
      data: {
        clientId: result.data.clientId,
        projectId: result.data.projectId,
        subtotal,
        taxRate: result.data.taxRate,
        taxAmount,
        total,
        amountDue,
        dueDate: result.data.dueDate ? new Date(result.data.dueDate) : undefined,
        notes: result.data.notes,
        terms: result.data.terms,
        status: newStatus,
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
        payments: {
          orderBy: { paidAt: 'desc' }
        },
      }
    })

    return NextResponse.json({ success: true, data: invoice })
  } catch (error) {
    console.error('Error updating invoice:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update invoice' },
      { status: 500 }
    )
  }
}

// DELETE /api/labs/invoices/[id] - Delete an invoice
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const existingInvoice = await prisma.invoice.findUnique({
      where: { id },
      include: { payments: true }
    })

    if (!existingInvoice) {
      return NextResponse.json(
        { success: false, error: 'Invoice not found' },
        { status: 404 }
      )
    }

    // Don't allow deletion if payments exist
    if (existingInvoice.payments.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete invoice with recorded payments' },
        { status: 400 }
      )
    }

    await prisma.$transaction(async (tx) => {
      // Unlink time entries from this invoice
      await tx.timeEntry.updateMany({
        where: { invoiceId: id },
        data: { 
          invoiced: false,
          invoiceId: null,
        }
      })

      // Delete invoice (line items will cascade)
      await tx.invoice.delete({
        where: { id }
      })
    })

    return NextResponse.json({ success: true, message: 'Invoice deleted successfully' })
  } catch (error) {
    console.error('Error deleting invoice:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete invoice' },
      { status: 500 }
    )
  }
}
