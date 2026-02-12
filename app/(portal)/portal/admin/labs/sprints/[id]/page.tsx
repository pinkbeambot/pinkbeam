'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { BurndownChart } from '@/components/labs-dashboard/BurndownChart'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  ArrowLeft,
  Calendar,
  Target,
  Play,
  CheckCircle,
  LayoutGrid,
  List,
  AlertCircle,
  Edit2,
  Loader2,
  Plus,
  Trash2,
  TrendingDown,
  CheckSquare,
  Lightbulb,
} from 'lucide-react'
import { format, differenceInDays } from 'date-fns'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { Task, TaskStatus } from '@prisma/client'

interface Sprint {
  id: string
  name: string
  goal: string | null
  startDate: string
  endDate: string
  status: 'PLANNING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
  totalPoints: number
  completedPoints: number
  reviewNotes: string | null
  tasks: Task[]
}

interface BurndownData {
  totalPoints: number
  completedPoints: number
  startDate: string
  endDate: string
  status: string
  idealBurndown: Array<{ date: string; points: number }>
  actualBurndown: Array<{ date: string; points: number; completed: number }>
  projection: Array<{ date: string; points: number }>
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

const taskStatusConfig: Record<string, { label: string; className: string }> = {
  TODO: { label: 'To Do', className: 'bg-gray-500/10 text-gray-400' },
  IN_PROGRESS: { label: 'In Progress', className: 'bg-blue-500/10 text-blue-400' },
  IN_REVIEW: { label: 'In Review', className: 'bg-yellow-500/10 text-yellow-400' },
  COMPLETED: { label: 'Completed', className: 'bg-green-500/10 text-green-400' },
  CANCELLED: { label: 'Cancelled', className: 'bg-red-500/10 text-red-400' },
}

export default function SprintDetailPage() {
  const params = useParams()
  const sprintId = params.id as string
  const [sprint, setSprint] = useState<Sprint | null>(null)
  const [burndownData, setBurndownData] = useState<BurndownData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    goal: '',
    startDate: '',
    endDate: '',
    reviewNotes: '',
  })

  const fetchSprint = useCallback(async () => {
    try {
      setLoading(true)
      const [sprintResponse, burndownResponse] = await Promise.all([
        fetch(`/api/labs/projects/demo/sprints/${sprintId}`),
        fetch(`/api/labs/projects/demo/sprints/${sprintId}/burndown`),
      ])

      const sprintResult = await sprintResponse.json()
      const burndownResult = await burndownResponse.json()

      if (sprintResult.success) {
        setSprint(sprintResult.data)
        setFormData({
          name: sprintResult.data.name,
          goal: sprintResult.data.goal || '',
          startDate: sprintResult.data.startDate.split('T')[0],
          endDate: sprintResult.data.endDate.split('T')[0],
          reviewNotes: sprintResult.data.reviewNotes || '',
        })
      } else {
        toast({
          title: 'Error',
          description: sprintResult.error || 'Failed to fetch sprint',
          variant: 'destructive',
        })
      }

      if (burndownResult.success) {
        setBurndownData(burndownResult.data)
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to fetch sprint data',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [sprintId, toast])

  useEffect(() => {
    if (sprintId) {
      fetchSprint()
    }
  }, [sprintId, fetchSprint])

  const handleUpdateSprint = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/labs/projects/demo/sprints/${sprintId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Sprint updated successfully',
        })
        setIsEditModalOpen(false)
        fetchSprint()
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to update sprint',
          variant: 'destructive',
        })
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update sprint',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStartSprint = async () => {
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
        fetchSprint()
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

  const handleCompleteSprint = async () => {
    try {
      const response = await fetch(`/api/labs/projects/demo/sprints/${sprintId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'COMPLETED', reviewNotes: formData.reviewNotes }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Sprint completed successfully',
        })
        setIsReviewModalOpen(false)
        fetchSprint()
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

  const handleDeleteSprint = async () => {
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
        // Navigate back to sprints list
        window.location.href = '/portal/admin/labs/sprints'
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
        <p className="text-muted-foreground mt-2">The sprint you are looking for does not exist.</p>
        <Button asChild className="mt-4 bg-cyan-600 hover:bg-cyan-700">
          <Link href="/portal/admin/labs/sprints">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sprints
          </Link>
        </Button>
      </div>
    )
  }

  const status = statusConfig[sprint.status]
  const progress = sprint.totalPoints > 0
    ? Math.round((sprint.completedPoints / sprint.totalPoints) * 100)
    : 0
  const daysRemaining = differenceInDays(new Date(sprint.endDate), new Date())

  // Group tasks by status
  const tasksByStatus = sprint.tasks.reduce((acc, task) => {
    if (!acc[task.status]) acc[task.status] = []
    acc[task.status].push(task)
    return acc
  }, {} as Record<string, Task[]>)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-2 -ml-2">
            <Link href="/portal/admin/labs/sprints">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sprints
            </Link>
          </Button>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-bold tracking-tight">{sprint.name}</h1>
            <Badge variant="outline" className={cn(status.className)}>
              <span className="flex items-center gap-1">
                {status.icon}
                {status.label}
              </span>
            </Badge>
          </div>
          {sprint.goal && (
            <p className="text-muted-foreground mt-2 flex items-center gap-2">
              <Target className="w-4 h-4" />
              {sprint.goal}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {sprint.status === 'PLANNING' && (
            <Button onClick={handleStartSprint} className="bg-green-600 hover:bg-green-700">
              <Play className="w-4 h-4 mr-2" />
              Start Sprint
            </Button>
          )}
          {sprint.status === 'ACTIVE' && (
            <Button onClick={() => setIsReviewModalOpen(true)} className="bg-cyan-600 hover:bg-cyan-700">
              <CheckCircle className="w-4 h-4 mr-2" />
              Complete Sprint
            </Button>
          )}
          <Button variant="outline" asChild>
            <Link href={`/portal/admin/labs/sprints/${sprintId}/retrospective`}>
              <Lightbulb className="w-4 h-4 mr-2" />
              Retrospective
            </Link>
          </Button>
          <Button variant="outline" onClick={() => setIsEditModalOpen(true)}>
            <Edit2 className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" className="text-destructive" onClick={handleDeleteSprint}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{sprint.totalPoints}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{sprint.completedPoints}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Remaining
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{sprint.totalPoints - sprint.completedPoints}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Days Remaining
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={cn(
              'text-2xl font-bold',
              daysRemaining < 3 && daysRemaining > 0 ? 'text-yellow-500' :
              daysRemaining <= 0 ? 'text-red-500' : ''
            )}>
              {daysRemaining > 0 ? daysRemaining : 0}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Sprint Progress</span>
            <span className="text-sm text-muted-foreground">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>
                {format(new Date(sprint.startDate), 'MMM d')} -{' '}
                {format(new Date(sprint.endDate), 'MMM d, yyyy')}
              </span>
            </div>
            <span>{sprint.tasks.length} tasks</span>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="board" className="space-y-4">
        <TabsList>
          <TabsTrigger value="board">
            <LayoutGrid className="w-4 h-4 mr-2" />
            Board
          </TabsTrigger>
          <TabsTrigger value="burndown">
            <TrendingDown className="w-4 h-4 mr-2" />
            Burndown
          </TabsTrigger>
          <TabsTrigger value="list">
            <List className="w-4 h-4 mr-2" />
            List
          </TabsTrigger>
        </TabsList>

        {/* Board View */}
        <TabsContent value="board" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Sprint Board</h3>
            <Button variant="outline" asChild>
              <Link href="/portal/admin/labs/sprints/backlog">
                <Plus className="w-4 h-4 mr-2" />
                Add from Backlog
              </Link>
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED'] as TaskStatus[]).map((status) => {
              const tasks = tasksByStatus[status] || []
              const config = taskStatusConfig[status]

              return (
                <div key={status} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{config.label}</h4>
                    <Badge variant="secondary">{tasks.length}</Badge>
                  </div>
                  <div className="space-y-2 min-h-[100px]">
                    {tasks.map((task) => (
                      <Card key={task.id} className="cursor-pointer hover:border-cyan-500/50 transition-colors">
                        <CardContent className="p-3">
                          <p className="font-medium text-sm line-clamp-2">{task.title}</p>
                          {task.storyPoints && (
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {task.storyPoints} pts
                              </Badge>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                    {tasks.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground text-sm">
                        No tasks
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </TabsContent>

        {/* Burndown View */}
        <TabsContent value="burndown" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Burndown Chart</CardTitle>
            </CardHeader>
            <CardContent>
              {burndownData ? (
                <BurndownChart data={burndownData} />
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <TrendingDown className="w-12 h-12 mx-auto mb-4" />
                  <p>Burndown data will be available once the sprint starts</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* List View */}
        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              {sprint.tasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckSquare className="w-12 h-12 mx-auto mb-4" />
                  <p>No tasks in this sprint yet</p>
                  <Button variant="outline" className="mt-4" asChild>
                    <Link href="/portal/admin/labs/sprints/backlog">
                      <Plus className="w-4 h-4 mr-2" />
                      Add from Backlog
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {sprint.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <CheckSquare className="w-5 h-5 text-cyan-500" />
                        <span className="font-medium">{task.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {task.storyPoints && (
                          <Badge variant="outline">{task.storyPoints} pts</Badge>
                        )}
                        <Badge className={taskStatusConfig[task.status].className}>
                          {taskStatusConfig[task.status].label}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Sprint</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateSprint} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Sprint Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal">Sprint Goal</Label>
              <Textarea
                id="goal"
                value={formData.goal}
                onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
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
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-cyan-600 hover:bg-cyan-700">
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Complete Sprint Modal */}
      <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Complete Sprint</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-medium mb-2">Sprint Summary</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Total Points:</span>{' '}
                  <span className="font-medium">{sprint.totalPoints}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Completed:</span>{' '}
                  <span className="font-medium text-green-600">{sprint.completedPoints}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Completion:</span>{' '}
                  <span className="font-medium">{progress}%</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Tasks:</span>{' '}
                  <span className="font-medium">{sprint.tasks.length}</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reviewNotes">Sprint Review Notes</Label>
              <Textarea
                id="reviewNotes"
                value={formData.reviewNotes}
                onChange={(e) => setFormData({ ...formData, reviewNotes: e.target.value })}
                placeholder="What went well? What could be improved?"
                rows={4}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Incomplete tasks will be moved back to the backlog.
            </p>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsReviewModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCompleteSprint} className="bg-cyan-600 hover:bg-cyan-700">
                <CheckCircle className="w-4 h-4 mr-2" />
                Complete Sprint
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
