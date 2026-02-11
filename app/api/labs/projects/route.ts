import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma, ProjectStatus } from '@prisma/client'
import { z } from 'zod'

// GET /api/labs/projects - List projects
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const clientId = searchParams.get('clientId')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const where: Prisma.ProjectWhereInput = {}
    
    if (status && status !== 'ALL') {
      where.status = status.toUpperCase() as ProjectStatus
    }
    
    if (clientId) {
      where.clientId = clientId
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    const orderBy: Prisma.ProjectOrderByWithRelationInput = {}
    if (sortBy === 'name') {
      orderBy.title = sortOrder as 'asc' | 'desc'
    } else if (sortBy === 'deadline') {
      orderBy.deadline = sortOrder as 'asc' | 'desc'
    } else if (sortBy === 'status') {
      orderBy.status = sortOrder as 'asc' | 'desc'
    } else {
      orderBy.createdAt = sortOrder as 'asc' | 'desc'
    }

    const projects = await prisma.project.findMany({
      where,
      orderBy,
      include: {
        client: {
          select: { id: true, name: true, email: true }
        },
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true }
            }
          }
        },
        milestones: {
          orderBy: { order: 'asc' }
        },
        _count: {
          select: { files: true }
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

// POST /api/labs/projects - Create project
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
  startDate: z.string().datetime().optional().nullable(),
  targetEndDate: z.string().datetime().optional().nullable(),
  progress: z.number().min(0).max(100).default(0),
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
        startDate: result.data.startDate ? new Date(result.data.startDate) : null,
        targetEndDate: result.data.targetEndDate ? new Date(result.data.targetEndDate) : null,
        progress: result.data.progress,
      },
      include: {
        client: {
          select: { id: true, name: true, email: true }
        },
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true }
            }
          }
        },
        milestones: {
          orderBy: { order: 'asc' }
        },
        _count: {
          select: { files: true }
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
