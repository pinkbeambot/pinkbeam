import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSignedUrl, getPublicUrl, deleteFile, type BucketName } from '@/lib/storage'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const file = await prisma.file.findUnique({
      where: { id },
      include: {
        uploadedBy: { select: { id: true, name: true, email: true } },
      },
    })

    if (!file) {
      return NextResponse.json({ success: false, error: 'File not found' }, { status: 404 })
    }

    let downloadUrl: string | null = null
    if (file.bucket === 'public-assets') {
      downloadUrl = getPublicUrl(file.storagePath)
    } else {
      const result = await getSignedUrl(file.bucket as BucketName, file.storagePath, 3600)
      if (result.error) {
        return NextResponse.json(
          { success: false, error: `Failed to generate download URL: ${result.error}` },
          { status: 500 }
        )
      }
      downloadUrl = result.url
    }

    return NextResponse.json({ success: true, data: { ...file, downloadUrl } })
  } catch (error) {
    console.error('Error fetching file:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch file' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const file = await prisma.file.findUnique({ where: { id } })
    if (!file) {
      return NextResponse.json({ success: false, error: 'File not found' }, { status: 404 })
    }

    const deleteResult = await deleteFile(file.bucket as BucketName, file.storagePath)
    if (deleteResult.error) {
      console.error('Storage delete error (continuing with DB delete):', deleteResult.error)
    }

    await prisma.file.delete({ where: { id } })

    await prisma.activityLog.create({
      data: {
        action: 'file_deleted',
        entityType: 'File',
        entityId: id,
        metadata: { fileName: file.name, bucket: file.bucket },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting file:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete file' }, { status: 500 })
  }
}
