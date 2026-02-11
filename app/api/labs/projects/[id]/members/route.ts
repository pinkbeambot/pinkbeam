import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// GET /api/labs/projects/[id]/members - Get project members
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const members = await prisma.projectMember.findMany({
      where: { projectId: id },
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true }
        }
      },
      orderBy: { joinedAt: 'asc' }
    })

    return NextResponse.json({ success: true, data: members })
  } catch (error) {
    console.error('Error fetching project members:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch project members' },
      { status: 500 }
    )
  }
}

// POST /api/labs/projects/[id]/members - Add member to project
const addMemberSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  role: z.string().default('MEMBER'),
})

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const result = addMemberSchema.safeParse(body)

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

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: result.data.userId }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if member already exists
    const existingMember = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId: id,
          userId: result.data.userId
        }
      }
    })

    if (existingMember) {
      return NextResponse.json(
        { success: false, error: 'User is already a member of this project' },
        { status: 400 }
      )
    }

    const member = await prisma.projectMember.create({
      data: {
        projectId: id,
        userId: result.data.userId,
        role: result.data.role,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true }
        }
      }
    })

    return NextResponse.json({ success: true, data: member }, { status: 201 })
  } catch (error) {
    console.error('Error adding project member:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to add project member' },
      { status: 500 }
    )
  }
}

// DELETE /api/labs/projects/[id]/members?userId=xxx - Remove member from project
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    const member = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId: id,
          userId: userId
        }
      }
    })

    if (!member) {
      return NextResponse.json(
        { success: false, error: 'Member not found' },
        { status: 404 }
      )
    }

    await prisma.projectMember.delete({
      where: {
        projectId_userId: {
          projectId: id,
          userId: userId
        }
      }
    })

    return NextResponse.json({ success: true, data: { deleted: true } })
  } catch (error) {
    console.error('Error removing project member:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to remove project member' },
      { status: 500 }
    )
  }
}
