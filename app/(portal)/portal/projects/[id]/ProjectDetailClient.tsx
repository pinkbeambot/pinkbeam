'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Download,
  FileText,
  MessageSquare,
  TrendingUp,
} from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { LoadingSpinner } from '@/components/ui/loading'
import { ProjectUpdatesTimeline } from './ProjectUpdatesTimeline'

interface ProjectDetail {
  id: string
  title: string
  description: string | null
  status: string
  services: string[]
  progress: number
  deadline: string | null
  startDate: string | null
  milestones: Array<{
    id: string
    title: string
    description: string | null
    dueDate: string | null
    completedAt: string | null
    order: number
  }>
  files: Array<{
    id: string
    name: string
    url: string
    size: number
    uploadedAt: string
  }>
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  LEAD: { label: 'New', color: 'bg-gray-500' },
  QUOTED: { label: 'Quoted', color: 'bg-yellow-500' },
  ACCEPTED: { label: 'Accepted', color: 'bg-blue-500' },
  IN_PROGRESS: { label: 'In Progress', color: 'bg-purple-500' },
  REVIEW: { label: 'Review', color: 'bg-orange-500' },
  COMPLETED: { label: 'Completed', color: 'bg-green-500' },
  ON_HOLD: { label: 'On Hold', color: 'bg-red-500' },
}

interface ProjectDetailClientProps {
  projectId: string
}

export function ProjectDetailClient({ projectId }: ProjectDetailClientProps) {
  const [project, setProject] = useState<ProjectDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadProject()
  }, [projectId])

  const loadProject = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`)
      const result = await response.json()

      if (result.success) {
        setProject(result.data)
      }
    } catch (error) {
      console.error('Failed to load project:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <LoadingSpinner text="Loading project..." />
  }

  if (!project) {
    return (
      <div className="p-6">
        <Card className="p-12 text-center">
          <p className="text-lg font-semibold mb-2">Project not found</p>
          <p className="text-sm text-muted-foreground mb-4">
            This project doesn't exist or you don't have access to it
          </p>
          <Button asChild variant="outline">
            <Link href="/portal/projects">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Link>
          </Button>
        </Card>
      </div>
    )
  }

  const statusInfo = STATUS_CONFIG[project.status] || {
    label: project.status,
    color: 'bg-gray-500',
  }

  const completedMilestones = project.milestones.filter((m) => m.completedAt).length
  const totalMilestones = project.milestones.length

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/portal/projects">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Link>
        </Button>

        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
            {project.description && (
              <p className="text-muted-foreground">{project.description}</p>
            )}
          </div>
          <Badge className={cn('gap-1', statusInfo.color, 'text-white')}>
            {statusInfo.label}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2">
          {project.services.map((service) => (
            <Badge key={service} variant="outline">
              {service}
            </Badge>
          ))}
        </div>
      </div>

      {/* Progress Overview */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Overall Progress</p>
            <div className="space-y-2">
              <p className="text-2xl font-bold">{project.progress}%</p>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-pink-500 transition-all"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-1">Milestones</p>
            <p className="text-2xl font-bold">
              {completedMilestones}/{totalMilestones}
            </p>
          </div>

          {project.startDate && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Start Date</p>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">
                  {format(new Date(project.startDate), 'MMM d, yyyy')}
                </p>
              </div>
            </div>
          )}

          {project.deadline && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Deadline</p>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">
                  {format(new Date(project.deadline), 'MMM d, yyyy')}
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="milestones" className="space-y-4">
        <TabsList>
          <TabsTrigger value="milestones">
            Milestones ({totalMilestones})
          </TabsTrigger>
          <TabsTrigger value="deliverables">
            Deliverables ({project.files.length})
          </TabsTrigger>
          <TabsTrigger value="activity">
            Activity
          </TabsTrigger>
        </TabsList>

        {/* Milestones Tab */}
        <TabsContent value="milestones" className="space-y-4">
          {project.milestones.length === 0 ? (
            <Card className="p-12 text-center border-dashed">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">
                No milestones set yet
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {project.milestones
                .sort((a, b) => a.order - b.order)
                .map((milestone, index) => {
                  const isCompleted = !!milestone.completedAt
                  const isOverdue =
                    milestone.dueDate &&
                    !isCompleted &&
                    new Date(milestone.dueDate) < new Date()

                  return (
                    <Card
                      key={milestone.id}
                      className={cn(
                        'p-4',
                        isCompleted && 'bg-green-500/5 border-green-500/20'
                      )}
                    >
                      <div className="flex items-start gap-4">
                        <div className="mt-1">
                          {isCompleted ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-4 mb-1">
                            <h4 className={cn('font-medium', isCompleted && 'line-through')}>
                              {milestone.title}
                            </h4>
                            {milestone.dueDate && (
                              <Badge
                                variant="outline"
                                className={cn(
                                  isOverdue && 'border-red-500 text-red-500',
                                  isCompleted && 'border-green-500 text-green-500'
                                )}
                              >
                                {isCompleted
                                  ? 'Completed'
                                  : isOverdue
                                  ? 'Overdue'
                                  : format(new Date(milestone.dueDate), 'MMM d')}
                              </Badge>
                            )}
                          </div>
                          {milestone.description && (
                            <p className="text-sm text-muted-foreground">
                              {milestone.description}
                            </p>
                          )}
                          {milestone.completedAt && (
                            <p className="text-xs text-muted-foreground mt-2">
                              Completed on {format(new Date(milestone.completedAt), 'MMM d, yyyy')}
                            </p>
                          )}
                        </div>
                      </div>
                    </Card>
                  )
                })}
            </div>
          )}
        </TabsContent>

        {/* Deliverables Tab */}
        <TabsContent value="deliverables" className="space-y-4">
          {project.files.length === 0 ? (
            <Card className="p-12 text-center border-dashed">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">
                No deliverables yet
              </p>
            </Card>
          ) : (
            <div className="grid gap-3">
              {project.files.map((file) => (
                <Card key={file.id} className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <FileText className="h-8 w-8 text-muted-foreground shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024).toFixed(2)} KB · Uploaded{' '}
                          {format(new Date(file.uploadedAt), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <a href={file.url} download>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </a>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Activity Tab - Project Updates Timeline */}
        <TabsContent value="activity" className="space-y-4">
          <ProjectUpdatesTimeline projectId={projectId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
