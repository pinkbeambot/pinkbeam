import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const bucket = searchParams.get('bucket')
    const projectId = searchParams.get('projectId')
    const ticketId = searchParams.get('ticketId')
    const commentId = searchParams.get('commentId')
    const invoiceId = searchParams.get('invoiceId')
    const uploadedById = searchParams.get('uploadedById')
    const versionGroupId = searchParams.get('versionGroupId')
    const latestParam = searchParams.get('latest')

    const where: Record<string, string | boolean> = {}
    if (bucket) where.bucket = bucket
    if (projectId) where.projectId = projectId
    if (ticketId) where.ticketId = ticketId
    if (commentId) where.commentId = commentId
    if (invoiceId) where.invoiceId = invoiceId
    if (uploadedById) where.uploadedById = uploadedById
    if (versionGroupId) where.versionGroupId = versionGroupId
    if (!versionGroupId && latestParam !== 'false') where.isLatest = true

    const orderBy = versionGroupId ? { version: 'desc' as const } : { createdAt: 'desc' as const }

    const files = await prisma.file.findMany({
      where,
      include: {
        uploadedBy: { select: { id: true, name: true, email: true } },
      },
      orderBy,
    })

    return NextResponse.json({ success: true, data: files })
  } catch (error) {
    console.error('Error fetching files:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch files' }, { status: 500 })
  }
}
