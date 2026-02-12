'use client'

import { useState, useEffect, useCallback } from 'react'
import { format, startOfWeek, endOfWeek, addDays, isSameDay, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, addWeeks, subWeeks, addMonths, subMonths } from 'date-fns'
import { Calendar, ChevronLeft, ChevronRight, Plus, Clock, Play, Edit2, Trash2, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { TimerWidget } from '@/components/labs-dashboard/TimerWidget'
import { TimeEntryForm } from '@/components/labs-dashboard/TimeEntryForm'
import { PageHeader } from '@/components/labs-dashboard/PageHeader'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

interface Project {
  id: string
  title: string
}

interface Task {
  id: string
  title: string
  projectId: string
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

export default function TimeTrackingPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('daily')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null)
  const [deletingEntry, setDeletingEntry] = useState<TimeEntry | null>(null)

  const fetchTimeEntries = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        view: activeTab,
        date: selectedDate.toISOString(),
      })
      
      const response = await fetch(`/api/labs/time-entries?${params}`)
      const result = await response.json()
      
      if (result.success) {
        setTimeEntries(result.data)
      }
    } catch (error) {
      console.error('Error fetching time entries:', error)
    } finally {
      setLoading(false)
    }
  }, [activeTab, selectedDate])

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

  const fetchTasks = useCallback(async () => {
    try {
      // Fetch tasks from all projects
      const allTasks: Task[] = []
      for (const project of projects) {
        const response = await fetch(`/api/labs/projects/${project.id}/tasks`)
        const result = await response.json()
        if (result.success) {
          allTasks.push(...result.data.map((t: { id: string; title: string; projectId: string }) => ({
            id: t.id,
            title: t.title,
            projectId: t.projectId,
          })))
        }
      }
      setTasks(allTasks)
    } catch (error) {
      console.error('Error fetching tasks:', error)
    }
  }, [projects])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  useEffect(() => {
    if (projects.length > 0) {
      fetchTasks()
    }
  }, [projects, fetchTasks])

  useEffect(() => {
    fetchTimeEntries()
  }, [fetchTimeEntries])

  const handleCreateEntry = () => {
    setEditingEntry(null)
    setIsModalOpen(true)
  }

  const handleEditEntry = (entry: TimeEntry) => {
    setEditingEntry(entry)
    setIsModalOpen(true)
  }

  const handleDeleteEntry = async () => {
    if (!deletingEntry) return

    try {
      const response = await fetch(`/api/labs/time-entries/${deletingEntry.id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        toast({ title: 'Success', description: 'Time entry deleted' })
        fetchTimeEntries()
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to delete entry',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete entry', variant: 'destructive' })
    } finally {
      setDeletingEntry(null)
    }
  }

  const handleSuccess = () => {
    setIsModalOpen(false)
    setEditingEntry(null)
    fetchTimeEntries()
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const totalDuration = timeEntries.reduce((sum, entry) => sum + entry.duration, 0)
  const billableDuration = timeEntries
    .filter(e => e.billable)
    .reduce((sum, entry) => sum + entry.duration, 0)

  // Navigation handlers
  const goToPrevious = () => {
    if (activeTab === 'daily') {
      setSelectedDate(prev => addDays(prev, -1))
    } else if (activeTab === 'weekly') {
      setSelectedDate(prev => subWeeks(prev, 1))
    } else {
      setSelectedDate(prev => subMonths(prev, 1))
    }
  }

  const goToNext = () => {
    if (activeTab === 'daily') {
      setSelectedDate(prev => addDays(prev, 1))
    } else if (activeTab === 'weekly') {
      setSelectedDate(prev => addWeeks(prev, 1))
    } else {
      setSelectedDate(prev => addMonths(prev, 1))
    }
  }

  const goToToday = () => {
    setSelectedDate(new Date())
  }

  // Daily View
  const DailyView = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={goToPrevious}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h3 className="text-lg font-semibold">
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </h3>
          <Button variant="outline" size="icon" onClick={goToNext}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <Button variant="outline" onClick={goToToday}>Today</Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Time</p>
            <p className="text-2xl font-bold">{formatDuration(totalDuration)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Billable</p>
            <p className="text-2xl font-bold text-green-600">{formatDuration(billableDuration)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Entries</p>
            <p className="text-2xl font-bold">{timeEntries.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-2">
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : timeEntries.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No time entries for this day</p>
            <Button variant="outline" className="mt-4" onClick={handleCreateEntry}>
              <Plus className="w-4 h-4 mr-2" />
              Add Time Entry
            </Button>
          </div>
        ) : (
          timeEntries.map((entry) => (
            <Card key={entry.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{entry.project.title}</span>
                      {entry.task && (
                        <>
                          <span className="text-muted-foreground">/</span>
                          <span className="text-sm text-muted-foreground">{entry.task.title}</span>
                        </>
                      )}
                      {entry.billable ? (
                        <Badge variant="secondary" className="text-green-600 bg-green-500/10">Billable</Badge>
                      ) : (
                        <Badge variant="secondary">Non-billable</Badge>
                      )}
                    </div>
                    {entry.description && (
                      <p className="text-sm text-muted-foreground">{entry.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(parseISO(entry.startTime), 'h:mm a')} - 
                      {entry.endTime ? format(parseISO(entry.endTime), 'h:mm a') : 'ongoing'}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-mono font-semibold">{formatDuration(entry.duration)}</span>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEditEntry(entry)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeletingEntry(entry)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )

  // Weekly View
  const WeeklyView = () => {
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 })
    const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 })
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd })

    const getEntriesForDay = (day: Date) => {
      return timeEntries.filter(entry => isSameDay(parseISO(entry.startTime), day))
    }

    const getDurationForDay = (day: Date) => {
      return getEntriesForDay(day).reduce((sum, entry) => sum + entry.duration, 0)
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={goToPrevious}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h3 className="text-lg font-semibold">
              {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
            </h3>
            <Button variant="outline" size="icon" onClick={goToNext}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <Button variant="outline" onClick={goToToday}>This Week</Button>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => (
            <div
              key={day.toISOString()}
              className={cn(
                'border rounded-lg p-3 min-h-[120px] cursor-pointer hover:bg-muted/50 transition-colors',
                isSameDay(day, new Date()) && 'border-cyan-500 bg-cyan-500/5'
              )}
              onClick={() => {
                setSelectedDate(day)
                setActiveTab('daily')
              }}
            >
              <p className={cn(
                'text-xs font-medium mb-2',
                isSameDay(day, new Date()) ? 'text-cyan-600' : 'text-muted-foreground'
              )}>
                {format(day, 'EEE')}
              </p>
              <p className="text-lg font-semibold mb-2">{format(day, 'd')}</p>
              <div className="space-y-1">
                {getEntriesForDay(day).slice(0, 3).map((entry, i) => (
                  <div
                    key={i}
                    className={cn(
                      'text-xs truncate px-1.5 py-0.5 rounded',
                      entry.billable ? 'bg-green-500/10 text-green-700' : 'bg-muted'
                    )}
                  >
                    {formatDuration(entry.duration)} - {entry.project.title}
                  </div>
                ))}
                {getEntriesForDay(day).length > 3 && (
                  <p className="text-xs text-muted-foreground text-center">
                    +{getEntriesForDay(day).length - 3} more
                  </p>
                )}
              </div>
              {getDurationForDay(day) > 0 && (
                <p className="text-xs font-medium text-right mt-2">
                  {formatDuration(getDurationForDay(day))}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Weekly Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Weekly Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">{formatDuration(totalDuration)}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{formatDuration(billableDuration)}</p>
                <p className="text-sm text-muted-foreground">Billable</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{timeEntries.length}</p>
                <p className="text-sm text-muted-foreground">Entries</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Monthly View
  const MonthlyView = () => {
    const monthStart = startOfMonth(selectedDate)
    const monthEnd = endOfMonth(selectedDate)
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

    const getDurationForDay = (day: Date) => {
      return timeEntries
        .filter(entry => isSameDay(parseISO(entry.startTime), day))
        .reduce((sum, entry) => sum + entry.duration, 0)
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={goToPrevious}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h3 className="text-lg font-semibold">{format(selectedDate, 'MMMM yyyy')}</h3>
            <Button variant="outline" size="icon" onClick={goToNext}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <Button variant="outline" onClick={goToToday}>This Month</Button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
              {day}
            </div>
          ))}
          {days.map((day) => {
            const duration = getDurationForDay(day)
            const hasEntries = duration > 0
            return (
              <div
                key={day.toISOString()}
                className={cn(
                  'border rounded-lg p-2 min-h-[80px] cursor-pointer hover:bg-muted/50 transition-colors',
                  isSameDay(day, new Date()) && 'border-cyan-500 bg-cyan-500/5'
                )}
                onClick={() => {
                  setSelectedDate(day)
                  setActiveTab('daily')
                }}
              >
                <p className={cn(
                  'text-sm font-medium',
                  isSameDay(day, new Date()) ? 'text-cyan-600' : ''
                )}>
                  {format(day, 'd')}
                </p>
                {hasEntries && (
                  <p className="text-xs font-medium text-green-600 mt-1">
                    {formatDuration(duration)}
                  </p>
                )}
              </div>
            )
          })}
        </div>

        {/* Monthly Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Monthly Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">{formatDuration(totalDuration)}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{formatDuration(billableDuration)}</p>
                <p className="text-sm text-muted-foreground">Billable</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{timeEntries.length}</p>
                <p className="text-sm text-muted-foreground">Entries</p>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {Math.round(totalDuration / (days.filter(d => getDurationForDay(d) > 0).length || 1))}m
                </p>
                <p className="text-sm text-muted-foreground">Avg/Day</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <PageHeader
          title="Time Tracking"
          description="Track and manage your time entries"
        />
        <div className="flex items-center gap-2">
          <Link href="/portal/admin/labs/time/reports">
            <Button variant="outline">
              <BarChart3 className="w-4 h-4 mr-2" />
              Reports
            </Button>
          </Link>
          <Button onClick={handleCreateEntry}>
            <Plus className="w-4 h-4 mr-2" />
            Add Entry
          </Button>
        </div>
      </div>

      {/* Timer Widget */}
      <TimerWidget
        projects={projects}
        tasks={tasks}
        onTimerStop={fetchTimeEntries}
      />

      {/* Timesheet Views */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>
        
        <TabsContent value="daily" className="mt-6">
          <DailyView />
        </TabsContent>
        
        <TabsContent value="weekly" className="mt-6">
          <WeeklyView />
        </TabsContent>
        
        <TabsContent value="monthly" className="mt-6">
          <MonthlyView />
        </TabsContent>
      </Tabs>

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingEntry ? 'Edit Time Entry' : 'Add Time Entry'}</DialogTitle>
          </DialogHeader>
          <TimeEntryForm
            projects={projects}
            tasks={tasks}
            entry={editingEntry}
            selectedDate={selectedDate}
            onSuccess={handleSuccess}
            onCancel={() => setIsModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deletingEntry} onOpenChange={() => setDeletingEntry(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Time Entry</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this time entry? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingEntry(null)}>Cancel</Button>
            <Button onClick={handleDeleteEntry} variant="destructive">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
