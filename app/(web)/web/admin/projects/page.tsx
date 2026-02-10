'use client'

import Link from 'next/link'
import { useState } from 'react'
import { 
  FolderKanban, 
  Search, 
  Filter, 
  Plus,
  MoreHorizontal,
  Calendar,
  Users,
  ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { FadeIn } from '@/components/animations'

const allProjects = [
  { 
    id: '1', 
    name: 'Acme Corp Website Redesign', 
    client: 'Acme Corp',
    status: 'in-progress', 
    progress: 65,
    startDate: '2026-01-15',
    dueDate: '2026-03-15',
    phase: 'Development',
    team: ['Sarah Chen', 'Mike Ross'],
    budget: 5000,
    priority: 'high'
  },
  { 
    id: '2', 
    name: 'E-commerce Platform', 
    client: 'TechStart Inc',
    status: 'planning', 
    progress: 15,
    startDate: '2026-02-01',
    dueDate: '2026-04-01',
    phase: 'Discovery',
    team: ['Sarah Chen', 'Alex Kim'],
    budget: 12000,
    priority: 'high'
  },
  { 
    id: '3', 
    name: 'Marketing Landing Pages', 
    client: 'Marketing Pro',
    status: 'review', 
    progress: 90,
    startDate: '2026-01-20',
    dueDate: '2026-02-20',
    phase: 'Review',
    team: ['Mike Ross', 'Emma Wilson'],
    budget: 3000,
    priority: 'medium'
  },
  { 
    id: '4', 
    name: 'Blog Migration', 
    client: 'Content Co',
    status: 'completed', 
    progress: 100,
    startDate: '2026-01-01',
    dueDate: '2026-01-30',
    phase: 'Completed',
    team: ['Emma Wilson'],
    budget: 2000,
    priority: 'low'
  },
]

const statusFilters = ['all', 'planning', 'in-progress', 'review', 'completed']

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    'planning': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    'in-progress': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    'review': 'bg-violet-500/10 text-violet-500 border-violet-500/20',
    'completed': 'bg-green-500/10 text-green-500 border-green-500/20',
  }
  return colors[status] || 'bg-gray-500/10 text-gray-500'
}

function getPriorityColor(priority: string) {
  const colors: Record<string, string> = {
    'high': 'bg-red-500/10 text-red-500 border-red-500/20',
    'medium': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    'low': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  }
  return colors[priority] || 'bg-gray-500/10 text-gray-500'
}

export default function AdminProjectsPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const filteredProjects = allProjects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(search.toLowerCase()) ||
                         project.client.toLowerCase().includes(search.toLowerCase())
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
              Manage all client projects
            </p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>
      </FadeIn>

      {/* Filters */}
      <FadeIn delay={0.1}>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-muted-foreground" />
            {statusFilters.map((status) => (
              <Button
                key={status}
                variant={filter === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(status)}
              >
                {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
              </Button>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProjects.map((project, index) => (
          <FadeIn key={project.id} delay={0.1 + index * 0.05}>
            <Card className="h-full">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                      <FolderKanban className="w-5 h-5 text-violet-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{project.name}</h3>
                      <p className="text-sm text-muted-foreground">{project.client}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={getPriorityColor(project.priority)}>
                    {project.priority}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="outline" className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">• {project.phase}</span>
                </div>

                <div className="space-y-3 mb-4">
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

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      Due {new Date(project.dueDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      {project.team.length} members
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <p className="font-medium">${project.budget.toLocaleString()}</p>
                  <Button variant="ghost" size="sm">
                    View Details
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <FadeIn>
          <div className="text-center py-12">
            <FolderKanban className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No projects found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        </FadeIn>
      )}

      {/* Summary */}
      <FadeIn delay={0.3}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statusFilters.slice(1).map((status) => {
            const count = allProjects.filter(p => p.status === status).length
            return (
              <Card key={status}>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-sm text-muted-foreground capitalize">{status.replace('-', ' ')}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </FadeIn>
    </div>
  )
}
