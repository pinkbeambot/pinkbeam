'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import {
  LayoutGrid,
  List,
  Calendar,
  Plus,
  Search,
  Filter,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ProjectTable } from './components/ProjectTable'
import { DeadlineWidget } from './components/DeadlineWidget'
import { LoadingSpinner } from '@/components/ui/loading'

// Lazy load ProjectKanban since it's only shown on demand
const ProjectKanban = dynamic(() => import('./components/ProjectKanban').then(mod => ({ default: mod.ProjectKanban })), {
  loading: () => <div className="flex items-center justify-center py-12"><LoadingSpinner /></div>,
  ssr: false
})

interface Project {
  id: string
  title: string
  status: string
  clientId: string
  services: string[]
  deadline: string | null
  progress: number
  client: {
    name: string | null
    email: string
    company: string | null
  }
}

export function ProjectManagementClient() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [serviceFilter, setServiceFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [view, setView] = useState<'kanban' | 'table'>('kanban')

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const response = await fetch('/api/labs/projects')
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
    const matchesSearch =
      !searchQuery ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client.company?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesService =
      serviceFilter === 'all' ||
      project.services.some((s) => s.toLowerCase() === serviceFilter.toLowerCase())

    const matchesStatus =
      statusFilter === 'all' || project.status === statusFilter

    return matchesSearch && matchesService && matchesStatus
  })

  const overdueProjects = projects.filter((p) => {
    if (!p.deadline) return false
    return new Date(p.deadline) < new Date() && p.status !== 'COMPLETED'
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading projects...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Project Management</h1>
          <p className="text-muted-foreground mt-1">
            Track all client projects, deadlines, and deliverables
          </p>
        </div>
        <Button className="bg-pink-500 hover:bg-pink-600">
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Overdue Alert */}
      {overdueProjects.length > 0 && (
        <Card className="p-4 border-red-500 bg-red-500/5">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <div>
              <p className="font-medium text-red-500">
                {overdueProjects.length} project{overdueProjects.length > 1 ? 's' : ''} overdue
              </p>
              <p className="text-sm text-muted-foreground">
                Immediate attention required
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total Projects</p>
          <p className="text-2xl font-bold mt-1">{projects.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">In Progress</p>
          <p className="text-2xl font-bold mt-1 text-blue-600">
            {projects.filter((p) => p.status === 'IN_PROGRESS').length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">In Review</p>
          <p className="text-2xl font-bold mt-1 text-purple-600">
            {projects.filter((p) => p.status === 'REVIEW').length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Overdue</p>
          <p className="text-2xl font-bold mt-1 text-red-600">
            {overdueProjects.length}
          </p>
        </Card>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-4">
          {/* Filters & View Toggle */}
          <Card className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={serviceFilter} onValueChange={setServiceFilter}>
                <SelectTrigger className="w-full md:w-40">
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
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="LEAD">Lead</SelectItem>
                  <SelectItem value="QUOTED">Quoted</SelectItem>
                  <SelectItem value="ACCEPTED">Accepted</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="REVIEW">Review</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="ON_HOLD">On Hold</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button
                  variant={view === 'kanban' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setView('kanban')}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={view === 'table' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setView('table')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Project Views */}
          {view === 'kanban' ? (
            <ProjectKanban projects={filteredProjects} onUpdate={loadProjects} />
          ) : (
            <ProjectTable projects={filteredProjects} onUpdate={loadProjects} />
          )}
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-4">
          <DeadlineWidget projects={projects} />
        </div>
      </div>
    </div>
  )
}
