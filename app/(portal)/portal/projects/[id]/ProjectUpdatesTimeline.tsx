'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, CheckCircle2, Package, FileText, AlertTriangle, RefreshCw } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

interface ProjectUpdate {
  id: string
  type: string
  title: string
  body: string | null
  visible: boolean
  createdAt: string
  attachments?: string | null
}

interface ProjectUpdatesTimelineProps {
  projectId: string
}

const UPDATE_TYPE_CONFIG: Record<string, { label: string; icon: any; color: string }> = {
  STATUS_CHANGE: {
    label: 'Status Change',
    icon: RefreshCw,
    color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  },
  MILESTONE: {
    label: 'Milestone',
    icon: CheckCircle2,
    color: 'text-green-500 bg-green-500/10 border-green-500/20',
  },
  DELIVERABLE: {
    label: 'Deliverable',
    icon: Package,
    color: 'text-violet-500 bg-violet-500/10 border-violet-500/20',
  },
  NOTE: {
    label: 'Note',
    icon: FileText,
    color: 'text-gray-500 bg-gray-500/10 border-gray-500/20',
  },
  BLOCKER: {
    label: 'Blocker',
    icon: AlertTriangle,
    color: 'text-red-500 bg-red-500/10 border-red-500/20',
  },
}

export function ProjectUpdatesTimeline({ projectId }: ProjectUpdatesTimelineProps) {
  const [updates, setUpdates] = useState<ProjectUpdate[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadUpdates()
  }, [projectId])

  const loadUpdates = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/updates`)
      const result = await response.json()

      if (result.success) {
        setUpdates(result.data)
      }
    } catch (error) {
      console.error('Failed to load updates:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <Card className="p-12 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-3/4 mx-auto" />
          <div className="h-4 bg-muted rounded w-1/2 mx-auto" />
        </div>
      </Card>
    )
  }

  if (updates.length === 0) {
    return (
      <Card className="p-12 text-center border-dashed">
        <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-sm text-muted-foreground">
          No updates yet. We'll post progress updates here as work begins.
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Project Updates</h3>
        <Badge variant="outline">{updates.length} update{updates.length !== 1 ? 's' : ''}</Badge>
      </div>

      <div className="space-y-4">
        {updates.map((update, index) => {
          const config = UPDATE_TYPE_CONFIG[update.type] || UPDATE_TYPE_CONFIG.NOTE
          const Icon = config.icon
          const attachments = update.attachments ? JSON.parse(update.attachments) : []

          return (
            <Card
              key={update.id}
              className={cn(
                'p-6',
                index === 0 && 'border-pink-500/30 bg-pink-500/5'
              )}
            >
              <div className="flex items-start gap-4">
                <div className={cn('flex items-center justify-center w-10 h-10 rounded-lg shrink-0', config.color)}>
                  <Icon className="h-5 w-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{update.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="outline" className={cn('gap-1', config.color)}>
                          {config.label}
                        </Badge>
                        <span>•</span>
                        <time>{format(new Date(update.createdAt), 'MMM d, yyyy')} at {format(new Date(update.createdAt), 'h:mm a')}</time>
                      </div>
                    </div>
                    {index === 0 && (
                      <Badge className="bg-pink-500 text-white">Latest</Badge>
                    )}
                  </div>

                  {update.body && (
                    <div className="prose prose-sm dark:prose-invert max-w-none mt-3">
                      <p className="text-muted-foreground whitespace-pre-wrap">{update.body}</p>
                    </div>
                  )}

                  {attachments.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">Attachments:</p>
                      <div className="flex flex-wrap gap-2">
                        {attachments.map((file: any) => (
                          <a
                            key={file.id}
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs px-3 py-1.5 rounded-md bg-muted hover:bg-muted/80 transition-colors flex items-center gap-2"
                          >
                            <FileText className="h-3 w-3" />
                            {file.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
