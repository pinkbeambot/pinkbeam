import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const {
      projectId,
      taskId,
      description,
      startTime,
      endTime,
      duration,
      billable,
    } = body

    // Check if time entry exists and belongs to user
    const existingEntry = await prisma.timeEntry.findUnique({
      where: { id },
    })

    if (!existingEntry) {
      return NextResponse.json(
        { success: false, error: 'Time entry not found' },
        { status: 404 }
      )
    }

    if (existingEntry.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Calculate duration if endTime changed
    let finalDuration = duration
    if (endTime && !duration) {
      const start = startTime ? new Date(startTime) : existingEntry.startTime
      const end = new Date(endTime)
      finalDuration = Math.round((end.getTime() - start.getTime()) / (1000 * 60))
    }

    const timeEntry = await prisma.timeEntry.update({
      where: { id },
      data: {
        ...(projectId && { projectId }),
        ...(taskId !== undefined && { taskId: taskId || null }),
        ...(description !== undefined && { description: description || null }),
        ...(startTime && { startTime: new Date(startTime) }),
        ...(endTime && { endTime: new Date(endTime) }),
        ...(finalDuration !== undefined && { duration: finalDuration }),
        ...(billable !== undefined && { billable }),
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
        task: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
      },
    })

    return NextResponse.json({ success: true, data: timeEntry })
  } catch (error) {
    console.error('Error updating time entry:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update time entry' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Check if time entry exists and belongs to user
    const existingEntry = await prisma.timeEntry.findUnique({
      where: { id },
    })

    if (!existingEntry) {
      return NextResponse.json(
        { success: false, error: 'Time entry not found' },
        { status: 404 }
      )
    }

    if (existingEntry.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }

    await prisma.timeEntry.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting time entry:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete time entry' },
      { status: 500 }
    )
  }
}
