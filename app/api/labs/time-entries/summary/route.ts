import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, format } from 'date-fns'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const userId = searchParams.get('userId') || session.user.id
    const groupBy = searchParams.get('groupBy') || 'day' // day, project, task
    const startDateParam = searchParams.get('startDate')
    const endDateParam = searchParams.get('endDate')

    let startDate: Date
    let endDate: Date

    if (startDateParam && endDateParam) {
      startDate = new Date(startDateParam)
      endDate = new Date(endDateParam)
    } else {
      // Default to current month
      startDate = startOfMonth(new Date())
      endDate = endOfMonth(new Date())
    }

    const where: {
      userId: string
      endTime: { not: null }
      startTime: { gte: Date; lte: Date }
      projectId?: string
    } = {
      userId,
      endTime: { not: null },
      startTime: {
        gte: startDate,
        lte: endDate,
      },
    }

    if (projectId) where.projectId = projectId

    const timeEntries = await prisma.timeEntry.findMany({
      where,
      include: {
        project: {
          select: {
            id: true,
            title: true,
          },
        },
        task: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    })

    // Calculate totals
    const totalDuration = timeEntries.reduce((sum, entry) => sum + entry.duration, 0)
    const billableDuration = timeEntries
      .filter(entry => entry.billable)
      .reduce((sum, entry) => sum + entry.duration, 0)
    const nonBillableDuration = totalDuration - billableDuration

    // Group data based on groupBy parameter
    interface GroupedData {
      date?: string
      projectId?: string
      projectName?: string
      taskId?: string | null
      taskName?: string
      duration: number
      billable: number
      entries: typeof timeEntries
    }
    
    let groupedData: GroupedData[] = []

    if (groupBy === 'day') {
      const days = new Map<string, GroupedData>()
      
      timeEntries.forEach(entry => {
        const dateKey = format(entry.startTime, 'yyyy-MM-dd')
        if (!days.has(dateKey)) {
          days.set(dateKey, { date: dateKey, duration: 0, billable: 0, entries: [] })
        }
        const day = days.get(dateKey)!
        day.duration += entry.duration
        if (entry.billable) day.billable += entry.duration
        day.entries.push(entry)
      })
      
      groupedData = Array.from(days.values()).sort((a, b) => (a.date || '').localeCompare(b.date || ''))
    } else if (groupBy === 'project') {
      const projects = new Map<string, GroupedData>()
      
      timeEntries.forEach(entry => {
        const key = entry.projectId
        if (!projects.has(key)) {
          projects.set(key, {
            projectId: key,
            projectName: entry.project.title,
            duration: 0,
            billable: 0,
            entries: [],
          })
        }
        const project = projects.get(key)!
        project.duration += entry.duration
        if (entry.billable) project.billable += entry.duration
        project.entries.push(entry)
      })
      
      groupedData = Array.from(projects.values()).sort((a, b) => b.duration - a.duration)
    } else if (groupBy === 'task') {
      const tasks = new Map<string, GroupedData>()
      
      timeEntries.forEach(entry => {
        const key = entry.taskId || `no-task-${entry.projectId}`
        if (!tasks.has(key)) {
          tasks.set(key, {
            taskId: entry.taskId,
            taskName: entry.task?.title || 'No Task',
            projectName: entry.project.title,
            duration: 0,
            billable: 0,
            entries: [],
          })
        }
        const task = tasks.get(key)!
        task.duration += entry.duration
        if (entry.billable) task.billable += entry.duration
        task.entries.push(entry)
      })
      
      groupedData = Array.from(tasks.values()).sort((a, b) => b.duration - a.duration)
    }

    // Calculate daily averages
    const daysInRange = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)))
    const averagePerDay = totalDuration / daysInRange

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalDuration,
          billableDuration,
          nonBillableDuration,
          totalEntries: timeEntries.length,
          averagePerDay: Math.round(averagePerDay),
          billablePercentage: totalDuration > 0 ? Math.round((billableDuration / totalDuration) * 100) : 0,
        },
        groupedData,
        entries: timeEntries,
        dateRange: {
          start: startDate.toISOString(),
          end: endDate.toISOString(),
        },
      },
    })
  } catch (error) {
    console.error('Error fetching time summary:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch time summary' },
      { status: 500 }
    )
  }
}
