import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/labs/projects/[id]/sprints/[sprintId]/burndown - Get burndown chart data
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; sprintId: string }> }
) {
  try {
    const { id: projectId, sprintId } = await params

    const sprint = await prisma.sprint.findFirst({
      where: {
        id: sprintId,
        projectId,
      },
      include: {
        burndownData: {
          orderBy: {
            date: 'asc',
          },
        },
      },
    })

    if (!sprint) {
      return NextResponse.json(
        { success: false, error: 'Sprint not found' },
        { status: 404 }
      )
    }

    const startDate = new Date(sprint.startDate)
    const endDate = new Date(sprint.endDate)
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

    // Get all tasks in the sprint
    const tasks = await prisma.task.findMany({
      where: { sprintId },
      select: { storyPoints: true, status: true },
    })

    const totalPoints = tasks.reduce((sum, task) => sum + (task.storyPoints || 0), 0)
    const completedPoints = tasks
      .filter((task) => task.status === 'COMPLETED')
      .reduce((sum, task) => sum + (task.storyPoints || 0), 0)

    // Generate ideal burndown line
    const idealBurndown: Array<{ date: string; points: number }> = []
    const pointsPerDay = totalPoints / (totalDays - 1 || 1)

    for (let i = 0; i < totalDays; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      const points = Math.max(0, totalPoints - pointsPerDay * i)
      idealBurndown.push({
        date: date.toISOString().split('T')[0],
        points: Math.round(points * 10) / 10,
      })
    }

    // Generate actual burndown from data
    const actualBurndown: Array<{ date: string; points: number; completed: number }> = []
    const burndownMap = new Map(
      sprint.burndownData.map((d) => [
        d.date.toISOString().split('T')[0],
        { remaining: d.remainingPoints, completed: d.completedPoints },
      ])
    )

    for (let i = 0; i < totalDays; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      const dateStr = date.toISOString().split('T')[0]

      const data = burndownMap.get(dateStr)
      if (data) {
        actualBurndown.push({
          date: dateStr,
          points: data.remaining,
          completed: data.completed,
        })
      } else if (i === totalDays - 1) {
        // Last day - show current state
        actualBurndown.push({
          date: dateStr,
          points: totalPoints - completedPoints,
          completed: completedPoints,
        })
      } else if (date < new Date()) {
        // Past day with no data - interpolate
        const prevData = actualBurndown[actualBurndown.length - 1]
        if (prevData) {
          actualBurndown.push({
            date: dateStr,
            points: prevData.points,
            completed: prevData.completed,
          })
        }
      }
    }

    // Calculate projection
    const projection: Array<{ date: string; points: number }> = []
    if (actualBurndown.length >= 2) {
      const lastData = actualBurndown[actualBurndown.length - 1]
      const daysElapsed = actualBurndown.length - 1
      const velocity = (totalPoints - lastData.points) / (daysElapsed || 1)
      const remainingPoints = lastData.points
      const daysToComplete = velocity > 0 ? remainingPoints / velocity : Infinity

      const today = new Date()
      const remainingDays = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

      if (daysToComplete <= remainingDays && velocity > 0) {
        // Project completion
        const completionDate = new Date(today)
        completionDate.setDate(today.getDate() + Math.ceil(daysToComplete))
        projection.push({
          date: completionDate.toISOString().split('T')[0],
          points: 0,
        })
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        totalPoints,
        completedPoints,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        status: sprint.status,
        idealBurndown,
        actualBurndown,
        projection,
      },
    })
  } catch (error) {
    console.error('Error fetching burndown data:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch burndown data' },
      { status: 500 }
    )
  }
}

// POST /api/labs/projects/[id]/sprints/[sprintId]/burndown - Record daily burndown data
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; sprintId: string }> }
) {
  try {
    const { id: projectId, sprintId } = await params

    const sprint = await prisma.sprint.findFirst({
      where: {
        id: sprintId,
        projectId,
      },
    })

    if (!sprint) {
      return NextResponse.json(
        { success: false, error: 'Sprint not found' },
        { status: 404 }
      )
    }

    if (sprint.status !== 'ACTIVE') {
      return NextResponse.json(
        { success: false, error: 'Can only record burndown data for active sprints' },
        { status: 400 }
      )
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Calculate current points
    const tasks = await prisma.task.findMany({
      where: { sprintId },
      select: { storyPoints: true, status: true },
    })

    const totalPoints = tasks.reduce((sum, task) => sum + (task.storyPoints || 0), 0)
    const completedPoints = tasks
      .filter((task) => task.status === 'COMPLETED')
      .reduce((sum, task) => sum + (task.storyPoints || 0), 0)

    const burndownData = await prisma.sprintBurndownData.upsert({
      where: {
        sprintId_date: {
          sprintId,
          date: today,
        },
      },
      create: {
        sprintId,
        date: today,
        remainingPoints: totalPoints - completedPoints,
        completedPoints,
      },
      update: {
        remainingPoints: totalPoints - completedPoints,
        completedPoints,
      },
    })

    return NextResponse.json({ success: true, data: burndownData })
  } catch (error) {
    console.error('Error recording burndown data:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to record burndown data' },
      { status: 500 }
    )
  }
}
