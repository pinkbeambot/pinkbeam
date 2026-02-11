import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'
import { startOfWeek, endOfWeek, addWeeks } from 'date-fns'

interface WorkloadAlert {
  id: string
  type: 'overallocation' | 'underutilization' | 'upcoming_crunch' | 'deadline_risk'
  severity: 'critical' | 'warning' | 'info'
  userId: string
  userName: string
  message: string
  details: {
    currentUtilization?: number
    projectedUtilization?: number
    affectedTasks?: string[]
    deadline?: string
  }
  createdAt: string
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const alerts: WorkloadAlert[] = []
    
    const now = new Date()
    const weekStart = startOfWeek(now, { weekStartsOn: 1 })
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 })
    const nextWeekStart = addWeeks(weekStart, 1)
    const nextWeekEnd = addWeeks(weekEnd, 1)

    // Fetch team members with their workload
    const teamMembers = await prisma.user.findMany({
      where: {
        role: { in: ['ADMIN', 'MANAGER'] },
      },
      select: {
        id: true,
        name: true,
        email: true,
        capacityConfig: true,
      },
    })

    // Check current week workload
    const currentWeekEntries = await prisma.workloadEntry.findMany({
      where: {
        date: { gte: weekStart, lte: weekEnd },
      },
    })

    // Check next week workload for upcoming crunch
    const nextWeekEntries = await prisma.workloadEntry.findMany({
      where: {
        date: { gte: nextWeekStart, lte: nextWeekEnd },
      },
    })

    // Fetch tasks with upcoming deadlines
    const upcomingTasks = await prisma.task.findMany({
      where: {
        status: { not: 'COMPLETED' },
        dueDate: { lte: addWeeks(now, 2), gte: now },
        assigneeId: { not: null },
      },
      include: {
        assignee: { select: { id: true, name: true } },
        project: { select: { id: true, title: true } },
      },
    })

    for (const member of teamMembers) {
      const dailyCapacity = member.capacityConfig?.defaultCapacity || 8
      const weeklyCapacity = dailyCapacity * 5

      // Current week allocation
      const memberCurrentEntries = currentWeekEntries.filter(e => e.userId === member.id)
      const currentAllocated = memberCurrentEntries.reduce((sum, e) => sum + e.allocatedHours, 0)
      const currentUtilization = (currentAllocated / weeklyCapacity) * 100

      // Next week allocation
      const memberNextEntries = nextWeekEntries.filter(e => e.userId === member.id)
      const nextAllocated = memberNextEntries.reduce((sum, e) => sum + e.allocatedHours, 0)
      const nextUtilization = (nextAllocated / weeklyCapacity) * 100

      // Check for overallocation (>100%)
      if (currentUtilization > 100) {
        alerts.push({
          id: `over-${member.id}-current`,
          type: 'overallocation',
          severity: currentUtilization > 120 ? 'critical' : 'warning',
          userId: member.id,
          userName: member.name || member.email?.split('@')[0] || 'Unknown',
          message: `${member.name} is overallocated this week (${currentUtilization.toFixed(0)}% utilized)`,
          details: {
            currentUtilization,
          },
          createdAt: now.toISOString(),
        })
      }

      // Check for underutilization (<50%)
      if (currentUtilization < 50 && currentUtilization > 0) {
        alerts.push({
          id: `under-${member.id}-current`,
          type: 'underutilization',
          severity: 'info',
          userId: member.id,
          userName: member.name || member.email?.split('@')[0] || 'Unknown',
          message: `${member.name} is underutilized this week (${currentUtilization.toFixed(0)}% utilized)`,
          details: {
            currentUtilization,
          },
          createdAt: now.toISOString(),
        })
      }

      // Check for upcoming crunch (next week >90%)
      if (nextUtilization > 90) {
        alerts.push({
          id: `crunch-${member.id}-next`,
          type: 'upcoming_crunch',
          severity: nextUtilization > 100 ? 'critical' : 'warning',
          userId: member.id,
          userName: member.name || member.email?.split('@')[0] || 'Unknown',
          message: `Upcoming crunch: ${member.name} at ${nextUtilization.toFixed(0)}% next week`,
          details: {
            projectedUtilization: nextUtilization,
          },
          createdAt: now.toISOString(),
        })
      }

      // Check for deadline risks
      const memberTasks = upcomingTasks.filter(t => t.assignee?.id === member.id)
      const highRiskTasks = memberTasks.filter(t => {
        if (!t.dueDate) return false
        const daysUntilDue = Math.ceil((t.dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        // Risk if due within 3 days and not in review
        return daysUntilDue <= 3 && t.status !== 'IN_REVIEW' && t.status !== 'COMPLETED'
      })

      if (highRiskTasks.length > 0) {
        alerts.push({
          id: `deadline-${member.id}`,
          type: 'deadline_risk',
          severity: 'warning',
          userId: member.id,
          userName: member.name || member.email?.split('@')[0] || 'Unknown',
          message: `${member.name} has ${highRiskTasks.length} task${highRiskTasks.length > 1 ? 's' : ''} with approaching deadlines`,
          details: {
            affectedTasks: highRiskTasks.map(t => t.title),
          },
          createdAt: now.toISOString(),
        })
      }
    }

    // Sort by severity
    const severityOrder = { critical: 0, warning: 1, info: 2 }
    alerts.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])

    return NextResponse.json({
      success: true,
      data: {
        alerts,
        summary: {
          critical: alerts.filter(a => a.severity === 'critical').length,
          warning: alerts.filter(a => a.severity === 'warning').length,
          info: alerts.filter(a => a.severity === 'info').length,
          total: alerts.length,
        },
      },
    })
  } catch (error) {
    console.error('Error fetching workload alerts:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch workload alerts' },
      { status: 500 }
    )
  }
}
