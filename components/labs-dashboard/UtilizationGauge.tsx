'use client'

interface UtilizationGaugeProps {
  percentage: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

export function UtilizationGauge({ percentage, size = 'md', showLabel = false }: UtilizationGaugeProps) {
  const sizeClasses = {
    sm: { container: 'w-20 h-20', stroke: 6, font: 'text-sm' },
    md: { container: 'w-32 h-32', stroke: 8, font: 'text-lg' },
    lg: { container: 'w-48 h-48', stroke: 10, font: 'text-2xl' },
  }

  const { container, stroke, font } = sizeClasses[size]
  const radius = 50 - stroke / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (Math.min(percentage, 100) / 100) * circumference

  // Determine color based on percentage
  let strokeColor = '#22c55e' // green
  if (percentage > 100) {
    strokeColor = '#ef4444' // red
  } else if (percentage > 90) {
    strokeColor = '#f59e0b' // orange
  } else if (percentage < 50) {
    strokeColor = '#eab308' // yellow
  }

  return (
    <div className={`relative ${container}`}>
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-muted/20"
        />
        
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-500 ease-out"
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`font-bold ${font}`} style={{ color: strokeColor }}>
          {percentage.toFixed(0)}%
        </span>
        {showLabel && (
          <span className="text-xs text-muted-foreground">utilized</span>
        )}
      </div>

      {/* Warning indicator for overallocation */}
      {percentage > 100 && (
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">!</span>
        </div>
      )}
    </div>
  )
}
