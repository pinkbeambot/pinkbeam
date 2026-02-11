'use client'

import { useState, useEffect } from 'react'
import { format, parseISO } from 'date-fns'
import { CalendarIcon, Clock, Save, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

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
  project?: { id: string; title: string }
  task?: { id: string; title: string } | null
}

interface TimeEntryFormProps {
  projects: Project[]
  tasks: Task[]
  entry?: TimeEntry | null
  selectedDate?: Date
  onSuccess: () => void
  onCancel: () => void
  className?: string
}

export function TimeEntryForm({
  projects,
  tasks,
  entry,
  selectedDate,
  onSuccess,
  onCancel,
  className,
}: TimeEntryFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [date, setDate] = useState<Date>(selectedDate || new Date())
  const [projectId, setProjectId] = useState('')
  const [taskId, setTaskId] = useState('')
  const [description, setDescription] = useState('')
  const [hours, setHours] = useState('')
  const [minutes, setMinutes] = useState('')
  const [billable, setBillable] = useState(true)
  const [useTimeRange, setUseTimeRange] = useState(false)
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('17:00')

  // Populate form when editing
  useEffect(() => {
    if (entry) {
      setProjectId(entry.projectId)
      setTaskId(entry.taskId || '')
      setDescription(entry.description || '')
      setBillable(entry.billable)
      
      const entryDate = new Date(entry.startTime)
      setDate(entryDate)
      
      // Calculate hours and minutes from duration
      const entryHours = Math.floor(entry.duration / 60)
      const entryMinutes = entry.duration % 60
      setHours(entryHours.toString())
      setMinutes(entryMinutes.toString())
      
      // If entry has start and end time, show time range
      if (entry.endTime) {
        setUseTimeRange(true)
        setStartTime(format(entryDate, 'HH:mm'))
        const endDate = new Date(entry.endTime)
        setEndTime(format(endDate, 'HH:mm'))
      }
    } else {
      // Reset form for new entry
      setProjectId('')
      setTaskId('')
      setDescription('')
      setHours('')
      setMinutes('')
      setBillable(true)
      setUseTimeRange(false)
      setStartTime('09:00')
      setEndTime('17:00')
      setDate(selectedDate || new Date())
    }
  }, [entry, selectedDate])

  const filteredTasks = tasks.filter(
    task => task.projectId === projectId
  )

  const calculateDuration = (): number => {
    if (useTimeRange) {
      const [startH, startM] = startTime.split(':').map(Number)
      const [endH, endM] = endTime.split(':').map(Number)
      const startMinutes = startH * 60 + startM
      const endMinutes = endH * 60 + endM
      return Math.max(0, endMinutes - startMinutes)
    } else {
      const h = parseInt(hours) || 0
      const m = parseInt(minutes) || 0
      return h * 60 + m
    }
  }

  const calculateTimesFromDuration = () => {
    const h = parseInt(hours) || 0
    const m = parseInt(minutes) || 0
    const totalMinutes = h * 60 + m
    
    // Assume starting at 9 AM
    const startH = 9
    const startM = 0
    const endTotalMinutes = startH * 60 + startM + totalMinutes
    const endH = Math.floor(endTotalMinutes / 60)
    const endM = endTotalMinutes % 60
    
    return {
      start: `${startH.toString().padStart(2, '0')}:${startM.toString().padStart(2, '0')}`,
      end: `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`,
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!projectId) {
      toast({
        title: 'Project Required',
        description: 'Please select a project',
        variant: 'destructive',
      })
      return
    }

    const duration = calculateDuration()
    if (duration <= 0) {
      toast({
        title: 'Invalid Duration',
        description: 'Please enter a valid duration',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)

    try {
      // Calculate start and end times
      const [startH, startM] = useTimeRange
        ? startTime.split(':').map(Number)
        : [9, 0]
      const [endH, endM] = useTimeRange
        ? endTime.split(':').map(Number)
        : (() => {
            const totalM = startH * 60 + startM + duration
            return [Math.floor(totalM / 60), totalM % 60]
          })()

      const startDateTime = new Date(date)
      startDateTime.setHours(startH, startM, 0, 0)

      const endDateTime = new Date(date)
      endDateTime.setHours(endH, endM, 0, 0)

      const payload = {
        projectId,
        taskId: taskId || null,
        description: description || null,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        duration,
        billable,
      }

      const url = entry
        ? `/api/labs/time-entries/${entry.id}`
        : '/api/labs/time-entries'
      const method = entry ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: 'Success',
          description: entry ? 'Time entry updated' : 'Time entry created',
        })
        onSuccess()
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to save time entry',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save time entry',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-4', className)}>
      {/* Date Picker */}
      <div className="space-y-2">
        <Label>Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-full justify-start text-left font-normal',
                !date && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, 'PPP') : 'Pick a date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => d && setDate(d)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Project Selection */}
      <div className="space-y-2">
        <Label htmlFor="project">Project *</Label>
        <Select value={projectId} onValueChange={(value) => {
          setProjectId(value)
          setTaskId('')
        }}>
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
        <Select value={taskId} onValueChange={setTaskId} disabled={!projectId}>
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

      {/* Duration Input Toggle */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setUseTimeRange(false)}
          className={cn(
            'text-sm px-3 py-1 rounded-full transition-colors',
            !useTimeRange ? 'bg-cyan-500/10 text-cyan-600' : 'text-muted-foreground'
          )}
        >
          Duration
        </button>
        <button
          type="button"
          onClick={() => setUseTimeRange(true)}
          className={cn(
            'text-sm px-3 py-1 rounded-full transition-colors',
            useTimeRange ? 'bg-cyan-500/10 text-cyan-600' : 'text-muted-foreground'
          )}
        >
          Time Range
        </button>
      </div>

      {/* Duration Input */}
      {!useTimeRange ? (
        <div className="space-y-2">
          <Label>Duration</Label>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Input
                type="number"
                min="0"
                max="23"
                placeholder="Hours"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
              />
            </div>
            <span className="text-muted-foreground">:</span>
            <div className="flex-1">
              <Input
                type="number"
                min="0"
                max="59"
                placeholder="Minutes"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
              />
            </div>
          </div>
        </div>
      ) : (
        /* Time Range Input */
        <div className="space-y-2">
          <Label>Time Range</Label>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <span className="text-muted-foreground">to</span>
            <div className="flex-1">
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
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
          placeholder="What did you work on?"
          rows={3}
        />
      </div>

      {/* Billable Toggle */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
        <div className="space-y-0.5">
          <Label className="cursor-pointer">Billable</Label>
          <p className="text-xs text-muted-foreground">
            Include this time in billing reports
          </p>
        </div>
        <button
          type="button"
          onClick={() => setBillable(!billable)}
          className={cn(
            'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
            billable
              ? 'bg-green-500/10 text-green-600'
              : 'bg-muted-foreground/20 text-muted-foreground'
          )}
        >
          {billable ? 'Billable' : 'Non-billable'}
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button type="submit" disabled={loading} className="bg-cyan-600 hover:bg-cyan-700">
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Saving...' : entry ? 'Update Entry' : 'Save Entry'}
        </Button>
      </div>
    </form>
  )
}
