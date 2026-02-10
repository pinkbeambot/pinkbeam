'use client'

import { DollarSign, TrendingUp, Receipt, CreditCard } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FadeIn } from '@/components/animations'

const financialData = {
  revenue: { mtd: 12450, ytd: 45600 },
  outstanding: 8500,
  paid: 28900,
  projected: 52000
}

const recentTransactions = [
  { id: 'INV-001', client: 'Acme Corp', amount: 2500, status: 'paid', date: '2026-02-15' },
  { id: 'INV-002', client: 'TechStart Inc', amount: 3600, status: 'paid', date: '2026-02-10' },
  { id: 'INV-003', client: 'Marketing Pro', amount: 1500, status: 'pending', date: '2026-02-18' },
  { id: 'INV-004', client: 'Local Cafe', amount: 800, status: 'pending', date: '2026-02-20' },
]

export default function FinancePage() {
  return (
    <div className="space-y-6">
      <FadeIn>
        <h1 className="text-3xl font-bold">Financial Overview</h1>
        <p className="text-muted-foreground mt-1">Track revenue, invoices, and financial performance</p>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Revenue (MTD)</p>
                  <p className="text-3xl font-bold mt-2">${financialData.revenue.mtd.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Revenue (YTD)</p>
                  <p className="text-3xl font-bold mt-2">${financialData.revenue.ytd.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-violet-500/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-violet-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Outstanding</p>
                  <p className="text-3xl font-bold mt-2">${financialData.outstanding.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Receipt className="w-6 h-6 text-amber-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Projected</p>
                  <p className="text-3xl font-bold mt-2">${financialData.projected.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </FadeIn>

      <FadeIn delay={0.2}>
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">{tx.client}</p>
                    <p className="text-sm text-muted-foreground">{tx.id} • {new Date(tx.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${tx.amount.toLocaleString()}</p>
                    <p className={`text-sm ${tx.status === 'paid' ? 'text-green-500' : 'text-amber-500'}`}>
                      {tx.status}
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
