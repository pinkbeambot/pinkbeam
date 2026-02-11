import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/onboarding/skip - Skip onboarding (mark as completed)
export async function POST() {
  try {
    const userId = 'user-1' // TODO: Get from auth session

    await prisma.user.update({
      where: { id: userId },
      data: {
        onboardingCompleted: true,
        onboardingStep: 'complete',
      },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'onboarding_skipped',
        entityType: 'User',
        entityId: userId,
        userId,
        metadata: { skippedAt: new Date().toISOString() },
      },
    })

    return NextResponse.json({
      success: true,
      data: { message: 'Onboarding skipped' },
    })
  } catch (error) {
    console.error('Error skipping onboarding:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to skip onboarding' },
      { status: 500 }
    )
  }
}
