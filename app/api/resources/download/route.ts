import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { sendResourceDownloadEmail } from '@/lib/email';

const downloadSchema = z.object({
  resourceId: z.string(),
  name: z.string().min(1),
  email: z.string().email(),
  company: z.string().optional(),
  role: z.string().optional(),
  privacyConsent: z.boolean(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = downloadSchema.parse(body);

    // Check if resource exists and is gated
    const resource = await prisma.resource.findUnique({
      where: { id: validated.resourceId },
    });

    if (!resource) {
      return NextResponse.json(
        { success: false, error: 'Resource not found' },
        { status: 404 }
      );
    }

    if (!resource.published) {
      return NextResponse.json(
        { success: false, error: 'Resource not available' },
        { status: 403 }
      );
    }

    // Create download record
    await prisma.resourceDownload.create({
      data: {
        resourceId: validated.resourceId,
        email: validated.email,
        name: validated.name,
        company: validated.company || null,
        role: validated.role || null,
      },
    });

    // Increment download count
    await prisma.resource.update({
      where: { id: validated.resourceId },
      data: {
        downloadCount: {
          increment: 1,
        },
      },
    });

    // Send download email
    await sendResourceDownloadEmail({
      email: validated.email,
      name: validated.name,
      resourceTitle: resource.title,
      resourceType: resource.type,
      downloadUrl: resource.fileUrl,
      fileFormat: resource.fileFormat,
    });

    return NextResponse.json({
      success: true,
      message: 'Download recorded and email sent',
    });
  } catch (error) {
    console.error('Download error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid data provided' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
