'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ArrowUpDown, Calendar, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

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

interface ProjectTableProps {
  projects: Project[]
  onUpdate: () => void
}

type SortField = 'title' | 'client' | 'status' | 'deadline' | 'progress'
type SortOrder = 'asc' | 'desc'

const STATUS_COLORS: Record<string, string> = {
  LEAD: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  QUOTED: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  ACCEPTED: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  IN_PROGRESS: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  REVIEW: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  COMPLETED: 'bg-green-500/10 text-green-600 border-green-500/20',
  ON_HOLD: 'bg-red-500/10 text-red-600 border-red-500/20',
}

const STATUS_LABELS: Record<string, string> = {
  LEAD: 'New',
  QUOTED: 'Quoted',
  ACCEPTED: 'Accepted',
  IN_PROGRESS: 'In Progress',
  REVIEW: 'Review',
  COMPLETED: 'Completed',
  ON_HOLD: 'On Hold',
}

export function ProjectTable({ projects, onUpdate }: ProjectTableProps) {
  const [sortField, setSortField] = useState<SortField>('deadline')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')

  const isOverdue = (deadline: string | null) => {
    if (!deadline) return false
    return new Date(deadline) < new Date()
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  const sortedProjects = [...projects].sort((a, b) => {
    let aVal: any
    let bVal: any

    switch (sortField) {
      case 'title':
        aVal = a.title.toLowerCase()
        bVal = b.title.toLowerCase()
        break
      case 'client':
        aVal = (a.client.name || a.client.company || '').toLowerCase()
        bVal = (b.client.name || b.client.company || '').toLowerCase()
        break
      case 'status':
        aVal = a.status
        bVal = b.status
        break
      case 'deadline':
        aVal = a.deadline ? new Date(a.deadline).getTime() : Infinity
        bVal = b.deadline ? new Date(b.deadline).getTime() : Infinity
        break
      case 'progress':
        aVal = a.progress
        bVal = b.progress
        break
      default:
        return 0
    }

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1
    return 0
  })

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 font-semibold"
                  onClick={() => handleSort('title')}
                >
                  Project
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 font-semibold"
                  onClick={() => handleSort('client')}
                >
                  Client
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>Services</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 font-semibold"
                  onClick={() => handleSort('status')}
                >
                  Status
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 font-semibold"
                  onClick={() => handleSort('deadline')}
                >
                  Deadline
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 font-semibold"
                  onClick={() => handleSort('progress')}
                >
                  Progress
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedProjects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No projects found
                </TableCell>
              </TableRow>
            ) : (
              sortedProjects.map((project) => (
                <TableRow
                  key={project.id}
                  className={cn(
                    'cursor-pointer hover:bg-muted/50 transition-colors',
                    isOverdue(project.deadline) &&
                      project.status !== 'COMPLETED' &&
                      'bg-red-500/5 hover:bg-red-500/10'
                  )}
                >
                  <TableCell className="font-medium">
                    <div className="max-w-xs">
                      <p className="truncate">{project.title}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-3 w-3 text-muted-foreground" />
                      <span className="truncate max-w-[150px]">
                        {project.client.name || project.client.company || 'No name'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap max-w-[200px]">
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
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn('font-normal', STATUS_COLORS[project.status])}
                    >
                      {STATUS_LABELS[project.status] || project.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {project.deadline ? (
                      <div
                        className={cn(
                          'flex items-center gap-2 text-sm',
                          isOverdue(project.deadline) && project.status !== 'COMPLETED'
                            ? 'text-red-600 font-medium'
                            : 'text-muted-foreground'
                        )}
                      >
                        <Calendar className="h-3 w-3" />
                        {format(new Date(project.deadline), 'MMM d, yyyy')}
                        {isOverdue(project.deadline) && project.status !== 'COMPLETED' && (
                          <Badge variant="destructive" className="text-xs ml-1">
                            Overdue
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">No deadline</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 min-w-[120px]">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-pink-500 transition-all"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-8 text-right">
                        {project.progress}%
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {sortedProjects.length === 0 ? (
          <Card className="p-8">
            <p className="text-center text-muted-foreground">No projects found</p>
          </Card>
        ) : (
          sortedProjects.map((project) => (
            <Card
              key={project.id}
              className={cn(
                'p-4 cursor-pointer hover:shadow-md transition-shadow',
                isOverdue(project.deadline) &&
                  project.status !== 'COMPLETED' &&
                  'border-red-500/50 bg-red-500/5'
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-medium line-clamp-2 flex-1 pr-2">{project.title}</h3>
                <Badge
                  variant="outline"
                  className={cn('shrink-0', STATUS_COLORS[project.status])}
                >
                  {STATUS_LABELS[project.status] || project.status}
                </Badge>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-3 w-3" />
                  <span className="truncate">
                    {project.client.name || project.client.company || 'No name'}
                  </span>
                </div>

                {project.deadline && (
                  <div
                    className={cn(
                      'flex items-center gap-2 text-sm',
                      isOverdue(project.deadline) && project.status !== 'COMPLETED'
                        ? 'text-red-600 font-medium'
                        : 'text-muted-foreground'
                    )}
                  >
                    <Calendar className="h-3 w-3" />
                    {format(new Date(project.deadline), 'MMM d, yyyy')}
                    {isOverdue(project.deadline) && project.status !== 'COMPLETED' && (
                      <Badge variant="destructive" className="text-xs ml-1">
                        Overdue
                      </Badge>
                    )}
                  </div>
                )}

                <div className="flex flex-wrap gap-1">
                  {project.services.slice(0, 3).map((service) => (
                    <Badge key={service} variant="outline" className="text-xs">
                      {service}
                    </Badge>
                  ))}
                  {project.services.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{project.services.length - 3}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">Progress</span>
                  <span className="text-xs font-medium">{project.progress}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-pink-500 transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </>
  )
}
