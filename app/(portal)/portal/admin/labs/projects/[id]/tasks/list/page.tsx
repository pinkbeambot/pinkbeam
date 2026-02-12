'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { Task, TaskStatus, TaskPriority } from '@prisma/client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { TaskModal } from '@/components/labs-dashboard/TaskModal'
import { TaskBadge } from '@/components/labs-dashboard/TaskBadge'
import { AssigneeAvatar } from '@/components/labs-dashboard/AssigneeAvatar'
import { TaskLabelList } from '@/components/labs-dashboard/TaskLabel'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, Plus, MoreHorizontal, Loader2, ArrowUpDown, Trash2, CheckSquare } from 'lucide-react'
import { format } from 'date-fns'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

interface TaskWithRelations extends Task {
  assignee: { id: string; name: string | null; email: string } | null
  labels: { id: string; name: string; color: string }[]
}

interface ProjectMember {
  id: string
  name: string | null
  email: string
  role: string
}

type SortField = 'title' | 'status' | 'priority' | 'dueDate' | 'createdAt'
type SortDirection = 'asc' | 'desc'

export default function TaskListPage() {
  const params = useParams()
  const projectId = params.id as string
  const { toast } = useToast()
  
  const [tasks, setTasks] = useState<TaskWithRelations[]>([])
  const [members, setMembers] = useState<ProjectMember[]>([])
  const [labels, setLabels] = useState<{ id: string; name: string; color: string }[]>([])
  const [loading, setLoading] = useState(true)
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all')
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all')
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all')
  
  // Sorting
  const [sortField, setSortField] = useState<SortField>('createdAt')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  
  // Selection
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set())
  
  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<TaskWithRelations | null>(null)
  
  const fetchTasks = useCallback(async () => {
    try {
      const queryParams = new URLSearchParams()
      if (statusFilter !== 'all') queryParams.append('status', statusFilter)
      if (priorityFilter !== 'all') queryParams.append('priority', priorityFilter)
      if (assigneeFilter !== 'all') queryParams.append('assigneeId', assigneeFilter)
      if (searchQuery) queryParams.append('search', searchQuery)
      
      const response = await fetch(`/api/labs/projects/${projectId}/tasks?${queryParams}`)
      const result = await response.json()
      
      if (result.success) {
        setTasks(result.data)
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to fetch tasks',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch tasks',
        variant: 'destructive',
      })
    }
  }, [projectId, statusFilter, priorityFilter, assigneeFilter, searchQuery, toast])
  
  const fetchProjectData = useCallback(async () => {
    try {
      const response = await fetch(`/api/labs/projects/${projectId}`)
      const result = await response.json()
      
      if (result.success) {
        setMembers(result.data.members.map((m: { user: ProjectMember }) => m.user) || [])
      }
    } catch (error) {
      console.error('Error fetching project:', error)
    }
  }, [projectId])
  
  const fetchLabels = useCallback(async () => {
    try {
      const response = await fetch(`/api/labs/projects/${projectId}/tasks/labels`)
      const result = await response.json()
      
      if (result.success) {
        setLabels(result.data)
      }
    } catch (error) {
      console.error('Error fetching labels:', error)
    }
  }, [projectId])
  
  useEffect(() => {
    if (!projectId) return
    
    const loadData = async () => {
      setLoading(true)
      await Promise.all([fetchTasks(), fetchProjectData(), fetchLabels()])
      setLoading(false)
    }
    
    loadData()
  }, [projectId, fetchTasks, fetchProjectData, fetchLabels])
  
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }
  
  const sortedTasks = [...tasks].sort((a, b) => {
    let comparison = 0
    
    switch (sortField) {
      case 'title':
        comparison = a.title.localeCompare(b.title)
        break
      case 'status':
        comparison = a.status.localeCompare(b.status)
        break
      case 'priority':
        const priorityOrder = { URGENT: 3, HIGH: 2, MEDIUM: 1, LOW: 0 }
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority]
        break
      case 'dueDate':
        if (!a.dueDate && !b.dueDate) comparison = 0
        else if (!a.dueDate) comparison = 1
        else if (!b.dueDate) comparison = -1
        else comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        break
      case 'createdAt':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        break
    }
    
    return sortDirection === 'asc' ? comparison : -comparison
  })
  
  const toggleTaskSelection = (taskId: string) => {
    setSelectedTasks(prev => {
      const newSet = new Set(prev)
      if (newSet.has(taskId)) {
        newSet.delete(taskId)
      } else {
        newSet.add(taskId)
      }
      return newSet
    })
  }
  
  const toggleAllSelection = () => {
    if (selectedTasks.size === tasks.length) {
      setSelectedTasks(new Set())
    } else {
      setSelectedTasks(new Set(tasks.map(t => t.id)))
    }
  }
  
  const handleBulkStatusChange = async (status: TaskStatus) => {
    try {
      const promises = Array.from(selectedTasks).map(taskId =>
        fetch(`/api/labs/projects/${projectId}/tasks/${taskId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
        })
      )
      
      await Promise.all(promises)
      
      toast({
        title: 'Success',
        description: `Updated ${selectedTasks.size} tasks`,
      })
      
      setSelectedTasks(new Set())
      fetchTasks()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update tasks',
        variant: 'destructive',
      })
    }
  }
  
  const handleBulkAssign = async (assigneeId: string) => {
    try {
      const promises = Array.from(selectedTasks).map(taskId =>
        fetch(`/api/labs/projects/${projectId}/tasks/${taskId}/assign`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ assigneeId: assigneeId || null }),
        })
      )
      
      await Promise.all(promises)
      
      toast({
        title: 'Success',
        description: `Assigned ${selectedTasks.size} tasks`,
      })
      
      setSelectedTasks(new Set())
      fetchTasks()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to assign tasks',
        variant: 'destructive',
      })
    }
  }
  
  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return
    
    try {
      const response = await fetch(`/api/labs/projects/${projectId}/tasks/${taskId}`, {
        method: 'DELETE',
      })
      
      const result = await response.json()
      
      if (result.success) {
        toast({
          title: 'Success',
          description: 'Task deleted successfully',
        })
        fetchTasks()
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to delete task',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete task',
        variant: 'destructive',
      })
    }
  }
  
  const handleSuccess = () => {
    fetchTasks()
    setIsModalOpen(false)
    setEditingTask(null)
    toast({
      title: 'Success',
      description: editingTask ? 'Task updated successfully' : 'Task created successfully',
    })
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    )
  }
  
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Task List</h2>
          <p className="text-muted-foreground">
            {tasks.length} tasks • {selectedTasks.size} selected
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-cyan-600 hover:bg-cyan-700">
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </Button>
      </div>
      
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as TaskStatus | 'all')}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="TODO">To Do</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="IN_REVIEW">In Review</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v as TaskPriority | 'all')}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="URGENT">Urgent</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="LOW">Low</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Assignee" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Assignees</SelectItem>
            <SelectItem value="unassigned">Unassigned</SelectItem>
            {members.map(member => (
              <SelectItem key={member.id} value={member.id}>
                {member.name || member.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Bulk Actions */}
      {selectedTasks.size > 0 && (
        <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
          <CheckSquare className="w-4 h-4 text-cyan-500" />
          <span className="text-sm font-medium">{selectedTasks.size} selected</span>
          <div className="flex-1" />
          <Select onValueChange={handleBulkStatusChange}>
            <SelectTrigger className="w-[140px] h-8">
              <SelectValue placeholder="Set Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TODO">To Do</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="IN_REVIEW">In Review</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
            </SelectContent>
          </Select>
          
          <Select onValueChange={handleBulkAssign}>
            <SelectTrigger className="w-[160px] h-8">
              <SelectValue placeholder="Assign To" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Unassigned</SelectItem>
              {members.map(member => (
                <SelectItem key={member.id} value={member.id}>
                  {member.name || member.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      {/* Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedTasks.size === tasks.length && tasks.length > 0}
                  onCheckedChange={toggleAllSelection}
                />
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort('title')}>
                <div className="flex items-center gap-1">
                  Title
                  <ArrowUpDown className={cn('w-3 h-3', sortField === 'title' ? 'text-cyan-500' : 'text-muted-foreground')} />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort('status')}>
                <div className="flex items-center gap-1">
                  Status
                  <ArrowUpDown className={cn('w-3 h-3', sortField === 'status' ? 'text-cyan-500' : 'text-muted-foreground')} />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort('priority')}>
                <div className="flex items-center gap-1">
                  Priority
                  <ArrowUpDown className={cn('w-3 h-3', sortField === 'priority' ? 'text-cyan-500' : 'text-muted-foreground')} />
                </div>
              </TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Labels</TableHead>
              <TableHead className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort('dueDate')}>
                <div className="flex items-center gap-1">
                  Due Date
                  <ArrowUpDown className={cn('w-3 h-3', sortField === 'dueDate' ? 'text-cyan-500' : 'text-muted-foreground')} />
                </div>
              </TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No tasks found
                </TableCell>
              </TableRow>
            ) : (
              sortedTasks.map(task => {
                const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'COMPLETED'
                
                return (
                  <TableRow
                    key={task.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => {
                      setEditingTask(task)
                      setIsModalOpen(true)
                    }}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedTasks.has(task.id)}
                        onCheckedChange={() => toggleTaskSelection(task.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{task.title}</div>
                      {task.description && (
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {task.description}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <TaskBadge status={task.status} />
                    </TableCell>
                    <TableCell>
                      <TaskBadge priority={task.priority} />
                    </TableCell>
                    <TableCell>
                      <AssigneeAvatar assignee={task.assignee} size="sm" />
                    </TableCell>
                    <TableCell>
                      <TaskLabelList labels={task.labels} maxVisible={2} />
                    </TableCell>
                    <TableCell>
                      {task.dueDate ? (
                        <span className={cn('text-sm', isOverdue && 'text-red-400 font-medium')}>
                          {format(new Date(task.dueDate), 'MMM d, yyyy')}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {
                            setEditingTask(task)
                            setIsModalOpen(true)
                          }}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-400"
                            onClick={() => handleDeleteTask(task.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingTask(null)
        }}
        onSuccess={handleSuccess}
        projectId={projectId}
        task={editingTask}
        members={members}
        labels={labels}
      />
    </div>
  )
}
