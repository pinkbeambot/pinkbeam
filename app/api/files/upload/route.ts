import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { prisma } from '@/lib/prisma'
import {
  validateFile,
  generateStoragePath,
  uploadFile,
  BUCKETS,
  type BucketName,
} from '@/lib/storage'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const uploadedById = formData.get('uploadedById') as string | null
    const bucketParam = (formData.get('bucket') as string) || 'attachments'
    const projectId = formData.get('projectId') as string | null
    const ticketId = formData.get('ticketId') as string | null
    const commentId = formData.get('commentId') as string | null
    const invoiceId = formData.get('invoiceId') as string | null
    const widthStr = formData.get('width') as string | null
    const heightStr = formData.get('height') as string | null
    const alt = formData.get('alt') as string | null
    const replaceFileId = formData.get('replaceFileId') as string | null
    const versionGroupIdParam = formData.get('versionGroupId') as string | null

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 })
    }
    if (!uploadedById) {
      return NextResponse.json(
        { success: false, error: 'uploadedById is required' },
        { status: 400 }
      )
    }
    let resolvedBucket = bucketParam
    let resolvedProjectId = projectId || undefined
    let resolvedTicketId = ticketId || undefined
    let resolvedCommentId = commentId || undefined
    let resolvedInvoiceId = invoiceId || undefined
    let resolvedVersionGroupId = versionGroupIdParam || undefined
    let resolvedVersion = 1

    if (replaceFileId) {
      const existingFile = await prisma.file.findUnique({ where: { id: replaceFileId } })
      if (!existingFile) {
        return NextResponse.json(
          { success: false, error: 'File to replace not found' },
          { status: 404 }
        )
      }

      resolvedBucket = existingFile.bucket
      resolvedProjectId = resolvedProjectId ?? existingFile.projectId ?? undefined
      resolvedTicketId = resolvedTicketId ?? existingFile.ticketId ?? undefined
      resolvedCommentId = resolvedCommentId ?? existingFile.commentId ?? undefined
      resolvedInvoiceId = resolvedInvoiceId ?? existingFile.invoiceId ?? undefined

      const versionGroupId = existingFile.versionGroupId ?? existingFile.id
      if (!existingFile.versionGroupId) {
        await prisma.file.update({
          where: { id: existingFile.id },
          data: { versionGroupId },
        })
      }

      resolvedVersionGroupId = versionGroupId
      const latestVersion = await prisma.file.findFirst({
        where: { versionGroupId },
        orderBy: { version: 'desc' },
        select: { version: true },
      })
      const baseVersion = latestVersion?.version ?? existingFile.version ?? 1
      resolvedVersion = baseVersion + 1
    } else if (versionGroupIdParam) {
      const latestVersion = await prisma.file.findFirst({
        where: { versionGroupId: versionGroupIdParam },
        orderBy: { version: 'desc' },
        select: { version: true },
      })
      resolvedVersion = (latestVersion?.version ?? 0) + 1
    } else {
      resolvedVersionGroupId = randomUUID()
      resolvedVersion = 1
    }

    if (!BUCKETS.includes(resolvedBucket as BucketName)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid bucket. Must be one of: ${BUCKETS.join(', ')}`,
        },
        { status: 400 }
      )
    }

    const validation = validateFile({ size: file.size, type: file.type })
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.errors.join('; ') },
        { status: 400 }
      )
    }

    const storagePath = generateStoragePath(resolvedBucket as BucketName, file.name, {
      ticketId: resolvedTicketId,
      projectId: resolvedProjectId,
      commentId: resolvedCommentId,
      invoiceId: resolvedInvoiceId,
    })

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const metadata: Record<string, string> = { uploadedById }
    if (resolvedProjectId) metadata.projectId = resolvedProjectId
    if (resolvedTicketId) metadata.ticketId = resolvedTicketId
    if (resolvedCommentId) metadata.commentId = resolvedCommentId
    if (resolvedInvoiceId) metadata.invoiceId = resolvedInvoiceId
    if (resolvedVersionGroupId) metadata.versionGroupId = resolvedVersionGroupId
    metadata.version = String(resolvedVersion)

    const uploadResult = await uploadFile(
      resolvedBucket as BucketName,
      storagePath,
      buffer,
      file.type,
      metadata
    )
    if (uploadResult.error) {
      return NextResponse.json(
        { success: false, error: `Upload failed: ${uploadResult.error}` },
        { status: 500 }
      )
    }

    const fileRecord = await prisma.file.create({
      data: {
        name: file.name,
        storagePath,
        bucket: resolvedBucket,
        mimeType: file.type,
        size: file.size,
        uploadedById,
        projectId: resolvedProjectId,
        ticketId: resolvedTicketId,
        commentId: resolvedCommentId,
        invoiceId: resolvedInvoiceId,
        width: widthStr ? parseInt(widthStr, 10) : undefined,
        height: heightStr ? parseInt(heightStr, 10) : undefined,
        alt: alt || undefined,
        versionGroupId: resolvedVersionGroupId,
        version: resolvedVersion,
        isLatest: true,
      },
      include: {
        uploadedBy: { select: { id: true, name: true, email: true } },
      },
    })

    if (resolvedVersionGroupId && resolvedVersion > 1) {
      await prisma.file.updateMany({
        where: { versionGroupId: resolvedVersionGroupId, id: { not: fileRecord.id } },
        data: { isLatest: false },
      })
    }

    await prisma.activityLog.create({
      data: {
        action: 'file_uploaded',
        entityType: 'File',
        entityId: fileRecord.id,
        userId: uploadedById,
        metadata: {
          fileName: file.name,
          bucket: resolvedBucket,
          size: file.size,
          versionGroupId: resolvedVersionGroupId,
          version: resolvedVersion,
          ...(resolvedTicketId && { ticketId: resolvedTicketId }),
          ...(resolvedProjectId && { projectId: resolvedProjectId }),
          ...(replaceFileId && { replacedFileId: replaceFileId }),
        },
      },
    })

    return NextResponse.json({ success: true, data: fileRecord }, { status: 201 })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json({ success: false, error: 'Failed to upload file' }, { status: 500 })
  }
}
