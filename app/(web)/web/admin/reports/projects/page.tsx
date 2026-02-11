'use client'

import { useState, useEffect } from 'react'
import { FadeIn } from '@/components/animations'
import { MetricCard } from '@/components/reports/MetricCard'
import { StatusPieChart } from '@/components/reports/StatusPieChart'
import { DateRangePicker } from '@/components/reports/DateRangePicker'
import { ExportButton } from '@/components/reports/ExportButton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import {
  FolderKanban,
  Clock,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { subMonths } from 'date-fns'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Funnel,
  FunnelChart,
  LabelList,
} from 'recharts'

interface ProjectData {
  byStatus: Array<{
    status: string
    count: number
    budget: number
  }>
  onTimeRate: number
  avgDuration: number
  pipeline: Array<{
    stage: string
    count: number
    value: number
  }>
  budgetVsActual: Array<{
    id: string
    title: string
    budget: number
    actual: number
    variance: number
    variancePercent: number
  }>
  totalProjects: number
  activeProjects: number
  monthlyTrend: Array<{
    month: string
    count: number
  }>
}

export default function ProjectReportPage() {
  const [data, setData] = useState<ProjectData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    startDate: subMonths(new Date(), 12),
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
        const res = await fetch(`/api/reports/projects?${params}`)
        const json = await res.json()
        if (json.success) {
          setData(json.data)
        }
      } catch (error) {
        console.error('Failed to fetch project data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [dateRange])

  const handleDateChange = (range: { startDate: Date; endDate: Date }) => {
    setDateRange(range)
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      LEAD: 'bg-blue-500/10 text-blue-500',
      QUOTED: 'bg-amber-500/10 text-amber-500',
      ACCEPTED: 'bg-green-500/10 text-green-500',
      IN_PROGRESS: 'bg-violet-500/10 text-violet-500',
      REVIEW: 'bg-pink-500/10 text-pink-500',
      COMPLETED: 'bg-emerald-500/10 text-emerald-500',
      ON_HOLD: 'bg-gray-500/10 text-gray-500',
      CANCELLED: 'bg-red-500/10 text-red-500',
    }
    return colors[status] || 'bg-gray-500/10 text-gray-500'
  }

  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Project Metrics</h1>
            <p className="text-muted-foreground mt-1">
              Track project performance, pipeline, and delivery
            </p>
          </div>
          <div className="flex items-center gap-2">
            <DateRangePicker onChange={handleDateChange} />
            <ExportButton 
              data={data?.byStatus || []} 
              filename="project-report"
              disabled={loading}
            />
          </div>
        </div>
      </FadeIn>

      {/* KPI Cards */}
      <FadeIn delay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Projects"
            value={data?.totalProjects || 0}
            subtitle="All time in range"
            icon={FolderKanban}
            loading={loading}
          />
          <MetricCard
            title="Active Projects"
            value={data?.activeProjects || 0}
            subtitle="Currently in progress"
            change={{ value: `${data?.activeProjects || 0} active`, trend: 'neutral' }}
            icon={TrendingUp}
            loading={loading}
            iconClassName="bg-violet-500/10"
          />
          <MetricCard
            title="On-Time Delivery"
            value={`${Math.round(data?.onTimeRate || 0)}%`}
            subtitle={`${data?.onTimeRate || 0 > 80 ? 'Excellent' : 'Needs improvement'}`}
            change={{ 
              value: data?.onTimeRate || 0 >= 80 ? 'On target' : 'Below target', 
              trend: data?.onTimeRate || 0 >= 80 ? 'up' : 'down' 
            }}
            icon={CheckCircle}
            loading={loading}
            iconClassName={data?.onTimeRate || 0 >= 80 ? "bg-green-500/10" : "bg-amber-500/10"}
          />
          <MetricCard
            title="Avg. Duration"
            value={`${data?.avgDuration || 0} days`}
            subtitle="Per project completion"
            icon={Clock}
            loading={loading}
            iconClassName="bg-blue-500/10"
          />
        </div>
      </FadeIn>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <FadeIn delay={0.2} className="lg:col-span-1">
          <StatusPieChart
            title="Projects by Status"
            data={data?.byStatus?.map(s => ({
              name: formatStatus(s.status),
              value: s.budget,
              count: s.count,
            })) || []}
            loading={loading}
            showCurrency
          />
        </FadeIn>

        <FadeIn delay={0.3} className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Project Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[250px] w-full" />
              ) : (
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <FunnelChart>
                      <Tooltip
                        formatter={(value, name, props) => [
                          `${(props?.payload as { count: number })?.count || 0} projects`,
                          (props?.payload as { stage: string })?.stage || ''
                        ]}
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Funnel
                        dataKey="count"
                        data={data?.pipeline || []}
                        isAnimationActive
                      >
                        <LabelList
                          position="inside"
                          fill="#fff"
                          stroke="none"
                          dataKey="stage"
                        />
                      </Funnel>
                    </FunnelChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </FadeIn>
      </div>

      {/* Budget vs Actual & Monthly Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FadeIn delay={0.4}>
          <Card>
            <CardHeader>
              <CardTitle>Budget vs Actual</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : data?.budgetVsActual?.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No budget data available
                </p>
              ) : (
                <div className="space-y-3">
                  {data?.budgetVsActual?.slice(0, 5).map((project) => (
                    <div key={project.id} className="p-3 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium truncate">{project.title}</span>
                        <Badge variant="outline" className={
                          project.variance >= 0 
                            ? 'bg-green-500/10 text-green-500' 
                            : 'bg-red-500/10 text-red-500'
                        }>
                          {project.variance >= 0 ? '+' : ''}
                          {Math.round(project.variancePercent)}%
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Budget: {formatCurrency(project.budget)}
                        </span>
                        <span className="font-medium">
                          Actual: {formatCurrency(project.actual)}
                        </span>
                      </div>
                      <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            project.variance >= 0 ? 'bg-green-500' : 'bg-red-500'
                          }`}
                          style={{ 
                            width: `${Math.min(100, (project.actual / Math.max(project.budget, 1)) * 100)}%` 
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn delay={0.5}>
          <Card>
            <CardHeader>
              <CardTitle>Monthly Project Trend</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[250px] w-full" />
              ) : (
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data?.monthlyTrend || []}>
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
                      <Bar 
                        dataKey="count" 
                        fill="#8b5cf6" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </div>
  )
}
