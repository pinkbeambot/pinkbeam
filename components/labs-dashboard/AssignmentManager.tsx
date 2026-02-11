'use client'

import { useState, useEffect } from 'react'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, useDraggable, useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { AlertTriangle, ArrowRightLeft, User, Briefcase } from 'lucide-react'

interface Task {
  id: string
  title: string
  status: string
  priority: string
  estimate?: number
  projectId: string
  projectName: string
  assigneeId?: string
  assigneeName?: string
}

interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  capacity: number
  allocated: number
  utilization: number
}

interface AssignmentManagerProps {
  projectId?: string
}

function DraggableTask({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: { task },
  })

  const style = transform ? {
    transform: CSS.Translate.toString(transform),
  } : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        p-3 bg-card border rounded-lg cursor-move hover:shadow-md transition-shadow
        ${isDragging ? 'opacity-50' : ''}
      `}
    >
      <div className="flex items-start gap-2">
        <ArrowRightLeft className="w-4 h-4 text-muted-foreground mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{task.title}</p>
          <p className="text-xs text-muted-foreground">{task.projectName}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`text-xs px-1.5 py-0.5 rounded ${getPriorityClass(task.priority)}`}>
              {task.priority.toLowerCase()}
            </span>
            {task.estimate && (
              <span className="text-xs text-muted-foreground">
                {task.estimate}h
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function DroppableMember({ 
  member, 
  children,
  isOver,
  canAccept,
}: { 
  member: TeamMember
  children: React.ReactNode
  isOver: boolean
  canAccept: boolean
}) {
  const { setNodeRef } = useDroppable({
    id: member.id,
    data: { member },
  })

  return (
    <div
      ref={setNodeRef}
      className={`
        p-4 rounded-lg border-2 transition-all
        ${isOver && canAccept ? 'border-green-500 bg-green-500/10' : ''}
        ${isOver && !canAccept ? 'border-red-500 bg-red-500/10' : ''}
        ${!isOver ? 'border bg-card' : ''}
      `}
    >
      {children}
    </div>
  )
}

function getPriorityClass(priority: string) {
  switch (priority) {
    case 'URGENT': return 'bg-red-500/10 text-red-600'
    case 'HIGH': return 'bg-orange-500/10 text-orange-600'
    case 'MEDIUM': return 'bg-yellow-500/10 text-yellow-600'
    default: return 'bg-blue-500/10 text-blue-600'
  }
}

export function AssignmentManager({ projectId }: AssignmentManagerProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [dragOverMember, setDragOverMember] = useState<string | null>(null)
  const [conflictWarning, setConflictWarning] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [projectId])

  async function fetchData() {
    try {
      setLoading(true)
      
      // Fetch tasks
      const tasksUrl = projectId 
        ? `/api/labs/projects/${projectId}/tasks`
        : '/api/labs/tasks?status=TODO,IN_PROGRESS,IN_REVIEW'
      
      const tasksRes = await fetch(tasksUrl)
      const tasksData = await tasksRes.json()
      
      // Fetch team members with workload
      const workloadRes = await fetch('/api/labs/workload')
      const workloadData = await workloadRes.json()
      
      if (tasksData.success) {
        setTasks(tasksData.data.map((t: any) => ({
          id: t.id,
          title: t.title,
          status: t.status,
          priority: t.priority,
          estimate: t.estimate,
          projectId: t.projectId,
          projectName: t.project?.title || 'Unknown Project',
          assigneeId: t.assigneeId,
          assigneeName: t.assignee?.name,
        })))
      }
      
      if (workloadData.success) {
        setMembers(workloadData.data.members.map((m: any) => ({
          id: m.userId,
          name: m.name,
          email: m.email,
          role: m.role,
          capacity: m.capacity,
          allocated: m.allocated,
          utilization: m.utilization,
        })))
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  function handleDragStart(event: DragStartEvent) {
    const task = event.active.data.current?.task as Task
    setActiveTask(task)
    setConflictWarning(null)
    setSuccessMessage(null)
  }

  function handleDragOver(event: DragEndEvent) {
    const { over } = event
    setDragOverMember(over?.id as string || null)
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveTask(null)
    setDragOverMember(null)

    if (!over) return

    const taskId = active.id as string
    const newAssigneeId = over.id as string
    
    const task = tasks.find(t => t.id === taskId)
    const member = members.find(m => m.id === newAssigneeId)
    
    if (!task || !member) return
    if (task.assigneeId === newAssigneeId) return

    // Check capacity
    const projectedUtilization = member.utilization + 
      ((task.estimate || 0) / member.capacity * 100)
    
    if (projectedUtilization > 100) {
      setConflictWarning(
        `Warning: Assigning this task will overallocate ${member.name} (${projectedUtilization.toFixed(0)}% utilization)`
      )
      // Still proceed but show warning
    }

    try {
      const response = await fetch(`/api/labs/tasks/${taskId}/assign`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assigneeId: newAssigneeId }),
      })

      if (response.ok) {
        // Update local state
        setTasks(tasks.map(t => 
          t.id === taskId 
            ? { ...t, assigneeId: newAssigneeId, assigneeName: member.name }
            : t
        ))
        
        // Refresh member data
        await fetchData()
        
        setSuccessMessage(`Task assigned to ${member.name}`)
        setTimeout(() => setSuccessMessage(null), 3000)
      }
    } catch (error) {
      console.error('Error assigning task:', error)
    }
  }

  function canAssignToMember(member: TeamMember, task: Task | null) {
    if (!task) return true
    const projectedUtilization = member.utilization + 
      ((task.estimate || 0) / member.capacity * 100)
    return projectedUtilization <= 120 // Allow some buffer
  }

  const unassignedTasks = tasks.filter(t => !t.assigneeId)
  const assignedTasks = tasks.filter(t => t.assigneeId)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-4">
        {/* Alerts */}
        {conflictWarning && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <p className="text-sm text-yellow-700 dark:text-yellow-400">{conflictWarning}</p>
          </div>
        )}
        
        {successMessage && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-sm text-green-700 dark:text-green-400">
            {successMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Unassigned Tasks */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Unassigned Tasks ({unassignedTasks.length})
            </h3>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {unassignedTasks.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No unassigned tasks
                </p>
              ) : (
                unassignedTasks.map(task => (
                  <DraggableTask key={task.id} task={task} />
                ))
              )}
            </div>
          </div>

          {/* Team Members */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="font-medium flex items-center gap-2">
              <User className="w-4 h-4" />
              Team Members
            </h3>
            
            {members.map((member) => {
              const memberTasks = assignedTasks.filter(t => t.assigneeId === member.id)
              const isOver = dragOverMember === member.id
              const canAccept = canAssignToMember(member, activeTask)
              
              return (
                <DroppableMember 
                  key={member.id} 
                  member={member}
                  isOver={isOver}
                  canAccept={canAccept}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${
                        member.utilization > 100 ? 'text-red-500' :
                        member.utilization < 50 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {member.utilization.toFixed(0)}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {member.allocated.toFixed(1)}h / {member.capacity.toFixed(0)}h
                      </p>
                    </div>
                  </div>
                  
                  {/* Assigned tasks */}
                  {memberTasks.length > 0 && (
                    <div className="mt-3 pt-3 border-t space-y-2">
                      <p className="text-xs text-muted-foreground">
                        {memberTasks.length} assigned task{memberTasks.length > 1 ? 's' : ''}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {memberTasks.slice(0, 3).map(task => (
                          <span 
                            key={task.id}
                            className="text-xs px-2 py-0.5 rounded bg-muted truncate max-w-[120px]"
                          >
                            {task.title}
                          </span>
                        ))}
                        {memberTasks.length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{memberTasks.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </DroppableMember>
              )
            })}
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="p-3 bg-card border-2 border-primary rounded-lg shadow-lg opacity-90 w-64">
            <p className="font-medium text-sm">{activeTask.title}</p>
            <p className="text-xs text-muted-foreground">{activeTask.projectName}</p>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
