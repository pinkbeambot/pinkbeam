'use client'

import Link from 'next/link'
import {
  Briefcase,
  Calendar,
  User as UserIcon,
  Clock,
  CheckCircle,
  ArrowLeft,
  FileText,
  MessageSquare,
  MoreHorizontal
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FadeIn } from '@/components/animations'
import type { User } from '@supabase/supabase-js'

interface EngagementsViewProps {
  user: User
}

// Mock data - will be replaced with real API calls
const engagements = [
  { 
    id: '1', 
    name: 'Digital Transformation Strategy', 
    type: 'Strategy Consulting',
    status: 'active', 
    startDate: '2026-01-15',
    consultant: 'Sarah Chen',
    consultantRole: 'Principal Consultant',
    progress: 75,
    nextMilestone: 'Strategy Presentation',
    description: 'Comprehensive digital transformation roadmap including technology assessment, process optimization, and change management strategy.',
    recentActivity: [
      { text: 'Roadmap v2 uploaded', time: '2 days ago' },
      { text: 'Stakeholder interviews completed', time: '1 week ago' },
    ]
  },
  { 
    id: '2', 
    name: 'Process Automation Assessment', 
    type: 'Assessment',
    status: 'active', 
    startDate: '2026-02-01',
    consultant: 'Marcus Johnson',
    consultantRole: 'Senior Consultant',
    progress: 40,
    nextMilestone: 'Gap Analysis Report',
    description: 'Analysis of current processes and identification of automation opportunities across operations and customer service.',
    recentActivity: [
      { text: 'Process maps delivered', time: '1 week ago' },
      { text: 'Discovery workshop completed', time: '2 weeks ago' },
    ]
  },
  { 
    id: '3', 
    name: 'AI Strategy Workshop', 
    type: 'Workshop',
    status: 'completed', 
    startDate: '2025-11-01',
    endDate: '2025-12-15',
    consultant: 'Dr. Emily Rodriguez',
    consultantRole: 'AI Strategist',
    progress: 100,
    nextMilestone: null,
    description: 'Two-day intensive workshop on AI adoption strategy, use case identification, and implementation roadmap.',
    recentActivity: [
      { text: 'Final report delivered', time: '1 month ago' },
      { text: 'Workshop completed', time: '2 months ago' },
    ]
  },
  { 
    id: '4', 
    name: 'Technology Architecture Review', 
    type: 'Assessment',
    status: 'planning', 
    startDate: '2026-03-01',
    consultant: 'James Wilson',
    consultantRole: 'Solution Architect',
    progress: 10,
    nextMilestone: 'Kickoff Meeting',
    description: 'Comprehensive review of current technology architecture with recommendations for modernization and scalability.',
    recentActivity: [
      { text: 'Statement of work signed', time: '3 days ago' },
    ]
  },
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

function EngagementCard({ engagement }: { engagement: typeof engagements[0] }) {
  return (
    <Card className="hover:border-amber-500/30 transition-colors">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
          {/* Left: Main Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold">{engagement.name}</h3>
                  <Badge variant="outline" className={getStatusColor(engagement.status)}>
                    {engagement.status}
                  </Badge>
                </div>
                <p className="text-sm text-amber-500 font-medium">{engagement.type}</p>
              </div>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">{engagement.description}</p>
            
            {/* Progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{engagement.progress}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 rounded-full transition-all"
                  style={{ width: `${engagement.progress}%` }}
                />
              </div>
              {engagement.nextMilestone && (
                <p className="text-xs text-muted-foreground mt-1">
                  Next milestone: <span className="text-amber-500">{engagement.nextMilestone}</span>
                </p>
              )}
            </div>
            
            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>Started {new Date(engagement.startDate).toLocaleDateString()}</span>
              </div>
              {engagement.endDate && (
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" />
                  <span>Completed {new Date(engagement.endDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Right: Consultant & Activity */}
          <div className="lg:w-64 space-y-4">
            {/* Consultant */}
            <div className="p-4 rounded-lg bg-muted">
              <p className="text-xs text-muted-foreground mb-2">Lead Consultant</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="font-medium text-sm">{engagement.consultant}</p>
                  <p className="text-xs text-muted-foreground">{engagement.consultantRole}</p>
                </div>
              </div>
            </div>
            
            {/* Recent Activity */}
            <div>
              <p className="text-xs text-muted-foreground mb-2">Recent Activity</p>
              <div className="space-y-2">
                {engagement.recentActivity.map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <Clock className="w-3 h-3 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm">{activity.text}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <FileText className="w-4 h-4 mr-1.5" />
                Files
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <MessageSquare className="w-4 h-4 mr-1.5" />
                Message
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function EngagementsView({ user }: EngagementsViewProps) {
  const activeEngagements = engagements.filter(e => e.status === 'active' || e.status === 'planning')
  const completedEngagements = engagements.filter(e => e.status === 'completed')

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeIn>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/portal/admin/solutions">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Engagements</h1>
            <p className="text-muted-foreground">Manage your consulting projects and view progress</p>
          </div>
        </div>
      </FadeIn>

      {/* Stats */}
      <FadeIn delay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold">{activeEngagements.length}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-amber-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{completedEngagements.length}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{engagements.length}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-violet-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </FadeIn>

      {/* Tabs */}
      <FadeIn delay={0.2}>
        <Tabs defaultValue="active" className="w-full">
          <TabsList>
            <TabsTrigger value="active">Active ({activeEngagements.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedEngagements.length})</TabsTrigger>
            <TabsTrigger value="all">All ({engagements.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="mt-6 space-y-4">
            {activeEngagements.map((engagement) => (
              <EngagementCard key={engagement.id} engagement={engagement} />
            ))}
          </TabsContent>
          
          <TabsContent value="completed" className="mt-6 space-y-4">
            {completedEngagements.map((engagement) => (
              <EngagementCard key={engagement.id} engagement={engagement} />
            ))}
          </TabsContent>
          
          <TabsContent value="all" className="mt-6 space-y-4">
            {engagements.map((engagement) => (
              <EngagementCard key={engagement.id} engagement={engagement} />
            ))}
          </TabsContent>
        </Tabs>
      </FadeIn>
    </div>
  )
}
