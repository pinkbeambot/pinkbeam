import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma, ProjectStatus } from '@prisma/client'
import { z } from 'zod'

// GET /api/projects - List projects
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const clientId = searchParams.get('clientId')

    const where: Prisma.ProjectWhereInput = {}
    if (status) where.status = status.toUpperCase() as ProjectStatus
    if (clientId) where.clientId = clientId

    const projects = await prisma.project.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        client: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    return NextResponse.json({ success: true, data: projects })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

// POST /api/projects - Create project
const createProjectSchema = z.object({
  title: z.string().min(1, 'Project title is required'),
  description: z.string().optional(),
  clientId: z.string().min(1, 'Client ID is required'),
  services: z
    .array(z.enum(['DESIGN', 'DEVELOPMENT', 'SEO', 'MAINTENANCE', 'CONSULTING']))
    .min(1, 'At least one service is required'),
  budget: z.number().optional(),
  status: z
    .enum([
      'LEAD',
      'QUOTED',
      'ACCEPTED',
      'IN_PROGRESS',
      'REVIEW',
      'COMPLETED',
      'ON_HOLD',
      'CANCELLED',
    ])
    .default('LEAD'),
  deadline: z.string().datetime().optional().nullable(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = createProjectSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.flatten() },
        { status: 400 }
      )
    }

    const project = await prisma.project.create({
      data: {
        title: result.data.title,
        description: result.data.description ?? null,
        clientId: result.data.clientId,
        services: result.data.services,
        budget: result.data.budget,
        status: result.data.status,
        deadline: result.data.deadline ? new Date(result.data.deadline) : null,
      },
      include: {
        client: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    return NextResponse.json({ success: true, data: project }, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    )
  }
}
