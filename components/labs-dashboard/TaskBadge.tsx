import { TaskPriority, TaskStatus, TaskType } from '@prisma/client'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface TaskBadgeProps {
  status?: TaskStatus
  priority?: TaskPriority
  type?: TaskType
  className?: string
}

const statusConfig: Record<TaskStatus, { label: string; className: string }> = {
  TODO: {
    label: 'Todo',
    className: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    className: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  },
  IN_REVIEW: {
    label: 'In Review',
    className: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  },
  COMPLETED: {
    label: 'Completed',
    className: 'bg-green-500/10 text-green-400 border-green-500/20',
  },
  CANCELLED: {
    label: 'Cancelled',
    className: 'bg-red-500/10 text-red-400 border-red-500/20',
  },
}

const priorityConfig: Record<TaskPriority, { label: string; className: string }> = {
  LOW: {
    label: 'Low',
    className: 'bg-green-500/10 text-green-400 border-green-500/20',
  },
  MEDIUM: {
    label: 'Medium',
    className: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  },
  HIGH: {
    label: 'High',
    className: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  },
  URGENT: {
    label: 'Urgent',
    className: 'bg-red-500/10 text-red-400 border-red-500/20',
  },
}

const typeConfig: Record<TaskType, { label: string; className: string }> = {
  FEATURE: {
    label: 'Feature',
    className: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  },
  BUG: {
    label: 'Bug',
    className: 'bg-red-500/10 text-red-400 border-red-500/20',
  },
  CHORE: {
    label: 'Chore',
    className: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  },
  DOCUMENTATION: {
    label: 'Docs',
    className: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  },
}

export function TaskBadge({ status, priority, type, className }: TaskBadgeProps) {
  if (status) {
    const config = statusConfig[status]
    return (
      <Badge variant="outline" className={cn(config.className, className)}>
        {config.label}
      </Badge>
    )
  }
  
  if (priority) {
    const config = priorityConfig[priority]
    return (
      <Badge variant="outline" className={cn(config.className, className)}>
        {config.label}
      </Badge>
    )
  }
  
  if (type) {
    const config = typeConfig[type]
    return (
      <Badge variant="outline" className={cn(config.className, className)}>
        {config.label}
      </Badge>
    )
  }
  
  return null
}
