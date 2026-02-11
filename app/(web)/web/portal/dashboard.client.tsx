'use client'

import Link from 'next/link'
import { 
  FolderKanban, 
  Receipt, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  Plus,
  Sparkles,
  Rocket,
  User
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FadeIn } from '@/components/animations'
import type { OnboardingStatus } from '@/lib/onboarding'

interface PortalDashboardProps {
  onboardingStatus: OnboardingStatus
}

// Mock data - will be replaced with real API calls
const stats = [
  { label: 'Active Projects', value: '3', icon: FolderKanban, color: 'violet' },
  { label: 'Open Invoices', value: '2', icon: Receipt, color: 'amber' },
  { label: 'Pending Tasks', value: '5', icon: Clock, color: 'blue' },
  { label: 'Completed', value: '12', icon: CheckCircle, color: 'green' },
]

const projects = [
  { 
    id: '1', 
    name: 'Acme Corp Website Redesign', 
    status: 'in-progress', 
    progress: 65,
    dueDate: '2026-03-15',
    phase: 'Development'
  },
  { 
    id: '2', 
    name: 'E-commerce Platform', 
    status: 'planning', 
    progress: 15,
    dueDate: '2026-04-01',
    phase: 'Discovery'
  },
  { 
    id: '3', 
    name: 'Marketing Landing Pages', 
    status: 'review', 
    progress: 90,
    dueDate: '2026-02-20',
    phase: 'Review'
  },
]

const recentActivity = [
  { id: 1, text: 'New design mockups uploaded', time: '2 hours ago', type: 'file' },
  { id: 2, text: 'Invoice #INV-001 paid', time: '1 day ago', type: 'payment' },
  { id: 3, text: 'Project milestone completed', time: '2 days ago', type: 'milestone' },
  { id: 4, text: 'New comment on Acme Corp project', time: '3 days ago', type: 'comment' },
]

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    'in-progress': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    'planning': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    'review': 'bg-violet-500/10 text-violet-500 border-violet-500/20',
    'completed': 'bg-green-500/10 text-green-500 border-green-500/20',
  }
  return colors[status] || 'bg-gray-500/10 text-gray-500'
}

export default function PortalDashboard({ onboardingStatus }: PortalDashboardProps) {
  const isNewUser = !onboardingStatus.startedAt

  return (
    <div className="space-y-8">
      {/* Welcome Banner for new users */}
      {isNewUser && (
        <FadeIn>
          <Card className="bg-gradient-to-r from-violet-500 to-fuchsia-500 border-0 text-white">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-1">Welcome to your Client Portal!</h2>
                    <p className="text-white/80 text-sm">
                      Everything you need to manage your projects in one place.
                    </p>
                  </div>
                </div>
                <Button variant="secondary" size="sm" asChild>
                  <Link href="/web/portal/onboarding">
                    <Rocket className="w-4 h-4 mr-2" />
                    Complete Setup
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      )}

      {/* Header */}
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              {isNewUser ? 'Welcome!' : 'Dashboard'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isNewUser 
                ? 'Complete your setup to get the most out of your portal.'
                : "Welcome back! Here's what's happening with your projects."
              }
            </p>
          </div>
          <Button asChild>
            <Link href="/web/portal/support">
              <Plus className="w-4 h-4 mr-2" />
              New Support Ticket
            </Link>
          </Button>
        </div>
      </FadeIn>

      {/* Onboarding Progress Card (if not completed) */}
      {!isNewUser && !onboardingStatus.completed && (
        <FadeIn delay={0.05}>
          <Card className="border-amber-200 bg-amber-50/50">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Complete Your Profile</h3>
                    <p className="text-sm text-muted-foreground">
                      You&apos;re on step {onboardingStatus.stepIndex + 1} of {onboardingStatus.totalSteps}. 
                      Finish setting up your account.
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/web/portal/onboarding">
                    Continue Setup
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      )}

      {/* Stats */}
      <FadeIn delay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.label}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                      <p className="text-3xl font-bold mt-2">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-lg bg-${stat.color}-500/10 flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 text-${stat.color}-500`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Projects */}
        <FadeIn delay={0.2} className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Active Projects</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/web/portal/projects">
                  View All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {projects.map((project) => (
                <Link 
                  key={project.id} 
                  href={`/web/portal/projects/${project.id}`}
                  className="block p-4 rounded-lg border hover:border-violet-500/30 hover:bg-violet-500/5 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold truncate">{project.name}</h3>
                        <Badge variant="outline" className={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Phase: {project.phase} • Due: {new Date(project.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-violet-500 rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </FadeIn>

        {/* Activity Feed */}
        <FadeIn delay={0.3}>
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                      {activity.type === 'file' && <FolderKanban className="w-4 h-4 text-violet-500" />}
                      {activity.type === 'payment' && <Receipt className="w-4 h-4 text-green-500" />}
                      {activity.type === 'milestone' && <CheckCircle className="w-4 h-4 text-blue-500" />}
                      {activity.type === 'comment' && <AlertCircle className="w-4 h-4 text-amber-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{activity.text}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </div>

      {/* Quick Actions */}
      <FadeIn delay={0.4}>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" asChild>
                <Link href="/web/portal/support">Submit Ticket</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/web/portal/files">Upload Files</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/web/portal/invoices">View Invoices</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  )
}
