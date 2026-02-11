'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { PageHeader } from '@/components/labs-dashboard/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ArrowLeft,
  Plus,
  ThumbsUp,
  CheckCircle,
  XCircle,
  Lightbulb,
  Trash2,
  Loader2,
} from 'lucide-react'
import { format } from 'date-fns'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

interface RetrospectiveItem {
  id: string
  content: string
  votes: number
  createdAt: string
}

interface Retrospective {
  id: string
  sprintId: string
  whatWentWell: RetrospectiveItem[]
  whatWentWrong: RetrospectiveItem[]
  actionItems: RetrospectiveItem[]
  createdAt: string
}

interface Sprint {
  id: string
  name: string
  goal: string | null
  status: 'PLANNING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
  totalPoints: number
  completedPoints: number
}

const columns = [
  {
    id: 'whatWentWell',
    title: 'What Went Well',
    description: 'Things that went smoothly',
    icon: <CheckCircle className="w-5 h-5 text-green-500" />,
    color: 'border-green-500/30 bg-green-500/5',
    badgeColor: 'bg-green-500/10 text-green-400',
  },
  {
    id: 'whatWentWrong',
    title: 'What Went Wrong',
    description: 'Challenges and blockers',
    icon: <XCircle className="w-5 h-5 text-red-500" />,
    color: 'border-red-500/30 bg-red-500/5',
    badgeColor: 'bg-red-500/10 text-red-400',
  },
  {
    id: 'actionItems',
    title: 'Action Items',
    description: 'Improvements for next sprint',
    icon: <Lightbulb className="w-5 h-5 text-amber-500" />,
    color: 'border-amber-500/30 bg-amber-500/5',
    badgeColor: 'bg-amber-500/10 text-amber-400',
  },
] as const

type ColumnId = typeof columns[number]['id']

export default function SprintRetrospectivePage() {
  const params = useParams()
  const sprintId = params.id as string
  const { toast } = useToast()

  const [sprint, setSprint] = useState<Sprint | null>(null)
  const [retrospective, setRetrospective] = useState<Retrospective | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedColumn, setSelectedColumn] = useState<ColumnId>('whatWentWell')
  const [newItemContent, setNewItemContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchSprint = useCallback(async () => {
    try {
      const response = await fetch(`/api/labs/projects/demo/sprints/${sprintId}`)
      const result = await response.json()

      if (result.success) {
        setSprint(result.data)
      }
    } catch (error) {
      console.error('Error fetching sprint:', error)
    }
  }, [sprintId])

  const fetchRetrospective = useCallback(async () => {
    try {
      const response = await fetch(`/api/labs/projects/demo/sprints/${sprintId}/retrospective`)
      const result = await response.json()

      if (result.success) {
        setRetrospective(result.data)
      }
    } catch (error) {
      console.error('Error fetching retrospective:', error)
    }
  }, [sprintId])

  useEffect(() => {
    Promise.all([fetchSprint(), fetchRetrospective()]).then(() => setLoading(false))
  }, [fetchSprint, fetchRetrospective])

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newItemContent.trim()) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/labs/projects/demo/sprints/${sprintId}/retrospective`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          column: selectedColumn,
          content: newItemContent,
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Item added to retrospective',
        })
        setRetrospective(result.data)
        setNewItemContent('')
        setIsAddModalOpen(false)
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to add item',
          variant: 'destructive',
        })
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to add item',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVote = async (column: ColumnId, itemId: string) => {
    try {
      const response = await fetch(`/api/labs/projects/demo/sprints/${sprintId}/retrospective`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'vote',
          column,
          itemId,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setRetrospective(result.data)
      }
    } catch {
      // Error handled silently
    }
  }

  const handleDeleteItem = async (column: ColumnId, itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      const response = await fetch(`/api/labs/projects/demo/sprints/${sprintId}/retrospective`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete',
          column,
          itemId,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setRetrospective(result.data)
        toast({
          title: 'Success',
          description: 'Item deleted',
        })
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to delete item',
        variant: 'destructive',
      })
    }
  }

  const handleConvertToTask = async (item: RetrospectiveItem) => {
    try {
      const response = await fetch(`/api/labs/projects/demo/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: item.content,
          description: `Converted from retrospective action item: ${item.content}`,
          projectId: 'demo', // This would be dynamic in real implementation
          priority: 'MEDIUM',
          type: 'CHORE',
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Action item converted to task',
        })
        
        // Remove from retrospective
        handleDeleteItem('actionItems', item.id)
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to convert to task',
        variant: 'destructive',
      })
    }
  }

  const getItemsForColumn = (columnId: ColumnId): RetrospectiveItem[] => {
    if (!retrospective) return []
    return retrospective[columnId] || []
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    )
  }

  if (!sprint) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">Sprint not found</h2>
        <Button asChild className="mt-4 bg-cyan-600 hover:bg-cyan-700">
          <Link href="/labs/dashboard/sprints">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sprints
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sprint Retrospective"
        description={`${sprint.name} - Reflect and improve`}
      />

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link href={`/labs/dashboard/sprints/${sprintId}`}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sprint
          </Link>
        </Button>
        <Button onClick={() => setIsAddModalOpen(true)} className="bg-cyan-600 hover:bg-cyan-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>

      {/* Sprint Summary */}
      {sprint.status === 'COMPLETED' && (
        <Card className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Points</p>
                <p className="text-2xl font-bold">{sprint.totalPoints}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-600">{sprint.completedPoints}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold">
                  {sprint.totalPoints > 0 
                    ? Math.round((sprint.completedPoints / sprint.totalPoints) * 100) 
                    : 0}%
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed On</p>
                <p className="text-lg font-medium">
                  {format(new Date(), 'MMM d, yyyy')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Retrospective Board */}
      <div className="grid md:grid-cols-3 gap-6">
        {columns.map((column) => {
          const items = getItemsForColumn(column.id)

          return (
            <Card key={column.id} className={cn('border-2', column.color)}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {column.icon}
                    <CardTitle className="text-lg">{column.title}</CardTitle>
                  </div>
                  <Badge variant="outline" className={column.badgeColor}>
                    {items.length}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{column.description}</p>
              </CardHeader>
              <CardContent className="space-y-3 min-h-[200px]">
                {items.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Plus className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No items yet</p>
                  </div>
                ) : (
                  items
                    .sort((a, b) => b.votes - a.votes)
                    .map((item) => (
                      <div
                        key={item.id}
                        className="group bg-card border rounded-lg p-3 hover:border-cyan-500/50 transition-colors"
                      >
                        <p className="text-sm mb-3">{item.content}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-muted-foreground hover:text-foreground"
                              onClick={() => handleVote(column.id, item.id)}
                            >
                              <ThumbsUp className="w-4 h-4 mr-1" />
                              {item.votes}
                            </Button>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {column.id === 'actionItems' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-cyan-500 hover:text-cyan-600"
                                onClick={() => handleConvertToTask(item)}
                                title="Convert to task"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-destructive hover:text-destructive"
                              onClick={() => handleDeleteItem(column.id, item.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Add Item Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Retrospective Item</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddItem} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Column</label>
              <Select value={selectedColumn} onValueChange={(v) => setSelectedColumn(v as ColumnId)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {columns.map((col) => (
                    <SelectItem key={col.id} value={col.id}>
                      <span className="flex items-center gap-2">
                        {col.icon}
                        {col.title}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Content</label>
              <Textarea
                value={newItemContent}
                onChange={(e) => setNewItemContent(e.target.value)}
                placeholder="What would you like to share?"
                rows={4}
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-cyan-600 hover:bg-cyan-700">
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Plus className="w-4 h-4 mr-2" />
                )}
                Add Item
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
