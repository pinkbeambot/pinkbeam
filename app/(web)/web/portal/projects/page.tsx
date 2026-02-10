'use client'

import Link from 'next/link'
import { FolderKanban, Search, Filter, ArrowRight, Calendar, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { FadeIn } from '@/components/animations'
import { useState } from 'react'

const allProjects = [
  { 
    id: '1', 
    name: 'Acme Corp Website Redesign', 
    status: 'in-progress', 
    progress: 65,
    startDate: '2026-01-15',
    dueDate: '2026-03-15',
    phase: 'Development',
    description: 'Complete redesign of corporate website with modern UI/UX'
  },
  { 
    id: '2', 
    name: 'E-commerce Platform', 
    status: 'planning', 
    progress: 15,
    startDate: '2026-02-01',
    dueDate: '2026-04-01',
    phase: 'Discovery',
    description: 'Full-featured e-commerce platform with payment integration'
  },
  { 
    id: '3', 
    name: 'Marketing Landing Pages', 
    status: 'review', 
    progress: 90,
    startDate: '2026-01-20',
    dueDate: '2026-02-20',
    phase: 'Review',
    description: '5 high-converting landing pages for marketing campaigns'
  },
  { 
    id: '4', 
    name: 'Blog Migration', 
    status: 'completed', 
    progress: 100,
    startDate: '2026-01-01',
    dueDate: '2026-01-30',
    phase: 'Completed',
    description: 'Migration of existing blog to new CMS'
  },
]

const statusFilters = ['all', 'in-progress', 'planning', 'review', 'completed']

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    'in-progress': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    'planning': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    'review': 'bg-violet-500/10 text-violet-500 border-violet-500/20',
    'completed': 'bg-green-500/10 text-green-500 border-green-500/20',
  }
  return colors[status] || 'bg-gray-500/10 text-gray-500'
}

export default function ProjectsPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const filteredProjects = allProjects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || project.status === filter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Projects</h1>
            <p className="text-muted-foreground mt-1">
              Manage and track all your projects
            </p>
          </div>
        </div>
      </FadeIn>

      {/* Filters */}
      <FadeIn delay={0.1}>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            {statusFilters.map((status) => (
              <Button
                key={status}
                variant={filter === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProjects.map((project, index) => (
          <FadeIn key={project.id} delay={0.1 + index * 0.05}>
            <Link href={`/web/portal/projects/${project.id}`}>
              <Card className="h-full hover:border-violet-500/30 hover:shadow-md transition-all group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                      <FolderKanban className="w-5 h-5 text-violet-500" />
                    </div>
                    <Badge variant="outline" className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </div>

                  <h3 className="font-semibold text-lg mb-2 group-hover:text-violet-500 transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {new Date(project.dueDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {project.phase}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-violet-500 rounded-full transition-all"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center text-sm text-violet-500 font-medium pt-2">
                      View Details
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </FadeIn>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <FadeIn>
          <div className="text-center py-12">
            <FolderKanban className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No projects found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </div>
        </FadeIn>
      )}
    </div>
  )
}
