import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { startOfMonth, endOfMonth, subMonths, format, parseISO } from 'date-fns'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Default to last 12 months if no dates provided
    const end = endDate ? parseISO(endDate) : new Date()
    const start = startDate ? parseISO(startDate) : subMonths(end, 12)

    // Get all invoices in date range with project info
    const invoices = await prisma.invoice.findMany({
      where: {
        issuedAt: {
          gte: start,
          lte: end,
        },
      },
      include: {
        project: true,
      },
      orderBy: {
        issuedAt: 'asc',
      },
    })

    // Calculate MRR (Monthly Recurring Revenue)
    const now = new Date()
    const currentMonthStart = startOfMonth(now)
    const currentMonthEnd = endOfMonth(now)

    const currentMonthInvoices = await prisma.invoice.findMany({
      where: {
        issuedAt: {
          gte: currentMonthStart,
          lte: currentMonthEnd,
        },
        status: 'PAID',
      },
    })

    const mrr = currentMonthInvoices.reduce((sum, inv) => 
      sum + Number(inv.amount), 0
    )

    // Calculate ARR (Annual Recurring Revenue)
    const last12MonthsStart = subMonths(now, 12)
    const last12MonthsInvoices = await prisma.invoice.findMany({
      where: {
        issuedAt: {
          gte: last12MonthsStart,
          lte: now,
        },
        status: 'PAID',
      },
    })

    const arr = last12MonthsInvoices.reduce((sum, inv) => 
      sum + Number(inv.amount), 0
    )

    // Revenue by month (trend)
    const monthlyRevenue: Record<string, { month: string; revenue: number; paid: number; pending: number }> = {}
    
    for (let i = 0; i < 12; i++) {
      const monthDate = subMonths(now, 11 - i)
      const monthKey = format(monthDate, 'yyyy-MM')
      monthlyRevenue[monthKey] = {
        month: format(monthDate, 'MMM yyyy'),
        revenue: 0,
        paid: 0,
        pending: 0,
      }
    }

    invoices.forEach((invoice) => {
      const monthKey = format(invoice.issuedAt, 'yyyy-MM')
      if (monthlyRevenue[monthKey]) {
        const amount = Number(invoice.amount)
        monthlyRevenue[monthKey].revenue += amount
        if (invoice.status === 'PAID') {
          monthlyRevenue[monthKey].paid += amount
        } else {
          monthlyRevenue[monthKey].pending += amount
        }
      }
    })

    // Revenue by service type (from project services array)
    const serviceRevenue: Record<string, number> = {}
    invoices.forEach((invoice) => {
      const amount = Number(invoice.amount)
      const services = (invoice.project?.services as string[]) || []
      services.forEach((service: string) => {
        serviceRevenue[service] = (serviceRevenue[service] || 0) + amount
      })
    })

    // Outstanding invoices
    const outstandingInvoices = await prisma.invoice.findMany({
      where: {
        status: 'PENDING',
        issuedAt: {
          gte: subMonths(now, 6),
        },
      },
      include: {
        project: {
          include: {
            client: {
              select: {
                name: true,
                company: true,
              },
            },
          },
        },
      },
      orderBy: {
        issuedAt: 'desc',
      },
      take: 10,
    })

    const totalOutstanding = outstandingInvoices.reduce((sum, inv) => 
      sum + Number(inv.amount), 0
    )

    // Simple revenue forecast (3 month projection based on average)
    const revenueValues = Object.values(monthlyRevenue).map(m => m.revenue)
    const avgMonthlyRevenue = revenueValues.reduce((a, b) => a + b, 0) / revenueValues.length || 0
    const forecast = {
      nextMonth: Math.round(avgMonthlyRevenue * 1.05), // 5% growth assumption
      nextQuarter: Math.round(avgMonthlyRevenue * 3 * 1.05),
      nextYear: Math.round(avgMonthlyRevenue * 12 * 1.05),
    }

    return NextResponse.json({
      success: true,
      data: {
        mrr,
        arr,
        totalOutstanding,
        monthlyTrend: Object.values(monthlyRevenue),
        byService: Object.entries(serviceRevenue).map(([service, amount]) => ({
          service,
          amount,
        })),
        outstandingInvoices: outstandingInvoices.map(inv => ({
          id: inv.id,
          amount: Number(inv.amount),
          description: inv.description,
          issuedAt: inv.issuedAt,
          dueAt: inv.dueAt,
          clientName: inv.project?.client?.name || 'Unknown',
          clientCompany: inv.project?.client?.company,
        })),
        forecast,
      },
    })
  } catch (error) {
    console.error('Revenue report error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate revenue report' },
      { status: 500 }
    )
  }
}
