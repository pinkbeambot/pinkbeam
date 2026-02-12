import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendQuoteNotification, sendClientAutoResponse } from '@/lib/email'
import { calculateLeadScore } from '@/lib/lead-scoring'
import { quoteSchema } from '@/lib/validation'
import type { QuoteRequest } from '@prisma/client'
import type { QuoteVariables } from '@/lib/email-templates'

// Helper to convert Prisma QuoteRequest to QuoteVariables
function toQuoteVariables(quote: QuoteRequest): QuoteVariables {
  return {
    id: quote.id,
    fullName: quote.fullName,
    email: quote.email,
    company: quote.company,
    projectType: quote.projectType,
    services: quote.services,
    budgetRange: quote.budgetRange,
    timeline: quote.timeline,
    description: quote.description,
    leadScore: quote.leadScore,
    leadQuality: quote.leadQuality as 'hot' | 'warm' | 'cold' | null | undefined,
    status: quote.status,
  }
}

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

    // Fire-and-forget email notifications with structured error handling
    sendQuoteNotification(toQuoteVariables(quote)).catch(async (err) => {
      console.error('[email-error] Quote admin notification failed:', {
        quoteId: quote.id,
        recipient: process.env.QUOTE_NOTIFY_EMAIL || 'team@pinkbeam.ai',
        error: err instanceof Error ? err.message : String(err),
        timestamp: new Date().toISOString(),
      })
      await prisma.activityLog.create({
        data: {
          action: 'email_failed',
          entityType: 'QuoteRequest',
          entityId: quote.id,
          metadata: {
            emailType: 'admin_notification',
            recipient: process.env.QUOTE_NOTIFY_EMAIL || 'team@pinkbeam.ai',
            error: err instanceof Error ? err.message : String(err),
          },
        },
      }).catch((logErr) => console.error('[activitylog] Failed to log email error:', logErr))
    })

    sendClientAutoResponse(toQuoteVariables(quote)).catch(async (err) => {
      console.error('[email-error] Quote client auto-response failed:', {
        quoteId: quote.id,
        recipient: quote.email,
        error: err instanceof Error ? err.message : String(err),
        timestamp: new Date().toISOString(),
      })
      await prisma.activityLog.create({
        data: {
          action: 'email_failed',
          entityType: 'QuoteRequest',
          entityId: quote.id,
          metadata: {
            emailType: 'client_auto_response',
            recipient: quote.email,
            error: err instanceof Error ? err.message : String(err),
          },
        },
      }).catch((logErr) => console.error('[activitylog] Failed to log email error:', logErr))
    })

    return NextResponse.json({ success: true, data: quote }, { status: 201 })
  } catch (error) {
    console.error('Error creating quote request:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit quote request' },
      { status: 500 }
    )
  }
}
