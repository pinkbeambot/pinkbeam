import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma, ProjectStatus } from '@prisma/client'
import { z } from 'zod'

// GET /api/labs/projects/[id] - Get project details
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        client: {
          select: { id: true, name: true, email: true, company: true }
        },
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, role: true }
            }
          }
        },
        milestones: {
          orderBy: { order: 'asc' }
        },
        files: {
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        quotes: {
          orderBy: { createdAt: 'desc' }
        },
        invoices: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: project })
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch project' },
      { status: 500 }
    )
  }
}

// PUT /api/labs/projects/[id] - Update project
const updateProjectSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  services: z
    .array(z.enum(['DESIGN', 'DEVELOPMENT', 'SEO', 'MAINTENANCE', 'CONSULTING']))
    .optional(),
  budget: z.number().optional().nullable(),
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
    .optional(),
  deadline: z.string().datetime().optional().nullable(),
  startDate: z.string().datetime().optional().nullable(),
  targetEndDate: z.string().datetime().optional().nullable(),
  completedAt: z.string().datetime().optional().nullable(),
  progress: z.number().min(0).max(100).optional(),
})

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const result = updateProjectSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.flatten() },
        { status: 400 }
      )
    }

    const existingProject = await prisma.project.findUnique({
      where: { id }
    })

    if (!existingProject) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }

    const updateData: Prisma.ProjectUpdateInput = {}
    
    if (result.data.title !== undefined) updateData.title = result.data.title
    if (result.data.description !== undefined) updateData.description = result.data.description
    if (result.data.services !== undefined) updateData.services = result.data.services
    if (result.data.budget !== undefined) updateData.budget = result.data.budget
    if (result.data.status !== undefined) updateData.status = result.data.status as ProjectStatus
    if (result.data.deadline !== undefined) updateData.deadline = result.data.deadline ? new Date(result.data.deadline) : null
    if (result.data.startDate !== undefined) updateData.startDate = result.data.startDate ? new Date(result.data.startDate) : null
    if (result.data.targetEndDate !== undefined) updateData.targetEndDate = result.data.targetEndDate ? new Date(result.data.targetEndDate) : null
    if (result.data.completedAt !== undefined) updateData.completedAt = result.data.completedAt ? new Date(result.data.completedAt) : null
    if (result.data.progress !== undefined) updateData.progress = result.data.progress

    const project = await prisma.project.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json({ success: true, data: project })
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update project' },
      { status: 500 }
    )
  }
}

// DELETE /api/labs/projects/[id] - Archive/delete project
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const existingProject = await prisma.project.findUnique({
      where: { id }
    })

    if (!existingProject) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }

    // Soft delete by marking as cancelled
    const project = await prisma.project.update({
      where: { id },
      data: { status: 'CANCELLED' },
      include: {
        client: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    return NextResponse.json({ success: true, data: project })
  } catch (error) {
    console.error('Error archiving project:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to archive project' },
      { status: 500 }
    )
  }
}
