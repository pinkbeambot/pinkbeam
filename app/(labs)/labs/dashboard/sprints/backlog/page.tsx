'use client'

export const dynamic = 'force-dynamic';

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { PageHeader } from '@/components/labs-dashboard/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ArrowLeft,
  Search,
  Loader2,
  ArrowRight,
  Calendar,
  Target,
  LayoutGrid,
  CheckSquare,
  Filter,
} from 'lucide-react'
import { format } from 'date-fns'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { TaskStatus, TaskPriority } from '@prisma/client'

interface Task {
  id: string
  title: string
  status: TaskStatus
  priority: TaskPriority
  storyPoints: number | null
  assignee: {
    id: string
    name: string | null
    email: string
  } | null
}

interface Sprint {
  id: string
  name: string
  goal: string | null
  startDate: string
  endDate: string
  status: 'PLANNING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
  totalPoints: number
  completedPoints: number
}

const statusConfig: Record<string, { label: string; className: string }> = {
  PLANNING: { label: 'Planning', className: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  ACTIVE: { label: 'Active', className: 'bg-green-500/10 text-green-400 border-green-500/20' },
  COMPLETED: { label: 'Completed', className: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
  CANCELLED: { label: 'Cancelled', className: 'bg-gray-500/10 text-gray-400 border-gray-500/20' },
}

const priorityConfig: Record<string, { label: string; className: string }> = {
  LOW: { label: 'Low', className: 'bg-gray-500/10 text-gray-400' },
  MEDIUM: { label: 'Medium', className: 'bg-blue-500/10 text-blue-400' },
  HIGH: { label: 'High', className: 'bg-orange-500/10 text-orange-400' },
  URGENT: { label: 'Urgent', className: 'bg-red-500/10 text-red-400' },
}

export default function SprintPlanningPage() {
  const searchParams = useSearchParams()
  const sprintId = searchParams.get('sprint')
  const { toast } = useToast()

  const [sprints, setSprints] = useState<Sprint[]>([])
  const [selectedSprint, setSelectedSprint] = useState<Sprint | null>(null)
  const [backlogTasks, setBacklogTasks] = useState<Task[]>([])
  const [sprintTasks, setSprintTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('ALL')
  const [selectedBacklogTasks, setSelectedBacklogTasks] = useState<Set<string>>(new Set())
  const [selectedSprintTasks, setSelectedSprintTasks] = useState<Set<string>>(new Set())
  const [isAdding, setIsAdding] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)

  const fetchSprints = useCallback(async () => {
    try {
      const response = await fetch('/api/labs/projects/demo/sprints')
      const result = await response.json()

      if (result.success) {
        setSprints(result.data)
        // Select the first non-completed sprint or the one from URL
        const targetSprint = sprintId 
          ? result.data.find((s: Sprint) => s.id === sprintId)
          : result.data.find((s: Sprint) => s.status !== 'COMPLETED' && s.status !== 'CANCELLED')
        
        if (targetSprint) {
          setSelectedSprint(targetSprint)
        }
      }
    } catch (err) {
      console.error('Error fetching sprints:', err)
    }
  }, [sprintId])

  const fetchBacklogTasks = useCallback(async () => {
    try {
      const response = await fetch('/api/labs/projects/demo/tasks?status=ALL&backlog=true')
      const result = await response.json()

      if (result.success) {
        // Filter out tasks already in a sprint
        const backlogOnly = result.data.filter((task: Task) => !sprintTasks.find((t) => t.id === task.id))
        setBacklogTasks(backlogOnly)
      }
    } catch (err) {
      console.error('Error fetching backlog tasks:', err)
    }
  }, [sprintTasks])

  const fetchSprintTasks = useCallback(async () => {
    if (!selectedSprint) return

    try {
      const response = await fetch(`/api/labs/projects/demo/sprints/${selectedSprint.id}/tasks`)
      const result = await response.json()

      if (result.success) {
        setSprintTasks(result.data)
      }
    } catch (err) {
      console.error('Error fetching sprint tasks:', err)
    }
  }, [selectedSprint])

  useEffect(() => {
    fetchSprints()
  }, [fetchSprints])

  useEffect(() => {
    if (selectedSprint) {
      fetchSprintTasks()
    }
  }, [selectedSprint, fetchSprintTasks])

  useEffect(() => {
    if (sprintTasks.length >= 0) {
      fetchBacklogTasks()
    }
  }, [sprintTasks, fetchBacklogTasks])

  useEffect(() => {
    setLoading(false)
  }, [backlogTasks, sprintTasks])

  const handleAddToSprint = async () => {
    if (!selectedSprint || selectedBacklogTasks.size === 0) return

    setIsAdding(true)
    try {
      const response = await fetch(`/api/labs/projects/demo/sprints/${selectedSprint.id}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskIds: Array.from(selectedBacklogTasks) }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: 'Success',
          description: `${selectedBacklogTasks.size} task(s) added to sprint`,
        })
        setSelectedBacklogTasks(new Set())
        fetchSprintTasks()
        fetchBacklogTasks()
        
        // Refresh sprint data to get updated points
        const sprintResponse = await fetch(`/api/labs/projects/demo/sprints/${selectedSprint.id}`)
        const sprintResult = await sprintResponse.json()
        if (sprintResult.success) {
          setSelectedSprint(sprintResult.data)
        }
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to add tasks to sprint',
          variant: 'destructive',
        })
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to add tasks to sprint',
        variant: 'destructive',
      })
    } finally {
      setIsAdding(false)
    }
  }

  const handleRemoveFromSprint = async () => {
    if (!selectedSprint || selectedSprintTasks.size === 0) return

    setIsRemoving(true)
    try {
      const response = await fetch(
        `/api/labs/projects/demo/sprints/${selectedSprint.id}/tasks?taskIds=${Array.from(selectedSprintTasks).join(',')}`,
        { method: 'DELETE' }
      )

      const result = await response.json()

      if (result.success) {
        toast({
          title: 'Success',
          description: `${selectedSprintTasks.size} task(s) removed from sprint`,
        })
        setSelectedSprintTasks(new Set())
        fetchSprintTasks()
        fetchBacklogTasks()
        
        // Refresh sprint data
        const sprintResponse = await fetch(`/api/labs/projects/demo/sprints/${selectedSprint.id}`)
        const sprintResult = await sprintResponse.json()
        if (sprintResult.success) {
          setSelectedSprint(sprintResult.data)
        }
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to remove tasks from sprint',
          variant: 'destructive',
        })
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to remove tasks from sprint',
        variant: 'destructive',
      })
    } finally {
      setIsRemoving(false)
    }
  }

  const filteredBacklogTasks = backlogTasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPriority = priorityFilter === 'ALL' || task.priority === priorityFilter
    return matchesSearch && matchesPriority
  })

  const calculatePoints = (tasks: Task[]) => {
    return tasks.reduce((sum, task) => sum + (task.storyPoints || 0), 0)
  }

  const selectedBacklogPoints = calculatePoints(
    backlogTasks.filter((t) => selectedBacklogTasks.has(t.id))
  )
  const selectedSprintPoints = calculatePoints(
    sprintTasks.filter((t) => selectedSprintTasks.has(t.id))
  )

  const sprintCapacity = 40 // Default sprint capacity - could be configurable
  const currentSprintPoints = calculatePoints(sprintTasks)
  const capacityUsed = Math.round((currentSprintPoints / sprintCapacity) * 100)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sprint Planning"
        description="Assign tasks from the backlog to your sprint"
      />

      {/* Navigation */}
      <Button variant="ghost" size="sm" asChild className="-ml-2">
        <Link href="/labs/dashboard/sprints">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Sprints
        </Link>
      </Button>

      {/* Sprint Selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="flex-1">
              <label className="text-sm font-medium mb-1.5 block">Select Sprint</label>
              <Select
                value={selectedSprint?.id}
                onValueChange={(value) => {
                  const sprint = sprints.find((s) => s.id === value)
                  setSelectedSprint(sprint || null)
                }}
              >
                <SelectTrigger className="w-full md:w-80">
                  <SelectValue placeholder="Choose a sprint" />
                </SelectTrigger>
                <SelectContent>
                  {sprints.map((sprint) => (
                    <SelectItem key={sprint.id} value={sprint.id}>
                      <span className="flex items-center gap-2">
                        {sprint.name}
                        <Badge variant="outline" className={cn('text-xs', statusConfig[sprint.status].className)}>
                          {statusConfig[sprint.status].label}
                        </Badge>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedSprint && (
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {format(new Date(selectedSprint.startDate), 'MMM d')} - {format(new Date(selectedSprint.endDate), 'MMM d')}
                  </span>
                </div>
                {selectedSprint.goal && (
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground truncate max-w-xs">
                      {selectedSprint.goal}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {selectedSprint && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Sprint Capacity</span>
                <span className={cn(
                  'text-sm font-medium',
                  capacityUsed > 100 ? 'text-red-500' : capacityUsed > 80 ? 'text-yellow-500' : 'text-green-500'
                )}>
                  {currentSprintPoints} / {sprintCapacity} points ({capacityUsed}%)
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full transition-all',
                    capacityUsed > 100 ? 'bg-red-500' : capacityUsed > 80 ? 'bg-yellow-500' : 'bg-green-500'
                  )}
                  style={{ width: `${Math.min(capacityUsed, 100)}%` }}
                />
              </div>
              {capacityUsed > 100 && (
                <p className="text-xs text-red-500 mt-1">Over capacity! Consider removing some tasks.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
        </div>
      ) : !selectedSprint ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Select a Sprint</h3>
            <p className="text-muted-foreground">Choose a sprint to start planning</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Backlog */}
          <Card className="flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-muted-foreground" />
                  Backlog
                  <Badge variant="secondary">{backlogTasks.length}</Badge>
                </CardTitle>
              </div>
              <div className="flex gap-2 mt-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search backlog..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-32">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All</SelectItem>
                    <SelectItem value="URGENT">Urgent</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="LOW">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto max-h-[500px]">
              <div className="space-y-2">
                {filteredBacklogTasks.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckSquare className="w-12 h-12 mx-auto mb-4" />
                    <p>No tasks in backlog</p>
                  </div>
                ) : (
                  filteredBacklogTasks.map((task) => (
                    <div
                      key={task.id}
                      className={cn(
                        'flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors',
                        selectedBacklogTasks.has(task.id) && 'border-cyan-500 bg-cyan-500/5'
                      )}
                      onClick={() => {
                        const newSelected = new Set(selectedBacklogTasks)
                        if (newSelected.has(task.id)) {
                          newSelected.delete(task.id)
                        } else {
                          newSelected.add(task.id)
                        }
                        setSelectedBacklogTasks(newSelected)
                      }}
                    >
                      <Checkbox
                        checked={selectedBacklogTasks.has(task.id)}
                        onCheckedChange={(checked) => {
                          const newSelected = new Set(selectedBacklogTasks)
                          if (checked) {
                            newSelected.add(task.id)
                          } else {
                            newSelected.delete(task.id)
                          }
                          setSelectedBacklogTasks(newSelected)
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-2">{task.title}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <Badge variant="outline" className={cn('text-xs', priorityConfig[task.priority].className)}>
                            {priorityConfig[task.priority].label}
                          </Badge>
                          {task.storyPoints && (
                            <Badge variant="outline" className="text-xs">
                              {task.storyPoints} pts
                            </Badge>
                          )}
                          {task.assignee && (
                            <span className="text-xs text-muted-foreground">
                              @{task.assignee.name || task.assignee.email}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
            {selectedBacklogTasks.size > 0 && (
              <CardContent className="pt-0">
                <Button
                  className="w-full bg-cyan-600 hover:bg-cyan-700"
                  onClick={handleAddToSprint}
                  disabled={isAdding}
                >
                  {isAdding ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <ArrowRight className="w-4 h-4 mr-2" />
                  )}
                  Add {selectedBacklogTasks.size} Task(s) ({selectedBacklogPoints} pts)
                </Button>
              </CardContent>
            )}
          </Card>

          {/* Sprint */}
          <Card className="flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <LayoutGrid className="w-5 h-5 text-cyan-500" />
                  {selectedSprint.name}
                  <Badge variant="secondary">{sprintTasks.length}</Badge>
                </CardTitle>
              </div>
              <div className="flex items-center justify-between mt-2 text-sm">
                <span className="text-muted-foreground">
                  {currentSprintPoints} points committed
                </span>
                <span className="text-muted-foreground">
                  {sprintTasks.filter((t) => t.status === 'COMPLETED').length} completed
                </span>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto max-h-[500px]">
              <div className="space-y-2">
                {sprintTasks.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <LayoutGrid className="w-12 h-12 mx-auto mb-4" />
                    <p>No tasks in this sprint</p>
                    <p className="text-sm">Select tasks from the backlog to add them</p>
                  </div>
                ) : (
                  sprintTasks.map((task) => (
                    <div
                      key={task.id}
                      className={cn(
                        'flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors',
                        selectedSprintTasks.has(task.id) && 'border-red-500 bg-red-500/5'
                      )}
                      onClick={() => {
                        const newSelected = new Set(selectedSprintTasks)
                        if (newSelected.has(task.id)) {
                          newSelected.delete(task.id)
                        } else {
                          newSelected.add(task.id)
                        }
                        setSelectedSprintTasks(newSelected)
                      }}
                    >
                      <Checkbox
                        checked={selectedSprintTasks.has(task.id)}
                        onCheckedChange={(checked) => {
                          const newSelected = new Set(selectedSprintTasks)
                          if (checked) {
                            newSelected.add(task.id)
                          } else {
                            newSelected.delete(task.id)
                          }
                          setSelectedSprintTasks(newSelected)
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-2">{task.title}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <Badge variant="outline" className={cn('text-xs', priorityConfig[task.priority].className)}>
                            {priorityConfig[task.priority].label}
                          </Badge>
                          {task.storyPoints && (
                            <Badge variant="outline" className="text-xs">
                              {task.storyPoints} pts
                            </Badge>
                          )}
                          {task.assignee && (
                            <span className="text-xs text-muted-foreground">
                              @{task.assignee.name || task.assignee.email}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
            {selectedSprintTasks.size > 0 && (
              <CardContent className="pt-0">
                <Button
                  variant="outline"
                  className="w-full text-destructive hover:text-destructive border-destructive hover:bg-destructive/5"
                  onClick={handleRemoveFromSprint}
                  disabled={isRemoving}
                >
                  {isRemoving ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <ArrowLeft className="w-4 h-4 mr-2" />
                  )}
                  Remove {selectedSprintTasks.size} Task(s) ({selectedSprintPoints} pts)
                </Button>
              </CardContent>
            )}
          </Card>
        </div>
      )}
    </div>
  )
}
