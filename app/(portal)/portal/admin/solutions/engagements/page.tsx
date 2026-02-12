import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import EngagementsView from './engagements.client'

export default async function EngagementsPage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/sign-in?redirect=/portal/admin/solutions/engagements')
  }

  return <EngagementsView user={user} />
}
