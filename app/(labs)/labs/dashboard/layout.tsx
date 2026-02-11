import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardSidebar } from './components/DashboardSidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/sign-in')
  }

  const userData = {
    email: user.email || '',
    name: user.user_metadata?.name || user.email?.split('@')[0],
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar user={userData} />
      
      {/* Main Content */}
      <main className="lg:ml-[250px] min-h-screen">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
