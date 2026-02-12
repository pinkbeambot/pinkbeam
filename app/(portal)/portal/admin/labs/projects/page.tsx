'use client'

import { useState, useEffect, useCallback } from 'react'
import { PageHeader } from '@/components/labs-dashboard/PageHeader'
import { ProjectTable } from '@/components/labs-dashboard/ProjectTable'
import { ProjectModal } from '@/components/labs-dashboard/ProjectModal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Search, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'

interface Project {
  id: string
  title: string
  description: string | null
  status: string
  progress: number
  budget: string | null
  deadline: string | null
  startDate: string | null
  targetEndDate: string | null
  clientId: string
  services: string[]
  createdAt: string
  updatedAt: string
  client: {
    id: string
    name: string | null
    email: string
  }
  members: Array<{
    id: string
    role: string
    user: {
      id: string
      name: string | null
      email: string
    }
  }>
  milestones: Array<{
    id: string
    title: string
    dueDate: string | null
    completedAt: string | null
  }>
  _count: {
    files: number
  }
}

const statusOptions = [
  { value: 'ALL', label: 'All Statuses' },
  { value: 'LEAD', label: 'Lead' },
  { value: 'QUOTED', label: 'Quoted' },
  { value: 'ACCEPTED', label: 'Accepted' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'REVIEW', label: 'Review' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'ON_HOLD', label: 'On Hold' },
  { value: 'CANCELLED', label: 'Cancelled' },
]

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const { toast } = useToast()

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (statusFilter !== 'ALL') params.append('status', statusFilter)
      if (searchQuery) params.append('search', searchQuery)
      params.append('sortBy', sortBy)
      params.append('sortOrder', sortOrder)

      const response = await fetch(`/api/labs/projects?${params.toString()}`)
      const result = await response.json()

      if (result.success) {
        setProjects(result.data)
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to fetch projects',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch projects',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [statusFilter, searchQuery, sortBy, sortOrder, toast])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const handleArchive = async (id: string) => {
    try {
      const response = await fetch(`/api/labs/projects/${id}`, {
        method: 'DELETE',
      })
      const result = await response.json()

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Project archived successfully',
        })
        fetchProjects()
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to archive project',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to archive project',
        variant: 'destructive',
      })
    }
  }

  const handleCreateSuccess = () => {
    setIsModalOpen(false)
    setEditingProject(null)
    fetchProjects()
    toast({
      title: 'Success',
      description: editingProject ? 'Project updated successfully' : 'Project created successfully',
    })
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Projects"
        description="Manage and track your projects"
      />

      {/* Actions Bar */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search projects..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Date Created</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="deadline">Deadline</SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={() => {
            setEditingProject(null)
            setIsModalOpen(true)
          }}
          className="bg-cyan-600 hover:bg-cyan-700 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Projects Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Projects</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
            </div>
          ) : (
            <ProjectTable 
              projects={projects} 
              onArchive={handleArchive}
            />
          )}
        </CardContent>
      </Card>

      {/* Project Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingProject(null)
        }}
        onSuccess={handleCreateSuccess}
        project={editingProject}
      />
    </div>
  )
}
