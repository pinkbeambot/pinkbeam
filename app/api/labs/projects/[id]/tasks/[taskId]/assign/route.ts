import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/labs/projects/[id]/tasks/[taskId]/assign - Assign a task to a user
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) {
  try {
    const { taskId } = await params
    const body = await request.json()
    const { assigneeId } = body
    
    // Check if task exists
    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
    })
    
    if (!existingTask) {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      )
    }
    
    // If assigneeId is provided, verify the user exists
    if (assigneeId) {
      const user = await prisma.user.findUnique({
        where: { id: assigneeId },
      })
      
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'Assignee not found' },
          { status: 404 }
        )
      }
    }
    
    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        assigneeId: assigneeId || null,
      },
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
    })
    
    return NextResponse.json({ success: true, data: task })
  } catch (error) {
    console.error('Error assigning task:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to assign task' },
      { status: 500 }
    )
  }
}
