'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { Task, TaskStatus } from '@prisma/client'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  closestCorners,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { TaskCard } from '@/components/labs-dashboard/TaskCard'
import { TaskModal } from '@/components/labs-dashboard/TaskModal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

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

const columns: { id: TaskStatus; title: string; className: string }[] = [
  { id: 'TODO', title: 'To Do', className: 'bg-slate-500/5' },
  { id: 'IN_PROGRESS', title: 'In Progress', className: 'bg-cyan-500/5' },
  { id: 'IN_REVIEW', title: 'In Review', className: 'bg-purple-500/5' },
  { id: 'COMPLETED', title: 'Completed', className: 'bg-green-500/5' },
]

export default function TaskBoardPage() {
  const params = useParams()
  const projectId = params.id as string
  const { toast } = useToast()
  
  const [tasks, setTasks] = useState<TaskWithRelations[]>([])
  const [members, setMembers] = useState<ProjectMember[]>([])
  const [labels, setLabels] = useState<Array<{ id: string; name: string; color: string }>>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<TaskWithRelations | null>(null)
  const [activeTask, setActiveTask] = useState<TaskWithRelations | null>(null)
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  )
  
  const fetchTasks = useCallback(async () => {
    try {
      const response = await fetch(`/api/labs/projects/${projectId}/tasks`)
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
  }, [projectId, toast])
  
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
  
  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find(t => t.id === event.active.id)
    if (task) {
      setActiveTask(task)
    }
  }
  
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)
    
    if (!over) return
    
    const taskId = active.id as string
    const newStatus = over.id as TaskStatus
    
    // Check if dropped on a column
    if (!columns.some(col => col.id === newStatus)) return
    
    const task = tasks.find(t => t.id === taskId)
    if (!task || task.status === newStatus) return
    
    // Optimistic update
    setTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, status: newStatus } : t
    ))
    
    // API call
    try {
      const response = await fetch(`/api/labs/projects/${projectId}/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      
      const result = await response.json()
      
      if (!result.success) {
        // Revert on error
        setTasks(prev => prev.map(t =>
          t.id === taskId ? { ...t, status: task.status } : t
        ))
        toast({
          title: 'Error',
          description: result.error || 'Failed to update task status',
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Success',
          description: `Task moved to ${columns.find(c => c.id === newStatus)?.title}`,
        })
      }
    } catch (error) {
      // Revert on error
      setTasks(prev => prev.map(t =>
        t.id === taskId ? { ...t, status: task.status } : t
      ))
      toast({
        title: 'Error',
        description: 'Failed to update task status',
        variant: 'destructive',
      })
    }
  }
  
  const handleTaskClick = (task: TaskWithRelations) => {
    setEditingTask(task)
    setIsModalOpen(true)
  }
  
  const handleCreateTask = () => {
    setEditingTask(null)
    setIsModalOpen(true)
  }
  
  const handleSuccess = (task: Task) => {
    fetchTasks()
    toast({
      title: 'Success',
      description: editingTask ? 'Task updated successfully' : 'Task created successfully',
    })
  }
  
  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status)
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    )
  }
  
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Task Board</h2>
          <p className="text-muted-foreground">
            {tasks.length} tasks • Drag and drop to update status
          </p>
        </div>
        <Button onClick={() => handleCreateTask()} className="bg-cyan-600 hover:bg-cyan-700">
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </Button>
      </div>
      
      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 overflow-x-auto">
          <div className="flex gap-4 min-w-max pb-4">
            {columns.map(column => {
              const columnTasks = getTasksByStatus(column.id)
              
              return (
                <div
                  key={column.id}
                  className={cn(
                    'w-80 flex-shrink-0 rounded-lg',
                    column.className
                  )}
                >
                  <Card className="h-full bg-transparent border-0 shadow-none">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center justify-between text-sm font-medium">
                        <span>{column.title}</span>
                        <Badge variant="secondary" className="ml-2">
                          {columnTasks.length}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <SortableContext
                        items={columnTasks.map(t => t.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-3 min-h-[100px]">
                          {columnTasks.map(task => (
                            <TaskCard
                              key={task.id}
                              task={task}
                              onClick={() => handleTaskClick(task)}
                            />
                          ))}
                        </div>
                      </SortableContext>
                      
                      {/* Add Task Button */}
                      <Button
                        variant="ghost"
                        className="w-full mt-3 text-muted-foreground hover:text-foreground"
                        onClick={() => handleCreateTask()}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Task
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>
        </div>
        
        {/* Drag Overlay */}
        <DragOverlay>
          {activeTask ? (
            <TaskCard
              task={activeTask}
              className="rotate-2 shadow-xl"
            />
          ) : null}
        </DragOverlay>
      </DndContext>
      
      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
        projectId={projectId}
        task={editingTask}
        members={members}
        labels={labels}
      />
    </div>
  )
}
