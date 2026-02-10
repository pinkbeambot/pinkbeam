'use client'

import { Receipt, Download, Eye, CheckCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FadeIn } from '@/components/animations'

const invoices = [
  { id: 'INV-001', client: 'Acme Corp', amount: 2500, status: 'paid', date: '2026-02-01', dueDate: '2026-02-15' },
  { id: 'INV-002', client: 'TechStart Inc', amount: 3600, status: 'paid', date: '2026-02-05', dueDate: '2026-02-20' },
  { id: 'INV-003', client: 'Marketing Pro', amount: 1500, status: 'pending', date: '2026-02-15', dueDate: '2026-03-01' },
  { id: 'INV-004', client: 'Local Cafe', amount: 800, status: 'pending', date: '2026-02-18', dueDate: '2026-03-05' },
  { id: 'INV-005', client: 'Content Co', amount: 2000, status: 'overdue', date: '2026-01-15', dueDate: '2026-01-30' },
]

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    'paid': 'bg-green-500/10 text-green-500 border-green-500/20',
    'pending': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    'overdue': 'bg-red-500/10 text-red-500 border-red-500/20',
  }
  return colors[status] || 'bg-gray-500/10 text-gray-500'
}

export default function AdminInvoicesPage() {
  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0)
  const totalPending = invoices.filter(i => i.status !== 'paid').reduce((sum, i) => sum + i.amount, 0)

  return (
    <div className="space-y-6">
      <FadeIn>
        <h1 className="text-3xl font-bold">Invoices</h1>
        <p className="text-muted-foreground mt-1">Manage and track all invoices</p>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground">Total Paid</p>
              <p className="text-3xl font-bold mt-2 text-green-500">${totalPaid.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground">Outstanding</p>
              <p className="text-3xl font-bold mt-2 text-amber-500">${totalPending.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground">Total Invoices</p>
              <p className="text-3xl font-bold mt-2">{invoices.length}</p>
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
                <div key={invoice.id} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                      <Receipt className="w-5 h-5 text-violet-500" />
                    </div>
                    <div>
                      <p className="font-medium">{invoice.id}</p>
                      <p className="text-sm text-muted-foreground">{invoice.client}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="font-bold">${invoice.amount.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Due: {new Date(invoice.dueDate).toLocaleDateString()}</p>
                    </div>
                    <Badge variant="outline" className={getStatusColor(invoice.status)}>
                      {invoice.status}
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
