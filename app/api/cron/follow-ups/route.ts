import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendFollowUpEmail } from '@/lib/email'

// POST /api/cron/follow-ups — Process follow-up email queue
// Call this via a cron service (e.g. Vercel Cron, external scheduler)
// Protected by CRON_SECRET header
export async function POST(request: Request) {
  const secret = request.headers.get('authorization')
  if (secret !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date()
  const results = { stage1: 0, stage2: 0, stage3: 0, errors: 0 }

  // Stage 1: Day 1 follow-up — quotes created >24h ago, still NEW, followUpStage=0
  const day1Cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  const stage1Quotes = await prisma.quoteRequest.findMany({
    where: {
      status: 'NEW',
      followUpStage: 0,
      createdAt: { lt: day1Cutoff },
    },
  })

  for (const quote of stage1Quotes) {
    try {
      await sendFollowUpEmail(quote, 1)
      await prisma.quoteRequest.update({
        where: { id: quote.id },
        data: { followUpStage: 1, lastFollowUpAt: now },
      })
      results.stage1++
    } catch {
      results.errors++
    }
  }

  // Stage 2: Day 3 follow-up — quotes with followUpStage=1, last follow-up >2 days ago
  const day3Cutoff = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
  const stage2Quotes = await prisma.quoteRequest.findMany({
    where: {
      status: 'NEW',
      followUpStage: 1,
      lastFollowUpAt: { lt: day3Cutoff },
    },
  })

  for (const quote of stage2Quotes) {
    try {
      await sendFollowUpEmail(quote, 2)
      await prisma.quoteRequest.update({
        where: { id: quote.id },
        data: { followUpStage: 2, lastFollowUpAt: now },
      })
      results.stage2++
    } catch {
      results.errors++
    }
  }

  // Stage 3: Day 7 follow-up — quotes with followUpStage=2, last follow-up >4 days ago
  const day7Cutoff = new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000)
  const stage3Quotes = await prisma.quoteRequest.findMany({
    where: {
      status: 'NEW',
      followUpStage: 2,
      lastFollowUpAt: { lt: day7Cutoff },
    },
  })

  for (const quote of stage3Quotes) {
    try {
      await sendFollowUpEmail(quote, 3)
      await prisma.quoteRequest.update({
        where: { id: quote.id },
        data: { followUpStage: 3, lastFollowUpAt: now },
      })
      results.stage3++
    } catch {
      results.errors++
    }
  }

  return NextResponse.json({
    success: true,
    processed: results,
    timestamp: now.toISOString(),
  })
}
