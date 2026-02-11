import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// GET /api/labs/projects/[id]/sprints/[sprintId]/tasks - Get tasks in sprint
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; sprintId: string }> }
) {
  try {
    const { id: projectId, sprintId } = await params

    const sprint = await prisma.sprint.findFirst({
      where: {
        id: sprintId,
        projectId,
      },
    })

    if (!sprint) {
      return NextResponse.json(
        { success: false, error: 'Sprint not found' },
        { status: 404 }
      )
    }

    const tasks = await prisma.task.findMany({
      where: { sprintId },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        labels: true,
      },
      orderBy: [
        { priority: 'desc' },
        { order: 'asc' },
      ],
    })

    return NextResponse.json({ success: true, data: tasks })
  } catch (error) {
    console.error('Error fetching sprint tasks:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sprint tasks' },
      { status: 500 }
    )
  }
}

// POST /api/labs/projects/[id]/sprints/[sprintId]/tasks - Add tasks to sprint
const addTasksSchema = z.object({
  taskIds: z.array(z.string()).min(1, 'At least one task ID is required'),
})

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; sprintId: string }> }
) {
  try {
    const { id: projectId, sprintId } = await params
    const body = await request.json()
    const result = addTasksSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.flatten() },
        { status: 400 }
      )
    }

    const sprint = await prisma.sprint.findFirst({
      where: {
        id: sprintId,
        projectId,
      },
    })

    if (!sprint) {
      return NextResponse.json(
        { success: false, error: 'Sprint not found' },
        { status: 404 }
      )
    }

    if (sprint.status === 'COMPLETED') {
      return NextResponse.json(
        { success: false, error: 'Cannot add tasks to a completed sprint' },
        { status: 400 }
      )
    }

    // Verify all tasks belong to the project
    const tasks = await prisma.task.findMany({
      where: {
        id: { in: result.data.taskIds },
        projectId,
      },
    })

    if (tasks.length !== result.data.taskIds.length) {
      return NextResponse.json(
        { success: false, error: 'Some tasks were not found in this project' },
        { status: 400 }
      )
    }

    // Update tasks to add to sprint
    await prisma.task.updateMany({
      where: {
        id: { in: result.data.taskIds },
      },
      data: { sprintId },
    })

    // If sprint is active, update burndown data
    if (sprint.status === 'ACTIVE') {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const allSprintTasks = await prisma.task.findMany({
        where: { sprintId },
        select: { storyPoints: true, status: true },
      })

      const totalPoints = allSprintTasks.reduce((sum, task) => sum + (task.storyPoints || 0), 0)
      const completedPoints = allSprintTasks
        .filter((task) => task.status === 'COMPLETED')
        .reduce((sum, task) => sum + (task.storyPoints || 0), 0)

      await prisma.sprintBurndownData.upsert({
        where: {
          sprintId_date: {
            sprintId,
            date: today,
          },
        },
        create: {
          sprintId,
          date: today,
          remainingPoints: totalPoints - completedPoints,
          completedPoints,
        },
        update: {
          remainingPoints: totalPoints - completedPoints,
          completedPoints,
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error adding tasks to sprint:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to add tasks to sprint' },
      { status: 500 }
    )
  }
}

// DELETE /api/labs/projects/[id]/sprints/[sprintId]/tasks - Remove tasks from sprint
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; sprintId: string }> }
) {
  try {
    const { id: projectId, sprintId } = await params
    const { searchParams } = new URL(request.url)
    const taskIdsParam = searchParams.get('taskIds')

    if (!taskIdsParam) {
      return NextResponse.json(
        { success: false, error: 'taskIds query parameter is required' },
        { status: 400 }
      )
    }

    const taskIds = taskIdsParam.split(',')

    const sprint = await prisma.sprint.findFirst({
      where: {
        id: sprintId,
        projectId,
      },
    })

    if (!sprint) {
      return NextResponse.json(
        { success: false, error: 'Sprint not found' },
        { status: 404 }
      )
    }

    if (sprint.status === 'COMPLETED') {
      return NextResponse.json(
        { success: false, error: 'Cannot remove tasks from a completed sprint' },
        { status: 400 }
      )
    }

    // Update tasks to remove from sprint
    await prisma.task.updateMany({
      where: {
        id: { in: taskIds },
        sprintId,
      },
      data: { sprintId: null },
    })

    // If sprint is active, update burndown data
    if (sprint.status === 'ACTIVE') {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const allSprintTasks = await prisma.task.findMany({
        where: { sprintId },
        select: { storyPoints: true, status: true },
      })

      const totalPoints = allSprintTasks.reduce((sum, task) => sum + (task.storyPoints || 0), 0)
      const completedPoints = allSprintTasks
        .filter((task) => task.status === 'COMPLETED')
        .reduce((sum, task) => sum + (task.storyPoints || 0), 0)

      await prisma.sprintBurndownData.upsert({
        where: {
          sprintId_date: {
            sprintId,
            date: today,
          },
        },
        create: {
          sprintId,
          date: today,
          remainingPoints: totalPoints - completedPoints,
          completedPoints,
        },
        update: {
          remainingPoints: totalPoints - completedPoints,
          completedPoints,
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing tasks from sprint:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to remove tasks from sprint' },
      { status: 500 }
    )
  }
}
