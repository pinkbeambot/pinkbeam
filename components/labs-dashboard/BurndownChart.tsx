'use client'

import { useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { format, parseISO } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, AlertTriangle } from 'lucide-react'

interface BurndownChartProps {
  data: {
    totalPoints: number
    completedPoints: number
    startDate: string
    endDate: string
    status: string
    idealBurndown: Array<{ date: string; points: number }>
    actualBurndown: Array<{ date: string; points: number; completed: number }>
    projection: Array<{ date: string; points: number }>
  }
}

export function BurndownChart({ data }: BurndownChartProps) {
  const { chartData, stats } = useMemo(() => {
    // Combine all data points
    const allDates = new Set([
      ...data.idealBurndown.map((d) => d.date),
      ...data.actualBurndown.map((d) => d.date),
    ])

    const combined = Array.from(allDates)
      .sort()
      .map((date) => {
        const ideal = data.idealBurndown.find((d) => d.date === date)
        const actual = data.actualBurndown.find((d) => d.date === date)

        return {
          date,
          ideal: ideal?.points ?? null,
          actual: actual?.points ?? null,
          completed: actual?.completed ?? 0,
        }
      })

    // Calculate stats
    const today = new Date().toISOString().split('T')[0]
    const todayData = data.actualBurndown.find((d) => d.date === today)
    const currentRemaining = todayData?.points ?? data.totalPoints - data.completedPoints

    const velocity =
      data.actualBurndown.length > 1
        ? (data.totalPoints - currentRemaining) / (data.actualBurndown.length - 1)
        : 0

    const daysRemaining = Math.ceil(currentRemaining / (velocity || 1))
    const endDate = parseISO(data.endDate)
    const projectedEndDate = new Date()
    projectedEndDate.setDate(projectedEndDate.getDate() + daysRemaining)

    const isOnTrack = projectedEndDate <= endDate || currentRemaining === 0

    return {
      chartData: combined,
      stats: {
        currentRemaining,
        velocity: Math.round(velocity * 10) / 10,
        daysRemaining: velocity > 0 ? daysRemaining : Infinity,
        isOnTrack,
        completion: data.totalPoints > 0
          ? Math.round((data.completedPoints / data.totalPoints) * 100)
          : 0,
      },
    }
  }, [data])

  const formatDate = (dateStr: string) => {
    return format(parseISO(dateStr), 'MMM d')
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Remaining
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.currentRemaining}</p>
            <p className="text-xs text-muted-foreground">story points</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Velocity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.velocity}</p>
            <p className="text-xs text-muted-foreground">points/day</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Days to Complete
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {stats.daysRemaining === Infinity ? '∞' : stats.daysRemaining}
            </p>
            <p className="text-xs text-muted-foreground">at current velocity</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {stats.isOnTrack ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="font-medium text-green-600">On Track</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  <span className="font-medium text-yellow-600">At Risk</span>
                </>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.completion}% complete
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              stroke="#6b7280"
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <YAxis
              stroke="#6b7280"
              tick={{ fill: '#6b7280', fontSize: 12 }}
              label={{
                value: 'Remaining Points',
                angle: -90,
                position: 'insideLeft',
                fill: '#6b7280',
                fontSize: 12,
              }}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-popover border rounded-lg p-3 shadow-lg">
                      <p className="font-medium mb-2">{formatDate(label as string)}</p>
                      {payload.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: entry.color }}
                          />
                          <span className="capitalize">{entry.name}:</span>
                          <span className="font-medium">{entry.value} pts</span>
                        </div>
                      ))}
                    </div>
                  )
                }
                return null
              }}
            />
            {/* Ideal Burndown Line */}
            <Line
              type="monotone"
              dataKey="ideal"
              name="Ideal"
              stroke="#22d3ee"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              connectNulls
            />
            {/* Actual Burndown Line */}
            <Line
              type="monotone"
              dataKey="actual"
              name="Actual"
              stroke="#06b6d4"
              strokeWidth={3}
              dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#06b6d4' }}
              connectNulls
            />
            {/* Zero line */}
            <ReferenceLine y={0} stroke="#6b7280" strokeDasharray="3 3" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-cyan-400 border-dashed border-t-2" />
          <span className="text-muted-foreground">Ideal Burndown</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-cyan-600 rounded" />
          <span className="text-muted-foreground">Actual Burndown</span>
        </div>
      </div>
    </div>
  )
}
