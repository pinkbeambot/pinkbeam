import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/quotes/reports - Quote pipeline analytics
export async function GET() {
  try {
    // R1: Conversion funnel — count of quotes at each status
    const statusCounts = await prisma.quoteRequest.groupBy({
      by: ['status'],
      _count: { _all: true },
    })

    const funnel = {
      NEW: 0,
      CONTACTED: 0,
      QUALIFIED: 0,
      PROPOSAL: 0,
      ACCEPTED: 0,
      DECLINED: 0,
      total: 0,
    }

    for (const row of statusCounts) {
      const status = row.status as keyof typeof funnel
      if (status in funnel) {
        funnel[status] = row._count._all
      }
      funnel.total += row._count._all
    }

    // R2: Volume over time — quotes per month for last 6 months
    const volumeByMonth = await prisma.$queryRaw<
      { month: string; count: number }[]
    >`SELECT to_char("createdAt", 'YYYY-MM') as month, COUNT(*)::int as count FROM quote_requests WHERE "createdAt" > NOW() - INTERVAL '6 months' GROUP BY month ORDER BY month`

    // R3: Average time to close — average days from creation to ACCEPTED status
    const avgDaysResult = await prisma.$queryRaw<
      { avg_days: number | null }[]
    >`SELECT AVG(EXTRACT(EPOCH FROM ("updatedAt" - "createdAt")) / 86400)::float as avg_days FROM quote_requests WHERE status = 'ACCEPTED'`

    const avgDaysToClose = avgDaysResult[0]?.avg_days ?? null

    // R4: Conversion rate by referral source
    const conversionRaw = await prisma.$queryRaw<
      { source: string; total: number; accepted: number }[]
    >`SELECT COALESCE("referralSource", 'direct') as source, COUNT(*)::int as total, COUNT(*) FILTER (WHERE status = 'ACCEPTED')::int as accepted FROM quote_requests GROUP BY COALESCE("referralSource", 'direct')`

    const conversionBySource = conversionRaw.map((row) => ({
      source: row.source,
      total: row.total,
      accepted: row.accepted,
      rate: row.total > 0 ? Math.round((row.accepted / row.total) * 10000) / 100 : 0,
    }))

    // Extra: Average lead score
    const leadScoreAgg = await prisma.quoteRequest.aggregate({
      _avg: { leadScore: true },
    })
    const avgLeadScore = leadScoreAgg._avg.leadScore ?? 0

    // Extra: Hot lead count
    const hotLeadCount = await prisma.quoteRequest.count({
      where: { leadQuality: 'hot' },
    })

    return NextResponse.json({
      success: true,
      data: {
        funnel,
        volumeByMonth,
        avgDaysToClose,
        conversionBySource,
        avgLeadScore,
        hotLeadCount,
      },
    })
  } catch (error) {
    console.error('Error generating quote reports:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate quote reports' },
      { status: 500 }
    )
  }
}
