import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { PageHeader } from '@/components/labs-dashboard/PageHeader'
import { StatCard } from '@/components/labs-dashboard/StatCard'
import { ActivityFeed } from '@/components/labs-dashboard/ActivityFeed'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Plus, FolderKanban, CheckCircle, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/sign-in')
  }

  const userName = user.user_metadata?.name || user.email?.split('@')[0] || 'there'

  // Get real project stats
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  const [
    totalProjects,
    activeProjects,
    completedThisMonth,
    recentProjects
  ] = await Promise.all([
    // Total projects count
    prisma.project.count(),
    
    // Active projects (IN_PROGRESS, REVIEW, ACCEPTED)
    prisma.project.count({
      where: {
        status: {
          in: ['IN_PROGRESS', 'REVIEW', 'ACCEPTED']
        }
      }
    }),
    
    // Completed this month
    prisma.project.count({
      where: {
        status: 'COMPLETED',
        completedAt: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      }
    }),
    
    // Recent projects (last 5)
    prisma.project.findMany({
      take: 5,
      orderBy: { updatedAt: 'desc' },
      include: {
        client: {
          select: { id: true, name: true, email: true }
        }
      }
    })
  ])

  // Calculate projects on hold
  const onHoldProjects = await prisma.project.count({
    where: { status: 'ON_HOLD' }
  })

  const stats = [
    { 
      label: 'Active Projects', 
      value: activeProjects.toString(), 
      change: `${onHoldProjects} on hold`, 
      icon: FolderKanban 
    },
    { 
      label: 'Completed This Month', 
      value: completedThisMonth.toString(), 
      change: `of ${totalProjects} total`, 
      icon: CheckCircle 
    },
    { 
      label: 'Total Projects', 
      value: totalProjects.toString(), 
      change: 'All time', 
      icon: Clock 
    },
  ]

  // Placeholder activity data - in a real app this would come from an activity log
  const activities = [
    { id: '1', type: 'project_created' as const, title: 'New project created', description: 'Website Redesign project was created', time: '2 hours ago' },
    { id: '2', type: 'task_completed' as const, title: 'Task completed', description: 'Homepage mockup approved', time: '5 hours ago' },
    { id: '3', type: 'invoice_paid' as const, title: 'Invoice paid', description: 'Invoice #001 paid ($2,500)', time: '1 day ago' },
    { id: '4', type: 'comment_added' as const, title: 'New comment', description: 'Sarah left a comment on Brand Guidelines', time: '2 days ago' },
  ]

  return (
    <div className="space-y-8">
      <PageHeader 
        title={`Welcome back, ${userName}`}
        description="Here's what's happening with your projects"
      />

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button asChild className="bg-cyan-600 hover:bg-cyan-700">
          <Link href="/portal/admin/labs/projects">
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/portal/admin/labs/projects">
            View All Projects
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            change={stat.change}
            icon={stat.icon}
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Projects */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Projects</CardTitle>
              <CardDescription>Latest project updates</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/portal/admin/labs/projects">
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentProjects.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No projects yet</p>
            ) : (
              <div className="space-y-3">
                {recentProjects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/portal/admin/labs/projects/${project.id}`}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted transition-colors"
                  >
                    <div>
                      <p className="font-medium">{project.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {project.client?.name || project.client?.email} • Updated {format(new Date(project.updatedAt), 'MMM d')}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from your projects</CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityFeed activities={activities} />
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks to get things done</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Link 
              href="/portal/admin/labs/projects" 
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                <FolderKanban className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <p className="font-medium">Create a Project</p>
                <p className="text-sm text-muted-foreground">Start tracking your work</p>
              </div>
            </Link>
            
            <Link 
              href="/portal/admin/labs/projects" 
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <p className="font-medium">View Completed</p>
                <p className="text-sm text-muted-foreground">See finished projects</p>
              </div>
            </Link>
            
            <Link 
              href="/portal/admin/labs/settings" 
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <p className="font-medium">Dashboard Settings</p>
                <p className="text-sm text-muted-foreground">Customize your view</p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
