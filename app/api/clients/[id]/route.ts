import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// GET /api/clients/[id] - Get client detail
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const client = await prisma.user.findFirst({
      where: { 
        id,
        role: 'CLIENT'
      },
      include: {
        projects: {
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            title: true,
            status: true,
            budget: true,
            createdAt: true,
          }
        }
      }
    })

    if (!client) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      )
    }

    const invoices = await prisma.invoice.findMany({
      where: { project: { clientId: id } },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        status: true,
        dueDate: true,
        createdAt: true,
        project: {
          select: { id: true, title: true },
        },
      },
    })

    return NextResponse.json({ success: true, data: { ...client, invoices } })
  } catch (error) {
    console.error('Error fetching client:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch client' },
      { status: 500 }
    )
  }
}

// PUT /api/clients/[id] - Update client
const updateClientSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  company: z.string().optional().nullable(),
})

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const result = updateClientSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.flatten() },
        { status: 400 }
      )
    }

    const client = await prisma.user.update({
      where: { id },
      data: result.data,
      select: {
        id: true,
        name: true,
        email: true,
        company: true,
        phone: true,
      }
    })

    return NextResponse.json({ success: true, data: client })
  } catch (error) {
    console.error('Error updating client:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update client' },
      { status: 500 }
    )
  }
}

// DELETE /api/clients/[id] - Delete client
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.user.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting client:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete client' },
      { status: 500 }
    )
  }
}
