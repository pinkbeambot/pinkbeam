import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { TaskStatus, TaskPriority, TaskType } from '@prisma/client'

// GET /api/labs/projects/[id]/tasks - List tasks for a project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const status = searchParams.get('status')?.split(',') as TaskStatus[] | undefined
    const priority = searchParams.get('priority')?.split(',') as TaskPriority[] | undefined
    const type = searchParams.get('type')?.split(',') as TaskType[] | undefined
    const assigneeId = searchParams.get('assigneeId') || undefined
    const labelId = searchParams.get('labelId') || undefined
    const search = searchParams.get('search') || undefined
    const backlog = searchParams.get('backlog') === 'true'
    
    const tasks = await prisma.task.findMany({
      where: {
        projectId,
        ...(status && status.length > 0 && (status[0] as string) !== 'ALL' && { status: { in: status } }),
        ...(priority && { priority: { in: priority } }),
        ...(type && { type: { in: type } }),
        ...(assigneeId && { assigneeId: assigneeId === 'unassigned' ? null : assigneeId }),
        ...(labelId && { labels: { some: { id: labelId } } }),
        ...(backlog && { sprintId: null }),
        ...(search && {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
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
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' },
      ],
    })
    
    return NextResponse.json({ success: true, data: tasks })
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tasks' },
      { status: 500 }
    )
  }
}

// POST /api/labs/projects/[id]/tasks - Create a new task
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params
    const body = await request.json()
    
    const {
      title,
      description,
      status = 'TODO',
      priority = 'MEDIUM',
      type = 'FEATURE',
      assigneeId,
      dueDate,
      estimate,
      labelIds,
    } = body
    
    // Validate required fields
    if (!title?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Title is required' },
        { status: 400 }
      )
    }
    
    // For now, use a placeholder createdById - in production this should come from auth
    const createdById = body.createdById || 'system'
    
    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        status: status as TaskStatus,
        priority: priority as TaskPriority,
        type: type as TaskType,
        projectId,
        assigneeId: assigneeId || null,
        createdById,
        dueDate: dueDate ? new Date(dueDate) : null,
        estimate: estimate ? parseInt(estimate) : null,
        completedAt: status === 'COMPLETED' ? new Date() : null,
        ...(labelIds?.length > 0 && {
          labels: {
            connect: labelIds.map((id: string) => ({ id })),
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
    console.error('Error creating task:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create task' },
      { status: 500 }
    )
  }
}
