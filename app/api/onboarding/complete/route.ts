import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/onboarding/complete - Mark onboarding as complete
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
        action: 'onboarding_completed',
        entityType: 'User',
        entityId: userId,
        userId,
        metadata: { completedAt: new Date().toISOString() },
      },
    })

    return NextResponse.json({
      success: true,
      data: { message: 'Onboarding completed successfully' },
    })
  } catch (error) {
    console.error('Error completing onboarding:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to complete onboarding' },
      { status: 500 }
    )
  }
}
