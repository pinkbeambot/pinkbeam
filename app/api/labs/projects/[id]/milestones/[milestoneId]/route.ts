import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// PUT /api/labs/projects/[id]/milestones/[milestoneId] - Update milestone
const updateMilestoneSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  dueDate: z.string().datetime().optional().nullable(),
  completedAt: z.string().datetime().optional().nullable(),
  order: z.number().optional(),
})

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; milestoneId: string }> }
) {
  try {
    const { id, milestoneId } = await params
    const body = await request.json()
    const result = updateMilestoneSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.flatten() },
        { status: 400 }
      )
    }

    const existingMilestone = await prisma.projectMilestone.findFirst({
      where: { id: milestoneId, projectId: id }
    })

    if (!existingMilestone) {
      return NextResponse.json(
        { success: false, error: 'Milestone not found' },
        { status: 404 }
      )
    }

    const updateData: { 
      title?: string
      description?: string | null
      dueDate?: Date | null
      completedAt?: Date | null
      order?: number
    } = {}
    
    if (result.data.title !== undefined) updateData.title = result.data.title
    if (result.data.description !== undefined) updateData.description = result.data.description
    if (result.data.dueDate !== undefined) updateData.dueDate = result.data.dueDate ? new Date(result.data.dueDate) : null
    if (result.data.completedAt !== undefined) updateData.completedAt = result.data.completedAt ? new Date(result.data.completedAt) : null
    if (result.data.order !== undefined) updateData.order = result.data.order

    const milestone = await prisma.projectMilestone.update({
      where: { id: milestoneId },
      data: updateData
    })

    return NextResponse.json({ success: true, data: milestone })
  } catch (error) {
    console.error('Error updating milestone:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update milestone' },
      { status: 500 }
    )
  }
}

// DELETE /api/labs/projects/[id]/milestones/[milestoneId] - Delete milestone
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; milestoneId: string }> }
) {
  try {
    const { id, milestoneId } = await params

    const existingMilestone = await prisma.projectMilestone.findFirst({
      where: { id: milestoneId, projectId: id }
    })

    if (!existingMilestone) {
      return NextResponse.json(
        { success: false, error: 'Milestone not found' },
        { status: 404 }
      )
    }

    await prisma.projectMilestone.delete({
      where: { id: milestoneId }
    })

    return NextResponse.json({ success: true, data: { deleted: true } })
  } catch (error) {
    console.error('Error deleting milestone:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete milestone' },
      { status: 500 }
    )
  }
}
