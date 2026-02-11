/**
 * Webhook Events API
 * List and manage webhook events
 */

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/webhooks/events - List webhook events
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') ?? '100', 10)
    const source = searchParams.get('source')
    const processed = searchParams.get('processed')

    const where: {
      source?: string
      processed?: boolean
    } = {}

    if (source) where.source = source
    if (processed !== null && processed !== undefined) {
      where.processed = processed === 'true'
    }

    const events = await prisma.webhookEvent.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    return NextResponse.json({ success: true, data: events })
  } catch (error) {
    console.error('Error fetching webhook events:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch webhook events' },
      { status: 500 }
    )
  }
}
