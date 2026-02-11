'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Play, Pause, Square, Timer, ChevronDown, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { formatDuration } from '@/lib/utils'

interface Project {
  id: string
  title: string
}

interface Task {
  id: string
  title: string
  projectId: string
}

interface ActiveTimer {
  id: string
  projectId: string
  taskId: string | null
  description: string | null
  startTime: string
  billable: boolean
  project: {
    id: string
    title: string
  }
  task?: {
    id: string
    title: string
  } | null
}

interface TimerWidgetProps {
  projects: Project[]
  tasks: Task[]
  recentTasks?: Task[]
  onTimerStart?: () => void
  onTimerStop?: () => void
  className?: string
  compact?: boolean
}

const TIMER_STORAGE_KEY = 'pinkbeam-active-timer'

export function TimerWidget({
  projects,
  tasks,
  recentTasks = [],
  onTimerStart,
  onTimerStop,
  className,
  compact = false,
}: TimerWidgetProps) {
  const { toast } = useToast()
  const [isRunning, setIsRunning] = useState(false)
  const [elapsedMinutes, setElapsedMinutes] = useState(0)
  const [activeTimerId, setActiveTimerId] = useState<string | null>(null)
  const [selectedProjectId, setSelectedProjectId] = useState('')
  const [selectedTaskId, setSelectedTaskId] = useState('')
  const [description, setDescription] = useState('')
  const [billable, setBillable] = useState(true)
  const [showDetails, setShowDetails] = useState(false)
  const [loading, setLoading] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Load active timer on mount
  useEffect(() => {
    const loadActiveTimer = async () => {
      try {
        const response = await fetch('/api/labs/time-entries/timer')
        const result = await response.json()

        if (result.success && result.data) {
          const timer: ActiveTimer = result.data
          setIsRunning(true)
          setActiveTimerId(timer.id)
          setSelectedProjectId(timer.projectId)
          setSelectedTaskId(timer.taskId || '')
          setDescription(timer.description || '')
          setBillable(timer.billable)
          setElapsedMinutes(result.data.currentDuration || 0)
        }
      } catch (error) {
        console.error('Error loading active timer:', error)
      }
    }

    loadActiveTimer()
  }, [])

  // Timer interval
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsedMinutes(prev => prev + 1)
      }, 60000) // Update every minute
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning])

  const handleStart = async () => {
    if (!selectedProjectId) {
      toast({
        title: 'Project Required',
        description: 'Please select a project before starting the timer',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/labs/time-entries/timer/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: selectedProjectId,
          taskId: selectedTaskId || null,
          description: description || null,
          billable,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setIsRunning(true)
        setActiveTimerId(result.data.id)
        setElapsedMinutes(0)
        toast({
          title: 'Timer Started',
          description: `Tracking time on ${result.data.project.title}`,
        })
        onTimerStart?.()
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to start timer',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to start timer',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStop = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/labs/time-entries/timer/stop', {
        method: 'POST',
      })

      const result = await response.json()

      if (result.success) {
        setIsRunning(false)
        setActiveTimerId(null)
        setElapsedMinutes(0)
        toast({
          title: 'Timer Stopped',
          description: `Logged ${formatDuration(result.data.duration)} on ${result.data.project.title}`,
        })
        onTimerStop?.()
        // Reset form
        setDescription('')
        setSelectedTaskId('')
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to stop timer',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to stop timer',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredTasks = tasks.filter(
    task => task.projectId === selectedProjectId
  )

  const formatElapsedTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
  }

  if (compact) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <div className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-mono',
          isRunning ? 'bg-cyan-500/10 text-cyan-600 animate-pulse' : 'bg-muted'
        )}>
          <Timer className="w-4 h-4" />
          <span>{formatElapsedTime(elapsedMinutes)}</span>
        </div>
        
        {isRunning ? (
          <Button
            size="sm"
            variant="destructive"
            onClick={handleStop}
            disabled={loading}
          >
            <Square className="w-4 h-4 mr-1" />
            Stop
          </Button>
        ) : (
          <Button
            size="sm"
            className="bg-cyan-600 hover:bg-cyan-700"
            onClick={() => setShowDetails(true)}
          >
            <Play className="w-4 h-4 mr-1" />
            Start
          </Button>
        )}
      </div>
    )
  }

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-4">
        {/* Timer Display */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-12 h-12 rounded-full flex items-center justify-center',
              isRunning ? 'bg-cyan-500/10 text-cyan-600' : 'bg-muted'
            )}>
              <Clock className={cn('w-6 h-6', isRunning && 'animate-pulse')} />
            </div>
            <div>
              <div className={cn(
                'text-3xl font-mono font-bold tracking-tight',
                isRunning ? 'text-cyan-600' : 'text-muted-foreground'
              )}>
                {formatElapsedTime(elapsedMinutes)}
              </div>
              <p className="text-sm text-muted-foreground">
                {isRunning ? 'Timer running' : 'Ready to track'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isRunning ? (
              <Button
                size="lg"
                variant="destructive"
                onClick={handleStop}
                disabled={loading}
              >
                <Square className="w-5 h-5 mr-2" />
                Stop
              </Button>
            ) : (
              <Button
                size="lg"
                className="bg-cyan-600 hover:bg-cyan-700"
                onClick={handleStart}
                disabled={loading}
              >
                <Play className="w-5 h-5 mr-2" />
                Start
              </Button>
            )}
          </div>
        </div>

        {/* Details Toggle */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ChevronDown className={cn('w-4 h-4 transition-transform', showDetails && 'rotate-180')} />
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>

        {/* Details Form */}
        {showDetails && (
          <div className="space-y-4 pt-4 border-t">
            {/* Project Selection */}
            <div className="space-y-2">
              <Label htmlFor="project">Project</Label>
              <Select
                value={selectedProjectId}
                onValueChange={(value) => {
                  setSelectedProjectId(value)
                  setSelectedTaskId('')
                }}
                disabled={isRunning}
              >
                <SelectTrigger id="project">
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Task Selection */}
            <div className="space-y-2">
              <Label htmlFor="task">Task (Optional)</Label>
              <Select
                value={selectedTaskId}
                onValueChange={setSelectedTaskId}
                disabled={isRunning || !selectedProjectId}
              >
                <SelectTrigger id="task">
                  <SelectValue placeholder="Select a task" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No specific task</SelectItem>
                  {filteredTasks.map((task) => (
                    <SelectItem key={task.id} value={task.id}>
                      {task.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Recent Tasks Quick Select */}
            {!isRunning && recentTasks.length > 0 && (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Recent Tasks</Label>
                <div className="flex flex-wrap gap-2">
                  {recentTasks.slice(0, 5).map((task) => (
                    <button
                      key={task.id}
                      onClick={() => {
                        setSelectedProjectId(task.projectId)
                        setSelectedTaskId(task.id)
                      }}
                      className="text-xs px-2 py-1 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                    >
                      {task.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What are you working on?"
                rows={2}
                disabled={isRunning}
              />
            </div>

            {/* Billable Toggle */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Billable</Label>
                <p className="text-xs text-muted-foreground">
                  Include this time in billing reports
                </p>
              </div>
              <button
                onClick={() => setBillable(!billable)}
                disabled={isRunning}
                className={cn(
                  'px-3 py-1 rounded-full text-sm font-medium transition-colors',
                  billable
                    ? 'bg-green-500/10 text-green-600'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {billable ? 'Billable' : 'Non-billable'}
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
