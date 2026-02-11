import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const taskId = searchParams.get('taskId')
    const userId = searchParams.get('userId') || session.user.id
    const view = searchParams.get('view') || 'daily'
    const dateParam = searchParams.get('date')
    const startDateParam = searchParams.get('startDate')
    const endDateParam = searchParams.get('endDate')

    const date = dateParam ? new Date(dateParam) : new Date()
    let startDate: Date
    let endDate: Date

    if (startDateParam && endDateParam) {
      startDate = new Date(startDateParam)
      endDate = new Date(endDateParam)
    } else {
      switch (view) {
        case 'weekly':
          startDate = startOfWeek(date, { weekStartsOn: 1 })
          endDate = endOfWeek(date, { weekStartsOn: 1 })
          break
        case 'monthly':
          startDate = startOfMonth(date)
          endDate = endOfMonth(date)
          break
        default:
          startDate = startOfDay(date)
          endDate = endOfDay(date)
      }
    }

    const where: {
      userId: string
      startTime: { gte: Date; lte: Date }
      projectId?: string
      taskId?: string
    } = {
      userId,
      startTime: {
        gte: startDate,
        lte: endDate,
      },
    }

    if (projectId) where.projectId = projectId
    if (taskId) where.taskId = taskId

    const timeEntries = await prisma.timeEntry.findMany({
      where,
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
      orderBy: {
        startTime: 'desc',
      },
    })

    return NextResponse.json({ success: true, data: timeEntries })
  } catch (error) {
    console.error('Error fetching time entries:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch time entries' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      projectId,
      taskId,
      description,
      startTime,
      endTime,
      duration,
      billable = true,
    } = body

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: 'Project ID is required' },
        { status: 400 }
      )
    }

    if (!startTime) {
      return NextResponse.json(
        { success: false, error: 'Start time is required' },
        { status: 400 }
      )
    }

    // Calculate duration if not provided but endTime is
    let finalDuration = duration
    if (!finalDuration && endTime) {
      const start = new Date(startTime)
      const end = new Date(endTime)
      finalDuration = Math.round((end.getTime() - start.getTime()) / (1000 * 60))
    }

    const timeEntry = await prisma.timeEntry.create({
      data: {
        projectId,
        taskId: taskId || null,
        userId: session.user.id,
        description: description || null,
        startTime: new Date(startTime),
        endTime: endTime ? new Date(endTime) : null,
        duration: finalDuration || 0,
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
    console.error('Error creating time entry:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create time entry' },
      { status: 500 }
    )
  }
}
