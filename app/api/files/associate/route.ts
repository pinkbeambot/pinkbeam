import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const associateSchema = z.object({
  fileIds: z.array(z.string()).min(1),
  ticketId: z.string().optional(),
  projectId: z.string().optional(),
  commentId: z.string().optional(),
  invoiceId: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = associateSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { fileIds, ticketId, projectId, commentId, invoiceId } = result.data

    const updateData: Record<string, string> = {}
    if (ticketId) updateData.ticketId = ticketId
    if (projectId) updateData.projectId = projectId
    if (commentId) updateData.commentId = commentId
    if (invoiceId) updateData.invoiceId = invoiceId

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one entity ID is required' },
        { status: 400 }
      )
    }

    await prisma.file.updateMany({
      where: { id: { in: fileIds } },
      data: updateData,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error associating files:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to associate files' },
      { status: 500 }
    )
  }
}
