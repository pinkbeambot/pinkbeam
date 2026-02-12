import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { parseISO, differenceInDays, format, subMonths } from 'date-fns'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const end = endDate ? parseISO(endDate) : new Date()
    const start = startDate ? parseISO(startDate) : subMonths(end, 12)

    // Get all projects in date range
    const projects = await prisma.project.findMany({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
      include: {
        client: {
          select: {
            name: true,
            company: true,
          },
        },
        invoices: true,
        quotes: true,
      },
    })

    // Projects by status
    const statusCounts: Record<string, number> = {}
    const statusBudget: Record<string, number> = {}
    
    projects.forEach((project) => {
      statusCounts[project.status] = (statusCounts[project.status] || 0) + 1
      if (project.budget) {
        statusBudget[project.status] = (statusBudget[project.status] || 0) + Number(project.budget)
      }
    })

    // On-time delivery rate
    const completedProjects = projects.filter(p => p.status === 'COMPLETED' && p.deadline)
    const onTimeProjects = completedProjects.filter(p => {
      // Use last invoice date or current date as completion proxy
      const lastInvoice = p.invoices.sort((a, b) => 
        b.issueDate.getTime() - a.issueDate.getTime()
      )[0]
      const completionDate = lastInvoice?.paidAt || lastInvoice?.issueDate
      if (!completionDate || !p.deadline) return true
      return completionDate <= p.deadline
    })

    const onTimeRate = completedProjects.length > 0 
      ? (onTimeProjects.length / completedProjects.length) * 100 
      : 0

    // Average project duration
    const projectsWithDuration = projects.filter(p => {
      const hasInvoices = p.invoices.length > 0
      return hasInvoices || p.status === 'COMPLETED'
    })

    let totalDuration = 0
    let durationCount = 0

    projectsWithDuration.forEach(project => {
      const start = project.createdAt
      const end = project.status === 'COMPLETED' 
        ? (project.invoices.find(i => i.paidAt)?.paidAt || project.updatedAt)
        : new Date()
      
      if (end) {
        totalDuration += differenceInDays(end, start)
        durationCount++
      }
    })

    const avgDuration = durationCount > 0 ? Math.round(totalDuration / durationCount) : 0

    // Pipeline stages (funnel view)
    const pipelineStages = [
      { stage: 'Lead', count: statusCounts['LEAD'] || 0, value: statusBudget['LEAD'] || 0 },
      { stage: 'Quoted', count: statusCounts['QUOTED'] || 0, value: statusBudget['QUOTED'] || 0 },
      { stage: 'Accepted', count: statusCounts['ACCEPTED'] || 0, value: statusBudget['ACCEPTED'] || 0 },
      { stage: 'In Progress', count: statusCounts['IN_PROGRESS'] || 0, value: statusBudget['IN_PROGRESS'] || 0 },
      { stage: 'Completed', count: statusCounts['COMPLETED'] || 0, value: statusBudget['COMPLETED'] || 0 },
    ]

    // Budget vs Actual
    const projectsWithBudget = projects.filter(p => p.budget && p.invoices.length > 0)
    const budgetVsActual = projectsWithBudget.map(p => {
      const actualRevenue = p.invoices.reduce((sum, inv) => 
        sum + Number(inv.total), 0
      )
      const budget = Number(p.budget)
      return {
        id: p.id,
        title: p.title,
        budget,
        actual: actualRevenue,
        variance: actualRevenue - budget,
        variancePercent: budget > 0 ? ((actualRevenue - budget) / budget) * 100 : 0,
      }
    })

    // Project creation trend
    const monthlyProjects: Record<string, { month: string; count: number }> = {}
    for (let i = 0; i < 12; i++) {
      const monthDate = subMonths(new Date(), 11 - i)
      const monthKey = format(monthDate, 'yyyy-MM')
      monthlyProjects[monthKey] = {
        month: format(monthDate, 'MMM yyyy'),
        count: 0,
      }
    }

    projects.forEach((project) => {
      const monthKey = format(project.createdAt, 'yyyy-MM')
      if (monthlyProjects[monthKey]) {
        monthlyProjects[monthKey].count++
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        byStatus: Object.entries(statusCounts).map(([status, count]) => ({
          status,
          count,
          budget: statusBudget[status] || 0,
        })),
        onTimeRate,
        avgDuration,
        pipeline: pipelineStages,
        budgetVsActual,
        totalProjects: projects.length,
        activeProjects: projects.filter(p => 
          ['ACCEPTED', 'IN_PROGRESS', 'REVIEW'].includes(p.status)
        ).length,
        monthlyTrend: Object.values(monthlyProjects),
      },
    })
  } catch (error) {
    console.error('Project report error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate project report' },
      { status: 500 }
    )
  }
}
