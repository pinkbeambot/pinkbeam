'use client'

import { useState, useEffect } from 'react'
import { FadeIn } from '@/components/animations'
import { MetricCard } from '@/components/reports/MetricCard'
import { RevenueChart } from '@/components/reports/RevenueChart'
import { DateRangePicker } from '@/components/reports/DateRangePicker'
import { ExportButton } from '@/components/reports/ExportButton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Calendar,
  ArrowRight,
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { subMonths } from 'date-fns'
import Link from 'next/link'

interface RevenueData {
  mrr: number
  arr: number
  totalOutstanding: number
  monthlyTrend: Array<{
    month: string
    revenue: number
    paid: number
    pending: number
  }>
  byService: Array<{
    service: string
    amount: number
  }>
  outstandingInvoices: Array<{
    id: string
    amount: number
    description: string
    issuedAt: string
    dueAt: string | null
    clientName: string
    clientCompany: string | null
  }>
  forecast: {
    nextMonth: number
    nextQuarter: number
    nextYear: number
  }
}

export default function RevenueReportPage() {
  const [data, setData] = useState<RevenueData | null>(null)
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
        const res = await fetch(`/api/reports/revenue?${params}`)
        const json = await res.json()
        if (json.success) {
          setData(json.data)
        }
      } catch (error) {
        console.error('Failed to fetch revenue data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [dateRange])

  const handleDateChange = (range: { startDate: Date; endDate: Date }) => {
    setDateRange(range)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Revenue Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Track revenue metrics, trends, and forecasts
            </p>
          </div>
          <div className="flex items-center gap-2">
            <DateRangePicker onChange={handleDateChange} />
            <ExportButton 
              data={data?.monthlyTrend || []} 
              filename="revenue-report"
              disabled={loading}
            />
          </div>
        </div>
      </FadeIn>

      {/* KPI Cards */}
      <FadeIn delay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Monthly Recurring Revenue"
            value={data ? formatCurrency(data.mrr) : '$0'}
            subtitle="Current month"
            icon={DollarSign}
            loading={loading}
          />
          <MetricCard
            title="Annual Recurring Revenue"
            value={data ? formatCurrency(data.arr) : '$0'}
            subtitle="Last 12 months"
            icon={TrendingUp}
            loading={loading}
          />
          <MetricCard
            title="Outstanding Invoices"
            value={data ? formatCurrency(data.totalOutstanding) : '$0'}
            subtitle="Pending payment"
            change={{ value: `${data?.outstandingInvoices?.length || 0} invoices`, trend: 'neutral' }}
            icon={AlertCircle}
            loading={loading}
            iconClassName="bg-amber-500/10"
          />
          <MetricCard
            title="Revenue Forecast"
            value={data ? formatCurrency(data?.forecast?.nextMonth || 0) : '$0'}
            subtitle="Next month projection"
            change={{ value: '+5% projected', trend: 'up' }}
            icon={TrendingUp}
            loading={loading}
            iconClassName="bg-green-500/10"
          />
        </div>
      </FadeIn>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <FadeIn delay={0.2} className="lg:col-span-2">
          <RevenueChart 
            data={data?.monthlyTrend || []} 
            loading={loading} 
          />
        </FadeIn>

        <FadeIn delay={0.3}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Revenue by Service</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                  ))}
                </div>
              ) : data?.byService?.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No service data available
                </p>
              ) : (
                <div className="space-y-3">
                  {data?.byService?.map((service, index) => (
                    <div key={service.service} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ 
                            backgroundColor: [
                              '#8b5cf6', '#22c55e', '#f59e0b', 
                              '#ef4444', '#3b82f6'
                            ][index % 5] 
                          }}
                        />
                        <span className="font-medium capitalize">
                          {service.service.toLowerCase().replace('_', ' ')}
                        </span>
                      </div>
                      <span className="font-bold">{formatCurrency(service.amount)}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </FadeIn>
      </div>

      {/* Outstanding Invoices & Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FadeIn delay={0.4}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Outstanding Invoices</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/portal/admin/web/invoices">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : data?.outstandingInvoices?.length === 0 ? (
                <div className="text-center py-8">
                  <DollarSign className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No outstanding invoices</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {data?.outstandingInvoices?.slice(0, 5).map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <p className="font-medium">{invoice.clientName}</p>
                        <p className="text-sm text-muted-foreground">
                          {invoice.clientCompany || invoice.description || 'Invoice'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(invoice.amount)}</p>
                        <p className="text-xs text-muted-foreground">
                          <Calendar className="inline h-3 w-3 mr-1" />
                          {new Date(invoice.issuedAt).toLocaleDateString()}
                        </p>
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
              <CardTitle>Revenue Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-violet-500/5 border border-violet-500/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Next Month</p>
                        <p className="text-2xl font-bold text-violet-600">
                          {formatCurrency(data?.forecast?.nextMonth || 0)}
                        </p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-violet-500" />
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Next Quarter</p>
                        <p className="text-2xl font-bold text-green-600">
                          {formatCurrency(data?.forecast?.nextQuarter || 0)}
                        </p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-green-500" />
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Next Year</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {formatCurrency(data?.forecast?.nextYear || 0)}
                        </p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-blue-500" />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </div>
  )
}
