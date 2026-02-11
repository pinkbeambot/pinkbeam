import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { SprintStatus } from '@prisma/client'
import { z } from 'zod'

// GET /api/labs/projects/[id]/sprints/[sprintId] - Get sprint details
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
      include: {
        tasks: {
          include: {
            assignee: {
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
        },
        project: {
          select: {
            id: true,
            title: true,
          },
        },
        burndownData: {
          orderBy: {
            date: 'asc',
          },
        },
      },
    })

    if (!sprint) {
      return NextResponse.json(
        { success: false, error: 'Sprint not found' },
        { status: 404 }
      )
    }

    // Calculate actual points from tasks
    const totalPoints = sprint.tasks.reduce((sum, task) => sum + (task.storyPoints || 0), 0)
    const completedPoints = sprint.tasks
      .filter((task) => task.status === 'COMPLETED')
      .reduce((sum, task) => sum + (task.storyPoints || 0), 0)

    const sprintWithStats = {
      ...sprint,
      totalPoints,
      completedPoints,
    }

    return NextResponse.json({ success: true, data: sprintWithStats })
  } catch (error) {
    console.error('Error fetching sprint:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sprint' },
      { status: 500 }
    )
  }
}

// PUT /api/labs/projects/[id]/sprints/[sprintId] - Update sprint
const updateSprintSchema = z.object({
  name: z.string().min(1).optional(),
  goal: z.string().optional().nullable(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  status: z.enum(['PLANNING', 'ACTIVE', 'COMPLETED', 'CANCELLED']).optional(),
  reviewNotes: z.string().optional().nullable(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; sprintId: string }> }
) {
  try {
    const { id: projectId, sprintId } = await params
    const body = await request.json()
    const result = updateSprintSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.flatten() },
        { status: 400 }
      )
    }

    const existingSprint = await prisma.sprint.findFirst({
      where: {
        id: sprintId,
        projectId,
      },
    })

    if (!existingSprint) {
      return NextResponse.json(
        { success: false, error: 'Sprint not found' },
        { status: 404 }
      )
    }

    // Check if activating sprint
    if (result.data.status === 'ACTIVE' && existingSprint.status !== 'ACTIVE') {
      const activeSprint = await prisma.sprint.findFirst({
        where: {
          projectId,
          status: 'ACTIVE',
          id: { not: sprintId },
        },
      })

      if (activeSprint) {
        return NextResponse.json(
          { success: false, error: 'There is already an active sprint for this project' },
          { status: 400 }
        )
      }

      // Initialize burndown data when sprint starts
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const tasks = await prisma.task.findMany({
        where: { sprintId },
        select: { storyPoints: true, status: true },
      })
      
      const totalPoints = tasks.reduce((sum, task) => sum + (task.storyPoints || 0), 0)
      const completedPoints = tasks
        .filter((task) => task.status === 'COMPLETED')
        .reduce((sum, task) => sum + (task.storyPoints || 0), 0)

      // Create initial burndown entry
      await prisma.sprintBurndownData.create({
        data: {
          sprintId,
          date: today,
          remainingPoints: totalPoints - completedPoints,
          completedPoints,
        },
      })
    }

    // If completing sprint, move incomplete tasks back to backlog
    if (result.data.status === 'COMPLETED' && existingSprint.status !== 'COMPLETED') {
      await prisma.task.updateMany({
        where: {
          sprintId,
          status: { not: 'COMPLETED' },
        },
        data: {
          sprintId: null,
        },
      })
    }

    const updateData: Record<string, unknown> = {}
    if (result.data.name !== undefined) updateData.name = result.data.name
    if (result.data.goal !== undefined) updateData.goal = result.data.goal
    if (result.data.startDate !== undefined) updateData.startDate = new Date(result.data.startDate)
    if (result.data.endDate !== undefined) updateData.endDate = new Date(result.data.endDate)
    if (result.data.status !== undefined) updateData.status = result.data.status as SprintStatus
    if (result.data.reviewNotes !== undefined) updateData.reviewNotes = result.data.reviewNotes

    const sprint = await prisma.sprint.update({
      where: { id: sprintId },
      data: updateData,
      include: {
        tasks: {
          include: {
            assignee: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            labels: true,
          },
        },
        _count: {
          select: { tasks: true },
        },
      },
    })

    // Calculate actual points
    const totalPoints = sprint.tasks.reduce((sum, task) => sum + (task.storyPoints || 0), 0)
    const completedPoints = sprint.tasks
      .filter((task) => task.status === 'COMPLETED')
      .reduce((sum, task) => sum + (task.storyPoints || 0), 0)

    const sprintWithStats = {
      ...sprint,
      totalPoints,
      completedPoints,
    }

    return NextResponse.json({ success: true, data: sprintWithStats })
  } catch (error) {
    console.error('Error updating sprint:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update sprint' },
      { status: 500 }
    )
  }
}

// DELETE /api/labs/projects/[id]/sprints/[sprintId] - Delete sprint
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; sprintId: string }> }
) {
  try {
    const { id: projectId, sprintId } = await params

    const existingSprint = await prisma.sprint.findFirst({
      where: {
        id: sprintId,
        projectId,
      },
    })

    if (!existingSprint) {
      return NextResponse.json(
        { success: false, error: 'Sprint not found' },
        { status: 404 }
      )
    }

    // Move all tasks back to backlog
    await prisma.task.updateMany({
      where: { sprintId },
      data: { sprintId: null },
    })

    // Delete burndown data
    await prisma.sprintBurndownData.deleteMany({
      where: { sprintId },
    })

    // Delete sprint
    await prisma.sprint.delete({
      where: { id: sprintId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting sprint:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete sprint' },
      { status: 500 }
    )
  }
}
