'use client'

import Link from 'next/link'
import { 
  Briefcase, 
  FileText, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  Phone,
  Download,
  ChevronRight,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FadeIn } from '@/components/animations'
import type { User } from '@supabase/supabase-js'

interface DashboardHomeProps {
  user: User
  profile: any
}

// Mock data - will be replaced with real API calls
const stats = [
  { label: 'Active Engagements', value: '2', icon: Briefcase, color: 'amber' },
  { label: 'Recent Deliverables', value: '5', icon: FileText, color: 'violet' },
  { label: 'Upcoming Meetings', value: '3', icon: Calendar, color: 'amber' },
  { label: 'Completed', value: '12', icon: CheckCircle, color: 'green' },
]

const engagements = [
  { 
    id: '1', 
    name: 'Digital Transformation Strategy', 
    type: 'Strategy Consulting',
    status: 'active', 
    startDate: '2026-01-15',
    consultant: 'Sarah Chen',
    progress: 75,
    nextMilestone: 'Strategy Presentation'
  },
  { 
    id: '2', 
    name: 'Process Automation Assessment', 
    type: 'Assessment',
    status: 'active', 
    startDate: '2026-02-01',
    consultant: 'Marcus Johnson',
    progress: 40,
    nextMilestone: 'Gap Analysis Report'
  },
]

const recentDeliverables = [
  { id: 1, title: 'Digital Transformation Roadmap v2.pdf', engagement: 'Digital Transformation Strategy', date: '2 days ago', type: 'pdf' },
  { id: 2, title: 'Current State Process Maps.pptx', engagement: 'Process Automation Assessment', date: '1 week ago', type: 'ppt' },
  { id: 3, title: 'Stakeholder Interview Summary.docx', engagement: 'Digital Transformation Strategy', date: '1 week ago', type: 'doc' },
]

const upcomingMeetings = [
  { id: 1, title: 'Strategy Review Call', date: 'Today, 2:00 PM', duration: '60 min', type: 'video' },
  { id: 2, title: 'Weekly Sync', date: 'Thu, Feb 12, 10:00 AM', duration: '30 min', type: 'video' },
  { id: 3, title: 'Q1 Planning Session', date: 'Mon, Feb 16, 9:00 AM', duration: '120 min', type: 'in-person' },
]

const recentActivity = [
  { id: 1, text: 'New deliverable uploaded: Digital Transformation Roadmap v2', time: '2 hours ago', type: 'deliverable' },
  { id: 2, text: 'Meeting scheduled: Strategy Review Call', time: '1 day ago', type: 'meeting' },
  { id: 3, text: 'Milestone completed: Discovery Phase', time: '2 days ago', type: 'milestone' },
  { id: 4, text: 'Comment on Process Automation Assessment', time: '3 days ago', type: 'comment' },
]

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    'active': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    'completed': 'bg-green-500/10 text-green-500 border-green-500/20',
    'on-hold': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    'planning': 'bg-violet-500/10 text-violet-500 border-violet-500/20',
  }
  return colors[status] || 'bg-gray-500/10 text-gray-500'
}

function getFileIcon(type: string) {
  switch (type) {
    case 'pdf':
      return <div className="w-8 h-8 rounded bg-red-500/10 flex items-center justify-center"><span className="text-xs font-bold text-red-500">PDF</span></div>
    case 'ppt':
      return <div className="w-8 h-8 rounded bg-orange-500/10 flex items-center justify-center"><span className="text-xs font-bold text-orange-500">PPT</span></div>
    case 'doc':
      return <div className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center"><span className="text-xs font-bold text-blue-500">DOC</span></div>
    default:
      return <div className="w-8 h-8 rounded bg-muted flex items-center justify-center"><FileText className="w-4 h-4" /></div>
  }
}

export default function DashboardHome({ user, profile }: DashboardHomeProps) {
  const userName = profile?.full_name || user.email?.split('@')[0] || 'Client'
  const companyName = profile?.company_name || 'Your Organization'

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <FadeIn>
        <Card className="bg-gradient-to-r from-amber-600 to-amber-500 border-0 text-white">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-1">Welcome back, {userName}!</h2>
                  <p className="text-white/80 text-sm">
                    {companyName} • Here&apos;s what&apos;s happening with your engagements
                  </p>
                </div>
              </div>
              <Button variant="secondary" size="sm" asChild>
                <Link href="/solutions/dashboard/schedule">
                  <Phone className="w-4 h-4 mr-2" />
                  Schedule Call
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </FadeIn>

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
        {/* Active Engagements */}
        <FadeIn delay={0.2} className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Active Engagements</CardTitle>
                <CardDescription>Your ongoing consulting projects</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/solutions/dashboard/engagements">
                  View All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {engagements.map((engagement) => (
                <Link 
                  key={engagement.id} 
                  href={`/solutions/dashboard/engagements`}
                  className="block p-4 rounded-lg border hover:border-amber-500/30 hover:bg-amber-500/5 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold truncate">{engagement.name}</h3>
                        <Badge variant="outline" className={getStatusColor(engagement.status)}>
                          {engagement.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {engagement.type} • Started {new Date(engagement.startDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-amber-500">
                        Consultant: {engagement.consultant}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{engagement.progress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-amber-500 rounded-full transition-all"
                        style={{ width: `${engagement.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Next: {engagement.nextMilestone}
                    </p>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </FadeIn>

        {/* Upcoming Meetings */}
        <FadeIn delay={0.3}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Upcoming</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/solutions/dashboard/schedule">
                  <Calendar className="w-4 h-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingMeetings.map((meeting) => (
                  <div key={meeting.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-amber-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{meeting.title}</p>
                      <p className="text-xs text-muted-foreground">{meeting.date}</p>
                      <p className="text-xs text-amber-500">{meeting.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link href="/solutions/dashboard/schedule">
                  Schedule a Call
                </Link>
              </Button>
            </CardContent>
          </Card>
        </FadeIn>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Deliverables */}
        <FadeIn delay={0.4}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Deliverables</CardTitle>
                <CardDescription>Latest documents and files</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/solutions/dashboard/documents">
                  View All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentDeliverables.map((deliverable) => (
                  <div 
                    key={deliverable.id} 
                    className="flex items-center gap-3 p-3 rounded-lg border hover:border-amber-500/30 hover:bg-amber-500/5 transition-colors cursor-pointer group"
                  >
                    {getFileIcon(deliverable.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate group-hover:text-amber-500 transition-colors">{deliverable.title}</p>
                      <p className="text-xs text-muted-foreground">{deliverable.engagement} • {deliverable.date}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        {/* Recent Activity */}
        <FadeIn delay={0.5}>
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                      {activity.type === 'deliverable' && <FileText className="w-4 h-4 text-amber-500" />}
                      {activity.type === 'meeting' && <Calendar className="w-4 h-4 text-amber-500" />}
                      {activity.type === 'milestone' && <CheckCircle className="w-4 h-4 text-green-500" />}
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
      <FadeIn delay={0.6}>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" asChild>
                <Link href="/solutions/dashboard/schedule">
                  <Phone className="w-4 h-4 mr-2" />
                  Schedule a Call
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/solutions/dashboard/documents">
                  <FileText className="w-4 h-4 mr-2" />
                  View Documents
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/solutions/dashboard/engagements">
                  <Briefcase className="w-4 h-4 mr-2" />
                  View Engagements
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  )
}
