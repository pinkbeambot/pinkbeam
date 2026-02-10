'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Loader2, BarChart3, Clock, Shield, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FadeIn } from '@/components/animations'

interface ReportData {
  funnel: Record<string, number>
  byCategory: Record<string, number>
  byPriority: Record<string, number>
  avgResolutionHours: number
  slaComplianceRate: number
  totalTickets: number
  openTickets: number
  breachedTickets: number
  volumeByMonth: Record<string, number>
}

const statusLabels: Record<string, string> = {
  OPEN: 'Open',
  IN_PROGRESS: 'In Progress',
  WAITING_CLIENT: 'Waiting',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
}

const statusColors: Record<string, string> = {
  OPEN: '#3b82f6',
  IN_PROGRESS: '#f59e0b',
  WAITING_CLIENT: '#a855f7',
  RESOLVED: '#22c55e',
  CLOSED: '#6b7280',
}

const categoryLabels: Record<string, string> = {
  GENERAL: 'General',
  BUG: 'Bug',
  FEATURE_REQUEST: 'Feature',
  BILLING: 'Billing',
  TECHNICAL: 'Technical',
}

const priorityLabels: Record<string, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  URGENT: 'Urgent',
}

const priorityColors: Record<string, string> = {
  LOW: '#3b82f6',
  MEDIUM: '#f59e0b',
  HIGH: '#f97316',
  URGENT: '#ef4444',
}

export default function TicketReportsPage() {
  const [data, setData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchReports() {
      try {
        const res = await fetch('/api/tickets/reports')
        const json = await res.json()
        if (json.success) {
          setData(json.data)
        } else {
          setError('Failed to load reports')
        }
      } catch {
        setError('Failed to load reports')
      } finally {
        setLoading(false)
      }
    }
    fetchReports()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">{error}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    )
  }

  const totalFunnel = Object.values(data.funnel).reduce((a, b) => a + b, 0) || 1
  const totalCategory = Object.values(data.byCategory).reduce((a, b) => a + b, 0) || 1
  const monthKeys = Object.keys(data.volumeByMonth).sort()
  const maxVolume = Math.max(...Object.values(data.volumeByMonth), 1)

  return (
    <div className="space-y-6">
      <FadeIn>
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/web/admin/support">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tickets
          </Link>
        </Button>
        <div className="flex items-center gap-3">
          <BarChart3 className="w-6 h-6 text-violet-500" />
          <h1 className="text-3xl font-bold">Support Reports</h1>
        </div>
      </FadeIn>

      {/* KPI Cards */}
      <FadeIn delay={0.1}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold">{data.totalTickets}</p>
              <p className="text-sm text-muted-foreground">Total Tickets</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-blue-500">{data.openTickets}</p>
              <p className="text-sm text-muted-foreground">Open Tickets</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-1">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <p className="text-3xl font-bold">
                  {data.avgResolutionHours > 24
                    ? `${Math.round(data.avgResolutionHours / 24)}d`
                    : `${data.avgResolutionHours}h`}
                </p>
              </div>
              <p className="text-sm text-muted-foreground">Avg Resolution Time</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-1">
                <Shield className={`w-5 h-5 ${data.slaComplianceRate >= 90 ? 'text-green-500' : data.slaComplianceRate >= 70 ? 'text-amber-500' : 'text-red-500'}`} />
                <p className="text-3xl font-bold">{data.slaComplianceRate}%</p>
              </div>
              <p className="text-sm text-muted-foreground">SLA Compliance</p>
              {data.breachedTickets > 0 && (
                <p className="text-xs text-red-500 mt-1 flex items-center justify-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {data.breachedTickets} breached
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Funnel */}
        <FadeIn delay={0.2}>
          <Card>
            <CardHeader>
              <CardTitle>Ticket Status Distribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {['OPEN', 'IN_PROGRESS', 'WAITING_CLIENT', 'RESOLVED', 'CLOSED'].map((status) => {
                const count = data.funnel[status] || 0
                const pct = Math.round((count / totalFunnel) * 100)
                return (
                  <div key={status} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{statusLabels[status]}</span>
                      <span className="text-muted-foreground">{count} ({pct}%)</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: statusColors[status],
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </FadeIn>

        {/* By Category */}
        <FadeIn delay={0.25}>
          <Card>
            <CardHeader>
              <CardTitle>Tickets by Category</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(data.byCategory)
                .sort(([, a], [, b]) => b - a)
                .map(([category, count]) => {
                  const pct = Math.round((count / totalCategory) * 100)
                  return (
                    <div key={category} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{categoryLabels[category] || category}</Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-violet-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-16 text-right">
                          {count} ({pct}%)
                        </span>
                      </div>
                    </div>
                  )
                })}
            </CardContent>
          </Card>
        </FadeIn>

        {/* By Priority */}
        <FadeIn delay={0.3}>
          <Card>
            <CardHeader>
              <CardTitle>Tickets by Priority</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {['URGENT', 'HIGH', 'MEDIUM', 'LOW'].map((priority) => {
                const count = data.byPriority[priority] || 0
                return (
                  <div key={priority} className="flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className="min-w-[70px] justify-center"
                      style={{
                        borderColor: `${priorityColors[priority]}33`,
                        color: priorityColors[priority],
                        backgroundColor: `${priorityColors[priority]}11`,
                      }}
                    >
                      {priorityLabels[priority]}
                    </Badge>
                    <span className="text-2xl font-bold" style={{ color: priorityColors[priority] }}>
                      {count}
                    </span>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </FadeIn>

        {/* Volume Chart */}
        <FadeIn delay={0.35}>
          <Card>
            <CardHeader>
              <CardTitle>Ticket Volume (Last 6 Months)</CardTitle>
            </CardHeader>
            <CardContent>
              {monthKeys.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No data yet</p>
              ) : (
                <div className="flex items-end gap-2 h-40">
                  {monthKeys.map((month) => {
                    const count = data.volumeByMonth[month] || 0
                    const heightPct = (count / maxVolume) * 100
                    const label = new Date(month + '-01').toLocaleDateString('en-US', { month: 'short' })
                    return (
                      <div key={month} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-xs font-medium">{count}</span>
                        <div className="w-full bg-muted rounded-t relative" style={{ height: '100%' }}>
                          <div
                            className="absolute bottom-0 w-full bg-violet-500 rounded-t transition-all"
                            style={{ height: `${heightPct}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{label}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </div>
  )
}
