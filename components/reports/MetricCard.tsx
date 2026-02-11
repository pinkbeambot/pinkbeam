'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  change?: {
    value: string
    trend: 'up' | 'down' | 'neutral'
  }
  icon: LucideIcon
  loading?: boolean
  className?: string
  iconClassName?: string
}

export function MetricCard({
  title,
  value,
  subtitle,
  change,
  icon: Icon,
  loading = false,
  className,
  iconClassName,
}: MetricCardProps) {
  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-20" />
            </div>
            <Skeleton className="h-12 w-12 rounded-lg" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
            {change && (
              <div className={cn(
                "flex items-center gap-1 text-sm mt-1",
                change.trend === 'up' && "text-green-500",
                change.trend === 'down' && "text-red-500",
                change.trend === 'neutral' && "text-muted-foreground"
              )}>
                {change.trend === 'up' && '↑'}
                {change.trend === 'down' && '↓'}
                {change.trend === 'neutral' && '→'}
                {change.value}
              </div>
            )}
          </div>
          <div className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center",
            iconClassName || "bg-violet-500/10"
          )}>
            <Icon className={cn(
              "w-6 h-6",
              iconClassName ? iconClassName.replace('bg-', 'text-').replace('/10', '') : "text-violet-500"
            )} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
