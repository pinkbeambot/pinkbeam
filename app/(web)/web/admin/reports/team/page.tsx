'use client'

import { useState, useEffect } from 'react'
import { FadeIn } from '@/components/animations'
import { MetricCard } from '@/components/reports/MetricCard'
import { DateRangePicker } from '@/components/reports/DateRangePicker'
import { ExportButton } from '@/components/reports/ExportButton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Users,
  CheckCircle,
  Clock,
  Activity,
  TrendingUp,
  UserCheck,
} from 'lucide-react'
import { subMonths } from 'date-fns'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts'

interface TeamData {
  members: Array<{
    id: string
    name: string
    email: string
    role: string
    ticketsAssigned: number
    ticketsResolved: number
    ticketsOpen: number
    avgResolutionTime: number
    commentsCount: number
    activityScore: number
    lastLogin: string | null
  }>
  workloadDistribution: Array<{
    name: string
    assigned: number
    resolved: number
    open: number
  }>
  utilizationRates: Array<{
    name: string
    utilization: number
  }>
  capacityPlanning: Array<{
    name: string
    currentLoad: number
    capacity: number
    available: number
    utilization: number
  }>
  totals: {
    teamSize: number
    totalTickets: number
    totalResolved: number
    resolutionRate: number
  }
  activityTrend: Array<{
    month: string
    tickets: number
    comments: number
  }>
}

export default function TeamReportPage() {
  const [data, setData] = useState<TeamData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    startDate: subMonths(new Date(), 6),
    endDate: new Date(),
  })

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const params = new URLSearchParams({
          startDate: dateRange.startDate.toISOString(),
          endDate: dateRange.endDate.toISOString(),
        })
        const res = await fetch(`/api/reports/team?${params}`)
        const json = await res.json()
        if (json.success) {
          setData(json.data)
        }
      } catch (error) {
        console.error('Failed to fetch team data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [dateRange])

  const handleDateChange = (range: { startDate: Date; endDate: Date }) => {
    setDateRange(range)
  }

  const formatDuration = (hours: number) => {
    if (hours < 1) return '< 1 hour'
    if (hours < 24) return `${Math.round(hours)} hours`
    return `${Math.round(hours / 24)} days`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Team Performance</h1>
            <p className="text-muted-foreground mt-1">
              Track team productivity, workload, and capacity
            </p>
          </div>
          <div className="flex items-center gap-2">
            <DateRangePicker onChange={handleDateChange} />
            <ExportButton 
              data={data?.members || []} 
              filename="team-report"
              disabled={loading}
            />
          </div>
        </div>
      </FadeIn>

      {/* KPI Cards */}
      <FadeIn delay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Team Size"
            value={data?.totals?.teamSize || 0}
            subtitle="Active members"
            icon={Users}
            loading={loading}
          />
          <MetricCard
            title="Total Tickets"
            value={data?.totals?.totalTickets || 0}
            subtitle="Assigned in period"
            icon={Activity}
            loading={loading}
            iconClassName="bg-violet-500/10"
          />
          <MetricCard
            title="Resolution Rate"
            value={`${data?.totals?.resolutionRate || 0}%`}
            subtitle={`${data?.totals?.totalResolved || 0} resolved`}
            change={{ 
              value: data?.totals?.resolutionRate || 0 >= 80 ? 'On target' : 'Below target', 
              trend: data?.totals?.resolutionRate || 0 >= 80 ? 'up' : 'down' 
            }}
            icon={CheckCircle}
            loading={loading}
            iconClassName={data?.totals?.resolutionRate || 0 >= 80 ? "bg-green-500/10" : "bg-amber-500/10"}
          />
          <MetricCard
            title="Avg Resolution"
            value={formatDuration(
              (data?.members?.reduce((sum, m) => sum + m.avgResolutionTime, 0) || 0) / 
              Math.max(1, data?.members?.length || 1)
            )}
            subtitle="Time to resolve"
            icon={Clock}
            loading={loading}
            iconClassName="bg-blue-500/10"
          />
        </div>
      </FadeIn>

      {/* Team Members Table */}
      <FadeIn delay={0.2}>
        <Card>
          <CardHeader>
            <CardTitle>Team Member Performance</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : data?.members?.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No team data available
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Name</th>
                      <th className="text-left py-3 px-4 font-medium">Role</th>
                      <th className="text-center py-3 px-4 font-medium">Tickets</th>
                      <th className="text-center py-3 px-4 font-medium">Resolved</th>
                      <th className="text-center py-3 px-4 font-medium">Avg Time</th>
                      <th className="text-center py-3 px-4 font-medium">Activity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.members?.map((member) => (
                      <tr key={member.id} className="border-b last:border-0 hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-xs text-muted-foreground">{member.email}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className={
                            member.role === 'ADMIN' 
                              ? 'bg-violet-500/10 text-violet-500' 
                              : 'bg-blue-500/10 text-blue-500'
                          }>
                            {member.role}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center">{member.ticketsAssigned}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={member.ticketsResolved > 0 ? 'text-green-600 font-medium' : ''}>
                            {member.ticketsResolved}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {member.avgResolutionTime > 0 
                            ? formatDuration(member.avgResolutionTime)
                            : '-'
                          }
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Progress 
                              value={Math.min(100, member.activityScore * 5)} 
                              className="h-2 w-20"
                            />
                            <span className="text-xs text-muted-foreground">
                              {member.activityScore}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </FadeIn>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FadeIn delay={0.3}>
          <Card>
            <CardHeader>
              <CardTitle>Workload Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[250px] w-full" />
              ) : (
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data?.workloadDistribution || []}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 11 }}
                        tickMargin={10}
                      />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Bar dataKey="assigned" name="Assigned" fill="#8b5cf6" />
                      <Bar dataKey="resolved" name="Resolved" fill="#22c55e" />
                      <Bar dataKey="open" name="Open" fill="#f59e0b" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn delay={0.4}>
          <Card>
            <CardHeader>
              <CardTitle>Activity Trend</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[250px] w-full" />
              ) : (
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data?.activityTrend || []}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="month" 
                        tick={{ fontSize: 12 }}
                        tickMargin={10}
                      />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="tickets" 
                        name="Tickets"
                        stroke="#8b5cf6" 
                        strokeWidth={2}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="comments" 
                        name="Comments"
                        stroke="#22c55e" 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </FadeIn>
      </div>

      {/* Capacity Planning */}
      <FadeIn delay={0.5}>
        <Card>
          <CardHeader>
            <CardTitle>Capacity Planning</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data?.capacityPlanning?.map((member) => (
                  <div 
                    key={member.name} 
                    className="p-4 rounded-lg border hover:border-violet-500/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium">{member.name}</span>
                      <Badge 
                        variant="outline"
                        className={
                          member.utilization >= 90 
                            ? 'bg-red-500/10 text-red-500'
                            : member.utilization >= 70
                            ? 'bg-amber-500/10 text-amber-500'
                            : 'bg-green-500/10 text-green-500'
                        }
                      >
                        {member.utilization}%
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Current Load</span>
                        <span>{member.currentLoad} tickets</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Capacity</span>
                        <span>{member.capacity} tickets</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Available</span>
                        <span className={member.available > 0 ? 'text-green-600 font-medium' : ''}>
                          {member.available} tickets
                        </span>
                      </div>
                      <Progress 
                        value={member.utilization} 
                        className="h-2"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  )
}
