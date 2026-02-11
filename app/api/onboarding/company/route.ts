import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { onboardingCompanySchema } from '@/lib/validation'

// POST /api/onboarding/company - Save company details
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = onboardingCompanySchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.flatten() },
        { status: 400 }
      )
    }

    const userId = 'user-1' // TODO: Get from auth session
    const data = result.data

    await prisma.user.update({
      where: { id: userId },
      data: {
        industry: data.industry,
        companySize: data.companySize,
        servicesNeeded: data.servicesNeeded,
        onboardingStep: 'project',
      },
    })

    return NextResponse.json({
      success: true,
      data: { message: 'Company details updated successfully' },
    })
  } catch (error) {
    console.error('Error updating company details:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update company details' },
      { status: 500 }
    )
  }
}
