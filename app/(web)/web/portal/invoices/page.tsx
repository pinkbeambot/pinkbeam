'use client'

import Link from 'next/link'
import { Receipt, Download, Eye, CheckCircle, Clock, AlertCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FadeIn } from '@/components/animations'

const invoices = [
  { id: 'INV-001', amount: 2500, status: 'paid', date: '2026-02-01', dueDate: '2026-02-15', description: 'Website Design - 50% Deposit' },
  { id: 'INV-002', amount: 2500, status: 'pending', date: '2026-02-15', dueDate: '2026-03-01', description: 'Website Design - Final Payment' },
  { id: 'INV-003', amount: 1500, status: 'pending', date: '2026-02-20', dueDate: '2026-03-05', description: 'E-commerce Platform - Deposit' },
]

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    'paid': 'bg-green-500/10 text-green-500 border-green-500/20',
    'pending': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    'overdue': 'bg-red-500/10 text-red-500 border-red-500/20',
  }
  return colors[status] || 'bg-gray-500/10 text-gray-500'
}

function getStatusIcon(status: string) {
  if (status === 'paid') return <CheckCircle className="w-4 h-4" />
  if (status === 'pending') return <Clock className="w-4 h-4" />
  return <AlertCircle className="w-4 h-4" />
}

export default function InvoicesPage() {
  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0)
  const totalPending = invoices.filter(i => i.status !== 'paid').reduce((sum, i) => sum + i.amount, 0)

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Invoices</h1>
            <p className="text-muted-foreground mt-1">
              View and manage all your invoices
            </p>
          </div>
        </div>
      </FadeIn>

      {/* Stats */}
      <FadeIn delay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Paid</p>
                  <p className="text-3xl font-bold mt-2 text-green-500">${totalPaid.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Outstanding</p>
                  <p className="text-3xl font-bold mt-2 text-amber-500">${totalPending.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </FadeIn>

      <FadeIn delay={0.2}>
        <Card>
          <CardHeader>
            <CardTitle>All Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                      <Receipt className="w-5 h-5 text-violet-500" />
                    </div>
                    <div>
                      <p className="font-medium">{invoice.id}</p>
                      <p className="text-sm text-muted-foreground">{invoice.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="font-bold">${invoice.amount.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Due: {new Date(invoice.dueDate).toLocaleDateString()}</p>
                    </div>
                    <Badge variant="outline" className={getStatusColor(invoice.status)}>
                      {getStatusIcon(invoice.status)}
                      <span className="ml-1 capitalize">{invoice.status}</span>
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
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
