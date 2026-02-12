import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/auth/apiMiddleware'
import { MessageSenderType, MessageContentType, Prisma } from '@prisma/client'

const sendMessageSchema = z.object({
  content: z.string().min(1, 'Message content is required'),
  contentType: z.enum(['TEXT', 'FILE', 'IMAGE', 'TASK_RESULT', 'TASK_ASSIGNMENT']).default('TEXT'),
  fileUrl: z.string().url().optional(),
  fileName: z.string().optional(),
  fileSize: z.number().optional(),
  fileMimeType: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
})

// GET /api/conversations/[id]/messages - Fetch messages (paginated)
export const GET = withAuth(async (request, { params, auth }) => {
  try {
    const { id } = await params!
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '100')
    const before = searchParams.get('before') // Message ID for cursor pagination
    const after = searchParams.get('after')

    // Verify user has access to this conversation
    const conversation = await prisma.conversation.findUnique({
      where: { id },
      select: { userId: true, participants: true },
    })

    if (!conversation) {
      return NextResponse.json(
        { success: false, error: 'Conversation not found' },
        { status: 404 }
      )
    }

    if (conversation.userId !== auth.userId && !conversation.participants.includes(auth.userId)) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: You do not have access to this conversation' },
        { status: 403 }
      )
    }

    const where: any = {
      conversationId: id,
      deletedAt: null,
    }

    if (before) {
      where.id = { lt: before }
    } else if (after) {
      where.id = { gt: after }
    }

    const messages = await prisma.message.findMany({
      where,
      orderBy: { createdAt: before ? 'desc' : 'asc' },
      take: limit,
    })

    // If using 'before' cursor, reverse to maintain chronological order
    if (before) {
      messages.reverse()
    }

    return NextResponse.json({ success: true, data: messages })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
})

// POST /api/conversations/[id]/messages - Send message
export const POST = withAuth(async (request, { params, auth }) => {
  try {
    const { id } = await params!
    const body = await request.json()
    const result = sendMessageSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.flatten() },
        { status: 400 }
      )
    }

    // Verify user has access to this conversation
    const conversation = await prisma.conversation.findUnique({
      where: { id },
      select: { userId: true, participants: true },
    })

    if (!conversation) {
      return NextResponse.json(
        { success: false, error: 'Conversation not found' },
        { status: 404 }
      )
    }

    if (conversation.userId !== auth.userId && !conversation.participants.includes(auth.userId)) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: You do not have access to this conversation' },
        { status: 403 }
      )
    }

    // Create message and update conversation lastMessageAt
    const [message] = await prisma.$transaction([
      prisma.message.create({
        data: {
          conversationId: id,
          senderId: auth.userId,
          senderType: auth.isAdmin ? MessageSenderType.ADMIN : MessageSenderType.USER,
          content: result.data.content,
          contentType: result.data.contentType as MessageContentType,
          fileUrl: result.data.fileUrl,
          fileName: result.data.fileName,
          fileSize: result.data.fileSize,
          fileMimeType: result.data.fileMimeType,
          metadata: result.data.metadata as Prisma.InputJsonValue | undefined,
        },
      }),
      prisma.conversation.update({
        where: { id },
        data: {
          lastMessageAt: new Date(),
          // Increment unread count for other participants
          unreadCount: {
            increment: conversation.userId !== auth.userId ? 1 : 0,
          },
        },
      }),
    ])

    return NextResponse.json({ success: true, data: message }, { status: 201 })
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    )
  }
})
