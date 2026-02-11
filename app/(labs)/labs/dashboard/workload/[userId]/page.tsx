'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { PageHeader } from '@/components/labs-dashboard/PageHeader'
import { WorkloadBarChart } from '@/components/labs-dashboard/WorkloadBarChart'
import { UtilizationGauge } from '@/components/labs-dashboard/UtilizationGauge'
import { ArrowLeft, Calendar, Clock, Briefcase, TrendingUp, AlertCircle } from 'lucide-react'

interface WorkloadData {
  user: {
    id: string
    name: string
    email: string
    role: string
    dailyCapacity: number
  }
  period: {
    start: string
    end: string
    view: string
  }
  summary: {
    totalCapacity: number
    totalAllocated: number
    totalActual: number
    utilization: number
    remaining: number
  }
  dailyBreakdown: Array<{
    date: string
    dayName: string
    allocated: number
    actual: number
    available: number
    utilization: number
    entries: Array<{
      id: string
      projectId: string
      project: { title: string }
      task?: { id: string; title: string; status: string; priority: string }
      allocatedHours: number
      actualHours?: number
    }>
  }>
  projectBreakdown: Array<{
    projectId: string
    projectTitle: string
    allocated: number
    actual: number
    tasks: Array<{
      id: string
      title: string
      status: string
      priority: string
    }>
  }>
  assignedTasks: Array<{
    id: string
    title: string
    status: string
    priority: string
    estimate?: number
    dueDate?: string
    project: {
      id: string
      title: string
    }
  }>
  upcomingAvailability: Array<{
    weekStart: string
    weekEnd: string
    weekLabel: string
    allocated: number
    available: number
    utilization: number
  }>
}

export default function IndividualWorkloadPage() {
  const params = useParams()
  const userId = params.userId as string
  
  const [data, setData] = useState<WorkloadData | null>(null)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'weekly' | 'monthly'>('weekly')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    fetchWorkloadData()
  }, [userId, view, selectedDate])

  async function fetchWorkloadData() {
    try {
      setLoading(true)
      const response = await fetch(`/api/labs/workload/user/${userId}?view=${view}&date=${selectedDate}`)
      const result = await response.json()
      
      if (result.success) {
        setData(result.data)
      } else {
        console.error('Failed to fetch workload:', result.error)
      }
    } catch (error) {
      console.error('Error fetching workload:', error)
    } finally {
      setLoading(false)
    }
  }

  function getPriorityColor(priority: string) {
    switch (priority) {
      case 'URGENT': return 'bg-red-500/10 text-red-600 border-red-500/20'
      case 'HIGH': return 'bg-orange-500/10 text-orange-600 border-orange-500/20'
      case 'MEDIUM': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
      default: return 'bg-blue-500/10 text-blue-600 border-blue-500/20'
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'COMPLETED': return 'bg-green-500/10 text-green-600 border-green-500/20'
      case 'IN_PROGRESS': return 'bg-blue-500/10 text-blue-600 border-blue-500/20'
      case 'IN_REVIEW': return 'bg-purple-500/10 text-purple-600 border-purple-500/20'
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="p-6">
        <Link 
          href="/labs/dashboard/workload" 
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Team Workload
        </Link>
        <PageHeader title="Workload Details" description="Failed to load workload data" />
      </div>
    )
  }

  const { user, summary, dailyBreakdown, projectBreakdown, assignedTasks, upcomingAvailability } = data

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link 
        href="/labs/dashboard/workload" 
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Team Workload
      </Link>

      <PageHeader 
        title={user.name}
        description={`${user.email} • ${user.role.toLowerCase().replace('_', ' ')}`}
      />

      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center justify-between bg-card p-4 rounded-lg border">
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border rounded px-3 py-1.5 text-sm bg-background"
            />
          </div>
          <div className="flex gap-1 bg-muted rounded-lg p-1">
            <button
              onClick={() => setView('weekly')}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                view === 'weekly' 
                  ? 'bg-background shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setView('monthly')}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                view === 'monthly' 
                  ? 'bg-background shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Monthly
            </button>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground">
          Daily Capacity: <span className="font-medium text-foreground">{user.dailyCapacity}h</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Utilization</p>
              <p className="text-2xl font-bold">{summary.utilization.toFixed(1)}%</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Allocated</p>
              <p className="text-2xl font-bold">{summary.totalAllocated.toFixed(1)}h</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Actual</p>
              <p className="text-2xl font-bold">{summary.totalActual.toFixed(1)}h</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Available</p>
              <p className="text-2xl font-bold text-green-600">{summary.remaining.toFixed(1)}h</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workload Timeline */}
        <div className="lg:col-span-2 bg-card border rounded-lg">
          <div className="p-4 border-b">
            <h2 className="font-semibold">Workload Timeline</h2>
            <p className="text-sm text-muted-foreground">Daily hours breakdown</p>
          </div>
          <div className="p-4">
            <WorkloadBarChart 
              data={dailyBreakdown.map(day => ({
                label: day.dayName,
                allocated: day.allocated,
                actual: day.actual,
                available: day.available,
                utilization: day.utilization,
              }))}
              maxValue={user.dailyCapacity * 1.2}
            />
          </div>
        </div>

        {/* Utilization Gauge */}
        <div className="bg-card border rounded-lg">
          <div className="p-4 border-b">
            <h2 className="font-semibold">Period Utilization</h2>
            <p className="text-sm text-muted-foreground">Overall capacity usage</p>
          </div>
          <div className="p-8 flex justify-center">
            <UtilizationGauge percentage={summary.utilization} size="lg" showLabel />
          </div>
          <div className="px-4 pb-4 text-center">
            <p className="text-sm text-muted-foreground">
              {summary.totalAllocated.toFixed(1)}h allocated of {summary.totalCapacity.toFixed(0)}h capacity
            </p>
          </div>
        </div>
      </div>

      {/* Project Allocations & Assigned Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Breakdown */}
        <div className="bg-card border rounded-lg">
          <div className="p-4 border-b">
            <h2 className="font-semibold">Project Allocations</h2>
            <p className="text-sm text-muted-foreground">Hours by project</p>
          </div>
          <div className="divide-y">
            {projectBreakdown.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No project allocations for this period
              </div>
            ) : (
              projectBreakdown.map((project) => (
                <div key={project.projectId} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{project.projectTitle}</h3>
                    <span className="text-sm font-medium">
                      {project.allocated.toFixed(1)}h
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 mb-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ 
                        width: `${Math.min(100, (project.allocated / summary.totalAllocated) * 100)}%` 
                      }}
                    />
                  </div>
                  {project.actual > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Actual: {project.actual.toFixed(1)}h
                    </p>
                  )}
                  {project.tasks.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {project.tasks.map(task => (
                        <span 
                          key={task.id}
                          className="text-xs px-2 py-0.5 rounded-full bg-muted"
                        >
                          {task.title}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Assigned Tasks */}
        <div className="bg-card border rounded-lg">
          <div className="p-4 border-b">
            <h2 className="font-semibold">Assigned Tasks</h2>
            <p className="text-sm text-muted-foreground">Open tasks assigned to {user.name}</p>
          </div>
          <div className="divide-y max-h-[400px] overflow-y-auto">
            {assignedTasks.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No assigned tasks
              </div>
            ) : (
              assignedTasks.map((task) => (
                <div key={task.id} className="p-4 hover:bg-muted/50">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{task.title}</h3>
                      <p className="text-sm text-muted-foreground">{task.project.title}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className={`text-xs px-2 py-0.5 rounded border ${getPriorityColor(task.priority)}`}>
                          {task.priority.toLowerCase()}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded border ${getStatusColor(task.status)}`}>
                          {task.status.toLowerCase().replace('_', ' ')}
                        </span>
                        {task.estimate && (
                          <span className="text-xs px-2 py-0.5 rounded bg-muted">
                            {task.estimate}h
                          </span>
                        )}
                      </div>
                    </div>
                    {task.dueDate && (
                      <div className="text-right text-xs text-muted-foreground">
                        Due {new Date(task.dueDate).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Upcoming Availability */}
      <div className="bg-card border rounded-lg">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Upcoming Availability</h2>
          <p className="text-sm text-muted-foreground">Capacity outlook for next 4 weeks</p>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {upcomingAvailability.map((week) => (
              <div 
                key={week.weekStart}
                className={`p-4 rounded-lg border ${
                  week.utilization > 100 
                    ? 'border-red-500/30 bg-red-500/5' 
                    : week.utilization < 50 
                      ? 'border-yellow-500/30 bg-yellow-500/5'
                      : 'border-green-500/30 bg-green-500/5'
                }`}
              >
                <p className="text-sm font-medium mb-2">{week.weekLabel}</p>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-2xl font-bold">
                    {week.utilization.toFixed(0)}%
                  </span>
                  <span className="text-xs text-muted-foreground mb-1">utilized</span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Allocated</span>
                    <span>{week.allocated.toFixed(1)}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Available</span>
                    <span className={week.available > 0 ? 'text-green-600' : ''}>
                      {week.available.toFixed(1)}h
                    </span>
                  </div>
                </div>
                {week.utilization > 100 && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-red-600">
                    <AlertCircle className="w-3 h-3" />
                    Overallocated
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
