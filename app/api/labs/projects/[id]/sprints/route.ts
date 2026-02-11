import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { SprintStatus } from '@prisma/client'
import { z } from 'zod'

// GET /api/labs/projects/[id]/sprints - List sprints for a project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') as SprintStatus | undefined

    const sprints = await prisma.sprint.findMany({
      where: {
        projectId,
        ...(status && { status }),
      },
      include: {
        tasks: {
          select: {
            id: true,
            status: true,
            storyPoints: true,
          },
        },
        _count: {
          select: { tasks: true },
        },
      },
      orderBy: [
        { status: 'asc' }, // ACTIVE first, then PLANNING, COMPLETED, CANCELLED
        { startDate: 'desc' },
      ],
    })

    // Calculate actual points from tasks
    const sprintsWithStats = sprints.map((sprint) => {
      const totalPoints = sprint.tasks.reduce((sum, task) => sum + (task.storyPoints || 0), 0)
      const completedPoints = sprint.tasks
        .filter((task) => task.status === 'COMPLETED')
        .reduce((sum, task) => sum + (task.storyPoints || 0), 0)

      return {
        ...sprint,
        totalPoints,
        completedPoints,
      }
    })

    return NextResponse.json({ success: true, data: sprintsWithStats })
  } catch (error) {
    console.error('Error fetching sprints:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sprints' },
      { status: 500 }
    )
  }
}

// POST /api/labs/projects/[id]/sprints - Create a new sprint
const createSprintSchema = z.object({
  name: z.string().min(1, 'Sprint name is required'),
  goal: z.string().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  status: z.enum(['PLANNING', 'ACTIVE', 'COMPLETED', 'CANCELLED']).default('PLANNING'),
})

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params
    const body = await request.json()
    const result = createSprintSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.flatten() },
        { status: 400 }
      )
    }

    // Check if there's already an active sprint
    if (result.data.status === 'ACTIVE') {
      const activeSprint = await prisma.sprint.findFirst({
        where: {
          projectId,
          status: 'ACTIVE',
        },
      })

      if (activeSprint) {
        return NextResponse.json(
          { success: false, error: 'There is already an active sprint for this project' },
          { status: 400 }
        )
      }
    }

    const sprint = await prisma.sprint.create({
      data: {
        name: result.data.name,
        goal: result.data.goal ?? null,
        startDate: new Date(result.data.startDate),
        endDate: new Date(result.data.endDate),
        status: result.data.status as SprintStatus,
        projectId,
      },
      include: {
        tasks: {
          select: {
            id: true,
            status: true,
            storyPoints: true,
          },
        },
        _count: {
          select: { tasks: true },
        },
      },
    })

    return NextResponse.json({ success: true, data: sprint }, { status: 201 })
  } catch (error) {
    console.error('Error creating sprint:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create sprint' },
      { status: 500 }
    )
  }
}
