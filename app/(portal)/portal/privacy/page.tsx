import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PrivacyDashboardClient } from './PrivacyDashboardClient'

export const metadata: Metadata = {
  title: 'Privacy & Data | Portal',
  description: 'Manage your privacy settings and data.',
}

export default async function PrivacyPortalPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/sign-in?redirect=/portal/privacy')
  }

  return <PrivacyDashboardClient user={user} />
}
