'use client'

import Link from 'next/link'
import { FadeIn } from '@/components/animations'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DollarSign,
  FolderKanban,
  Users,
  UserCircle,
  ArrowRight,
  BarChart3,
} from 'lucide-react'

const reportCategories = [
  {
    title: 'Revenue Reports',
    description: 'Track MRR/ARR, revenue trends, outstanding invoices, and forecasts',
    icon: DollarSign,
    href: '/web/admin/reports/revenue',
    color: 'bg-green-500/10 text-green-500',
    stats: 'MRR, ARR, Forecasts',
  },
  {
    title: 'Project Metrics',
    description: 'Analyze project status, delivery rates, pipeline, and budgets',
    icon: FolderKanban,
    href: '/web/admin/reports/projects',
    color: 'bg-violet-500/10 text-violet-500',
    stats: 'Status, Pipeline, Budgets',
  },
  {
    title: 'Team Performance',
    description: 'Monitor team productivity, workload distribution, and capacity',
    icon: Users,
    href: '/web/admin/reports/team',
    color: 'bg-blue-500/10 text-blue-500',
    stats: 'Tickets, Utilization',
  },
  {
    title: 'Client Analytics',
    description: 'View client acquisition, CLV, health scores, and top clients',
    icon: UserCircle,
    href: '/web/admin/reports/clients',
    color: 'bg-amber-500/10 text-amber-500',
    stats: 'CLV, Health, Acquisition',
  },
]

export default function ReportsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <FadeIn>
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive dashboards for revenue, projects, team, and client insights
          </p>
        </div>
      </FadeIn>

      {/* Report Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportCategories.map((category, index) => {
          const Icon = category.icon
          return (
            <FadeIn key={category.title} delay={0.1 * (index + 1)}>
              <Link href={category.href}>
                <Card className="h-full hover:border-violet-500/50 transition-colors cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${category.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold group-hover:text-violet-500 transition-colors">
                          {category.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {category.description}
                        </p>
                        <div className="flex items-center justify-between mt-4">
                          <Badge variant="secondary" className="text-xs">
                            {category.stats}
                          </Badge>
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-violet-500 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </FadeIn>
          )
        })}
      </div>

      {/* Quick Stats Overview */}
      <FadeIn delay={0.5}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Reporting Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="font-medium">Date Range Filtering</p>
                <p className="text-muted-foreground mt-1">
                  All reports support custom date ranges with preset options
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="font-medium">CSV Export</p>
                <p className="text-muted-foreground mt-1">
                  Export any report data to CSV format for further analysis
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="font-medium">Real-time Data</p>
                <p className="text-muted-foreground mt-1">
                  Reports refresh automatically when date ranges change
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="font-medium">Visual Analytics</p>
                <p className="text-muted-foreground mt-1">
                  Interactive charts and graphs for better insights
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  )
}

// Helper component for the badge
function Badge({ children, variant, className }: { children: React.ReactNode; variant?: string; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
      variant === 'secondary' 
        ? 'bg-muted text-muted-foreground' 
        : 'bg-violet-500/10 text-violet-500'
    } ${className}`}>
      {children}
    </span>
  )
}
