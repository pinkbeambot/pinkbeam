'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  DollarSign,
  FolderKanban,
  Users,
  FileText,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Plus,
  Clock,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FadeIn } from '@/components/animations'

interface QuoteRequest {
  id: string
  fullName: string
  company: string | null
  projectType: string
  services: string[]
  budgetRange: string
  status: string
  createdAt: string
}

// Active projects and deadlines are still mock — will be connected in WEB-013
const activeProjects = [
  { id: '1', name: 'Acme Corp Website', client: 'Acme Corp', progress: 65, dueDate: '2026-03-15', status: 'in-progress' },
  { id: '2', name: 'E-commerce Platform', client: 'TechStart Inc', progress: 15, dueDate: '2026-04-01', status: 'planning' },
  { id: '3', name: 'Marketing Pages', client: 'Marketing Pro', progress: 90, dueDate: '2026-02-20', status: 'review' },
]

const upcomingDeadlines = [
  { task: 'Homepage design review', project: 'Acme Corp Website', date: '2026-02-20', daysLeft: 2 },
  { task: 'Launch marketing pages', project: 'Marketing Pro', date: '2026-02-22', daysLeft: 4 },
  { task: 'Client presentation', project: 'TechStart Inc', date: '2026-02-25', daysLeft: 7 },
]

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    'NEW': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    'CONTACTED': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    'QUALIFIED': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    'PROPOSAL': 'bg-violet-500/10 text-violet-500 border-violet-500/20',
    'ACCEPTED': 'bg-green-500/10 text-green-500 border-green-500/20',
    'DECLINED': 'bg-red-500/10 text-red-500 border-red-500/20',
    'in-progress': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    'planning': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    'review': 'bg-violet-500/10 text-violet-500 border-violet-500/20',
  }
  return colors[status] || 'bg-gray-500/10 text-gray-500'
}

const statusLabels: Record<string, string> = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  QUALIFIED: 'Qualified',
  PROPOSAL: 'Proposal',
  ACCEPTED: 'Accepted',
  DECLINED: 'Declined',
}

export default function AdminDashboard() {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([])
  const [quotesLoading, setQuotesLoading] = useState(true)

  useEffect(() => {
    async function fetchQuotes() {
      try {
        const res = await fetch('/api/quotes')
        const data = await res.json()
        if (data.success) {
          setQuotes(data.data)
        }
      } catch {
        console.error('Failed to fetch quotes')
      } finally {
        setQuotesLoading(false)
      }
    }
    fetchQuotes()
  }, [])

  const pendingQuotes = quotes.filter(
    (q) => !['ACCEPTED', 'DECLINED'].includes(q.status)
  ).length
  const newQuotes = quotes.filter((q) => q.status === 'NEW').length
  const recentQuotes = quotes.slice(0, 4)

  const kpis = [
    {
      label: 'Revenue (MTD)',
      value: '$12,450',
      change: '+12%',
      trend: 'up' as const,
      icon: DollarSign
    },
    {
      label: 'Active Projects',
      value: String(activeProjects.length),
      change: '+2',
      trend: 'up' as const,
      icon: FolderKanban
    },
    {
      label: 'Total Clients',
      value: '24',
      change: '+3',
      trend: 'up' as const,
      icon: Users
    },
    {
      label: 'Pending Quotes',
      value: quotesLoading ? '...' : String(pendingQuotes),
      change: newQuotes > 0 ? `${newQuotes} new` : '0 new',
      trend: newQuotes > 0 ? 'up' as const : 'down' as const,
      icon: FileText
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Overview of your agency operations
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/portal/admin/web/quotes">
                View Quotes
              </Link>
            </Button>
            <Button asChild>
              <Link href="/portal/admin/web/projects">
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Link>
            </Button>
          </div>
        </div>
      </FadeIn>

      {/* KPI Cards */}
      <FadeIn delay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi) => {
            const Icon = kpi.icon
            const TrendIcon = kpi.trend === 'up' ? TrendingUp : TrendingDown
            return (
              <Card key={kpi.label}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{kpi.label}</p>
                      <p className="text-3xl font-bold mt-2">{kpi.value}</p>
                      <div className={`flex items-center gap-1 text-sm mt-1 ${kpi.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                        <TrendIcon className="w-4 h-4" />
                        {kpi.change}
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-violet-500/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-violet-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Quotes */}
        <FadeIn delay={0.2}>
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Quote Requests</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/portal/admin/web/quotes">
                  View All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {quotesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : recentQuotes.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No quote requests yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentQuotes.map((quote) => (
                    <div key={quote.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <p className="font-medium">{quote.fullName}</p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {quote.projectType.replace(/-/g, ' ')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">{quote.budgetRange}</p>
                        <Badge variant="outline" className={getStatusColor(quote.status)}>
                          {statusLabels[quote.status] || quote.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </FadeIn>

        {/* Active Projects */}
        <FadeIn delay={0.3}>
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Active Projects</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/portal/admin/web/projects">
                  View All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeProjects.map((project) => (
                  <div key={project.id} className="p-3 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium">{project.name}</p>
                        <p className="text-sm text-muted-foreground">{project.client}</p>
                      </div>
                      <Badge variant="outline" className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </div>
                    <div>
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
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </div>

      {/* Upcoming Deadlines */}
      <FadeIn delay={0.4}>
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingDeadlines.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.daysLeft <= 3 ? 'bg-red-500/10' : 'bg-amber-500/10'}`}>
                      {item.daysLeft <= 3 ? <AlertCircle className="w-5 h-5 text-red-500" /> : <Clock className="w-5 h-5 text-amber-500" />}
                    </div>
                    <div>
                      <p className="font-medium">{item.task}</p>
                      <p className="text-sm text-muted-foreground">{item.project}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{new Date(item.date).toLocaleDateString()}</p>
                    <p className={`text-sm ${item.daysLeft <= 3 ? 'text-red-500' : 'text-muted-foreground'}`}>
                      {item.daysLeft} days left
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  )
}
