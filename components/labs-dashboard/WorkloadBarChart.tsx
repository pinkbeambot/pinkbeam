'use client'

interface WorkloadBarChartProps {
  data: Array<{
    label: string
    allocated: number
    actual: number
    available: number
    utilization: number
    entries?: Array<{
      id: string
      project?: { title: string }
      allocatedHours: number
    }>
  }>
  maxValue: number
}

export function WorkloadBarChart({ data, maxValue }: WorkloadBarChartProps) {
  return (
    <div className="space-y-3">
      {data.map((day, index) => {
        const allocatedPercent = (day.allocated / maxValue) * 100
        const actualPercent = (day.actual / maxValue) * 100
        const isOverallocated = day.utilization > 100
        
        return (
          <div key={index} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium w-12">{day.label}</span>
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground">
                  {day.allocated.toFixed(1)}h
                </span>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  isOverallocated 
                    ? 'bg-red-500/10 text-red-600' 
                    : day.utilization < 50 
                      ? 'bg-yellow-500/10 text-yellow-600'
                      : 'bg-green-500/10 text-green-600'
                }`}>
                  {day.utilization.toFixed(0)}%
                </span>
              </div>
            </div>
            <div className="relative h-8 bg-muted rounded-lg overflow-hidden">
              {/* Allocated bar */}
              <div 
                className={`absolute left-0 top-0 h-full transition-all duration-500 ${
                  isOverallocated ? 'bg-red-500/80' : 'bg-primary/80'
                }`}
                style={{ width: `${Math.min(100, allocatedPercent)}%` }}
              />
              
              {/* Actual hours overlay (if any) */}
              {day.actual > 0 && (
                <div 
                  className="absolute left-0 top-0 h-full bg-green-500/60 transition-all duration-500"
                  style={{ width: `${Math.min(100, actualPercent)}%` }}
                />
              )}
              
              {/* Capacity line */}
              <div 
                className="absolute top-0 bottom-0 w-0.5 bg-border"
                style={{ left: `${(maxValue / 1.2 / maxValue) * 100}%` }}
              />
            </div>
            
            {/* Legend for this day */}
            {day.entries && day.entries.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {day.entries.map((entry: any) => (
                  <span 
                    key={entry.id}
                    className="text-xs px-2 py-0.5 rounded bg-muted/50 truncate max-w-[150px]"
                    title={entry.project?.title}
                  >
                    {entry.project?.title} ({entry.allocatedHours}h)
                  </span>
                ))}
              </div>
            )}
          </div>
        )
      })}
      
      {/* Legend */}
      <div className="flex items-center gap-4 pt-2 text-xs text-muted-foreground border-t">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-primary/80"></span>
          Allocated
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-green-500/60"></span>
          Actual
        </span>
        <span className="flex items-center gap-1">
          <span className="w-0.5 h-3 bg-border"></span>
          Capacity
        </span>
      </div>
    </div>
  )
}
