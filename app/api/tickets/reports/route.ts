import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/tickets/reports — Ticket analytics and reporting
export async function GET() {
  try {
    // R1: Ticket volume — count by status
    const statusCounts = await prisma.supportTicket.groupBy({
      by: ['status'],
      _count: true,
    })

    const funnel: Record<string, number> = {}
    for (const row of statusCounts) {
      funnel[row.status] = row._count
    }

    // R4: Tickets by category
    const categoryCounts = await prisma.supportTicket.groupBy({
      by: ['category'],
      _count: true,
    })

    const byCategory: Record<string, number> = {}
    for (const row of categoryCounts) {
      byCategory[row.category] = row._count
    }

    // R4: Tickets by priority
    const priorityCounts = await prisma.supportTicket.groupBy({
      by: ['priority'],
      _count: true,
    })

    const byPriority: Record<string, number> = {}
    for (const row of priorityCounts) {
      byPriority[row.priority] = row._count
    }

    // R2: Average resolution time (for resolved/closed tickets)
    const resolvedTickets = await prisma.supportTicket.findMany({
      where: {
        resolvedAt: { not: null },
      },
      select: {
        createdAt: true,
        resolvedAt: true,
      },
    })

    let avgResolutionHours = 0
    if (resolvedTickets.length > 0) {
      const totalMs = resolvedTickets.reduce((sum, t) => {
        if (!t.resolvedAt) return sum
        return sum + (t.resolvedAt.getTime() - t.createdAt.getTime())
      }, 0)
      avgResolutionHours = Math.round(totalMs / resolvedTickets.length / (1000 * 60 * 60) * 10) / 10
    }

    // R3: SLA compliance
    const totalTickets = await prisma.supportTicket.count()
    const breachedTickets = await prisma.supportTicket.count({
      where: { slaBreach: true },
    })
    const slaComplianceRate = totalTickets > 0
      ? Math.round(((totalTickets - breachedTickets) / totalTickets) * 100)
      : 100

    // Volume over time — tickets per month (last 6 months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
    sixMonthsAgo.setDate(1)
    sixMonthsAgo.setHours(0, 0, 0, 0)

    const recentTickets = await prisma.supportTicket.findMany({
      where: { createdAt: { gte: sixMonthsAgo } },
      select: { createdAt: true },
    })

    const volumeByMonth: Record<string, number> = {}
    for (const t of recentTickets) {
      const key = `${t.createdAt.getFullYear()}-${String(t.createdAt.getMonth() + 1).padStart(2, '0')}`
      volumeByMonth[key] = (volumeByMonth[key] || 0) + 1
    }

    // Open tickets count
    const openTickets = await prisma.supportTicket.count({
      where: { status: { in: ['OPEN', 'IN_PROGRESS', 'WAITING_CLIENT'] } },
    })

    return NextResponse.json({
      success: true,
      data: {
        funnel,
        byCategory,
        byPriority,
        avgResolutionHours,
        slaComplianceRate,
        totalTickets,
        openTickets,
        breachedTickets,
        volumeByMonth,
      },
    })
  } catch (error) {
    console.error('Error fetching ticket reports:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reports' },
      { status: 500 }
    )
  }
}
