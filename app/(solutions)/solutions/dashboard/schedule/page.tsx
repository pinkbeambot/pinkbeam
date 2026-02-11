import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ScheduleView from './schedule.client'

export default async function SchedulePage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/sign-in?redirect=/solutions/dashboard/schedule')
  }

  return <ScheduleView user={user} />
}
