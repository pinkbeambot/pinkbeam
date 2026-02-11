import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PageHeader } from '@/components/labs-dashboard/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { CreditCard, Download, ArrowUpRight, Check } from 'lucide-react'
import Link from 'next/link'

export default async function BillingPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/sign-in')
  }

  // Placeholder invoices data
  const invoices = [
    { id: 'INV-001', date: '2026-02-01', amount: '$2,500.00', status: 'paid' as const },
    { id: 'INV-002', date: '2026-01-01', amount: '$2,500.00', status: 'paid' as const },
    { id: 'INV-003', date: '2025-12-01', amount: '$1,200.00', status: 'paid' as const },
  ]

  // Placeholder usage data
  const usage = {
    projectsUsed: 3,
    projectsLimit: 5,
    storageUsed: '1.2 GB',
    storageLimit: '10 GB',
    apiCallsUsed: '8,432',
    apiCallsLimit: '50,000',
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Billing"
        description="Manage your subscription and view invoices"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Current Plan */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>Your subscription details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-bold">Starter</h3>
                <Badge variant="secondary" className="bg-cyan-500/10 text-cyan-400">
                  Active
                </Badge>
              </div>
              <p className="text-muted-foreground">$99/month</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-cyan-400" />
                <span>Up to 5 projects</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-cyan-400" />
                <span>10 GB storage</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-cyan-400" />
                <span>50,000 API calls/month</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-cyan-400" />
                <span>Email support</span>
              </div>
            </div>

            <Button asChild variant="outline" className="w-full">
              <Link href="/labs/dashboard/billing/upgrade">
                Upgrade Plan
                <ArrowUpRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Usage Stats */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Usage</CardTitle>
            <CardDescription>Your current resource usage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Projects */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Projects</span>
                <span className="text-muted-foreground">
                  {usage.projectsUsed} / {usage.projectsLimit}
                </span>
              </div>
              <Progress 
                value={(usage.projectsUsed / usage.projectsLimit) * 100} 
                className="h-2"
              />
            </div>

            {/* Storage */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Storage</span>
                <span className="text-muted-foreground">
                  {usage.storageUsed} / {usage.storageLimit}
                </span>
              </div>
              <Progress 
                value={12} 
                className="h-2"
              />
            </div>

            {/* API Calls */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>API Calls</span>
                <span className="text-muted-foreground">
                  {usage.apiCallsUsed} / {usage.apiCallsLimit}
                </span>
              </div>
              <Progress 
                value={(8432 / 50000) * 100} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>Manage your payment details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <p className="font-medium">Visa ending in 4242</p>
                <p className="text-sm text-muted-foreground">Expires 12/27</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Update
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Invoices */}
      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
          <CardDescription>Download your past invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div 
                key={invoice.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <p className="font-medium">{invoice.id}</p>
                    <p className="text-sm text-muted-foreground">{invoice.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge 
                    variant={invoice.status === 'paid' ? 'default' : 'secondary'}
                    className={invoice.status === 'paid' ? 'bg-green-500/10 text-green-400' : ''}
                  >
                    {invoice.status}
                  </Badge>
                  <span className="font-medium hidden sm:inline">{invoice.amount}</span>
                  <Button variant="ghost" size="icon">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
