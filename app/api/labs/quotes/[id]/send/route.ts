import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { QuoteStatus } from '@prisma/client'

// POST /api/labs/quotes/[id]/send - Send quote to client
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

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

    if (existingQuote.status !== QuoteStatus.DRAFT) {
      return NextResponse.json(
        { success: false, error: 'Quote can only be sent from DRAFT status' },
        { status: 400 }
      )
    }

    const quote = await prisma.quote.update({
      where: { id },
      data: {
        status: QuoteStatus.SENT,
        sentAt: new Date(),
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

    // TODO: Send email notification to client
    // This would integrate with your email service

    return NextResponse.json({ 
      success: true, 
      message: 'Quote sent successfully',
      data: quote 
    })
  } catch (error) {
    console.error('Error sending quote:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send quote' },
      { status: 500 }
    )
  }
}