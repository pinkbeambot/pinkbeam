'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { PageHeader } from '@/components/labs-dashboard/PageHeader'
import { Timeline } from '@/components/labs-dashboard/Timeline'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  ArrowLeft, 
  Loader2, 
  Edit2, 
  FileText, 
  Users, 
  Calendar, 
  DollarSign,
  FolderOpen,
  CheckCircle2,
  Clock,
  LayoutGrid,
  CheckSquare,
  Plus,
  Timer
} from 'lucide-react'
import { format } from 'date-fns'
import { useToast } from '@/hooks/use-toast'
import { ProjectModal } from '@/components/labs-dashboard/ProjectModal'

interface ProjectMember {
  id: string
  role: string
  user: {
    id: string
    name: string | null
    email: string
    role: string
  }
}

interface ProjectMilestone {
  id: string
  title: string
  description: string | null
  dueDate: string | null
  completedAt: string | null
  order: number
}

interface ProjectFile {
  id: string
  name: string
  mimeType: string
  size: number
  createdAt: string
  uploadedBy: {
    id: string
    name: string | null
    email: string
  }
}

interface TimeEntrySummary {
  totalDuration: number
  billableDuration: number
  totalEntries: number
  userSummaries: Array<{
    userId: string
    userName: string
    duration: number
    billableDuration: number
    entries: number
  }>
}

interface Project {
  id: string
  title: string
  description: string | null
  status: 'LEAD' | 'QUOTED' | 'ACCEPTED' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED'
  progress: number
  budget: string | null
  deadline: string | null
  startDate: string | null
  targetEndDate: string | null
  completedAt: string | null
  createdAt: string
  updatedAt: string
  clientId: string
  services: string[]
  client: {
    id: string
    name: string | null
    email: string
    company: string | null
  }
  members: ProjectMember[]
  milestones: ProjectMilestone[]
  files: ProjectFile[]
  quotes: Array<{
    id: string
    amount: string
    status: string
    createdAt: string
  }>
  invoices: Array<{
    id: string
    amount: string
    status: string
    createdAt: string
  }>
  timeSummary?: TimeEntrySummary
}

const statusConfig: Record<string, { label: string; className: string }> = {
  LEAD: { label: 'Lead', className: 'bg-gray-500/10 text-gray-400 border-gray-500/20' },
  QUOTED: { label: 'Quoted', className: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  ACCEPTED: { label: 'Accepted', className: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  IN_PROGRESS: { label: 'In Progress', className: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
  REVIEW: { label: 'Review', className: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  COMPLETED: { label: 'Completed', className: 'bg-green-500/10 text-green-400 border-green-500/20' },
  ON_HOLD: { label: 'On Hold', className: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  CANCELLED: { label: 'Cancelled', className: 'bg-red-500/10 text-red-400 border-red-500/20' },
}

const serviceLabels: Record<string, string> = {
  DESIGN: 'Design',
  DEVELOPMENT: 'Development',
  SEO: 'SEO',
  MAINTENANCE: 'Maintenance',
  CONSULTING: 'Consulting',
}

export default function ProjectDetailPage() {
  const params = useParams()
  const projectId = params.id as string
  const [project, setProject] = useState<Project | null>(null)
  const [tasks, setTasks] = useState<Array<{ id: string; status: string; title: string; duration?: number }>>([])
  const [timeEntries, setTimeEntries] = useState<Array<{ id: string; taskId: string | null; duration: number; billable: boolean; user: { name: string | null } }>>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const { toast } = useToast()

  const fetchProject = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/labs/projects/${projectId}`)
      const result = await response.json()

      if (result.success) {
        setProject(result.data)
        // Fetch tasks for this project
        try {
          const tasksResponse = await fetch(`/api/labs/projects/${projectId}/tasks`)
          const tasksResult = await tasksResponse.json()
          if (tasksResult.success) {
            setTasks(tasksResult.data)
          }
        } catch (tasksError) {
          console.error('Error fetching tasks:', tasksError)
        }
        
        // Fetch time entries for this project
        try {
          const timeResponse = await fetch(`/api/labs/time-entries?projectId=${projectId}&view=monthly`)
          const timeResult = await timeResponse.json()
          if (timeResult.success) {
            setTimeEntries(timeResult.data)
          }
        } catch (timeError) {
          console.error('Error fetching time entries:', timeError)
        }
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to fetch project',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch project',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [projectId, toast])

  useEffect(() => {
    if (projectId) {
      fetchProject()
    }
  }, [projectId, fetchProject])

  const handleUpdateSuccess = () => {
    setIsEditModalOpen(false)
    fetchProject()
    toast({
      title: 'Success',
      description: 'Project updated successfully',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">Project not found</h2>
        <p className="text-muted-foreground mt-2">The project you are looking for does not exist.</p>
        <Button asChild className="mt-4 bg-cyan-600 hover:bg-cyan-700">
          <Link href="/labs/dashboard/projects">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Link>
        </Button>
      </div>
    )
  }

  const status = statusConfig[project.status]
  const completedMilestones = project.milestones.filter(m => m.completedAt).length
  
  // Calculate time summary
  const totalProjectTime = timeEntries.reduce((sum, entry) => sum + entry.duration, 0)
  const billableProjectTime = timeEntries
    .filter(e => e.billable)
    .reduce((sum, entry) => sum + entry.duration, 0)
  
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours === 0) return `${mins}m`
    if (mins === 0) return `${hours}h`
    return `${hours}h ${mins}m`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-2 -ml-2">
            <Link href="/labs/dashboard/projects">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Link>
          </Button>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
            <Badge variant="outline" className={status.className}>
              {status.label}
            </Badge>
          </div>
          {project.description && (
            <p className="text-muted-foreground mt-2">{project.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsEditModalOpen(true)}>
            <Edit2 className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Project Progress</span>
            <span className="text-sm text-muted-foreground">{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-2" />
          <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>{completedMilestones} of {project.milestones.length} milestones completed</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6 lg:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">
            Tasks
            {tasks.length > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {tasks.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="time">
            <Timer className="w-4 h-4 mr-1" />
            Time
            {timeEntries.length > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {formatDuration(totalProjectTime)}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Project Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-cyan-500" />
                  Project Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge variant="outline" className={`mt-1 ${status.className}`}>
                      {status.label}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Progress</p>
                    <p className="font-medium mt-1">{project.progress}%</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Services</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {project.services.map((service) => (
                      <Badge key={service} variant="secondary">
                        {serviceLabels[service] || service}
                      </Badge>
                    ))}
                  </div>
                </div>
                {project.budget && (
                  <div>
                    <p className="text-sm text-muted-foreground">Budget</p>
                    <p className="font-medium mt-1">${parseFloat(project.budget).toLocaleString()}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Dates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-cyan-500" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Start Date</p>
                    <p className="font-medium mt-1">
                      {project.startDate ? format(new Date(project.startDate), 'MMM d, yyyy') : 'Not set'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Target End</p>
                    <p className="font-medium mt-1">
                      {project.targetEndDate ? format(new Date(project.targetEndDate), 'MMM d, yyyy') : 'Not set'}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Deadline</p>
                  <p className="font-medium mt-1">
                    {project.deadline ? format(new Date(project.deadline), 'MMM d, yyyy') : 'Not set'}
                  </p>
                </div>
                {project.completedAt && (
                  <div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="font-medium mt-1 text-green-500">
                      {format(new Date(project.completedAt), 'MMM d, yyyy')}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Client */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-cyan-500" />
                  Client
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">{project.client.name || 'Unnamed Client'}</p>
                  <p className="text-sm text-muted-foreground">{project.client.email}</p>
                  {project.client.company && (
                    <p className="text-sm text-muted-foreground">{project.client.company}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Team */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-cyan-500" />
                  Team Members
                </CardTitle>
              </CardHeader>
              <CardContent>
                {project.members.length === 0 ? (
                  <p className="text-muted-foreground">No team members assigned</p>
                ) : (
                  <div className="space-y-3">
                    {project.members.map((member) => (
                      <div key={member.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{member.user.name || member.user.email}</p>
                          <p className="text-xs text-muted-foreground">{member.user.email}</p>
                        </div>
                        <Badge variant="secondary">{member.role}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Time Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-cyan-500" />
                  Time Tracked
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Time</p>
                    <p className="text-2xl font-bold">{formatDuration(totalProjectTime)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Billable</p>
                    <p className="text-2xl font-bold text-green-600">{formatDuration(billableProjectTime)}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Billable %</p>
                  <p className="font-medium mt-1">
                    {totalProjectTime > 0 ? Math.round((billableProjectTime / totalProjectTime) * 100) : 0}%
                  </p>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/labs/dashboard/time?projectId=${project.id}`}>
                    <Timer className="w-4 h-4 mr-2" />
                    View Time Details
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Time Tracking Tab */}
        <TabsContent value="time" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Timer className="w-5 h-5 text-cyan-500" />
                Project Time Tracking
              </CardTitle>
              <CardDescription>View time logged to this project</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">{formatDuration(totalProjectTime)}</p>
                  <p className="text-sm text-muted-foreground">Total Time</p>
                </div>
                <div className="text-center p-4 bg-green-500/10 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{formatDuration(billableProjectTime)}</p>
                  <p className="text-sm text-muted-foreground">Billable</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">{timeEntries.length}</p>
                  <p className="text-sm text-muted-foreground">Entries</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">
                    {totalProjectTime > 0 ? Math.round((billableProjectTime / totalProjectTime) * 100) : 0}%
                  </p>
                  <p className="text-sm text-muted-foreground">Billable %</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Button variant="outline" asChild>
                  <Link href={`/labs/dashboard/time?projectId=${project.id}`}>
                    View All Time Entries
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/labs/dashboard/time">
                    <Plus className="w-4 h-4 mr-2" />
                    Log Time
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Time by Task */}
          <Card>
            <CardHeader>
              <CardTitle>Time by Task</CardTitle>
              <CardDescription>Time logged per task in this project</CardDescription>
            </CardHeader>
            <CardContent>
              {tasks.length === 0 ? (
                <p className="text-muted-foreground">No tasks yet</p>
              ) : (
                <div className="space-y-3">
                  {tasks.map((task) => {
                    const taskTime = timeEntries
                      .filter(e => e.taskId === task.id)
                      .reduce((sum, e) => sum + e.duration, 0)
                    return (
                      <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <CheckSquare className="w-5 h-5 text-cyan-500" />
                          <span className="font-medium">{task.title}</span>
                          <Badge variant="outline">{task.status}</Badge>
                        </div>
                        <span className="font-mono">{formatDuration(taskTime)}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Project Timeline</CardTitle>
              <CardDescription>Track milestones and key dates</CardDescription>
            </CardHeader>
            <CardContent>
              <Timeline
                milestones={project.milestones}
                projectId={project.id}
                onMilestoneAdded={fetchProject}
                onMilestoneUpdated={fetchProject}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Files Tab */}
        <TabsContent value="files">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-cyan-500" />
                Project Files
              </CardTitle>
              <CardDescription>Manage files associated with this project</CardDescription>
            </CardHeader>
            <CardContent>
              {project.files.length === 0 ? (
                <div className="text-center py-8">
                  <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No files yet</p>
                  <Button className="mt-4 bg-cyan-600 hover:bg-cyan-700">
                    Upload File
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {project.files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-cyan-500" />
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Uploaded by {file.uploadedBy.name || file.uploadedBy.email} on{' '}
                            {format(new Date(file.createdAt), 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-cyan-500" />
                  Project Tasks
                </CardTitle>
                <CardDescription>Manage tasks and track progress</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <Link href={`/labs/dashboard/projects/${project.id}/tasks/list`}>
                    <CheckSquare className="w-4 h-4 mr-2" />
                    List View
                  </Link>
                </Button>
                <Button className="bg-cyan-600 hover:bg-cyan-700" asChild>
                  <Link href={`/labs/dashboard/projects/${project.id}/tasks/board`}>
                    <LayoutGrid className="w-4 h-4 mr-2" />
                    Board View
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {tasks.length === 0 ? (
                <div className="text-center py-8">
                  <CheckSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No tasks yet</p>
                  <Button className="mt-4 bg-cyan-600 hover:bg-cyan-700" asChild>
                    <Link href={`/labs/dashboard/projects/${project.id}/tasks/board`}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Task
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {tasks.slice(0, 5).map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <CheckSquare className="w-5 h-5 text-cyan-500" />
                        <span className="font-medium">{task.title}</span>
                      </div>
                      <Badge variant="outline">{task.status}</Badge>
                    </div>
                  ))}
                  {tasks.length > 5 && (
                    <p className="text-center text-sm text-muted-foreground py-2">
                      +{tasks.length - 5} more tasks
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Project Settings</CardTitle>
              <CardDescription>Manage project details and configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={() => setIsEditModalOpen(true)}>
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Project Details
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Modal */}
      <ProjectModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleUpdateSuccess}
        project={project}
      />
    </div>
  )
}
