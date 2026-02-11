import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, format } from 'date-fns'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const view = searchParams.get('view') || 'weekly'
    const dateParam = searchParams.get('date')
    const date = dateParam ? new Date(dateParam) : new Date()

    let startDate: Date
    let endDate: Date

    switch (view) {
      case 'monthly':
        startDate = startOfMonth(date)
        endDate = endOfMonth(date)
        break
      case 'weekly':
      default:
        startDate = startOfWeek(date, { weekStartsOn: 1 })
        endDate = endOfWeek(date, { weekStartsOn: 1 })
    }

    // Fetch team members (ADMIN and MANAGER roles)
    const teamMembers = await prisma.user.findMany({
      where: {
        role: { in: ['ADMIN', 'MANAGER'] },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        capacityConfig: true,
      },
    })

    // Fetch workload entries for the period
    const workloadEntries = await prisma.workloadEntry.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
        task: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
      },
    })

    // Fetch assigned tasks
    const assignedTasks = await prisma.task.findMany({
      where: {
        assigneeId: { in: teamMembers.map(m => m.id) },
        status: { not: 'COMPLETED' },
      },
      select: {
        id: true,
        title: true,
        status: true,
        priority: true,
        estimate: true,
        dueDate: true,
        assigneeId: true,
        project: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })

    // Calculate team workload summary
    const totalCapacity = teamMembers.reduce((sum, member) => {
      const capacity = member.capacityConfig?.defaultCapacity || 8
      return sum + (capacity * 5) // 5 work days
    }, 0)

    const totalAllocated = workloadEntries.reduce((sum, entry) => sum + entry.allocatedHours, 0)
    const totalActual = workloadEntries.reduce((sum, entry) => sum + (entry.actualHours || 0), 0)

    // Build member summaries
    const memberWorkload = teamMembers.map(member => {
      const memberEntries = workloadEntries.filter(e => e.userId === member.id)
      const memberTasks = assignedTasks.filter(t => t.assigneeId === member.id)
      const capacity = member.capacityConfig?.defaultCapacity || 8
      
      const allocated = memberEntries.reduce((sum, e) => sum + e.allocatedHours, 0)
      const actual = memberEntries.reduce((sum, e) => sum + (e.actualHours || 0), 0)
      const maxCapacity = capacity * 5 // Weekly capacity
      
      const utilization = maxCapacity > 0 ? (allocated / maxCapacity) * 100 : 0

      // Group allocations by project
      const projectAllocations = memberEntries.reduce((acc, entry) => {
        const projectId = entry.projectId
        if (!acc[projectId]) {
          acc[projectId] = {
            projectId,
            projectTitle: entry.project.title,
            hours: 0,
          }
        }
        acc[projectId].hours += entry.allocatedHours
        return acc
      }, {} as Record<string, { projectId: string; projectTitle: string; hours: number }>)

      return {
        userId: member.id,
        name: member.name || member.email?.split('@')[0] || 'Unknown',
        email: member.email,
        role: member.role,
        avatar: member.name?.charAt(0).toUpperCase() || 'U',
        capacity: maxCapacity,
        allocated,
        actual,
        utilization: Math.round(utilization * 10) / 10,
        available: Math.max(0, maxCapacity - allocated),
        taskCount: memberTasks.length,
        projectBreakdown: Object.values(projectAllocations),
        status: utilization > 100 ? 'overallocated' : utilization < 50 ? 'underutilized' : 'balanced',
      }
    })

    // Sort by utilization descending
    memberWorkload.sort((a, b) => b.utilization - a.utilization)

    // Identify issues
    const overallocationAlerts = memberWorkload.filter(m => m.utilization > 100)
    const underutilizationAlerts = memberWorkload.filter(m => m.utilization < 50)

    return NextResponse.json({
      success: true,
      data: {
        period: {
          start: startDate.toISOString(),
          end: endDate.toISOString(),
          view,
        },
        summary: {
          teamSize: teamMembers.length,
          totalCapacity,
          totalAllocated,
          totalActual,
          teamUtilization: totalCapacity > 0 ? Math.round((totalAllocated / totalCapacity) * 100 * 10) / 10 : 0,
          overallocationCount: overallocationAlerts.length,
          underutilizationCount: underutilizationAlerts.length,
        },
        members: memberWorkload,
        alerts: {
          overallocated: overallocationAlerts,
          underutilized: underutilizationAlerts,
        },
      },
    })
  } catch (error) {
    console.error('Error fetching team workload:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch team workload' },
      { status: 500 }
    )
  }
}
