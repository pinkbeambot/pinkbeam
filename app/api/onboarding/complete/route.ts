import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth/apiMiddleware'
import { prisma } from '@/lib/prisma'

// POST /api/onboarding/complete - Mark onboarding as complete
export const POST = withAuth(async (request: NextRequest, { auth }) => {
  try {
    const userId = auth.userId

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
})
