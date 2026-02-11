'use client'

import { useState, useEffect, useCallback } from 'react'
import { format, startOfMonth, endOfMonth, subMonths, parseISO } from 'date-fns'
import { Download, Calendar, BarChart3, PieChart, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { PageHeader } from '@/components/labs-dashboard/PageHeader'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

interface Project {
  id: string
  title: string
}

interface TimeEntry {
  id: string
  projectId: string
  taskId: string | null
  description: string | null
  startTime: string
  endTime: string | null
  duration: number
  billable: boolean
  project: { id: string; title: string }
  task?: { id: string; title: string } | null
}

interface GroupedData {
  projectId?: string
  projectName?: string
  taskId?: string | null
  taskName?: string
  date?: string
  duration: number
  billable: number
  entries?: TimeEntry[]
}

interface SummaryData {
  summary: {
    totalDuration: number
    billableDuration: number
    nonBillableDuration: number
    totalEntries: number
    averagePerDay: number
    billablePercentage: number
  }
  groupedData: GroupedData[]
  entries: TimeEntry[]
  dateRange: { start: string; end: string }
}

export default function TimeReportsPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('overview')
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfMonth(subMonths(new Date(), 1)),
    to: endOfMonth(new Date()),
  })
  const [projectId, setProjectId] = useState<string>('')
  const [groupBy, setGroupBy] = useState<'day' | 'project' | 'task'>('project')
  const [reportData, setReportData] = useState<SummaryData | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)

  const fetchProjects = useCallback(async () => {
    try {
      const response = await fetch('/api/labs/projects')
      const result = await response.json()
      if (result.success) {
        setProjects(result.data.map((p: { id: string; title: string }) => ({ id: p.id, title: p.title })))
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    }
  }, [])

  const fetchReportData = useCallback(async () => {
    if (!dateRange.from || !dateRange.to) return

    setLoading(true)
    try {
      const params = new URLSearchParams({
        startDate: dateRange.from.toISOString(),
        endDate: dateRange.to.toISOString(),
        groupBy,
      })
      
      if (projectId) params.set('projectId', projectId)

      const response = await fetch(`/api/labs/time-entries/summary?${params}`)
      const result = await response.json()

      if (result.success) {
        setReportData(result.data)
      }
    } catch (error) {
      console.error('Error fetching report data:', error)
    } finally {
      setLoading(false)
    }
  }, [dateRange, groupBy, projectId])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  useEffect(() => {
    fetchReportData()
  }, [fetchReportData])

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours === 0) return `${mins}m`
    if (mins === 0) return `${hours}h`
    return `${hours}h ${mins}m`
  }

  const formatDurationDecimal = (minutes: number) => {
    return (minutes / 60).toFixed(2)
  }

  const exportToCSV = () => {
    if (!reportData) return

    const headers = ['Date', 'Project', 'Task', 'Description', 'Duration (Hours)', 'Duration (Minutes)', 'Billable']
    const rows = reportData.entries.map((entry) => [
      format(parseISO(entry.startTime), 'yyyy-MM-dd'),
      entry.project.title,
      entry.task?.title || '',
      entry.description || '',
      formatDurationDecimal(entry.duration),
      entry.duration.toString(),
      entry.billable ? 'Yes' : 'No',
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `time-report-${format(new Date(), 'yyyy-MM-dd')}.csv`
    link.click()

    toast({ title: 'Export Complete', description: 'Time entries exported to CSV' })
  }

  const exportSummaryToCSV = () => {
    if (!reportData) return

    const headers = ['Group', 'Duration (Hours)', 'Duration (Minutes)', 'Billable (Hours)', 'Billable %']
    const rows = reportData.groupedData.map((group) => {
      const billablePct = group.duration > 0 ? Math.round((group.billable / group.duration) * 100) : 0
      return [
        group.projectName || group.taskName || group.date || 'Unknown',
        formatDurationDecimal(group.duration),
        group.duration.toString(),
        formatDurationDecimal(group.billable),
        `${billablePct}%`,
      ]
    })

    // Add summary row
    rows.push([
      'TOTAL',
      formatDurationDecimal(reportData.summary.totalDuration),
      reportData.summary.totalDuration.toString(),
      formatDurationDecimal(reportData.summary.billableDuration),
      `${reportData.summary.billablePercentage}%`,
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `time-summary-${format(new Date(), 'yyyy-MM-dd')}.csv`
    link.click()

    toast({ title: 'Export Complete', description: 'Summary exported to CSV' })
  }

  const quickDateRanges: Array<{ label: string; from: Date; to: Date }> = [
    { label: 'This Month', from: startOfMonth(new Date()), to: endOfMonth(new Date()) },
    { label: 'Last Month', from: startOfMonth(subMonths(new Date(), 1)), to: endOfMonth(subMonths(new Date(), 1)) },
    { label: 'Last 3 Months', from: startOfMonth(subMonths(new Date(), 3)), to: endOfMonth(new Date()) },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <PageHeader
          title="Time Reports"
          description="Analyze and export your time tracking data"
        />
        <Button variant="outline" onClick={exportToCSV}>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-end gap-4">
            {/* Date Range */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">From</Label>
              <Input
                type="date"
                value={dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : ''}
                onChange={(e) => {
                  const date = e.target.value ? new Date(e.target.value) : new Date()
                  setDateRange(prev => ({ ...prev, from: date }))
                }}
                className="w-[180px]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium">To</Label>
              <Input
                type="date"
                value={dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : ''}
                onChange={(e) => {
                  const date = e.target.value ? new Date(e.target.value) : new Date()
                  setDateRange(prev => ({ ...prev, to: date }))
                }}
                className="w-[180px]"
              />
            </div>

            {/* Quick Date Ranges */}
            <div className="flex gap-2">
              {quickDateRanges.map((range) => (
                <Button
                  key={range.label}
                  variant="outline"
                  size="sm"
                  onClick={() => setDateRange({ from: range.from, to: range.to })}
                >
                  {range.label}
                </Button>
              ))}
            </div>

            {/* Project Filter */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">Project</Label>
              <Select value={projectId} onValueChange={setProjectId}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All Projects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Projects</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Group By */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">Group By</Label>
              <Select value={groupBy} onValueChange={(v) => setGroupBy(v as 'day' | 'project' | 'task')}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Day</SelectItem>
                  <SelectItem value="project">Project</SelectItem>
                  <SelectItem value="task">Task</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      {reportData && (
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Time</p>
              <p className="text-2xl font-bold">{formatDuration(reportData.summary.totalDuration)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Billable</p>
              <p className="text-2xl font-bold text-green-600">
                {formatDuration(reportData.summary.billableDuration)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Billable %</p>
              <p className="text-2xl font-bold">{reportData.summary.billablePercentage}%</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Entries</p>
              <p className="text-2xl font-bold">{reportData.summary.totalEntries}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Report Views */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">
            <BarChart3 className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="breakdown">
            <PieChart className="w-4 h-4 mr-2" />
            Breakdown
          </TabsTrigger>
          <TabsTrigger value="entries">
            <FileText className="w-4 h-4 mr-2" />
            All Entries
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6">
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading...</div>
          ) : reportData ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Time Summary by {groupBy === 'day' ? 'Day' : groupBy === 'project' ? 'Project' : 'Task'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportData.groupedData.map((group, index) => {
                    const percentage = reportData.summary.totalDuration > 0
                      ? (group.duration / reportData.summary.totalDuration) * 100
                      : 0
                    const billablePct = group.duration > 0
                      ? (group.billable / group.duration) * 100
                      : 0
                    
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">
                            {group.projectName || group.taskName || format(parseISO(group.date || new Date().toISOString()), 'MMM dd, yyyy')}
                          </span>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground">
                              {formatDuration(group.duration)}
                            </span>
                            <span className="text-sm font-medium w-16 text-right">
                              {Math.round(percentage)}%
                            </span>
                          </div>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={cn(
                              'h-full rounded-full transition-all',
                              billablePct > 50 ? 'bg-green-500' : 'bg-cyan-500'
                            )}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{group.entries?.length || 0} entries</span>
                          <span>{Math.round(billablePct)}% billable</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-12 text-muted-foreground">No data available</div>
          )}
        </TabsContent>

        {/* Breakdown Tab */}
        <TabsContent value="breakdown" className="mt-6">
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading...</div>
          ) : reportData ? (
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Billable vs Non-Billable</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span>Billable</span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatDuration(reportData.summary.billableDuration)}</p>
                        <p className="text-sm text-muted-foreground">{reportData.summary.billablePercentage}%</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-muted" />
                        <span>Non-Billable</span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatDuration(reportData.summary.nonBillableDuration)}</p>
                        <p className="text-sm text-muted-foreground">{100 - reportData.summary.billablePercentage}%</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Key Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Average per Day</span>
                      <span className="font-medium">{formatDuration(reportData.summary.averagePerDay)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total Entries</span>
                      <span className="font-medium">{reportData.summary.totalEntries}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Date Range</span>
                      <span className="font-medium text-sm">
                        {format(parseISO(reportData.dateRange.start), 'MMM dd')} - {format(parseISO(reportData.dateRange.end), 'MMM dd')}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">No data available</div>
          )}
        </TabsContent>

        {/* All Entries Tab */}
        <TabsContent value="entries" className="mt-6">
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading...</div>
          ) : reportData ? (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">All Time Entries</CardTitle>
                <Button variant="outline" size="sm" onClick={exportToCSV}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </CardHeader>
              <CardContent>
                <div className="divide-y">
                  {reportData.entries.map((entry) => (
                    <div key={entry.id} className="py-3 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{entry.project.title}</span>
                          {entry.task && (
                            <span className="text-sm text-muted-foreground">/ {entry.task.title}</span>
                          )}
                          {entry.billable ? (
                            <Badge variant="secondary" className="text-green-600 bg-green-500/10 text-xs">
                              Billable
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">Non-billable</Badge>
                          )}
                        </div>
                        {entry.description && (
                          <p className="text-sm text-muted-foreground mt-0.5">{entry.description}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(parseISO(entry.startTime), 'MMM dd, yyyy • h:mm a')}
                        </p>
                      </div>
                      <span className="font-mono font-medium">{formatDuration(entry.duration)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-12 text-muted-foreground">No data available</div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Label component for the form
function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <label className={cn('text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70', className)}>
      {children}
    </label>
  )
}
