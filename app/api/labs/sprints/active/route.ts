import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/labs/sprints/active - Get current active sprint
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')

    const where = {
      status: 'ACTIVE' as const,
      ...(projectId && { projectId }),
    }

    const activeSprint = await prisma.sprint.findFirst({
      where,
      include: {
        project: {
          select: {
            id: true,
            title: true,
          },
        },
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
        _count: {
          select: { tasks: true },
        },
      },
    })

    if (!activeSprint) {
      return NextResponse.json(
        { success: false, error: 'No active sprint found' },
        { status: 404 }
      )
    }

    // Calculate points
    const totalPoints = activeSprint.tasks.reduce((sum, task) => sum + (task.storyPoints || 0), 0)
    const completedPoints = activeSprint.tasks
      .filter((task) => task.status === 'COMPLETED')
      .reduce((sum, task) => sum + (task.storyPoints || 0), 0)

    const sprintWithStats = {
      ...activeSprint,
      totalPoints,
      completedPoints,
    }

    return NextResponse.json({ success: true, data: sprintWithStats })
  } catch (error) {
    console.error('Error fetching active sprint:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch active sprint' },
      { status: 500 }
    )
  }
}
