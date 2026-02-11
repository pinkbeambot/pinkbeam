import { redirect } from 'next/navigation'
import { getOnboardingStatus } from '@/lib/onboarding'
import PortalDashboard from './dashboard.client'

export default async function PortalPage() {
  // TODO: Get actual user ID from auth session
  const userId = 'user-1'

  let status
  try {
    status = await getOnboardingStatus(userId)
  } catch {
    // If there's an error checking status, show the dashboard anyway
    return <PortalDashboard onboardingStatus={{ completed: true, currentStep: 'complete', stepIndex: 4, totalSteps: 4, startedAt: null }} />
  }

  // If onboarding is not completed, redirect to onboarding
  if (!status.completed) {
    redirect('/web/portal/onboarding')
  }

  return <PortalDashboard onboardingStatus={status} />
}
