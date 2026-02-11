import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Find active timer for this user
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
      return NextResponse.json(
        { success: false, error: 'No active timer found' },
        { status: 404 }
      )
    }

    const endTime = new Date()
    const duration = Math.round(
      (endTime.getTime() - activeTimer.startTime.getTime()) / (1000 * 60)
    )

    const timeEntry = await prisma.timeEntry.update({
      where: { id: activeTimer.id },
      data: {
        endTime,
        duration,
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

    return NextResponse.json({ success: true, data: timeEntry })
  } catch (error) {
    console.error('Error stopping timer:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to stop timer' },
      { status: 500 }
    )
  }
}
