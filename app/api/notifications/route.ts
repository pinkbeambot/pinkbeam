import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { NotificationType } from '@prisma/client'

// GET /api/notifications - List notifications for current user
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Get user ID from header (set by middleware)
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const unreadOnly = searchParams.get('unread') === 'true'
    const type = searchParams.get('type') as NotificationType | null

    const where: {
      userId: string
      isRead?: boolean
      type?: NotificationType
    } = { userId }

    if (unreadOnly) {
      where.isRead = false
    }

    if (type && Object.values(NotificationType).includes(type)) {
      where.type = type
    }

    const [notifications, totalCount, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.notification.count({ where: { userId } }),
      prisma.notification.count({ where: { userId, isRead: false } }),
    ])

    return NextResponse.json({
      success: true,
      data: notifications,
      meta: {
        total: totalCount,
        unread: unreadCount,
        limit,
        offset,
        hasMore: offset + notifications.length < totalCount,
      },
    })
  } catch (error) {
    console.error('[api/notifications] GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}

// PATCH /api/notifications - Mark all as read
export async function PATCH(request: Request) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { action } = body

    if (action === 'markAllRead') {
      await prisma.notification.updateMany({
        where: {
          userId,
          isRead: false,
        },
        data: {
          isRead: true,
          readAt: new Date(),
        },
      })

      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('[api/notifications] PATCH error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update notifications' },
      { status: 500 }
    )
  }
}