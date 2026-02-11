import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { QuoteStatus, ProjectStatus } from '@prisma/client'
import { z } from 'zod'

const acceptQuoteSchema = z.object({
  signature: z.string().optional(),
  acceptedBy: z.string().optional(),
})

// POST /api/labs/quotes/[id]/accept - Accept quote
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const result = acceptQuoteSchema.safeParse(body)

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
        { success: false, error: 'Quote can only be accepted from SENT or VIEWED status' },
        { status: 400 }
      )
    }

    // Check if quote has expired
    if (existingQuote.validUntil && new Date() > existingQuote.validUntil) {
      await prisma.quote.update({
        where: { id },
        data: { status: QuoteStatus.EXPIRED }
      })
      return NextResponse.json(
        { success: false, error: 'Quote has expired' },
        { status: 400 }
      )
    }

    const quote = await prisma.quote.update({
      where: { id },
      data: {
        status: QuoteStatus.ACCEPTED,
        acceptedAt: new Date(),
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

    // Update associated project status if exists
    if (existingQuote.projectId) {
      await prisma.project.update({
        where: { id: existingQuote.projectId },
        data: { status: ProjectStatus.ACCEPTED }
      })
    }

    // TODO: Send email notification to team
    // This would integrate with your email service

    return NextResponse.json({ 
      success: true, 
      message: 'Quote accepted successfully',
      data: quote 
    })
  } catch (error) {
    console.error('Error accepting quote:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to accept quote' },
      { status: 500 }
    )
  }
}