import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { onboardingProjectSchema } from '@/lib/validation'
import type { ProjectStatus } from '@prisma/client'

// POST /api/onboarding/project - Create initial project
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = onboardingProjectSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.flatten() },
        { status: 400 }
      )
    }

    const userId = 'user-1' // TODO: Get from auth session
    const data = result.data

    // Get user to ensure they exist and get their services
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { servicesNeeded: true },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Create the project
    const project = await prisma.project.create({
      data: {
        title: data.projectName,
        description: data.description || null,
        clientId: userId,
        status: 'LEAD' as ProjectStatus,
        services: (user.servicesNeeded as string[] || []).map(s => 
          s.toUpperCase()
        ) as ('DESIGN' | 'DEVELOPMENT' | 'SEO' | 'MAINTENANCE' | 'CONSULTING')[],
      },
    })

    // Update user's onboarding step
    await prisma.user.update({
      where: { id: userId },
      data: {
        onboardingStep: 'tutorial',
      },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'project_created_via_onboarding',
        entityType: 'Project',
        entityId: project.id,
        userId,
        metadata: { 
          projectName: data.projectName,
          budgetRange: data.budgetRange,
          timeline: data.timeline,
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: { 
        message: 'Project created successfully',
        projectId: project.id,
      },
    })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    )
  }
}
