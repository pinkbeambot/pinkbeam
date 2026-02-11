import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DocumentsView from './documents.client'

export default async function DocumentsPage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/sign-in?redirect=/solutions/dashboard/documents')
  }

  return <DocumentsView user={user} />
}
