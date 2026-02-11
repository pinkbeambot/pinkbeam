import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { QuoteStatus } from '@prisma/client'
import { z } from 'zod'

const declineQuoteSchema = z.object({
  reason: z.string().optional(),
})

// POST /api/labs/quotes/[id]/decline - Decline quote
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const result = declineQuoteSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.flatten() },
        { status: 400 }
      )
    }

    const existingQuote = await prisma.quote.findUnique({
      where: { id },
      include: {
        client: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    if (!existingQuote) {
      return NextResponse.json(
        { success: false, error: 'Quote not found' },
        { status: 404 }
      )
    }

    if (existingQuote.status !== QuoteStatus.SENT && existingQuote.status !== QuoteStatus.VIEWED) {
      return NextResponse.json(
        { success: false, error: 'Quote can only be declined from SENT or VIEWED status' },
        { status: 400 }
      )
    }

    const quote = await prisma.quote.update({
      where: { id },
      data: {
        status: QuoteStatus.DECLINED,
        declinedAt: new Date(),
        declinedReason: result.data.reason ?? null,
      },
      include: {
        client: {
          select: { id: true, name: true, email: true, company: true }
        },
        project: {
          select: { id: true, title: true }
        },
        lineItems: {
          orderBy: { id: 'asc' }
        },
      }
    })

    // TODO: Send email notification to team
    // This would integrate with your email service

    return NextResponse.json({ 
      success: true, 
      message: 'Quote declined successfully',
      data: quote 
    })
  } catch (error) {
    console.error('Error declining quote:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to decline quote' },
      { status: 500 }
    )
  }
}