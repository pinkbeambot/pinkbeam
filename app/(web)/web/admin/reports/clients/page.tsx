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
import { Progress } from '@/components/ui/progress'
import {
  Users,
  TrendingUp,
  DollarSign,
  Heart,
  UserPlus,
  Activity,
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
  LineChart,
  Line,
} from 'recharts'

interface ClientData {
  totals: {
    totalClients: number
    activeClients: number
    avgCLV: number
    totalRevenue: number
  }
  acquisitionTrend: Array<{
    month: string
    newClients: number
  }>
  topClients: Array<{
    id: string
    name: string
    email: string
    company: string | null
    totalRevenue: number
    totalProjects: number
    activeProjects: number
    avgProjectValue: number
    tenureDays: number
    openTickets: number
    healthScore: number
    joinedAt: string
    lastLogin: string | null
  }>
  healthDistribution: {
    healthy: number
    atRisk: number
    critical: number
  }
  clientList: Array<{
    id: string
    name: string
    email: string
    company: string | null
    totalRevenue: number
    totalProjects: number
    activeProjects: number
    avgProjectValue: number
    tenureDays: number
    openTickets: number
    healthScore: number
    joinedAt: string
    lastLogin: string | null
  }>
}

export default function ClientReportPage() {
  const [data, setData] = useState<ClientData | null>(null)
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
        const res = await fetch(`/api/reports/clients?${params}`)
        const json = await res.json()
        if (json.success) {
          setData(json.data)
        }
      } catch (error) {
        console.error('Failed to fetch client data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [dateRange])

  const handleDateChange = (range: { startDate: Date; endDate: Date }) => {
    setDateRange(range)
  }

  const getHealthColor = (score: number) => {
    if (score >= 70) return 'bg-green-500/10 text-green-500'
    if (score >= 40) return 'bg-amber-500/10 text-amber-500'
    return 'bg-red-500/10 text-red-500'
  }

  const getHealthLabel = (score: number) => {
    if (score >= 70) return 'Healthy'
    if (score >= 40) return 'At Risk'
    return 'Critical'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Client Analytics</h1>
            <p className="text-muted-foreground mt-1">
              Track client acquisition, lifetime value, and health
            </p>
          </div>
          <div className="flex items-center gap-2">
            <DateRangePicker onChange={handleDateChange} />
            <ExportButton 
              data={data?.clientList || []} 
              filename="client-report"
              disabled={loading}
            />
          </div>
        </div>
      </FadeIn>

      {/* KPI Cards */}
      <FadeIn delay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Clients"
            value={data?.totals?.totalClients || 0}
            subtitle="All time"
            icon={Users}
            loading={loading}
          />
          <MetricCard
            title="Active Clients"
            value={data?.totals?.activeClients || 0}
            subtitle="Last 90 days"
            change={{ 
              value: `${Math.round((data?.totals?.activeClients || 0) / Math.max(1, data?.totals?.totalClients || 1) * 100)}% active`, 
              trend: 'neutral' 
            }}
            icon={Activity}
            loading={loading}
            iconClassName="bg-violet-500/10"
          />
          <MetricCard
            title="Average CLV"
            value={formatCurrency(data?.totals?.avgCLV || 0)}
            subtitle="Per client"
            icon={DollarSign}
            loading={loading}
            iconClassName="bg-green-500/10"
          />
          <MetricCard
            title="Total Revenue"
            value={formatCurrency(data?.totals?.totalRevenue || 0)}
            subtitle="From all clients"
            icon={TrendingUp}
            loading={loading}
            iconClassName="bg-blue-500/10"
          />
        </div>
      </FadeIn>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <FadeIn delay={0.2} className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Client Acquisition Trend</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[250px] w-full" />
              ) : (
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data?.acquisitionTrend || []}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="month" 
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
                      <Bar 
                        dataKey="newClients" 
                        name="New Clients"
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

        <FadeIn delay={0.3}>
          <StatusPieChart
            title="Client Health Distribution"
            data={[
              { name: 'Healthy', value: data?.healthDistribution?.healthy || 0, count: data?.healthDistribution?.healthy || 0 },
              { name: 'At Risk', value: data?.healthDistribution?.atRisk || 0, count: data?.healthDistribution?.atRisk || 0 },
              { name: 'Critical', value: data?.healthDistribution?.critical || 0, count: data?.healthDistribution?.critical || 0 },
            ]}
            loading={loading}
          />
        </FadeIn>
      </div>

      {/* Top Clients */}
      <FadeIn delay={0.4}>
        <Card>
          <CardHeader>
            <CardTitle>Top Clients by Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : data?.topClients?.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No client data available
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Client</th>
                      <th className="text-center py-3 px-4 font-medium">Projects</th>
                      <th className="text-center py-3 px-4 font-medium">Avg Value</th>
                      <th className="text-center py-3 px-4 font-medium">Total Revenue</th>
                      <th className="text-center py-3 px-4 font-medium">Health</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.topClients?.slice(0, 10).map((client) => (
                      <tr key={client.id} className="border-b last:border-0 hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{client.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {client.company || client.email}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div>
                            <span className="font-medium">{client.totalProjects}</span>
                            {client.activeProjects > 0 && (
                              <span className="text-xs text-green-600 ml-1">
                                ({client.activeProjects} active)
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {formatCurrency(client.avgProjectValue)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="font-bold text-green-600">
                            {formatCurrency(client.totalRevenue)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant="outline" className={getHealthColor(client.healthScore)}>
                            {getHealthLabel(client.healthScore)}
                          </Badge>
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

      {/* Client Health Details */}
      <FadeIn delay={0.5}>
        <Card>
          <CardHeader>
            <CardTitle>Client Health Scores</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data?.clientList?.slice(0, 12).map((client) => (
                  <div 
                    key={client.id} 
                    className="p-4 rounded-lg border hover:border-violet-500/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium">{client.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {client.company || client.email}
                        </p>
                      </div>
                      <Badge 
                        variant="outline"
                        className={getHealthColor(client.healthScore)}
                      >
                        {client.healthScore}
                      </Badge>
                    </div>
                    <Progress 
                      value={client.healthScore} 
                      className="h-2 mb-3"
                    />
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Revenue:</span>
                        <span className="ml-1 font-medium">
                          {formatCurrency(client.totalRevenue)}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Projects:</span>
                        <span className="ml-1 font-medium">{client.totalProjects}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Tickets:</span>
                        <span className={`ml-1 font-medium ${client.openTickets > 2 ? 'text-red-500' : ''}`}>
                          {client.openTickets} open
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Tenure:</span>
                        <span className="ml-1 font-medium">
                          {Math.round(client.tenureDays / 30)} months
                        </span>
                      </div>
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
