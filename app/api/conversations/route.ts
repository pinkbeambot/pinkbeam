import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/auth/apiMiddleware'
import { ConversationType, Prisma } from '@prisma/client'

const createConversationSchema = z.object({
  type: z.enum(['VALIS_CHAT', 'AGENT_CHAT', 'ADMIN_CHAT', 'SUPPORT_TICKET']),
  title: z.string().optional(),
  participants: z.array(z.string()).optional().default([]),
  metadata: z.record(z.string(), z.any()).optional(),
})

// GET /api/conversations - List user's conversations
export const GET = withAuth(async (request, { auth }) => {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const archived = searchParams.get('archived') === 'true'
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where: any = {
      userId: auth.userId,
      archived,
    }

    if (type) {
      where.type = type as ConversationType
    }

    const conversations = await prisma.conversation.findMany({
      where,
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            content: true,
            senderType: true,
            createdAt: true,
          },
        },
        _count: {
          select: { messages: true },
        },
      },
      orderBy: { lastMessageAt: 'desc' },
      take: limit,
      skip: offset,
    })

    return NextResponse.json({ success: true, data: conversations })
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch conversations' },
      { status: 500 }
    )
  }
})

// POST /api/conversations - Create new conversation
export const POST = withAuth(async (request, { auth }) => {
  try {
    const body = await request.json()
    const result = createConversationSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.flatten() },
        { status: 400 }
      )
    }

    // Ensure user is in participants list
    const participants = result.data.participants.includes(auth.userId)
      ? result.data.participants
      : [auth.userId, ...result.data.participants]

    const conversation = await prisma.conversation.create({
      data: {
        userId: auth.userId,
        type: result.data.type as ConversationType,
        title: result.data.title,
        participants,
        metadata: result.data.metadata as Prisma.InputJsonValue | undefined,
      },
      include: {
        messages: true,
      },
    })

    return NextResponse.json({ success: true, data: conversation }, { status: 201 })
  } catch (error) {
    console.error('Error creating conversation:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create conversation' },
      { status: 500 }
    )
  }
})
