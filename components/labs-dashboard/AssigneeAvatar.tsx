import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface Assignee {
  id: string
  name: string | null
  email: string
}

interface AssigneeAvatarProps {
  assignee?: Assignee | null
  className?: string
  showName?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'h-6 w-6 text-xs',
  md: 'h-8 w-8 text-sm',
  lg: 'h-10 w-10 text-base',
}

export function AssigneeAvatar({ assignee, className, showName = false, size = 'sm' }: AssigneeAvatarProps) {
  if (!assignee) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <Avatar className={cn(sizeClasses[size], 'bg-muted border border-dashed border-muted-foreground/30')}>
          <AvatarFallback className="bg-transparent text-muted-foreground">?</AvatarFallback>
        </Avatar>
        {showName && <span className="text-sm text-muted-foreground">Unassigned</span>}
      </div>
    )
  }
  
  const initials = assignee.name
    ? assignee.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : assignee.email.slice(0, 2).toUpperCase()
  
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Avatar className={cn(sizeClasses[size], 'bg-cyan-500/10 border border-cyan-500/20')}>
        <AvatarFallback className="bg-cyan-500/10 text-cyan-400 font-medium">
          {initials}
        </AvatarFallback>
      </Avatar>
      {showName && (
        <span className="text-sm font-medium">
          {assignee.name || assignee.email}
        </span>
      )}
    </div>
  )
}
