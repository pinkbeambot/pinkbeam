'use client'

import { useState, useEffect, useCallback } from 'react'
import { PageHeader } from '@/components/labs-dashboard/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Loader2, Download, Calendar, DollarSign, FileText, Clock } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface InvoiceSummary {
  summary: {
    totalInvoices: number
    totalInvoiced: number
    totalPaid: number
    totalOutstanding: number
    collectionRate: number
  }
  byStatus: Record<string, { count: number; total: number; due: number }>
  aging: {
    current: { count: number; amount: number }
    days1to30: { count: number; amount: number }
    days31to60: { count: number; amount: number }
    days60plus: { count: number; amount: number }
  }
  monthlyRevenue: Array<{ month: string; amount: number }>
}

const statusLabels: Record<string, string> = {
  DRAFT: 'Draft',
  SENT: 'Sent',
  VIEWED: 'Viewed',
  PARTIAL: 'Partial',
  PAID: 'Paid',
  OVERDUE: 'Overdue',
  CANCELLED: 'Cancelled',
}

const statusColors: Record<string, string> = {
  DRAFT: 'bg-gray-500',
  SENT: 'bg-blue-500',
  VIEWED: 'bg-purple-500',
  PARTIAL: 'bg-orange-500',
  PAID: 'bg-green-500',
  OVERDUE: 'bg-red-500',
  CANCELLED: 'bg-gray-400',
}

export default function InvoiceReportsPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<InvoiceSummary | null>(null)

  const fetchSummary = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/labs/invoices/summary')
      const result = await response.json()

      if (result.success) {
        setData(result.data)
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to fetch reports',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch reports',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchSummary()
  }, [fetchSummary])

  const handleExportCSV = () => {
    if (!data) return

    // Create CSV content
    const csvContent = [
      ['Invoice Reports Export'],
      ['Generated:', new Date().toLocaleString()],
      [''],
      ['Summary'],
      ['Metric', 'Value'],
      ['Total Invoices', data.summary.totalInvoices.toString()],
      ['Total Invoiced', formatCurrency(data.summary.totalInvoiced)],
      ['Total Paid', formatCurrency(data.summary.totalPaid)],
      ['Total Outstanding', formatCurrency(data.summary.totalOutstanding)],
      ['Collection Rate', `${data.summary.collectionRate.toFixed(1)}%`],
      [''],
      ['By Status'],
      ['Status', 'Count', 'Total', 'Due'],
      ...Object.entries(data.byStatus).map(([status, values]) => [
        statusLabels[status] || status,
        values.count.toString(),
        formatCurrency(values.total),
        formatCurrency(values.due),
      ]),
      [''],
      ['Aging Report'],
      ['Period', 'Count', 'Amount'],
      ['Current (Not Due)', data.aging.current.count.toString(), formatCurrency(data.aging.current.amount)],
      ['1-30 Days Overdue', data.aging.days1to30.count.toString(), formatCurrency(data.aging.days1to30.amount)],
      ['31-60 Days Overdue', data.aging.days31to60.count.toString(), formatCurrency(data.aging.days31to60.amount)],
      ['60+ Days Overdue', data.aging.days60plus.count.toString(), formatCurrency(data.aging.days60plus.amount)],
      [''],
      ['Monthly Revenue (Last 6 Months)'],
      ['Month', 'Revenue'],
      ...data.monthlyRevenue.map(item => [item.month, formatCurrency(item.amount)]),
    ]
      .map(row => row.join(','))
      .join('\n')

    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `invoice-reports-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)

    toast({
      title: 'Success',
      description: 'Reports exported to CSV',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">Failed to load reports</h3>
        <Button variant="outline" className="mt-4" onClick={fetchSummary}>
          Retry
        </Button>
      </div>
    )
  }

  const totalOverdue = data.aging.days1to30.amount + data.aging.days31to60.amount + data.aging.days60plus.amount

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/labs/dashboard/invoices">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <PageHeader 
            title="Invoice Reports"
            description="Financial overview and aging analysis"
          />
        </div>
        <Button variant="outline" onClick={handleExportCSV}>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Invoiced</p>
                <p className="text-2xl font-bold">{formatCurrency(data.summary.totalInvoiced)}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Paid</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(data.summary.totalPaid)}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Outstanding</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(data.summary.totalOutstanding)}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <Clock className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Collection Rate</p>
                <p className="text-2xl font-bold">{data.summary.collectionRate.toFixed(1)}%</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>By Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(data.byStatus)
                .filter(([_, values]) => values.count > 0)
                .map(([status, values]) => (
                  <div key={status} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge className={`${statusColors[status]} text-white`}>
                        {statusLabels[status]}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{values.count} invoices</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(values.total)}</div>
                      {values.due > 0 && (
                        <div className="text-sm text-red-600">{formatCurrency(values.due)} due</div>
                      )}
                    </div>
                  </div>
                ))}
              {Object.values(data.byStatus).every(v => v.count === 0) && (
                <p className="text-center text-muted-foreground py-4">No invoices yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Aging Report */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice Aging</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <div className="font-medium text-green-900">Current (Not Due)</div>
                  <div className="text-sm text-green-700">{data.aging.current.count} invoices</div>
                </div>
                <div className="font-medium text-green-900">{formatCurrency(data.aging.current.amount)}</div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <div className="font-medium text-yellow-900">1-30 Days Overdue</div>
                  <div className="text-sm text-yellow-700">{data.aging.days1to30.count} invoices</div>
                </div>
                <div className="font-medium text-yellow-900">{formatCurrency(data.aging.days1to30.amount)}</div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div>
                  <div className="font-medium text-orange-900">31-60 Days Overdue</div>
                  <div className="text-sm text-orange-700">{data.aging.days31to60.count} invoices</div>
                </div>
                <div className="font-medium text-orange-900">{formatCurrency(data.aging.days31to60.amount)}</div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <div className="font-medium text-red-900">60+ Days Overdue</div>
                  <div className="text-sm text-red-700">{data.aging.days60plus.count} invoices</div>
                </div>
                <div className="font-medium text-red-900">{formatCurrency(data.aging.days60plus.amount)}</div>
              </div>

              {totalOverdue > 0 && (
                <div className="flex items-center justify-between p-3 border-t mt-4 pt-4">
                  <div className="font-medium text-red-600">Total Overdue</div>
                  <div className="font-bold text-red-600">{formatCurrency(totalOverdue)}</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Revenue */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Revenue (Last 6 Months)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.monthlyRevenue.map((item) => (
              <div key={item.month} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{item.month}</span>
                  <span className="font-medium">{formatCurrency(item.amount)}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-cyan-500 rounded-full"
                    style={{ 
                      width: `${Math.max(
                        5,
                        (item.amount / Math.max(...data.monthlyRevenue.map(m => m.amount))) * 100
                      )}%` 
                    }}
                  />
                </div>
              </div>
            ))}
            {data.monthlyRevenue.every(m => m.amount === 0) && (
              <p className="text-center text-muted-foreground py-4">No revenue data yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
