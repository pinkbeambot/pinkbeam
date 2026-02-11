import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { z } from 'zod'

// GET /api/invoices/[id] - Get invoice detail
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            client: { select: { id: true, name: true, email: true, company: true } },
          }
        }
      }
    })

    if (!invoice) {
      return NextResponse.json(
        { success: false, error: 'Invoice not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        ...invoice,
        project: { id: invoice.project.id, title: invoice.project.title },
        client: invoice.project.client,
      },
    })
  } catch (error) {
    console.error('Error fetching invoice:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch invoice' },
      { status: 500 }
    )
  }
}

// PUT /api/invoices/[id] - Update invoice
const updateInvoiceSchema = z.object({
  status: z.string().optional(),
  amount: z.number().min(0).optional(),
  description: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  paidAt: z.string().datetime().optional().nullable(),
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

    const updateData: Prisma.InvoiceUpdateInput = {
      amount: result.data.amount,
      description: result.data.description,
      paidAt: result.data.paidAt ? new Date(result.data.paidAt) : result.data.paidAt,
      dueAt: result.data.dueDate ? new Date(result.data.dueDate) : undefined,
      status: result.data.status ? result.data.status.toUpperCase() : undefined,
    }

    const invoice = await prisma.invoice.update({
      where: { id },
      data: updateData,
      include: {
        project: {
          select: {
            id: true,
            title: true,
            client: { select: { id: true, name: true, email: true } },
          },
        },
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        ...invoice,
        project: { id: invoice.project.id, title: invoice.project.title },
        client: invoice.project.client,
      },
    })
  } catch (error) {
    console.error('Error updating invoice:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update invoice' },
      { status: 500 }
    )
  }
}

// DELETE /api/invoices/[id] - Delete invoice
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.invoice.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting invoice:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete invoice' },
      { status: 500 }
    )
  }
}
