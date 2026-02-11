import { redirect } from 'next/navigation'
import { getOnboardingStatus } from '@/lib/onboarding'
import OnboardingPage from './page.client'

export default async function OnboardingServerPage() {
  // TODO: Get actual user ID from auth session
  const userId = 'user-1'

  let status
  try {
    status = await getOnboardingStatus(userId)
  } catch {
    // If user not found or other error, redirect to dashboard
    redirect('/web/portal')
  }

  // If onboarding is already completed, redirect to dashboard
  if (status.completed) {
    redirect('/web/portal')
  }

  return <OnboardingPage initialStatus={status} />
}
