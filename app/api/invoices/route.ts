import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { z } from 'zod'

// GET /api/invoices - List invoices
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const clientId = searchParams.get('clientId')

    const where: Prisma.InvoiceWhereInput = {}
    if (status) where.status = status.toUpperCase()
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
      project: { id: project.id, title: project.title },
      client: project.client,
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
const createInvoiceSchema = z.object({
  projectId: z.string().min(1, 'Project ID is required'),
  amount: z.number().min(0, 'Amount must be positive'),
  description: z.string().min(1, 'Description is required'),
  dueDate: z.string().datetime().optional(),
  status: z.string().optional(),
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
        amount: result.data.amount,
        description: result.data.description,
        dueAt: result.data.dueDate ? new Date(result.data.dueDate) : null,
        status: result.data.status ? result.data.status.toUpperCase() : 'PENDING',
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
          project: { id: invoice.project.id, title: invoice.project.title },
          client: invoice.project.client,
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
