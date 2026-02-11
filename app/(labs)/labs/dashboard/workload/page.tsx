'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PageHeader } from '@/components/labs-dashboard/PageHeader'
import { UtilizationGauge } from '@/components/labs-dashboard/UtilizationGauge'
import { CapacityCalendar } from '@/components/labs-dashboard/CapacityCalendar'
import { AllocationStackedBar } from '@/components/labs-dashboard/AllocationStackedBar'
import { AlertTriangle, CheckCircle, Clock, Users, TrendingUp, Calendar } from 'lucide-react'

interface TeamMember {
  userId: string
  name: string
  email: string
  role: string
  avatar: string
  capacity: number
  allocated: number
  actual: number
  utilization: number
  available: number
  taskCount: number
  projectBreakdown: Array<{
    projectId: string
    projectTitle: string
    hours: number
  }>
  status: 'overallocated' | 'underutilized' | 'balanced'
}

interface WorkloadSummary {
  teamSize: number
  totalCapacity: number
  totalAllocated: number
  totalActual: number
  teamUtilization: number
  overallocationCount: number
  underutilizationCount: number
}

interface WorkloadData {
  period: {
    start: string
    end: string
    view: string
  }
  summary: WorkloadSummary
  members: TeamMember[]
  alerts: {
    overallocated: TeamMember[]
    underutilized: TeamMember[]
  }
}

export default function WorkloadDashboardPage() {
  const [data, setData] = useState<WorkloadData | null>(null)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'weekly' | 'monthly'>('weekly')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    fetchWorkloadData()
  }, [view, selectedDate])

  async function fetchWorkloadData() {
    try {
      setLoading(true)
      const response = await fetch(`/api/labs/workload?view=${view}&date=${selectedDate}`)
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
        <PageHeader title="Team Workload" description="Failed to load workload data" />
      </div>
    )
  }

  const { summary, members, alerts } = data

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Team Workload" 
        description="Monitor capacity, assignments, and utilization across team members"
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
        
        <div className="flex gap-4 text-sm">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Balanced
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
            Underutilized
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            Overallocated
          </span>
        </div>
      </div>

      {/* Alerts Banner */}
      {(alerts.overallocated.length > 0 || alerts.underutilized.length > 0) && (
        <div className="space-y-3">
          {alerts.overallocated.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-red-700 dark:text-red-400">
                  {alerts.overallocated.length} team member{alerts.overallocated.length > 1 ? 's are' : ' is'} overallocated
                </h3>
                <p className="text-sm text-muted-foreground">
                  {alerts.overallocated.map(m => m.name).join(', ')} - Consider redistributing tasks
                </p>
              </div>
            </div>
          )}
          
          {alerts.underutilized.length > 0 && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 flex items-start gap-3">
              <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-700 dark:text-yellow-400">
                  {alerts.underutilized.length} team member{alerts.underutilized.length > 1 ? 's are' : ' is'} underutilized
                </h3>
                <p className="text-sm text-muted-foreground">
                  {alerts.underutilized.map(m => m.name).join(', ')} - Consider assigning more work
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Team Utilization</p>
              <p className="text-2xl font-bold">{summary.teamUtilization.toFixed(1)}%</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            {summary.totalAllocated.toFixed(1)}h / {summary.totalCapacity.toFixed(1)}h
          </div>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Team Size</p>
              <p className="text-2xl font-bold">{summary.teamSize}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            Active members
          </div>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Overallocated</p>
              <p className="text-2xl font-bold text-red-500">{summary.overallocationCount}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            {'>'} 100% capacity
          </div>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Underutilized</p>
              <p className="text-2xl font-bold text-yellow-600">{summary.underutilizationCount}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            &lt; 50% capacity
          </div>
        </div>
      </div>

      {/* Team Utilization Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team List */}
        <div className="lg:col-span-2 bg-card border rounded-lg">
          <div className="p-4 border-b">
            <h2 className="font-semibold">Team Members</h2>
            <p className="text-sm text-muted-foreground">Capacity and workload per member</p>
          </div>
          <div className="divide-y">
            {members.map((member) => (
              <Link
                key={member.userId}
                href={`/labs/dashboard/workload/${member.userId}`}
                className="block p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-medium text-primary">
                    {member.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium truncate">{member.name}</h3>
                      {member.status === 'overallocated' && (
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      )}
                      {member.status === 'balanced' && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{member.email}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-4">
                      <div className="w-32">
                        <UtilizationGauge 
                          percentage={member.utilization} 
                          size="sm"
                        />
                      </div>
                      <div className="text-right min-w-[80px]">
                        <p className="font-medium">{member.utilization.toFixed(0)}%</p>
                        <p className="text-xs text-muted-foreground">
                          {member.allocated.toFixed(1)}h / {member.capacity.toFixed(0)}h
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Project breakdown */}
                {member.projectBreakdown.length > 0 && (
                  <div className="mt-3 pl-14">
                    <AllocationStackedBar 
                      allocations={member.projectBreakdown}
                      total={member.capacity}
                      size="sm"
                    />
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Capacity Calendar */}
        <div className="bg-card border rounded-lg">
          <div className="p-4 border-b">
            <h2 className="font-semibold">Capacity Heatmap</h2>
            <p className="text-sm text-muted-foreground">Visual overview of team capacity</p>
          </div>
          <div className="p-4">
            <CapacityCalendar 
              members={members}
              startDate={new Date(data.period.start)}
              endDate={new Date(data.period.end)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
