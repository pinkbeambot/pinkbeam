import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { z } from 'zod'

// GET /api/projects/[id]/updates - List project updates
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const projectId = params.id

    // Fetch user from database to check role
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    })

    if (!dbUser) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    // Check if user has access to this project
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { clientId: true },
    })

    if (!project) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 })
    }

    // Admins can see all updates, clients can only see visible updates for their projects
    const isAdmin = dbUser.role === 'ADMIN' || dbUser.role === 'MANAGER'
    const isProjectClient = project.clientId === user.id

    if (!isAdmin && !isProjectClient) {
      return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 })
    }

    // Fetch updates
    const updates = await prisma.projectUpdate.findMany({
      where: {
        projectId,
        ...(isAdmin ? {} : { visible: true }),
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      data: updates,
    })
  } catch (error) {
    console.error('Error fetching project updates:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch updates',
      },
      { status: 500 }
    )
  }
}

const createUpdateSchema = z.object({
  type: z.enum(['STATUS_CHANGE', 'MILESTONE', 'DELIVERABLE', 'NOTE', 'BLOCKER']),
  title: z.string().min(1, 'Title is required'),
  body: z.string().optional(),
  visible: z.boolean().default(true),
  attachments: z.array(z.object({
    id: z.string(),
    name: z.string(),
    url: z.string(),
  })).optional(),
})

// POST /api/projects/[id]/updates - Create a new update (admin only)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const projectId = params.id

    // Check if user is admin
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    })

    if (!dbUser || (dbUser.role !== 'ADMIN' && dbUser.role !== 'MANAGER')) {
      return NextResponse.json(
        { success: false, error: 'Only admins can post updates' },
        { status: 403 }
      )
    }

    // Verify project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true, clientId: true, title: true },
    })

    if (!project) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 })
    }

    // Parse and validate request body
    const body = await request.json()
    const validation = createUpdateSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validation.error.issues,
        },
        { status: 400 }
      )
    }

    const data = validation.data

    // Create update
    const update = await prisma.projectUpdate.create({
      data: {
        projectId,
        authorId: user.id,
        type: data.type,
        title: data.title,
        body: data.body || null,
        visible: data.visible,
        attachments: (data.attachments ? JSON.stringify(data.attachments) : null) as Prisma.InputJsonValue,
      },
    })

    // TODO: Send email notification to client if update is visible
    // if (data.visible) {
    //   // Send email to project.clientId about the update
    // }

    return NextResponse.json({
      success: true,
      data: update,
      message: 'Update posted successfully',
    })
  } catch (error) {
    console.error('Error creating project update:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create update',
      },
      { status: 500 }
    )
  }
}
