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

    const [totals, byBucket] = await Promise.all([
      prisma.file.aggregate({
        where,
        _sum: { size: true },
        _count: { id: true },
      }),
      prisma.file.groupBy({
        by: ['bucket'],
        where,
        _sum: { size: true },
        _count: { id: true },
      }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        totalBytes: totals._sum.size ?? 0,
        totalFiles: totals._count.id,
        byBucket: byBucket.map((bucketStat) => ({
          bucket: bucketStat.bucket,
          totalBytes: bucketStat._sum.size ?? 0,
          totalFiles: bucketStat._count.id,
        })),
      },
    })
  } catch (error) {
    console.error('Error fetching file usage:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch file usage' },
      { status: 500 }
    )
  }
}
