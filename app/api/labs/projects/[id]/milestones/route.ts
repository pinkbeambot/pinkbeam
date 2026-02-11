import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// GET /api/labs/projects/[id]/milestones - Get project milestones
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const milestones = await prisma.projectMilestone.findMany({
      where: { projectId: id },
      orderBy: [
        { order: 'asc' },
        { dueDate: 'asc' }
      ]
    })

    return NextResponse.json({ success: true, data: milestones })
  } catch (error) {
    console.error('Error fetching project milestones:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch project milestones' },
      { status: 500 }
    )
  }
}

// POST /api/labs/projects/[id]/milestones - Add milestone to project
const createMilestoneSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional().nullable(),
  dueDate: z.string().datetime().optional().nullable(),
  order: z.number().default(0),
})

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const result = createMilestoneSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.flatten() },
        { status: 400 }
      )
    }

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id }
    })

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }

    // Get the max order if not provided
    let order = result.data.order
    if (order === 0) {
      const lastMilestone = await prisma.projectMilestone.findFirst({
        where: { projectId: id },
        orderBy: { order: 'desc' }
      })
      order = (lastMilestone?.order ?? -1) + 1
    }

    const milestone = await prisma.projectMilestone.create({
      data: {
        projectId: id,
        title: result.data.title,
        description: result.data.description,
        dueDate: result.data.dueDate ? new Date(result.data.dueDate) : null,
        order,
      }
    })

    return NextResponse.json({ success: true, data: milestone }, { status: 201 })
  } catch (error) {
    console.error('Error creating project milestone:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create project milestone' },
      { status: 500 }
    )
  }
}
