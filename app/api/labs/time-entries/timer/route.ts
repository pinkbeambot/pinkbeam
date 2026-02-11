import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const activeTimer = await prisma.timeEntry.findFirst({
      where: {
        userId: session.user.id,
        endTime: null,
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
        task: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
      },
    })

    if (!activeTimer) {
      return NextResponse.json({ success: true, data: null })
    }

    // Calculate current duration
    const now = new Date()
    const currentDuration = Math.round(
      (now.getTime() - activeTimer.startTime.getTime()) / (1000 * 60)
    )

    return NextResponse.json({
      success: true,
      data: {
        ...activeTimer,
        currentDuration,
      },
    })
  } catch (error) {
    console.error('Error fetching active timer:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch active timer' },
      { status: 500 }
    )
  }
}
