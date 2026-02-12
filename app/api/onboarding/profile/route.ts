import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth/apiMiddleware'
import { prisma } from '@/lib/prisma'
import { onboardingProfileSchema } from '@/lib/validation'

// POST /api/onboarding/profile - Save profile data
export const POST = withAuth(async (request: NextRequest, { auth }) => {
  try {
    const body = await request.json()
    const result = onboardingProfileSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.flatten() },
        { status: 400 }
      )
    }

    const userId = auth.userId
    const data = result.data

    await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        phone: data.phone || null,
        company: data.company || null,
        website: data.website || null,
        onboardingStep: 'company',
        ...(await shouldSetStartedAt(userId)),
      },
    })

    return NextResponse.json({
      success: true,
      data: { message: 'Profile updated successfully' },
    })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    )
  }
})

async function shouldSetStartedAt(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { onboardingStartedAt: true },
  })
  
  if (!user?.onboardingStartedAt) {
    return { onboardingStartedAt: new Date() }
  }
  
  return {}
}
