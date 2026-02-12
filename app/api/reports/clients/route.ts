import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { parseISO, subMonths, format, differenceInDays } from 'date-fns'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const end = endDate ? parseISO(endDate) : new Date()
    const start = startDate ? parseISO(startDate) : subMonths(end, 12)

    // Get all clients with their data
    const clients = await prisma.user.findMany({
      where: {
        role: 'CLIENT',
        createdAt: {
          lte: end,
        },
      },
      include: {
        projects: {
          include: {
            invoices: true,
            quotes: true,
          },
        },
        tickets: true,
      },
    })

    // Client acquisition trend
    const monthlyAcquisition: Record<string, { month: string; newClients: number }> = {}
    for (let i = 0; i < 12; i++) {
      const monthDate = subMonths(end, 11 - i)
      const monthKey = format(monthDate, 'yyyy-MM')
      monthlyAcquisition[monthKey] = {
        month: format(monthDate, 'MMM yyyy'),
        newClients: 0,
      }
    }

    clients.forEach(client => {
      const monthKey = format(client.createdAt, 'yyyy-MM')
      if (monthlyAcquisition[monthKey]) {
        monthlyAcquisition[monthKey].newClients++
      }
    })

    // Calculate CLV and revenue per client
    const clientMetrics = clients.map(client => {
      const totalRevenue = client.projects.reduce((sum, project) => 
        sum + project.invoices.reduce((invSum, inv) => 
          inv.status === 'PAID' ? invSum + Number(inv.total) : invSum, 0
        ), 0
      )

      const totalProjects = client.projects.length
      const activeProjects = client.projects.filter(p => 
        ['ACCEPTED', 'IN_PROGRESS', 'REVIEW'].includes(p.status)
      ).length

      const avgProjectValue = totalProjects > 0 ? totalRevenue / totalProjects : 0

      // Calculate client tenure
      const tenureDays = differenceInDays(new Date(), client.createdAt)

      // Open tickets count
      const openTickets = client.tickets.filter(t => 
        ['OPEN', 'IN_PROGRESS'].includes(t.status)
      ).length

      // Client health score (0-100)
      // Based on: revenue, project activity, support tickets, tenure
      let healthScore = 50 // base score
      
      // Revenue factor (up to 25 points)
      if (totalRevenue > 10000) healthScore += 25
      else if (totalRevenue > 5000) healthScore += 15
      else if (totalRevenue > 1000) healthScore += 5

      // Activity factor (up to 25 points)
      if (activeProjects > 0) healthScore += 15
      if (client.projects.some(p => p.createdAt > subMonths(new Date(), 3))) healthScore += 10

      // Support factor (negative impact)
      if (openTickets > 3) healthScore -= 15
      else if (openTickets > 0) healthScore -= 5

      // Tenure factor (up to 10 points)
      if (tenureDays > 365) healthScore += 10
      else if (tenureDays > 180) healthScore += 5

      healthScore = Math.max(0, Math.min(100, healthScore))

      return {
        id: client.id,
        name: client.name || client.email.split('@')[0],
        email: client.email,
        company: client.company,
        totalRevenue,
        totalProjects,
        activeProjects,
        avgProjectValue,
        tenureDays,
        openTickets,
        healthScore,
        joinedAt: client.createdAt,
        lastLogin: client.lastLoginAt,
      }
    })

    // Sort by revenue for top clients
    const topClientsByRevenue = [...clientMetrics]
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 10)

    // Client health distribution
    const healthDistribution = {
      healthy: clientMetrics.filter(c => c.healthScore >= 70).length,
      atRisk: clientMetrics.filter(c => c.healthScore >= 40 && c.healthScore < 70).length,
      critical: clientMetrics.filter(c => c.healthScore < 40).length,
    }

    // Calculate average CLV
    const totalCLV = clientMetrics.reduce((sum, c) => sum + c.totalRevenue, 0)
    const avgCLV = clients.length > 0 ? totalCLV / clients.length : 0

    // New vs returning clients (last 90 days activity)
    const last90Days = subMonths(new Date(), 3)
    const activeClients = clientMetrics.filter(c => 
      c.lastLogin && c.lastLogin > last90Days
    ).length

    return NextResponse.json({
      success: true,
      data: {
        totals: {
          totalClients: clients.length,
          activeClients,
          avgCLV: Math.round(avgCLV),
          totalRevenue: totalCLV,
        },
        acquisitionTrend: Object.values(monthlyAcquisition),
        topClients: topClientsByRevenue,
        healthDistribution,
        clientList: clientMetrics.sort((a, b) => b.healthScore - a.healthScore),
      },
    })
  } catch (error) {
    console.error('Client report error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate client report' },
      { status: 500 }
    )
  }
}
