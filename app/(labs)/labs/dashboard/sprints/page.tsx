'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { PageHeader } from '@/components/labs-dashboard/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
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
  Plus,
  Search,
  Loader2,
  Calendar,
  Target,
  Play,
  CheckCircle,
  LayoutGrid,
  List,
  AlertCircle,
  Trash2,
} from 'lucide-react'
import { format } from 'date-fns'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

interface Sprint {
  id: string
  name: string
  goal: string | null
  startDate: string
  endDate: string
  status: 'PLANNING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
  totalPoints: number
  completedPoints: number
  createdAt: string
  _count: {
    tasks: number
  }
}

const statusConfig: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
  PLANNING: {
    label: 'Planning',
    className: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    icon: <Calendar className="w-3 h-3" />,
  },
  ACTIVE: {
    label: 'Active',
    className: 'bg-green-500/10 text-green-400 border-green-500/20',
    icon: <Play className="w-3 h-3" />,
  },
  COMPLETED: {
    label: 'Completed',
    className: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    icon: <CheckCircle className="w-3 h-3" />,
  },
  CANCELLED: {
    label: 'Cancelled',
    className: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    icon: <AlertCircle className="w-3 h-3" />,
  },
}

export default function SprintsPage() {
  const [sprints, setSprints] = useState<Sprint[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    goal: '',
    startDate: '',
    endDate: '',
    status: 'PLANNING',
  })

  const fetchSprints = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (statusFilter !== 'ALL') params.append('status', statusFilter)

      const response = await fetch(`/api/labs/projects/demo/sprints?${params.toString()}`)
      const result = await response.json()

      if (result.success) {
        setSprints(result.data)
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to fetch sprints',
          variant: 'destructive',
        })
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to fetch sprints',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [statusFilter, toast])

  useEffect(() => {
    fetchSprints()
  }, [fetchSprints])

  const handleCreateSprint = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/labs/projects/demo/sprints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Sprint created successfully',
        })
        setIsModalOpen(false)
        setFormData({
          name: '',
          goal: '',
          startDate: '',
          endDate: '',
          status: 'PLANNING',
        })
        fetchSprints()
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to create sprint',
          variant: 'destructive',
        })
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to create sprint',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStartSprint = async (sprintId: string) => {
    try {
      const response = await fetch(`/api/labs/projects/demo/sprints/${sprintId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ACTIVE' }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Sprint started successfully',
        })
        fetchSprints()
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to start sprint',
          variant: 'destructive',
        })
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to start sprint',
        variant: 'destructive',
      })
    }
  }

  const handleCompleteSprint = async (sprintId: string) => {
    try {
      const response = await fetch(`/api/labs/projects/demo/sprints/${sprintId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'COMPLETED' }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Sprint completed successfully',
        })
        fetchSprints()
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to complete sprint',
          variant: 'destructive',
        })
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to complete sprint',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteSprint = async (sprintId: string) => {
    if (!confirm('Are you sure you want to delete this sprint? Tasks will be moved back to the backlog.')) {
      return
    }

    try {
      const response = await fetch(`/api/labs/projects/demo/sprints/${sprintId}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Sprint deleted successfully',
        })
        fetchSprints()
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to delete sprint',
          variant: 'destructive',
        })
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to delete sprint',
        variant: 'destructive',
      })
    }
  }

  const filteredSprints = sprints.filter((sprint) =>
    sprint.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (sprint.goal && sprint.goal.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sprints"
        description="Plan and track agile sprints"
      />

      {/* Actions Bar */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search sprints..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="PLANNING">Planning</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" asChild>
            <Link href="/labs/dashboard/sprints/backlog">
              <List className="w-4 h-4 mr-2" />
              Backlog
            </Link>
          </Button>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-cyan-600 hover:bg-cyan-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Sprint
          </Button>
        </div>
      </div>

      {/* Sprints Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
        </div>
      ) : filteredSprints.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No sprints found</h3>
            <p className="text-muted-foreground mb-4">
              Get started by creating your first sprint
            </p>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Sprint
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredSprints.map((sprint) => {
            const status = statusConfig[sprint.status]
            const progress = sprint.totalPoints > 0
              ? Math.round((sprint.completedPoints / sprint.totalPoints) * 100)
              : 0

            return (
              <Card key={sprint.id} className="group hover:border-cyan-500/50 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/labs/dashboard/sprints/${sprint.id}`}
                        className="font-semibold text-lg hover:text-cyan-500 transition-colors line-clamp-1"
                      >
                        {sprint.name}
                      </Link>
                      {sprint.goal && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {sprint.goal}
                        </p>
                      )}
                    </div>
                    <Badge variant="outline" className={cn('ml-2 shrink-0', status.className)}>
                      <span className="flex items-center gap-1">
                        {status.icon}
                        {status.label}
                      </span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Date Range */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {format(new Date(sprint.startDate), 'MMM d')} -{' '}
                      {format(new Date(sprint.endDate), 'MMM d, yyyy')}
                    </span>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">
                        {sprint.completedPoints}/{sprint.totalPoints} points
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <LayoutGrid className="w-4 h-4" />
                      <span>{sprint._count.tasks} tasks</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Target className="w-4 h-4" />
                      <span>{progress}% complete</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    {sprint.status === 'PLANNING' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleStartSprint(sprint.id)}
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Start
                      </Button>
                    )}
                    {sprint.status === 'ACTIVE' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleCompleteSprint(sprint.id)}
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Complete
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDeleteSprint(sprint.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Create Sprint Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Sprint</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateSprint} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Sprint Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Sprint 1 - Foundation"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal">Sprint Goal</Label>
              <Textarea
                id="goal"
                value={formData.goal}
                onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                placeholder="What do you want to achieve in this sprint?"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PLANNING">Planning</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-cyan-600 hover:bg-cyan-700">
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Sprint'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
