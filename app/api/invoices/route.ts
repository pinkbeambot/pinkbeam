import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma, InvoiceStatus } from '@prisma/client'
import { z } from 'zod'

// GET /api/invoices - List invoices
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const clientId = searchParams.get('clientId')

    const where: Prisma.InvoiceWhereInput = {}
    if (status) where.status = status.toUpperCase() as InvoiceStatus
    if (clientId) where.project = { clientId }

    const invoices = await prisma.invoice.findMany({
      where,
      orderBy: { createdAt: 'desc' },
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

    const data = invoices.map(({ project, ...invoice }) => ({
      ...invoice,
      project: project ? { id: project.id, title: project.title } : null,
      client: project?.client || null,
    }))

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error fetching invoices:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch invoices' },
      { status: 500 }
    )
  }
}

// POST /api/invoices - Create invoice
// NOTE: This endpoint is incomplete - missing required fields (clientId, invoiceNumber, createdById, etc.)
const createInvoiceSchema = z.object({
  projectId: z.string().min(1, 'Project ID is required'),
  clientId: z.string().min(1, 'Client ID is required'),
  invoiceNumber: z.string().min(1, 'Invoice number is required'),
  subtotal: z.number().min(0, 'Subtotal must be positive'),
  total: z.number().min(0, 'Total must be positive'),
  notes: z.string().optional(),
  dueDate: z.string().datetime(),
  createdById: z.string().min(1, 'Creator ID is required'),
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

    const invoice = await prisma.invoice.create({
      data: {
        projectId: result.data.projectId,
        clientId: result.data.clientId,
        invoiceNumber: result.data.invoiceNumber,
        subtotal: result.data.subtotal,
        total: result.data.total,
        amountDue: result.data.total,
        notes: result.data.notes,
        dueDate: new Date(result.data.dueDate),
        createdById: result.data.createdById,
      },
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

    return NextResponse.json(
      {
        success: true,
        data: {
          ...invoice,
          project: invoice.project ? { id: invoice.project.id, title: invoice.project.title } : null,
          client: invoice.project?.client || null,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating invoice:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create invoice' },
      { status: 500 }
    )
  }
}
