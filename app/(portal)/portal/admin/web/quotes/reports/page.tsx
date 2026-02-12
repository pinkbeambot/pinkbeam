'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Loader2, BarChart3, TrendingUp, Clock, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FadeIn } from '@/components/animations'

interface ReportData {
  funnel: Record<string, number> & { total: number }
  volumeByMonth: { month: string; count: number }[]
  avgDaysToClose: number | null
  conversionBySource: { source: string; total: number; accepted: number; rate: number }[]
  avgLeadScore: number
  hotLeadCount: number
}

const statusLabels: Record<string, string> = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  QUALIFIED: 'Qualified',
  PROPOSAL: 'Proposal',
  ACCEPTED: 'Accepted',
  DECLINED: 'Declined',
}

const statusColors: Record<string, string> = {
  NEW: 'bg-blue-500',
  CONTACTED: 'bg-amber-500',
  QUALIFIED: 'bg-purple-500',
  PROPOSAL: 'bg-violet-500',
  ACCEPTED: 'bg-green-500',
  DECLINED: 'bg-red-400',
}

const funnelOrder = ['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'ACCEPTED', 'DECLINED']

export default function QuoteReportsPage() {
  const [data, setData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchReports() {
      try {
        const res = await fetch('/api/quotes/reports')
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
        <Button onClick={() => window.location.reload()} variant="outline">Try Again</Button>
      </div>
    )
  }

  const maxFunnelCount = Math.max(...funnelOrder.map((s) => data.funnel[s] || 0), 1)
  const maxVolumeCount = Math.max(...data.volumeByMonth.map((m) => m.count), 1)

  const acceptedCount = data.funnel.ACCEPTED || 0
  const closedCount = acceptedCount + (data.funnel.DECLINED || 0)
  const overallConversionRate = closedCount > 0 ? ((acceptedCount / closedCount) * 100).toFixed(1) : '—'

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeIn>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/portal/admin/web/quotes">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Quote Reports</h1>
            <p className="text-muted-foreground mt-1">Pipeline analytics and conversion metrics</p>
          </div>
        </div>
      </FadeIn>

      {/* Summary KPIs */}
      <FadeIn delay={0.1}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Quotes</p>
                  <p className="text-2xl font-bold">{data.funnel.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Win Rate</p>
                  <p className="text-2xl font-bold">{overallConversionRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Days to Close</p>
                  <p className="text-2xl font-bold">{data.avgDaysToClose != null ? data.avgDaysToClose.toFixed(1) : '—'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Hot Leads</p>
                  <p className="text-2xl font-bold">{data.hotLeadCount}</p>
                  <p className="text-xs text-muted-foreground">avg score: {Math.round(data.avgLeadScore)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* R1: Conversion Funnel */}
        <FadeIn delay={0.2}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">Conversion Funnel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {funnelOrder.map((status) => {
                const count = data.funnel[status] || 0
                const pct = data.funnel.total > 0 ? ((count / data.funnel.total) * 100).toFixed(0) : '0'
                return (
                  <div key={status} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>{statusLabels[status]}</span>
                      <span className="font-mono">
                        {count} <span className="text-muted-foreground">({pct}%)</span>
                      </span>
                    </div>
                    <div className="h-6 bg-muted rounded overflow-hidden">
                      <div
                        className={`h-full ${statusColors[status]} rounded transition-all duration-500`}
                        style={{ width: `${(count / maxFunnelCount) * 100}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </FadeIn>

        {/* R2: Quote Volume by Month */}
        <FadeIn delay={0.3}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">Quote Volume (Last 6 Months)</CardTitle>
            </CardHeader>
            <CardContent>
              {data.volumeByMonth.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No data yet</p>
              ) : (
                <div className="flex items-end gap-2 h-48">
                  {data.volumeByMonth.map((m) => (
                    <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-xs font-mono">{m.count}</span>
                      <div className="w-full bg-muted rounded-t overflow-hidden relative" style={{ height: '100%' }}>
                        <div
                          className="absolute bottom-0 w-full bg-pink-500 rounded-t transition-all duration-500"
                          style={{ height: `${(m.count / maxVolumeCount) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(m.month + '-01').toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </FadeIn>

        {/* R4: Conversion Rate by Source */}
        <FadeIn delay={0.4}>
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Conversion by Referral Source</CardTitle>
            </CardHeader>
            <CardContent>
              {data.conversionBySource.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No data yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-medium">Source</th>
                        <th className="text-right p-3 font-medium">Total</th>
                        <th className="text-right p-3 font-medium">Accepted</th>
                        <th className="text-right p-3 font-medium">Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.conversionBySource.map((row) => (
                        <tr key={row.source} className="border-b last:border-0">
                          <td className="p-3 capitalize">{row.source}</td>
                          <td className="p-3 text-right font-mono">{row.total}</td>
                          <td className="p-3 text-right font-mono">{row.accepted}</td>
                          <td className="p-3 text-right">
                            <Badge variant="outline" className={row.rate > 0 ? 'bg-green-500/10 text-green-500 border-green-500/20' : ''}>
                              {row.rate.toFixed(1)}%
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
      </div>
    </div>
  )
}
