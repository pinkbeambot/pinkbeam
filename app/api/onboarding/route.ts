import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth/apiMiddleware'
import { prisma } from '@/lib/prisma'
import { getOnboardingStatus } from '@/lib/onboarding'
import type { OnboardingStep } from '@/lib/onboarding'

// GET /api/onboarding - Get current onboarding status
export const GET = withAuth(async (request: NextRequest, { auth }) => {
  try {
    const userId = auth.userId

    const status = await getOnboardingStatus(userId)

    return NextResponse.json({
      success: true,
      data: status,
    })
  } catch (error) {
    console.error('Error fetching onboarding status:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch onboarding status' },
      { status: 500 }
    )
  }
})

// POST /api/onboarding/step - Update current step
export const POST = withAuth(async (request: NextRequest, { auth }) => {
  try {
    const body = await request.json()
    const { step } = body as { step: OnboardingStep }

    if (!step) {
      return NextResponse.json(
        { success: false, error: 'Step is required' },
        { status: 400 }
      )
    }

    const userId = auth.userId

    await prisma.user.update({
      where: { id: userId },
      data: {
        onboardingStep: step,
        ...(step === 'profile' ? { onboardingStartedAt: new Date() } : {}),
      },
    })

    return NextResponse.json({
      success: true,
      data: { step },
    })
  } catch (error) {
    console.error('Error updating onboarding step:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update step' },
      { status: 500 }
    )
  }
})
