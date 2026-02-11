import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SolutionsSidebar } from './components/SolutionsSidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/sign-in?redirect=/solutions/dashboard')
  }

  return (
    <div className="min-h-screen bg-background">
      <SolutionsSidebar user={user} />
      
      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
