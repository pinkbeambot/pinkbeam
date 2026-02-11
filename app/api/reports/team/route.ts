import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { parseISO, subMonths, format } from 'date-fns'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const end = endDate ? parseISO(endDate) : new Date()
    const start = startDate ? parseISO(startDate) : subMonths(end, 12)

    // Get team members (ADMIN and MANAGER roles)
    const teamMembers = await prisma.user.findMany({
      where: {
        role: {
          in: ['ADMIN', 'MANAGER'],
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        lastLoginAt: true,
        assignedTickets: {
          where: {
            createdAt: {
              gte: start,
              lte: end,
            },
          },
          select: {
            id: true,
            status: true,
            createdAt: true,
            resolvedAt: true,
          },
        },
        ticketComments: {
          where: {
            createdAt: {
              gte: start,
              lte: end,
            },
          },
          select: {
            id: true,
            createdAt: true,
          },
        },
      },
    })

    // Calculate metrics per team member
    const teamMetrics = teamMembers.map(member => {
      const tickets = member.assignedTickets
      const resolvedTickets = tickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED')
      const openTickets = tickets.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS')
      
      // Calculate average resolution time (in hours)
      let totalResolutionHours = 0
      let resolvedCount = 0
      
      resolvedTickets.forEach(ticket => {
        if (ticket.resolvedAt) {
          const hours = (ticket.resolvedAt.getTime() - ticket.createdAt.getTime()) / (1000 * 60 * 60)
          totalResolutionHours += hours
          resolvedCount++
        }
      })
      
      const avgResolutionTime = resolvedCount > 0 
        ? Math.round(totalResolutionHours / resolvedCount) 
        : 0

      // Activity score (comments + tickets handled)
      const activityScore = tickets.length + member.ticketComments.length

      return {
        id: member.id,
        name: member.name || member.email.split('@')[0],
        email: member.email,
        role: member.role,
        ticketsAssigned: tickets.length,
        ticketsResolved: resolvedTickets.length,
        ticketsOpen: openTickets.length,
        avgResolutionTime,
        commentsCount: member.ticketComments.length,
        activityScore,
        lastLogin: member.lastLoginAt,
      }
    })

    // Sort by activity score
    teamMetrics.sort((a, b) => b.activityScore - a.activityScore)

    // Workload distribution
    const workloadDistribution = teamMetrics.map(m => ({
      name: m.name,
      assigned: m.ticketsAssigned,
      resolved: m.ticketsResolved,
      open: m.ticketsOpen,
    }))

    // Team totals
    const totalTickets = teamMetrics.reduce((sum, m) => sum + m.ticketsAssigned, 0)
    const totalResolved = teamMetrics.reduce((sum, m) => sum + m.ticketsResolved, 0)
    
    // Utilization (placeholder - would need time tracking data)
    const utilizationRates = teamMetrics.map(m => ({
      name: m.name,
      // Placeholder calculation based on ticket load vs average
      utilization: Math.min(100, Math.round((m.ticketsAssigned / Math.max(1, totalTickets / teamMetrics.length)) * 50)),
    }))

    // Capacity planning view (placeholder data structure)
    const capacityPlanning = teamMetrics.map(m => ({
      name: m.name,
      currentLoad: m.ticketsOpen,
      capacity: 10, // Placeholder: assume 10 tickets per person capacity
      available: Math.max(0, 10 - m.ticketsOpen),
      utilization: Math.min(100, Math.round((m.ticketsOpen / 10) * 100)),
    }))

    // Activity trend (monthly)
    const monthlyActivity: Record<string, { month: string; tickets: number; comments: number }> = {}
    for (let i = 0; i < 6; i++) {
      const monthDate = subMonths(new Date(), 5 - i)
      const monthKey = format(monthDate, 'yyyy-MM')
      monthlyActivity[monthKey] = {
        month: format(monthDate, 'MMM'),
        tickets: 0,
        comments: 0,
      }
    }

    teamMembers.forEach(member => {
      member.assignedTickets.forEach(ticket => {
        const monthKey = format(ticket.createdAt, 'yyyy-MM')
        if (monthlyActivity[monthKey]) {
          monthlyActivity[monthKey].tickets++
        }
      })
      member.ticketComments.forEach(comment => {
        const monthKey = format(comment.createdAt, 'yyyy-MM')
        if (monthlyActivity[monthKey]) {
          monthlyActivity[monthKey].comments++
        }
      })
    })

    return NextResponse.json({
      success: true,
      data: {
        members: teamMetrics,
        workloadDistribution,
        utilizationRates,
        capacityPlanning,
        totals: {
          teamSize: teamMembers.length,
          totalTickets,
          totalResolved,
          resolutionRate: totalTickets > 0 ? Math.round((totalResolved / totalTickets) * 100) : 0,
        },
        activityTrend: Object.values(monthlyActivity),
      },
    })
  } catch (error) {
    console.error('Team report error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate team report' },
      { status: 500 }
    )
  }
}
