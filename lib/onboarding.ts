import { prisma } from './prisma'

export type OnboardingStep = 'profile' | 'company' | 'project' | 'tutorial' | 'complete'

const STEP_ORDER: OnboardingStep[] = ['profile', 'company', 'project', 'tutorial', 'complete']

export interface OnboardingStatus {
  completed: boolean
  currentStep: OnboardingStep
  stepIndex: number
  totalSteps: number
  startedAt: Date | null
}

export interface OnboardingData {
  name?: string
  phone?: string
  company?: string
  website?: string
  companySize?: string
  industry?: string
  servicesNeeded?: string[]
}

/** Get the current onboarding status for a user */
export async function getOnboardingStatus(userId: string): Promise<OnboardingStatus> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      onboardingCompleted: true,
      onboardingStep: true,
      onboardingStartedAt: true,
    },
  })

  if (!user) {
    throw new Error('User not found')
  }

  const currentStep = (user.onboardingStep as OnboardingStep) || 'profile'
  const stepIndex = STEP_ORDER.indexOf(currentStep)

  return {
    completed: user.onboardingCompleted,
    currentStep,
    stepIndex: stepIndex === -1 ? 0 : stepIndex,
    totalSteps: STEP_ORDER.length - 1, // excluding 'complete'
    startedAt: user.onboardingStartedAt,
  }
}

/** Update the current onboarding step for a user */
export async function updateOnboardingStep(
  userId: string,
  step: OnboardingStep
): Promise<void> {
  const updateData: Record<string, unknown> = {
    onboardingStep: step,
  }

  // Set startedAt if this is the first step and not already set
  if (step === 'profile') {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { onboardingStartedAt: true },
    })
    if (!user?.onboardingStartedAt) {
      updateData.onboardingStartedAt = new Date()
    }
  }

  await prisma.user.update({
    where: { id: userId },
    data: updateData,
  })
}

/** Mark onboarding as complete for a user */
export async function completeOnboarding(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      onboardingCompleted: true,
      onboardingStep: 'complete',
    },
  })
}

/** Update user profile data during onboarding */
export async function updateOnboardingProfile(
  userId: string,
  data: {
    name?: string
    phone?: string
    company?: string
    website?: string
  }
): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      name: data.name,
      phone: data.phone,
      company: data.company,
      website: data.website,
    },
  })
}

/** Update company details during onboarding */
export async function updateOnboardingCompany(
  userId: string,
  data: {
    companySize?: string
    industry?: string
    servicesNeeded?: string[]
  }
): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      companySize: data.companySize,
      industry: data.industry,
      servicesNeeded: data.servicesNeeded,
    },
  })
}

/** Check if user needs to complete onboarding (redirect helper) */
export async function needsOnboarding(userId: string): Promise<boolean> {
  const status = await getOnboardingStatus(userId)
  return !status.completed
}

/** Get the next step in the onboarding flow */
export function getNextStep(currentStep: OnboardingStep): OnboardingStep | null {
  const currentIndex = STEP_ORDER.indexOf(currentStep)
  if (currentIndex === -1 || currentIndex >= STEP_ORDER.length - 1) {
    return null
  }
  return STEP_ORDER[currentIndex + 1]
}

/** Get the previous step in the onboarding flow */
export function getPreviousStep(currentStep: OnboardingStep): OnboardingStep | null {
  const currentIndex = STEP_ORDER.indexOf(currentStep)
  if (currentIndex <= 0) {
    return null
  }
  return STEP_ORDER[currentIndex - 1]
}

/** Get step display name */
export function getStepDisplayName(step: OnboardingStep): string {
  const names: Record<OnboardingStep, string> = {
    profile: 'Profile',
    company: 'Company',
    project: 'Project',
    tutorial: 'Tutorial',
    complete: 'Complete',
  }
  return names[step]
}

/** Get step description */
export function getStepDescription(step: OnboardingStep): string {
  const descriptions: Record<OnboardingStep, string> = {
    profile: 'Complete your profile information',
    company: 'Tell us about your company',
    project: 'Set up your first project',
    tutorial: 'Learn about the portal',
    complete: 'You\'re all set!',
  }
  return descriptions[step]
}
