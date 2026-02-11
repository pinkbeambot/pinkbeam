import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'
import { startOfWeek, endOfWeek, eachDayOfInterval, format } from 'date-fns'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { userId, projectId, taskId, date, allocatedHours, actualHours } = body

    if (!userId || !projectId || !date || allocatedHours === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: userId, projectId, date, allocatedHours' },
        { status: 400 }
      )
    }

    // Create or update workload entry
    const entryDate = new Date(date)
    
    // Check if entry already exists for this user/project/task/date combo
    const existingEntry = await prisma.workloadEntry.findFirst({
      where: {
        userId,
        projectId,
        taskId: taskId || null,
        date: {
          gte: new Date(entryDate.getFullYear(), entryDate.getMonth(), entryDate.getDate()),
          lt: new Date(entryDate.getFullYear(), entryDate.getMonth(), entryDate.getDate() + 1),
        },
      },
    })

    let workloadEntry
    if (existingEntry) {
      workloadEntry = await prisma.workloadEntry.update({
        where: { id: existingEntry.id },
        data: {
          allocatedHours: parseFloat(allocatedHours),
          actualHours: actualHours !== undefined ? parseFloat(actualHours) : existingEntry.actualHours,
        },
        include: {
          project: {
            select: {
              id: true,
              title: true,
            },
          },
          task: {
            select: {
              id: true,
              title: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      })
    } else {
      workloadEntry = await prisma.workloadEntry.create({
        data: {
          userId,
          projectId,
          taskId: taskId || null,
          date: entryDate,
          allocatedHours: parseFloat(allocatedHours),
          actualHours: actualHours !== undefined ? parseFloat(actualHours) : null,
        },
        include: {
          project: {
            select: {
              id: true,
              title: true,
            },
          },
          task: {
            select: {
              id: true,
              title: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      })
    }

    return NextResponse.json({
      success: true,
      data: workloadEntry,
      message: existingEntry ? 'Workload entry updated' : 'Workload entry created',
    })
  } catch (error) {
    console.error('Error creating/updating workload entry:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create workload entry' },
      { status: 500 }
    )
  }
}

// POST /api/labs/workload/calculate - Calculate workload from tasks
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { userId, startDate, endDate } = body

    if (!userId || !startDate || !endDate) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: userId, startDate, endDate' },
        { status: 400 }
      )
    }

    const start = new Date(startDate)
    const end = new Date(endDate)

    // Fetch user's assigned tasks with estimates
    const tasks = await prisma.task.findMany({
      where: {
        assigneeId: userId,
        status: { not: 'COMPLETED' },
        estimate: { not: null },
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })

    // Calculate daily distribution
    const days = eachDayOfInterval({ start, end })
    const createdEntries = []

    for (const task of tasks) {
      if (!task.estimate) continue

      // Simple distribution: spread estimate hours across available days
      const hoursPerDay = task.estimate / days.length

      for (const day of days) {
        // Skip weekends (optional - could check user capacity config)
        const dayOfWeek = day.getDay()
        if (dayOfWeek === 0 || dayOfWeek === 6) continue

        const existingEntry = await prisma.workloadEntry.findFirst({
          where: {
            userId,
            projectId: task.projectId,
            taskId: task.id,
            date: {
              gte: new Date(day.getFullYear(), day.getMonth(), day.getDate()),
              lt: new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1),
            },
          },
        })

        if (existingEntry) {
          // Update existing
          const updated = await prisma.workloadEntry.update({
            where: { id: existingEntry.id },
            data: {
              allocatedHours: hoursPerDay,
            },
          })
          createdEntries.push(updated)
        } else {
          // Create new
          const created = await prisma.workloadEntry.create({
            data: {
              userId,
              projectId: task.projectId,
              taskId: task.id,
              date: day,
              allocatedHours: hoursPerDay,
            },
          })
          createdEntries.push(created)
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        entriesCreated: createdEntries.length,
        entries: createdEntries,
      },
      message: `Created/updated ${createdEntries.length} workload entries`,
    })
  } catch (error) {
    console.error('Error calculating workload:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to calculate workload' },
      { status: 500 }
    )
  }
}

// DELETE - Remove workload entry
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const entryId = searchParams.get('id')

    if (!entryId) {
      return NextResponse.json(
        { success: false, error: 'Entry ID is required' },
        { status: 400 }
      )
    }

    await prisma.workloadEntry.delete({
      where: { id: entryId },
    })

    return NextResponse.json({
      success: true,
      message: 'Workload entry deleted',
    })
  } catch (error) {
    console.error('Error deleting workload entry:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete workload entry' },
      { status: 500 }
    )
  }
}
