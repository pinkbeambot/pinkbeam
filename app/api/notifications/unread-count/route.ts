import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/notifications/unread-count - Get unread count for current user
export async function GET(request: Request) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const count = await prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    })

    return NextResponse.json({
      success: true,
      count,
    })
  } catch (error) {
    console.error('[api/notifications/unread-count] GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch unread count' },
      { status: 500 }
    )
  }
}