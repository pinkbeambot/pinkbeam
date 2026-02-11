'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { z } from 'zod'

const projectSchema = z.object({
  title: z.string().min(1, 'Project title is required'),
  description: z.string().optional(),
  clientId: z.string().min(1, 'Client is required'),
  services: z.array(z.enum(['DESIGN', 'DEVELOPMENT', 'SEO', 'MAINTENANCE', 'CONSULTING'])).min(1, 'At least one service is required'),
  status: z.enum(['LEAD', 'QUOTED', 'ACCEPTED', 'IN_PROGRESS', 'REVIEW', 'COMPLETED', 'ON_HOLD', 'CANCELLED']),
  budget: z.number().optional(),
  progress: z.number().min(0).max(100).default(0),
  deadline: z.string().optional(),
  startDate: z.string().optional(),
  targetEndDate: z.string().optional(),
})

type ProjectFormData = z.infer<typeof projectSchema>

interface Client {
  id: string
  name: string | null
  email: string
}

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
  client?: {
    id: string
    name: string | null
    email: string
  }
}

interface ProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  project?: Project | null
}

const statusOptions = [
  { value: 'LEAD', label: 'Lead' },
  { value: 'QUOTED', label: 'Quoted' },
  { value: 'ACCEPTED', label: 'Accepted' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'REVIEW', label: 'Review' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'ON_HOLD', label: 'On Hold' },
  { value: 'CANCELLED', label: 'Cancelled' },
]

const serviceOptions = [
  { value: 'DESIGN', label: 'Design' },
  { value: 'DEVELOPMENT', label: 'Development' },
  { value: 'SEO', label: 'SEO' },
  { value: 'MAINTENANCE', label: 'Maintenance' },
  { value: 'CONSULTING', label: 'Consulting' },
]

export function ProjectModal({ isOpen, onClose, onSuccess, project }: ProjectModalProps) {
  const [loading, setLoading] = useState(false)
  const [clients, setClients] = useState<Client[]>([])
  const [clientsLoading, setClientsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { toast } = useToast()

  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    clientId: '',
    services: [],
    status: 'LEAD',
    budget: undefined,
    progress: 0,
    deadline: '',
    startDate: '',
    targetEndDate: '',
  })

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        description: project.description || '',
        clientId: project.clientId,
        services: project.services as ('DESIGN' | 'DEVELOPMENT' | 'SEO' | 'MAINTENANCE' | 'CONSULTING')[],
        status: project.status as ProjectFormData['status'],
        budget: project.budget ? parseFloat(project.budget) : undefined,
        progress: project.progress,
        deadline: project.deadline ? project.deadline.split('T')[0] : '',
        startDate: project.startDate ? project.startDate.split('T')[0] : '',
        targetEndDate: project.targetEndDate ? project.targetEndDate.split('T')[0] : '',
      })
    } else {
      setFormData({
        title: '',
        description: '',
        clientId: '',
        services: [],
        status: 'LEAD',
        budget: undefined,
        progress: 0,
        deadline: '',
        startDate: '',
        targetEndDate: '',
      })
    }
    setErrors({})
  }, [project, isOpen])

  useEffect(() => {
    if (isOpen) {
      fetchClients()
    }
  }, [isOpen])

  const fetchClients = async () => {
    try {
      setClientsLoading(true)
      const response = await fetch('/api/clients')
      const result = await response.json()
      if (result.success) {
        setClients(result.data)
      }
    } catch (error) {
      console.error('Error fetching clients:', error)
    } finally {
      setClientsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const result = projectSchema.safeParse(formData)
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.issues.forEach((err) => {
        const path = err.path
        if (path.length > 0) {
          fieldErrors[path[0].toString()] = err.message
        }
      })
      setErrors(fieldErrors)
      return
    }

    try {
      setLoading(true)
      const url = project ? `/api/labs/projects/${project.id}` : '/api/labs/projects'
      const method = project ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...result.data,
          deadline: result.data.deadline || undefined,
          startDate: result.data.startDate || undefined,
          targetEndDate: result.data.targetEndDate || undefined,
        }),
      })

      const data = await response.json()

      if (data.success) {
        onSuccess()
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to save project',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save project',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleService = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(service as typeof prev.services[number])
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service as typeof prev.services[number]],
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{project ? 'Edit Project' : 'Create New Project'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Project Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter project title"
            />
            {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter project description"
              rows={3}
            />
          </div>

          {/* Client */}
          <div className="space-y-2">
            <Label htmlFor="client">Client *</Label>
            <Select
              value={formData.clientId}
              onValueChange={(value) => setFormData({ ...formData, clientId: value })}
              disabled={clientsLoading || !!project}
            >
              <SelectTrigger>
                <SelectValue placeholder={clientsLoading ? 'Loading clients...' : 'Select a client'} />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name || client.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.clientId && <p className="text-sm text-red-500">{errors.clientId}</p>}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value as ProjectFormData['status'] })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Services */}
          <div className="space-y-2">
            <Label>Services *</Label>
            <div className="flex flex-wrap gap-2">
              {serviceOptions.map((service) => (
                <Button
                  key={service.value}
                  type="button"
                  variant={formData.services.includes(service.value as typeof formData.services[number]) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleService(service.value)}
                  className={
                    formData.services.includes(service.value as typeof formData.services[number])
                      ? 'bg-cyan-600 hover:bg-cyan-700'
                      : ''
                  }
                >
                  {service.label}
                </Button>
              ))}
            </div>
            {errors.services && <p className="text-sm text-red-500">{errors.services}</p>}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetEndDate">Target End Date</Label>
              <Input
                id="targetEndDate"
                type="date"
                value={formData.targetEndDate}
                onChange={(e) => setFormData({ ...formData, targetEndDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>
          </div>

          {/* Budget and Progress */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget">Budget ($)</Label>
              <Input
                id="budget"
                type="number"
                min="0"
                step="0.01"
                value={formData.budget || ''}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value ? parseFloat(e.target.value) : undefined })}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="progress">Progress (%)</Label>
              <Input
                id="progress"
                type="number"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {project ? 'Update Project' : 'Create Project'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
