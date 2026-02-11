import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import SettingsView from './settings.client'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/sign-in?redirect=/solutions/dashboard/settings')
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return <SettingsView user={user} profile={profile} />
}
