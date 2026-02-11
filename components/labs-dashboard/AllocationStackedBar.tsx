'use client'

interface Allocation {
  projectId: string
  projectTitle: string
  hours: number
}

interface AllocationStackedBarProps {
  allocations: Allocation[]
  total: number
  size?: 'sm' | 'md' | 'lg'
}

const PROJECT_COLORS = [
  'bg-blue-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-orange-500',
  'bg-pink-500',
  'bg-cyan-500',
  'bg-amber-500',
  'bg-indigo-500',
]

export function AllocationStackedBar({ allocations, total, size = 'md' }: AllocationStackedBarProps) {
  const sortedAllocations = [...allocations].sort((a, b) => b.hours - a.hours)
  const heightClass = size === 'sm' ? 'h-2' : size === 'md' ? 'h-4' : 'h-6'
  
  return (
    <div className="space-y-2">
      {/* Stacked bar */}
      <div className={`flex w-full ${heightClass} rounded-full overflow-hidden bg-muted`}>
        {sortedAllocations.map((allocation, index) => {
          const percentage = total > 0 ? (allocation.hours / total) * 100 : 0
          const colorClass = PROJECT_COLORS[index % PROJECT_COLORS.length]
          
          return (
            <div
              key={allocation.projectId}
              className={`${colorClass} transition-all duration-500 hover:opacity-80`}
              style={{ width: `${percentage}%` }}
              title={`${allocation.projectTitle}: ${allocation.hours.toFixed(1)}h (${percentage.toFixed(1)}%)`}
            />
          )
        })}
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap gap-2">
        {sortedAllocations.slice(0, 3).map((allocation, index) => {
          const percentage = total > 0 ? (allocation.hours / total) * 100 : 0
          const colorClass = PROJECT_COLORS[index % PROJECT_COLORS.length]
          
          return (
            <div 
              key={allocation.projectId}
              className="flex items-center gap-1 text-xs"
            >
              <div className={`w-2 h-2 rounded-full ${colorClass}`} />
              <span className="text-muted-foreground truncate max-w-[100px]">
                {allocation.projectTitle}
              </span>
              <span className="text-muted-foreground">
                ({percentage.toFixed(0)}%)
              </span>
            </div>
          )
        })}
        {sortedAllocations.length > 3 && (
          <span className="text-xs text-muted-foreground">
            +{sortedAllocations.length - 3} more
          </span>
        )}
      </div>
    </div>
  )
}
