'use client'

import { format, eachDayOfInterval, isSameMonth } from 'date-fns'

interface Member {
  userId: string
  name: string
  utilization: number
  allocated: number
  capacity: number
}

interface CapacityCalendarProps {
  members: Member[]
  startDate: Date
  endDate: Date
}

export function CapacityCalendar({ members, startDate, endDate }: CapacityCalendarProps) {
  const days = eachDayOfInterval({ start: startDate, end: endDate })

  function getUtilizationColor(utilization: number) {
    if (utilization > 100) return 'bg-red-500'
    if (utilization > 90) return 'bg-orange-500'
    if (utilization > 70) return 'bg-green-500'
    if (utilization > 50) return 'bg-blue-500'
    return 'bg-yellow-500'
  }

  function getUtilizationLevel(utilization: number) {
    if (utilization > 100) return 'Critical'
    if (utilization > 90) return 'High'
    if (utilization > 70) return 'Good'
    if (utilization > 50) return 'Moderate'
    return 'Low'
  }

  return (
    <div className="space-y-4">
      {/* Team Capacity Overview */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
          <div key={day} className="text-muted-foreground font-medium py-1">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar Grid - Team Average */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const isWeekend = day.getDay() === 0 || day.getDay() === 6
          const avgUtilization = members.reduce((sum, m) => sum + m.utilization, 0) / (members.length || 1)
          
          return (
            <div
              key={index}
              className={`
                aspect-square rounded-md flex items-center justify-center text-xs font-medium
                ${isWeekend ? 'bg-muted/30' : 'bg-card border'}
              `}
              title={`${format(day, 'MMM d')} - Team avg: ${avgUtilization.toFixed(0)}%`}
            >
              <div className="text-center">
                <div className="text-muted-foreground">{format(day, 'd')}</div>
                {!isWeekend && (
                  <div className={`w-2 h-2 rounded-full mx-auto mt-1 ${getUtilizationColor(avgUtilization)}`} />
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Member List with Mini Heatmap */}
      <div className="space-y-2 mt-4">
        <h4 className="text-sm font-medium text-muted-foreground">Team Members</h4>
        {members.slice(0, 5).map((member) => (
          <div key={member.userId} className="flex items-center gap-2">
            <span className="text-xs w-24 truncate">{member.name}</span>
            <div className="flex-1 flex gap-0.5">
              {days.slice(0, 7).map((_, dayIndex) => {
                const intensity = member.utilization / 100
                return (
                  <div
                    key={dayIndex}
                    className={`flex-1 h-4 rounded-sm ${getUtilizationColor(member.utilization)}`}
                    style={{ 
                      opacity: Math.max(0.2, Math.min(1, intensity)),
                    }}
                    title={`${member.name}: ${member.utilization.toFixed(0)}%`}
                  />
                )
              })}
            </div>
            <span className={`text-xs w-10 text-right ${
              member.utilization > 100 ? 'text-red-500' : 
              member.utilization < 50 ? 'text-yellow-600' : 'text-green-600'
            }`}>
              {member.utilization.toFixed(0)}%
            </span>
          </div>
        ))}
        {members.length > 5 && (
          <p className="text-xs text-muted-foreground text-center">
            +{members.length - 5} more members
          </p>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 pt-3 border-t text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-red-500"></div>
          <span>Overallocated (&gt;100%)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-orange-500"></div>
          <span>High (90-100%)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-green-500"></div>
          <span>Good (70-90%)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-blue-500"></div>
          <span>Moderate (50-70%)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-yellow-500"></div>
          <span>Low (&lt;50%)</span>
        </div>
      </div>
    </div>
  )
}
