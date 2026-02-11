import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { InvoiceStatus } from '@prisma/client'

// GET /api/labs/invoices/summary - Get invoice aging and revenue summary
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get('clientId')
    const projectId = searchParams.get('projectId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const where: any = {}
    if (clientId) where.clientId = clientId
    if (projectId) where.projectId = projectId

    // Date range filter for revenue
    const dateWhere = { ...where }
    if (startDate || endDate) {
      dateWhere.issueDate = {}
      if (startDate) dateWhere.issueDate.gte = new Date(startDate)
      if (endDate) dateWhere.issueDate.lte = new Date(endDate)
    }

    // Get all invoices for aging
    const invoices = await prisma.invoice.findMany({
      where,
      select: {
        id: true,
        status: true,
        total: true,
        amountDue: true,
        amountPaid: true,
        dueDate: true,
        issueDate: true,
      }
    })

    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

    // Calculate aging buckets
    const aging = {
      current: { count: 0, amount: 0 },      // Not yet due
      days1to30: { count: 0, amount: 0 },    // 1-30 days overdue
      days31to60: { count: 0, amount: 0 },   // 31-60 days overdue
      days60plus: { count: 0, amount: 0 },   // 60+ days overdue
    }

    // Calculate totals by status
    const byStatus: Record<string, { count: number; total: number; due: number }> = {
      DRAFT: { count: 0, total: 0, due: 0 },
      SENT: { count: 0, total: 0, due: 0 },
      VIEWED: { count: 0, total: 0, due: 0 },
      PARTIAL: { count: 0, total: 0, due: 0 },
      PAID: { count: 0, total: 0, due: 0 },
      OVERDUE: { count: 0, total: 0, due: 0 },
      CANCELLED: { count: 0, total: 0, due: 0 },
    }

    let totalOutstanding = 0
    let totalPaid = 0
    let totalInvoiced = 0

    for (const invoice of invoices) {
      const total = invoice.total.toNumber()
      const due = invoice.amountDue.toNumber()
      const paid = invoice.amountPaid.toNumber()

      totalInvoiced += total
      if (due > 0) totalOutstanding += due
      if (paid > 0) totalPaid += paid

      // By status
      const status = invoice.status
      if (byStatus[status]) {
        byStatus[status].count++
        byStatus[status].total += total
        byStatus[status].due += due
      }

      // Aging - only for outstanding amounts
      if (due > 0 && (status === 'SENT' || status === 'VIEWED' || status === 'PARTIAL' || status === 'OVERDUE')) {
        const dueDate = new Date(invoice.dueDate)
        
        if (dueDate > now) {
          // Not yet due
          aging.current.count++
          aging.current.amount += due
        } else if (dueDate > thirtyDaysAgo) {
          // 1-30 days overdue
          aging.days1to30.count++
          aging.days1to30.amount += due
        } else if (dueDate > sixtyDaysAgo) {
          // 31-60 days overdue
          aging.days31to60.count++
          aging.days31to60.amount += due
        } else {
          // 60+ days overdue
          aging.days60plus.count++
          aging.days60plus.amount += due
        }
      }
    }

    // Get monthly revenue data
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1)
    const monthlyRevenue = await prisma.invoice.groupBy({
      by: ['issueDate'],
      where: {
        ...dateWhere,
        status: { in: ['PAID', 'PARTIAL'] },
        issueDate: { gte: sixMonthsAgo },
      },
      _sum: {
        amountPaid: true,
      },
    })

    // Group by month
    const monthlyData: Record<string, number> = {}
    for (let i = 0; i < 6; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = d.toLocaleString('default', { month: 'short', year: 'numeric' })
      monthlyData[key] = 0
    }

    for (const entry of monthlyRevenue) {
      const key = entry.issueDate.toLocaleString('default', { month: 'short', year: 'numeric' })
      if (monthlyData[key] !== undefined) {
        monthlyData[key] += entry._sum.amountPaid?.toNumber() || 0
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalInvoices: invoices.length,
          totalInvoiced,
          totalPaid,
          totalOutstanding,
          collectionRate: totalInvoiced > 0 ? (totalPaid / totalInvoiced) * 100 : 0,
        },
        byStatus,
        aging,
        monthlyRevenue: Object.entries(monthlyData)
          .map(([month, amount]) => ({ month, amount }))
          .reverse(),
      }
    })
  } catch (error) {
    console.error('Error fetching invoice summary:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch invoice summary' },
      { status: 500 }
    )
  }
}
