import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { TaskStatus } from '@prisma/client'

// GET /api/labs/projects/[id]/tasks/[taskId] - Get a single task
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) {
  try {
    const { taskId } = await params
    
    const task = await prisma.task.findUnique({
      where: { id: taskId },
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
        project: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })
    
    if (!task) {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ success: true, data: task })
  } catch (error) {
    console.error('Error fetching task:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch task' },
      { status: 500 }
    )
  }
}

// PUT /api/labs/projects/[id]/tasks/[taskId] - Update a task
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) {
  try {
    const { taskId } = await params
    const body = await request.json()
    
    const {
      title,
      description,
      status,
      priority,
      type,
      assigneeId,
      dueDate,
      estimate,
      labelIds,
    } = body
    
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
    
    // Handle completedAt based on status
    let completedAt = existingTask.completedAt
    if (status === 'COMPLETED' && existingTask.status !== 'COMPLETED') {
      completedAt = new Date()
    } else if (status && status !== 'COMPLETED') {
      completedAt = null
    }
    
    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(description !== undefined && { description: description?.trim() || null }),
        ...(status && { status }),
        ...(priority && { priority }),
        ...(type && { type }),
        ...(assigneeId !== undefined && { assigneeId: assigneeId || null }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
        ...(estimate !== undefined && { estimate: estimate ? parseInt(estimate) : null }),
        ...(completedAt !== undefined && { completedAt }),
        ...(labelIds && {
          labels: {
            set: labelIds.map((id: string) => ({ id })),
          },
        }),
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
    console.error('Error updating task:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update task' },
      { status: 500 }
    )
  }
}

// DELETE /api/labs/projects/[id]/tasks/[taskId] - Delete a task
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) {
  try {
    const { taskId } = await params
    
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
    
    await prisma.task.delete({
      where: { id: taskId },
    })
    
    return NextResponse.json({ success: true, data: { id: taskId } })
  } catch (error) {
    console.error('Error deleting task:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete task' },
      { status: 500 }
    )
  }
}
