import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface SimpleLabel {
  id: string
  name: string
  color: string
}

interface TaskLabelProps {
  label: SimpleLabel
  className?: string
  onRemove?: () => void
}

export function TaskLabel({ label, className, onRemove }: TaskLabelProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'text-xs font-medium border-0 px-2 py-0.5',
        onRemove && 'pr-1 cursor-pointer hover:opacity-80',
        className
      )}
      style={{
        backgroundColor: `${label.color}20`,
        color: label.color,
      }}
    >
      {label.name}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="ml-1 hover:bg-black/10 rounded-sm px-0.5"
        >
          ×
        </button>
      )}
    </Badge>
  )
}

interface TaskLabelListProps {
  labels: SimpleLabel[]
  className?: string
  maxVisible?: number
  onRemove?: (labelId: string) => void
}

export function TaskLabelList({ labels, className, maxVisible = 3, onRemove }: TaskLabelListProps) {
  if (!labels.length) return null
  
  const visibleLabels = labels.slice(0, maxVisible)
  const hiddenCount = labels.length - visibleLabels.length
  
  return (
    <div className={cn('flex flex-wrap gap-1', className)}>
      {visibleLabels.map((label) => (
        <TaskLabel
          key={label.id}
          label={label}
          onRemove={onRemove ? () => onRemove(label.id) : undefined}
        />
      ))}
      {hiddenCount > 0 && (
        <Badge variant="outline" className="text-xs px-2 py-0.5 bg-muted">
          +{hiddenCount}
        </Badge>
      )}
    </div>
  )
}
