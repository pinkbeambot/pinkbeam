import { NextRequest, NextResponse } from 'next/server'
import { withAdmin } from '@/lib/auth/apiMiddleware'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const announcementSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  type: z.enum(['MAINTENANCE', 'FEATURE', 'NEWS']),
  targetAudience: z.enum(['ALL', 'ACTIVE', 'INACTIVE']),
})

// GET /api/admin/announcements - List all announcements
export const GET = withAdmin(async (request: NextRequest, { auth }) => {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return NextResponse.json({
      success: true,
      data: announcements,
    })
  } catch (error) {
    console.error('Failed to fetch announcements:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch announcements' },
      { status: 500 }
    )
  }
})

// POST /api/admin/announcements - Create and send announcement
export const POST = withAdmin(async (request: NextRequest, { auth }) => {
  try {
    const body = await request.json()
    const validation = announcementSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid announcement data', details: validation.error },
        { status: 400 }
      )
    }

    const { title, content, type, targetAudience } = validation.data

    // Determine target clients based on audience
    let targetClients
    if (targetAudience === 'ALL') {
      targetClients = await prisma.user.findMany({
        where: { role: 'CLIENT' },
        select: { id: true },
      })
    } else if (targetAudience === 'ACTIVE') {
      targetClients = await prisma.user.findMany({
        where: {
          role: 'CLIENT',
          subscriptions: {
            some: { status: 'ACTIVE' },
          },
        },
        select: { id: true },
      })
    } else {
      // INACTIVE
      targetClients = await prisma.user.findMany({
        where: {
          role: 'CLIENT',
          subscriptions: {
            none: { status: 'ACTIVE' },
          },
        },
        select: { id: true },
      })
    }

    // Create announcement
    const announcement = await prisma.announcement.create({
      data: {
        title,
        content,
        type,
        targetAudience,
        sentCount: targetClients.length,
      },
    })

    // Create conversation messages for each target client
    for (const client of targetClients) {
      // Find or create announcement conversation for client
      let conversation = await prisma.conversation.findFirst({
        where: {
          userId: client.id,
          type: 'ADMIN_CHAT',
        },
      })

      if (!conversation) {
        conversation = await prisma.conversation.create({
          data: {
            userId: client.id,
            type: 'ADMIN_CHAT',
            title: 'Admin Announcements',
            participants: [client.id, 'admin'],
          },
        })
      }

      // Send announcement as message
      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          senderType: 'SYSTEM',
          content: `📢 **${title}**\n\n${content}`,
          contentType: 'TEXT',
        },
      })

      // Update conversation last message time
      await prisma.conversation.update({
        where: { id: conversation.id },
        data: {
          lastMessageAt: new Date(),
          unreadCount: { increment: 1 },
        },
      })
    }

    return NextResponse.json({
      success: true,
      data: announcement,
    })
  } catch (error) {
    console.error('Failed to send announcement:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send announcement' },
      { status: 500 }
    )
  }
})
