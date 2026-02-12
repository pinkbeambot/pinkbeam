'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Folder, Calendar, TrendingUp, ChevronRight } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { LoadingSpinner } from '@/components/ui/loading'
import { EmptyState } from '@/components/ui/empty-states/EmptyState'

interface Project {
  id: string
  title: string
  description: string | null
  status: string
  services: string[]
  progress: number
  deadline: string | null
  startDate: string | null
  createdAt: string
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

const SERVICE_COLORS: Record<string, string> = {
  DESIGN: 'text-violet-500 bg-violet-500/10 border-violet-500/20',
  DEVELOPMENT: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
  SEO: 'text-green-500 bg-green-500/10 border-green-500/20',
  MAINTENANCE: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  CONSULTING: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
}

export function ProjectsClient() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [serviceFilter, setServiceFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      const result = await response.json()

      if (result.success) {
        setProjects(result.data)
      }
    } catch (error) {
      console.error('Failed to load projects:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredProjects = projects.filter((project) => {
    const matchesService =
      serviceFilter === 'all' ||
      project.services.some((s) => s.toLowerCase() === serviceFilter.toLowerCase())

    const matchesStatus = statusFilter === 'all' || project.status === statusFilter

    return matchesService && matchesStatus
  })

  const activeProjects = projects.filter(
    (p) => p.status === 'IN_PROGRESS' || p.status === 'REVIEW'
  )

  if (isLoading) {
    return <LoadingSpinner text="Loading projects..." />
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">My Projects</h1>
        <p className="text-muted-foreground mt-1">
          Track progress and view deliverables
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total Projects</p>
          <p className="text-2xl font-bold mt-1">{projects.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Active</p>
          <p className="text-2xl font-bold mt-1 text-purple-600">
            {activeProjects.length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Completed</p>
          <p className="text-2xl font-bold mt-1 text-green-600">
            {projects.filter((p) => p.status === 'COMPLETED').length}
          </p>
        </Card>
      </div>

      {/* Filters */}
      {projects.length > 0 && (
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Select value={serviceFilter} onValueChange={setServiceFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="development">Development</SelectItem>
                <SelectItem value="seo">SEO</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="consulting">Consulting</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ACCEPTED">Accepted</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="REVIEW">Review</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-muted-foreground">
                {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <EmptyState
          icon={Folder}
          title={projects.length === 0 ? 'No projects yet' : 'No projects match filters'}
          description={
            projects.length === 0
              ? 'Your projects will appear here once work begins'
              : 'Try adjusting your filters to see more projects'
          }
          action={
            projects.length === 0
              ? {
                  label: 'Browse Services',
                  href: '/',
                }
              : undefined
          }
        />
      ) : (
        <div className="grid gap-4">
          {filteredProjects.map((project) => {
            const statusInfo = STATUS_CONFIG[project.status] || {
              label: project.status,
              color: 'bg-gray-500',
            }
            const primaryService = project.services[0] || 'DEVELOPMENT'
            const serviceColor = SERVICE_COLORS[primaryService] || SERVICE_COLORS.DEVELOPMENT

            return (
              <Link key={project.id} href={`/portal/projects/${project.id}`}>
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={cn('gap-1', statusInfo.color, 'text-white')}>
                          {statusInfo.label}
                        </Badge>
                        {project.services.slice(0, 2).map((service) => (
                          <Badge key={service} variant="outline" className={serviceColor}>
                            {service}
                          </Badge>
                        ))}
                        {project.services.length > 2 && (
                          <Badge variant="outline">
                            +{project.services.length - 2}
                          </Badge>
                        )}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                      {project.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {project.description}
                        </p>
                      )}
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                  </div>

                  <div className="space-y-3">
                    {/* Progress Bar */}
                    {project.progress > 0 && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{project.progress}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-pink-500 transition-all"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Timeline */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {project.startDate && (
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4" />
                          <span>Started {format(new Date(project.startDate), 'MMM d, yyyy')}</span>
                        </div>
                      )}
                      {project.deadline && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Due {format(new Date(project.deadline), 'MMM d, yyyy')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
