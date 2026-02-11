'use client'

import { useState } from 'react'
import { format, isPast, isFuture, isToday } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CheckCircle2, Circle, Clock, Plus, Trash2, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Milestone {
  id: string
  title: string
  description: string | null
  dueDate: string | null
  completedAt: string | null
  order: number
  createdAt?: string
}

interface TimelineProps {
  milestones: Milestone[]
  projectId: string
  onMilestoneAdded: () => void
  onMilestoneUpdated: () => void
}

export function Timeline({ milestones, projectId, onMilestoneAdded, onMilestoneUpdated }: TimelineProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [newMilestone, setNewMilestone] = useState({
    title: '',
    description: '',
    dueDate: '',
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const getMilestoneStatus = (milestone: Milestone) => {
    if (milestone.completedAt) return 'completed'
    if (milestone.dueDate) {
      const due = new Date(milestone.dueDate)
      if (isToday(due)) return 'current'
      if (isPast(due)) return 'overdue'
      if (isFuture(due)) return 'upcoming'
    }
    return 'upcoming'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />
      case 'current':
        return <Clock className="w-5 h-5 text-cyan-500" />
      case 'overdue':
        return <Circle className="w-5 h-5 text-red-500" />
      default:
        return <Circle className="w-5 h-5 text-muted-foreground" />
    }
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 border-green-500/30'
      case 'current':
        return 'bg-cyan-500/20 border-cyan-500/30'
      case 'overdue':
        return 'bg-red-500/20 border-red-500/30'
      default:
        return 'bg-muted border-muted-foreground/20'
    }
  }

  const handleAddMilestone = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMilestone.title.trim()) return

    try {
      setLoading(true)
      const response = await fetch(`/api/labs/projects/${projectId}/milestones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newMilestone.title,
          description: newMilestone.description || null,
          dueDate: newMilestone.dueDate || null,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setNewMilestone({ title: '', description: '', dueDate: '' })
        setIsAdding(false)
        onMilestoneAdded()
        toast({
          title: 'Success',
          description: 'Milestone added successfully',
        })
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to add milestone',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add milestone',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleToggleComplete = async (milestone: Milestone) => {
    try {
      const response = await fetch(`/api/labs/projects/${projectId}/milestones/${milestone.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completedAt: milestone.completedAt ? null : new Date().toISOString(),
        }),
      })

      const result = await response.json()

      if (result.success) {
        onMilestoneUpdated()
        toast({
          title: 'Success',
          description: milestone.completedAt ? 'Milestone marked as incomplete' : 'Milestone completed',
        })
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to update milestone',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update milestone',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteMilestone = async (milestoneId: string) => {
    try {
      const response = await fetch(`/api/labs/projects/${projectId}/milestones/${milestoneId}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        onMilestoneUpdated()
        toast({
          title: 'Success',
          description: 'Milestone deleted successfully',
        })
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to delete milestone',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete milestone',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Add Milestone Button */}
      {!isAdding && (
        <Button
          onClick={() => setIsAdding(true)}
          variant="outline"
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Milestone
        </Button>
      )}

      {/* Add Milestone Form */}
      {isAdding && (
        <form onSubmit={handleAddMilestone} className="border rounded-lg p-4 space-y-4">
          <h4 className="font-medium">New Milestone</h4>
          <div className="space-y-2">
            <Label htmlFor="milestone-title">Title *</Label>
            <Input
              id="milestone-title"
              value={newMilestone.title}
              onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
              placeholder="Enter milestone title"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="milestone-description">Description</Label>
            <Textarea
              id="milestone-description"
              value={newMilestone.description}
              onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
              placeholder="Enter milestone description"
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="milestone-due-date">Due Date</Label>
            <Input
              id="milestone-due-date"
              type="date"
              value={newMilestone.dueDate}
              onChange={(e) => setNewMilestone({ ...newMilestone, dueDate: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-cyan-600 hover:bg-cyan-700">
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Add Milestone
            </Button>
          </div>
        </form>
      )}

      {/* Timeline */}
      <div className="relative">
        {/* Vertical Line */}
        {milestones.length > 0 && (
          <div className="absolute left-6 top-4 bottom-4 w-px bg-border" />
        )}

        <div className="space-y-4">
          {milestones.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No milestones yet. Add one to get started.
            </p>
          ) : (
            milestones.map((milestone) => {
              const status = getMilestoneStatus(milestone)
              return (
                <div
                  key={milestone.id}
                  className={`relative flex gap-4 p-4 rounded-lg border ${getStatusClass(status)} transition-colors`}
                >
                  {/* Status Icon */}
                  <div className="relative z-10 flex-shrink-0">
                    <button
                      onClick={() => handleToggleComplete(milestone)}
                      className="hover:opacity-80 transition-opacity"
                    >
                      {getStatusIcon(status)}
                    </button>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className={`font-medium ${milestone.completedAt ? 'line-through text-muted-foreground' : ''}`}>
                          {milestone.title}
                        </h4>
                        {milestone.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {milestone.description}
                          </p>
                        )}
                        {milestone.dueDate && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Due: {format(new Date(milestone.dueDate), 'MMM d, yyyy')}
                            {status === 'overdue' && (
                              <span className="text-red-500 ml-2">(Overdue)</span>
                            )}
                            {status === 'current' && (
                              <span className="text-cyan-500 ml-2">(Today)</span>
                            )}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="flex-shrink-0 text-muted-foreground hover:text-red-500"
                        onClick={() => handleDeleteMilestone(milestone.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
