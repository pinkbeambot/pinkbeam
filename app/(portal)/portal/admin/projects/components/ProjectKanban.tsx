'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, User } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

interface Project {
  id: string
  title: string
  status: string
  services: string[]
  deadline: string | null
  progress: number
  client: {
    name: string | null
    company: string | null
  }
}

interface ProjectKanbanProps {
  projects: Project[]
  onUpdate: () => void
}

const COLUMNS = [
  { id: 'LEAD', label: 'New', color: 'bg-gray-500' },
  { id: 'QUOTED', label: 'Quoted', color: 'bg-yellow-500' },
  { id: 'ACCEPTED', label: 'Accepted', color: 'bg-blue-500' },
  { id: 'IN_PROGRESS', label: 'In Progress', color: 'bg-purple-500' },
  { id: 'REVIEW', label: 'Review', color: 'bg-orange-500' },
  { id: 'COMPLETED', label: 'Completed', color: 'bg-green-500' },
]

const SERVICE_COLORS: Record<string, string> = {
  DESIGN: 'border-l-violet-500',
  DEVELOPMENT: 'border-l-cyan-500',
  SEO: 'border-l-green-500',
  MAINTENANCE: 'border-l-blue-500',
  CONSULTING: 'border-l-amber-500',
}

export function ProjectKanban({ projects, onUpdate }: ProjectKanbanProps) {
  const isOverdue = (deadline: string | null) => {
    if (!deadline) return false
    return new Date(deadline) < new Date()
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {COLUMNS.map((column) => {
        const columnProjects = projects.filter((p) => p.status === column.id)

        return (
          <div key={column.id} className="flex-shrink-0 w-80">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={cn('w-2 h-2 rounded-full', column.color)} />
                <h3 className="font-semibold">{column.label}</h3>
                <Badge variant="secondary" className="text-xs">
                  {columnProjects.length}
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              {columnProjects.map((project) => {
                const primaryService = project.services[0] || 'DEVELOPMENT'
                const borderColor = SERVICE_COLORS[primaryService] || 'border-l-gray-500'

                return (
                  <Card
                    key={project.id}
                    className={cn(
                      'p-4 cursor-pointer hover:shadow-md transition-shadow border-l-4',
                      borderColor,
                      isOverdue(project.deadline) && 'bg-red-500/5 border-red-500'
                    )}
                  >
                    <h4 className="font-medium mb-2 line-clamp-2">{project.title}</h4>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="h-3 w-3" />
                        <span className="truncate">
                          {project.client.name || project.client.company || 'No name'}
                        </span>
                      </div>

                      {project.deadline && (
                        <div
                          className={cn(
                            'flex items-center gap-2',
                            isOverdue(project.deadline)
                              ? 'text-red-500 font-medium'
                              : 'text-muted-foreground'
                          )}
                        >
                          <Calendar className="h-3 w-3" />
                          <span>{format(new Date(project.deadline), 'MMM d, yyyy')}</span>
                          {isOverdue(project.deadline) && (
                            <Badge variant="destructive" className="text-xs">
                              Overdue
                            </Badge>
                          )}
                        </div>
                      )}

                      <div className="flex gap-1 flex-wrap">
                        {project.services.slice(0, 2).map((service) => (
                          <Badge key={service} variant="outline" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                        {project.services.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{project.services.length - 2}
                          </Badge>
                        )}
                      </div>

                      {project.progress > 0 && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Progress</span>
                            <span>{project.progress}%</span>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-pink-500 transition-all"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                )
              })}

              {columnProjects.length === 0 && (
                <Card className="p-8 text-center border-dashed">
                  <p className="text-sm text-muted-foreground">No projects</p>
                </Card>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
