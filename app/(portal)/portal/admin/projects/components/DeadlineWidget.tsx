'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, AlertCircle, Clock } from 'lucide-react'
import { format, formatDistanceToNow, isAfter, isBefore, addDays } from 'date-fns'
import { cn } from '@/lib/utils'

interface Project {
  id: string
  title: string
  status: string
  deadline: string | null
  client: {
    name: string | null
    company: string | null
  }
}

interface DeadlineWidgetProps {
  projects: Project[]
}

export function DeadlineWidget({ projects }: DeadlineWidgetProps) {
  const now = new Date()
  const next7Days = addDays(now, 7)

  // Filter for projects with deadlines
  const projectsWithDeadlines = projects.filter(
    (p) => p.deadline && p.status !== 'COMPLETED'
  )

  // Categorize deadlines
  const overdue = projectsWithDeadlines.filter((p) =>
    isBefore(new Date(p.deadline!), now)
  )

  const upcoming = projectsWithDeadlines.filter((p) => {
    const deadline = new Date(p.deadline!)
    return isAfter(deadline, now) && isBefore(deadline, next7Days)
  })

  const later = projectsWithDeadlines.filter((p) => {
    const deadline = new Date(p.deadline!)
    return isAfter(deadline, next7Days)
  })

  // Sort each category by deadline
  const sortByDeadline = (a: Project, b: Project) =>
    new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime()

  const sortedOverdue = overdue.sort(sortByDeadline)
  const sortedUpcoming = upcoming.sort(sortByDeadline)
  const sortedLater = later.sort(sortByDeadline).slice(0, 5) // Show only next 5

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-5 w-5 text-muted-foreground" />
        <h3 className="font-semibold">Deadlines</h3>
      </div>

      {projectsWithDeadlines.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No upcoming deadlines</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Overdue Section */}
          {sortedOverdue.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <h4 className="text-sm font-medium text-red-500">
                  Overdue ({sortedOverdue.length})
                </h4>
              </div>
              <div className="space-y-2">
                {sortedOverdue.map((project) => (
                  <DeadlineItem key={project.id} project={project} variant="overdue" />
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Section (Next 7 Days) */}
          {sortedUpcoming.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-orange-500" />
                <h4 className="text-sm font-medium text-orange-500">
                  Next 7 Days ({sortedUpcoming.length})
                </h4>
              </div>
              <div className="space-y-2">
                {sortedUpcoming.map((project) => (
                  <DeadlineItem key={project.id} project={project} variant="upcoming" />
                ))}
              </div>
            </div>
          )}

          {/* Later Section */}
          {sortedLater.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <h4 className="text-sm font-medium">Later</h4>
              </div>
              <div className="space-y-2">
                {sortedLater.map((project) => (
                  <DeadlineItem key={project.id} project={project} variant="later" />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}

interface DeadlineItemProps {
  project: Project
  variant: 'overdue' | 'upcoming' | 'later'
}

function DeadlineItem({ project, variant }: DeadlineItemProps) {
  const deadline = new Date(project.deadline!)
  const timeAgo = formatDistanceToNow(deadline, { addSuffix: true })

  return (
    <div
      className={cn(
        'p-3 rounded-lg border transition-colors cursor-pointer hover:bg-muted/50',
        variant === 'overdue' && 'border-red-500/30 bg-red-500/5',
        variant === 'upcoming' && 'border-orange-500/30 bg-orange-500/5',
        variant === 'later' && 'border-border bg-card'
      )}
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h5 className="text-sm font-medium line-clamp-2 flex-1">{project.title}</h5>
          {variant === 'overdue' && (
            <Badge variant="destructive" className="text-xs shrink-0">
              Overdue
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span className={cn(variant === 'overdue' && 'text-red-500 font-medium')}>
            {format(deadline, 'MMM d, yyyy')}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground truncate">
            {project.client.name || project.client.company || 'No client'}
          </span>
          <span
            className={cn(
              'text-muted-foreground',
              variant === 'overdue' && 'text-red-500 font-medium'
            )}
          >
            {timeAgo}
          </span>
        </div>
      </div>
    </div>
  )
}
