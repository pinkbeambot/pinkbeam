'use client'

import { useState, useEffect } from 'react'
import { Task as PrismaTask, TaskStatus, TaskPriority, TaskType, TaskLabel } from '@prisma/client'

interface TaskWithLabels extends PrismaTask {
  labels: { id: string; name: string; color: string }[]
}
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { TaskBadge } from './TaskBadge'
import { AssigneeAvatar } from './AssigneeAvatar'
import { TaskLabelList } from './TaskLabel'
import { CalendarIcon, Loader2, Plus, X, Clock, Timer } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface SimpleLabel {
  id: string
  name: string
  color: string
}

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (task: PrismaTask) => void
  projectId: string
  task?: TaskWithLabels | null
  members: Array<{ id: string; name: string | null; email: string; role: string }>
  labels: SimpleLabel[]
}

const statuses: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED', 'CANCELLED']
const priorities: TaskPriority[] = ['LOW', 'MEDIUM', 'HIGH', 'URGENT']
const types: TaskType[] = ['FEATURE', 'BUG', 'CHORE', 'DOCUMENTATION']

export function TaskModal({ isOpen, onClose, onSuccess, projectId, task, members, labels }: TaskModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'TODO' as TaskStatus,
    priority: 'MEDIUM' as TaskPriority,
    type: 'FEATURE' as TaskType,
    assigneeId: '',
    dueDate: '',
    estimate: '',
    labelIds: [] as string[],
  })
  const [newLabelName, setNewLabelName] = useState('')
  const [newLabelColor, setNewLabelColor] = useState('#06b6d4')
  const [showLabelInput, setShowLabelInput] = useState(false)
  const [taskTime, setTaskTime] = useState<{ duration: number; billable: number; entries: number } | null>(null)
  
  // Fetch time entries for this task
  useEffect(() => {
    if (task?.id) {
      fetch(`/api/labs/time-entries?taskId=${task.id}`)
        .then(res => res.json())
        .then(result => {
          if (result.success) {
            const entries = result.data
            const duration = entries.reduce((sum: number, e: { duration: number }) => sum + e.duration, 0)
            const billable = entries
              .filter((e: { billable: boolean }) => e.billable)
              .reduce((sum: number, e: { duration: number }) => sum + e.duration, 0)
            setTaskTime({ duration, billable, entries: entries.length })
          }
        })
        .catch(console.error)
    }
  }, [task?.id])
  
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours === 0) return `${mins}m`
    if (mins === 0) return `${hours}h`
    return `${hours}h ${mins}m`
  }
  
  // Reset form when modal opens/closes or task changes
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        type: task.type,
        assigneeId: task.assigneeId || '',
        dueDate: task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : '',
        estimate: task.estimate?.toString() || '',
        labelIds: task.labels?.map(l => l.id) || [],
      })
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'TODO',
        priority: 'MEDIUM',
        type: 'FEATURE',
        assigneeId: '',
        dueDate: '',
        estimate: '',
        labelIds: [],
      })
    }
  }, [task, isOpen])
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) return
    
    setLoading(true)
    try {
      const url = task
        ? `/api/labs/projects/${projectId}/tasks/${task.id}`
        : `/api/labs/projects/${projectId}/tasks`
      
      const method = task ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          assigneeId: formData.assigneeId || null,
          dueDate: formData.dueDate || null,
          estimate: formData.estimate ? parseInt(formData.estimate) : null,
        }),
      })
      
      const result = await response.json()
      
      if (result.success) {
        onSuccess(result.data)
        onClose()
      } else {
        console.error('Error saving task:', result.error)
      }
    } catch (error) {
      console.error('Error saving task:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleCreateLabel = async () => {
    if (!newLabelName.trim()) return
    
    try {
      const response = await fetch(`/api/labs/projects/${projectId}/tasks/labels`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newLabelName.trim(),
          color: newLabelColor,
        }),
      })
      
      const result = await response.json()
      
      if (result.success) {
        setFormData(prev => ({
          ...prev,
          labelIds: [...prev.labelIds, result.data.id],
        }))
        setNewLabelName('')
        setShowLabelInput(false)
      }
    } catch (error) {
      console.error('Error creating label:', error)
    }
  }
  
  const toggleLabel = (labelId: string) => {
    setFormData(prev => ({
      ...prev,
      labelIds: prev.labelIds.includes(labelId)
        ? prev.labelIds.filter(id => id !== labelId)
        : [...prev.labelIds, labelId],
    }))
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Create Task'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter task title..."
              required
            />
          </div>
          
          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter task description..."
              rows={4}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Status */}
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as TaskStatus }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map(status => (
                    <SelectItem key={status} value={status}>
                      <div className="flex items-center gap-2">
                        <TaskBadge status={status} />
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Priority */}
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value as TaskPriority }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map(priority => (
                    <SelectItem key={priority} value={priority}>
                      <div className="flex items-center gap-2">
                        <TaskBadge priority={priority} />
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Type */}
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as TaskType }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {types.map(type => (
                    <SelectItem key={type} value={type}>
                      <div className="flex items-center gap-2">
                        <TaskBadge type={type} />
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Assignee */}
            <div className="space-y-2">
              <Label>Assignee</Label>
              <Select
                value={formData.assigneeId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, assigneeId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select assignee..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Unassigned</SelectItem>
                  {members.map(member => (
                    <SelectItem key={member.id} value={member.id}>
                      <div className="flex items-center gap-2">
                        <AssigneeAvatar assignee={member} size="sm" />
                        <span>{member.name || member.email}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Due Date */}
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
              />
            </div>
            
            {/* Estimate */}
            <div className="space-y-2">
              <Label htmlFor="estimate">Estimate (hours)</Label>
              <Input
                id="estimate"
                type="number"
                min="0"
                value={formData.estimate}
                onChange={(e) => setFormData(prev => ({ ...prev, estimate: e.target.value }))}
                placeholder="e.g., 4"
              />
            </div>
          </div>
          
          {/* Labels */}
          <div className="space-y-2">
            <Label>Labels</Label>
            <div className="flex flex-wrap gap-2">
              {labels.map(label => (
                <button
                  key={label.id}
                  type="button"
                  onClick={() => toggleLabel(label.id)}
                  className={cn(
                    'px-2 py-1 rounded-md text-xs font-medium transition-all',
                    formData.labelIds.includes(label.id)
                      ? 'ring-2 ring-offset-1 ring-cyan-500'
                      : 'opacity-60 hover:opacity-100'
                  )}
                  style={{
                    backgroundColor: `${label.color}20`,
                    color: label.color,
                  }}
                >
                  {label.name}
                </button>
              ))}
              
              {showLabelInput ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={newLabelName}
                    onChange={(e) => setNewLabelName(e.target.value)}
                    placeholder="Label name"
                    className="w-32 h-8 text-sm"
                  />
                  <Input
                    type="color"
                    value={newLabelColor}
                    onChange={(e) => setNewLabelColor(e.target.value)}
                    className="w-10 h-8 p-1"
                  />
                  <Button type="button" size="sm" onClick={handleCreateLabel}>
                    <Plus className="w-3 h-3" />
                  </Button>
                  <Button type="button" size="sm" variant="ghost" onClick={() => setShowLabelInput(false)}>
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowLabelInput(true)}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Label
                </Button>
              )}
            </div>
          </div>
          
          {/* Time Tracking */}
          {task && taskTime && (
            <div className="space-y-2 pt-4 border-t">
              <Label className="flex items-center gap-2">
                <Timer className="w-4 h-4" />
                Time Tracked
              </Label>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-muted/50 rounded-md p-3 text-center">
                  <p className="text-lg font-bold">{formatDuration(taskTime.duration)}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
                <div className="bg-green-500/10 rounded-md p-3 text-center">
                  <p className="text-lg font-bold text-green-600">{formatDuration(taskTime.billable)}</p>
                  <p className="text-xs text-muted-foreground">Billable</p>
                </div>
                <div className="bg-muted/50 rounded-md p-3 text-center">
                  <p className="text-lg font-bold">{taskTime.entries}</p>
                  <p className="text-xs text-muted-foreground">Entries</p>
                </div>
              </div>
              {formData.estimate && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">vs Estimate ({formData.estimate}h)</span>
                    <span className="font-medium">
                      {Math.round((taskTime.duration / 60 / parseInt(formData.estimate)) * 100)}%
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all',
                        taskTime.duration / 60 > parseInt(formData.estimate) ? 'bg-red-500' : 'bg-cyan-500'
                      )}
                      style={{ width: `${Math.min(100, (taskTime.duration / 60 / parseInt(formData.estimate)) * 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Activity/Comments Placeholder */}
          {task && (
            <div className="space-y-2 pt-4 border-t">
              <Label>Activity</Label>
              <div className="bg-muted/50 rounded-md p-4 text-sm text-muted-foreground text-center">
                Activity feed coming soon...
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-cyan-600 hover:bg-cyan-700">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : task ? (
                'Update Task'
              ) : (
                'Create Task'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
