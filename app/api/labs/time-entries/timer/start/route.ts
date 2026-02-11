import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { projectId, taskId, description, billable = true } = body

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: 'Project ID is required' },
        { status: 400 }
      )
    }

    // Check if there's already an active timer for this user
    const activeTimer = await prisma.timeEntry.findFirst({
      where: {
        userId: session.user.id,
        endTime: null,
      },
    })

    if (activeTimer) {
      return NextResponse.json(
        { success: false, error: 'Timer already running', data: activeTimer },
        { status: 400 }
      )
    }

    const timeEntry = await prisma.timeEntry.create({
      data: {
        projectId,
        taskId: taskId || null,
        userId: session.user.id,
        description: description || null,
        startTime: new Date(),
        endTime: null,
        duration: 0,
        billable,
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
    console.error('Error starting timer:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to start timer' },
      { status: 500 }
    )
  }
}
