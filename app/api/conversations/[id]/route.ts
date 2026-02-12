import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/auth/apiMiddleware'

// GET /api/conversations/[id] - Get conversation details
export const GET = withAuth(async (request, { params, auth }) => {
  try {
    const { id } = await params!

    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 100, // Last 100 messages
        },
        _count: {
          select: { messages: true },
        },
      },
    })

    if (!conversation) {
      return NextResponse.json(
        { success: false, error: 'Conversation not found' },
        { status: 404 }
      )
    }

    // Verify user has access to this conversation
    if (conversation.userId !== auth.userId && !conversation.participants.includes(auth.userId)) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: You do not have access to this conversation' },
        { status: 403 }
      )
    }

    // Reset unread count when viewing conversation
    if (conversation.unreadCount > 0) {
      await prisma.conversation.update({
        where: { id },
        data: { unreadCount: 0 },
      })
      conversation.unreadCount = 0
    }

    return NextResponse.json({ success: true, data: conversation })
  } catch (error) {
    console.error('Error fetching conversation:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch conversation' },
      { status: 500 }
    )
  }
})

const updateConversationSchema = z.object({
  title: z.string().optional(),
  archived: z.boolean().optional(),
  unreadCount: z.number().optional(),
})

// PATCH /api/conversations/[id] - Update conversation
export const PATCH = withAuth(async (request, { params, auth }) => {
  try {
    const { id } = await params!
    const body = await request.json()
    const result = updateConversationSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.flatten() },
        { status: 400 }
      )
    }

    const existing = await prisma.conversation.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Conversation not found' },
        { status: 404 }
      )
    }

    // Verify ownership
    if (existing.userId !== auth.userId) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: You do not own this conversation' },
        { status: 403 }
      )
    }

    const conversation = await prisma.conversation.update({
      where: { id },
      data: result.data,
    })

    return NextResponse.json({ success: true, data: conversation })
  } catch (error) {
    console.error('Error updating conversation:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update conversation' },
      { status: 500 }
    )
  }
})

// DELETE /api/conversations/[id] - Delete conversation
export const DELETE = withAuth(async (request, { params, auth }) => {
  try {
    const { id } = await params!

    const existing = await prisma.conversation.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Conversation not found' },
        { status: 404 }
      )
    }

    // Verify ownership
    if (existing.userId !== auth.userId) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: You do not own this conversation' },
        { status: 403 }
      )
    }

    // Soft delete - archive instead of hard delete
    await prisma.conversation.update({
      where: { id },
      data: { archived: true },
    })

    return NextResponse.json({ success: true, data: { id } })
  } catch (error) {
    console.error('Error deleting conversation:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete conversation' },
      { status: 500 }
    )
  }
})
