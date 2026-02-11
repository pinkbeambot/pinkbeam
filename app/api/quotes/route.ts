import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendQuoteNotification, sendClientAutoResponse } from '@/lib/email'
import { calculateLeadScore } from '@/lib/lead-scoring'
import { quoteSchema } from '@/lib/validation'

// GET /api/quotes - List quote requests
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const where: Record<string, unknown> = {}
    if (status) where.status = status

    const quotes = await prisma.quoteRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: quotes })
  } catch (error) {
    console.error('Error fetching quotes:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch quotes' },
      { status: 500 }
    )
  }
}

// POST /api/quotes - Submit quote request
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = quoteSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.flatten() },
        { status: 400 }
      )
    }

    const { agreedToTerms, ...data } = result.data
    const { score, quality } = calculateLeadScore(data)

    const quote = await prisma.quoteRequest.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone || null,
        company: data.company || null,
        website: data.website || null,
        projectType: data.projectType,
        services: data.services,
        pageCount: data.pageCount || null,
        needsEcommerce: data.needsEcommerce,
        cmsPreference: data.cmsPreference || null,
        budgetRange: data.budgetRange,
        timeline: data.timeline,
        description: data.description,
        referralSource: data.referralSource || null,
        marketingConsent: data.marketingConsent,
        leadScore: score,
        leadQuality: quality,
      },
    })

    // Fire-and-forget email notifications
    sendQuoteNotification(quote).catch((err) =>
      console.error('Email notification failed:', err)
    )
    sendClientAutoResponse(quote).catch((err) =>
      console.error('Client auto-response failed:', err)
    )

    return NextResponse.json({ success: true, data: quote }, { status: 201 })
  } catch (error) {
    console.error('Error creating quote request:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit quote request' },
      { status: 500 }
    )
  }
}
