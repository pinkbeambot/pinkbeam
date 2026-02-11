import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { assigneeId } = body

    const task = await prisma.task.update({
      where: { id },
      data: { assigneeId: assigneeId || null },
      include: {
        project: {
          select: {
            id: true,
            title: true,
          },
        },
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json({ success: true, data: task })
  } catch (error) {
    console.error('Error updating task assignment:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update task assignment' },
      { status: 500 }
    )
  }
}
