import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { QuoteStatus, ProjectStatus } from '@prisma/client'
import { z } from 'zod'

const convertQuoteSchema = z.object({
  title: z.string().min(1, 'Project title is required').optional(),
  startDate: z.string().datetime().optional().nullable(),
  targetEndDate: z.string().datetime().optional().nullable(),
})

// POST /api/labs/quotes/[id]/convert - Convert quote to project
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const result = convertQuoteSchema.safeParse(body)

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
        },
        lineItems: true,
      }
    })

    if (!existingQuote) {
      return NextResponse.json(
        { success: false, error: 'Quote not found' },
        { status: 404 }
      )
    }

    if (existingQuote.status !== QuoteStatus.ACCEPTED) {
      return NextResponse.json(
        { success: false, error: 'Only accepted quotes can be converted to projects' },
        { status: 400 }
      )
    }

    // If quote already has a project, just return it
    if (existingQuote.projectId) {
      const project = await prisma.project.findUnique({
        where: { id: existingQuote.projectId },
        include: {
          client: {
            select: { id: true, name: true, email: true }
          }
        }
      })
      return NextResponse.json({ 
        success: true, 
        message: 'Quote is already linked to a project',
        data: { project, quote: existingQuote }
      })
    }

    // Create new project from quote
    const project = await prisma.project.create({
      data: {
        title: result.data.title || existingQuote.title,
        description: existingQuote.description,
        clientId: existingQuote.clientId,
        budget: existingQuote.total.toNumber(),
        status: ProjectStatus.ACCEPTED,
        startDate: result.data.startDate ? new Date(result.data.startDate) : null,
        targetEndDate: result.data.targetEndDate ? new Date(result.data.targetEndDate) : null,
        progress: 0,
      },
      include: {
        client: {
          select: { id: true, name: true, email: true }
        },
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true }
            }
          }
        },
      }
    })

    // Update quote with project reference
    const updatedQuote = await prisma.quote.update({
      where: { id },
      data: {
        projectId: project.id,
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
      message: 'Quote converted to project successfully',
      data: { project, quote: updatedQuote }
    })
  } catch (error) {
    console.error('Error converting quote:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to convert quote to project' },
      { status: 500 }
    )
  }
}