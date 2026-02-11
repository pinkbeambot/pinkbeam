'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Task, TaskPriority, TaskStatus, TaskType } from '@prisma/client'
import { Card } from '@/components/ui/card'
import { TaskLabelList } from './TaskLabel'
import { AssigneeAvatar } from './AssigneeAvatar'
import { TaskBadge } from './TaskBadge'
import { cn } from '@/lib/utils'
import { Calendar, GripVertical, Clock } from 'lucide-react'
import { format } from 'date-fns'

interface SimpleLabel {
  id: string
  name: string
  color: string
}

interface TaskCardProps {
  task: Task & {
    assignee: { id: string; name: string | null; email: string } | null
    labels: SimpleLabel[]
  }
  onClick?: () => void
  className?: string
}

const priorityDotColors: Record<TaskPriority, string> = {
  LOW: 'bg-green-500',
  MEDIUM: 'bg-yellow-500',
  HIGH: 'bg-orange-500',
  URGENT: 'bg-red-500',
}

export function TaskCard({ task, onClick, className }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }
  
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'COMPLETED'
  
  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        'p-3 cursor-pointer hover:shadow-md transition-all group border-l-4',
        isDragging && 'opacity-50 shadow-lg rotate-2 z-50',
        priorityDotColors[task.priority] && `border-l-${priorityDotColors[task.priority].replace('bg-', '')}`,
        task.priority === 'URGENT' && 'border-l-red-500',
        task.priority === 'HIGH' && 'border-l-orange-500',
        task.priority === 'MEDIUM' && 'border-l-yellow-500',
        task.priority === 'LOW' && 'border-l-green-500',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-2">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-opacity"
        >
          <GripVertical className="w-4 h-4" />
        </div>
        
        <div className="flex-1 min-w-0 space-y-2">
          {/* Title */}
          <h4 className="font-medium text-sm leading-tight line-clamp-2">
            {task.title}
          </h4>
          
          {/* Labels */}
          {task.labels.length > 0 && (
            <TaskLabelList labels={task.labels} maxVisible={3} />
          )}
          
          {/* Footer */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              {/* Priority Dot */}
              <div className={cn('w-2 h-2 rounded-full', priorityDotColors[task.priority])} />
              
              {/* Type Badge */}
              <TaskBadge type={task.type} className="text-[10px] px-1.5 py-0" />
            </div>
            
            <div className="flex items-center gap-2">
              {/* Due Date */}
              {task.dueDate && (
                <div className={cn(
                  'flex items-center gap-1 text-xs',
                  isOverdue ? 'text-red-400' : 'text-muted-foreground'
                )}>
                  <Calendar className="w-3 h-3" />
                  <span>{format(new Date(task.dueDate), 'MMM d')}</span>
                </div>
              )}
              
              {/* Estimate */}
              {task.estimate && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{task.estimate}h</span>
                </div>
              )}
              
              {/* Assignee */}
              <AssigneeAvatar assignee={task.assignee} size="sm" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
