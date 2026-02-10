import { NextResponse } from 'next/server'
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
    const bucket = (formData.get('bucket') as string) || 'attachments'
    const projectId = formData.get('projectId') as string | null
    const ticketId = formData.get('ticketId') as string | null
    const commentId = formData.get('commentId') as string | null
    const invoiceId = formData.get('invoiceId') as string | null
    const widthStr = formData.get('width') as string | null
    const heightStr = formData.get('height') as string | null
    const alt = formData.get('alt') as string | null

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 })
    }
    if (!uploadedById) {
      return NextResponse.json(
        { success: false, error: 'uploadedById is required' },
        { status: 400 }
      )
    }
    if (!BUCKETS.includes(bucket as BucketName)) {
      return NextResponse.json(
        { success: false, error: `Invalid bucket. Must be one of: ${BUCKETS.join(', ')}` },
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

    const storagePath = generateStoragePath(bucket as BucketName, file.name, {
      ticketId: ticketId || undefined,
      projectId: projectId || undefined,
      commentId: commentId || undefined,
      invoiceId: invoiceId || undefined,
    })

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const uploadResult = await uploadFile(bucket as BucketName, storagePath, buffer, file.type)
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
        bucket,
        mimeType: file.type,
        size: file.size,
        uploadedById,
        projectId: projectId || undefined,
        ticketId: ticketId || undefined,
        commentId: commentId || undefined,
        invoiceId: invoiceId || undefined,
        width: widthStr ? parseInt(widthStr, 10) : undefined,
        height: heightStr ? parseInt(heightStr, 10) : undefined,
        alt: alt || undefined,
      },
      include: {
        uploadedBy: { select: { id: true, name: true, email: true } },
      },
    })

    await prisma.activityLog.create({
      data: {
        action: 'file_uploaded',
        entityType: 'File',
        entityId: fileRecord.id,
        userId: uploadedById,
        metadata: {
          fileName: file.name,
          bucket,
          size: file.size,
          ...(ticketId && { ticketId }),
          ...(projectId && { projectId }),
        },
      },
    })

    return NextResponse.json({ success: true, data: fileRecord }, { status: 201 })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json({ success: false, error: 'Failed to upload file' }, { status: 500 })
  }
}
