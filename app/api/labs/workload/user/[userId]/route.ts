import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'
import { startOfWeek, endOfWeek, addDays, format, eachDayOfInterval } from 'date-fns'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { userId } = await params
    const { searchParams } = new URL(request.url)
    const view = searchParams.get('view') || 'weekly'
    const dateParam = searchParams.get('date')
    const date = dateParam ? new Date(dateParam) : new Date()

    let startDate: Date
    let endDate: Date

    switch (view) {
      case 'monthly':
        startDate = new Date(date.getFullYear(), date.getMonth(), 1)
        endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0)
        break
      case 'weekly':
      default:
        startDate = startOfWeek(date, { weekStartsOn: 1 })
        endDate = endOfWeek(date, { weekStartsOn: 1 })
    }

    // Fetch user details
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        capacityConfig: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Fetch workload entries
    const workloadEntries = await prisma.workloadEntry.findMany({
      where: {
        userId,
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
            priority: true,
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    })

    // Fetch assigned tasks
    const assignedTasks = await prisma.task.findMany({
      where: {
        assigneeId: userId,
        status: { not: 'COMPLETED' },
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
      },
      orderBy: [
        { priority: 'desc' },
        { dueDate: 'asc' },
      ],
    })

    // Calculate capacity
    const dailyCapacity = user.capacityConfig?.defaultCapacity || 8
    const daysInPeriod = eachDayOfInterval({ start: startDate, end: endDate }).length
    const totalCapacity = dailyCapacity * daysInPeriod

    // Calculate totals
    const totalAllocated = workloadEntries.reduce((sum, entry) => sum + entry.allocatedHours, 0)
    const totalActual = workloadEntries.reduce((sum, entry) => sum + (entry.actualHours || 0), 0)

    // Build daily breakdown
    const dailyBreakdown = eachDayOfInterval({ start: startDate, end: endDate }).map(day => {
      const dayStr = format(day, 'yyyy-MM-dd')
      const dayEntries = workloadEntries.filter(e => format(e.date, 'yyyy-MM-dd') === dayStr)
      
      const allocated = dayEntries.reduce((sum, e) => sum + e.allocatedHours, 0)
      const actual = dayEntries.reduce((sum, e) => sum + (e.actualHours || 0), 0)

      return {
        date: dayStr,
        dayName: format(day, 'EEE'),
        allocated,
        actual,
        available: Math.max(0, dailyCapacity - allocated),
        utilization: (allocated / dailyCapacity) * 100,
        entries: dayEntries,
      }
    })

    // Group by project
    const projectBreakdown = workloadEntries.reduce((acc, entry) => {
      const projectId = entry.projectId
      if (!acc[projectId]) {
        acc[projectId] = {
          projectId,
          projectTitle: entry.project.title,
          allocated: 0,
          actual: 0,
          tasks: [],
        }
      }
      acc[projectId].allocated += entry.allocatedHours
      acc[projectId].actual += entry.actualHours || 0
      if (entry.task && !acc[projectId].tasks.find(t => t.id === entry.task?.id)) {
        acc[projectId].tasks.push(entry.task)
      }
      return acc
    }, {} as Record<string, { projectId: string; projectTitle: string; allocated: number; actual: number; tasks: any[] }>)

    // Calculate upcoming availability (next 4 weeks)
    const upcomingAvailability = []
    for (let i = 0; i < 4; i++) {
      const weekStart = addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), i * 7)
      const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 })
      
      const weekEntries = await prisma.workloadEntry.findMany({
        where: {
          userId,
          date: {
            gte: weekStart,
            lte: weekEnd,
          },
        },
      })
      
      const weekAllocated = weekEntries.reduce((sum, e) => sum + e.allocatedHours, 0)
      const weekCapacity = dailyCapacity * 5
      
      upcomingAvailability.push({
        weekStart: weekStart.toISOString(),
        weekEnd: weekEnd.toISOString(),
        weekLabel: i === 0 ? 'This week' : i === 1 ? 'Next week' : `Week ${i + 1}`,
        allocated: weekAllocated,
        available: Math.max(0, weekCapacity - weekAllocated),
        utilization: (weekAllocated / weekCapacity) * 100,
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name || user.email?.split('@')[0] || 'Unknown',
          email: user.email,
          role: user.role,
          dailyCapacity,
        },
        period: {
          start: startDate.toISOString(),
          end: endDate.toISOString(),
          view,
        },
        summary: {
          totalCapacity,
          totalAllocated,
          totalActual,
          utilization: totalCapacity > 0 ? Math.round((totalAllocated / totalCapacity) * 100 * 10) / 10 : 0,
          remaining: Math.max(0, totalCapacity - totalAllocated),
        },
        dailyBreakdown,
        projectBreakdown: Object.values(projectBreakdown),
        assignedTasks: assignedTasks.map(task => ({
          id: task.id,
          title: task.title,
          status: task.status,
          priority: task.priority,
          estimate: task.estimate,
          dueDate: task.dueDate?.toISOString(),
          project: task.project,
        })),
        upcomingAvailability,
      },
    })
  } catch (error) {
    console.error('Error fetching user workload:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user workload' },
      { status: 500 }
    )
  }
}
