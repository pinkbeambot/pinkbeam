import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

const resourceUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  type: z.enum(['TEMPLATE', 'FRAMEWORK', 'CHECKLIST', 'CALCULATOR', 'REPORT', 'TOOL']).optional(),
  category: z.string().min(1).optional(),
  topics: z.array(z.string()).optional(),
  fileUrl: z.string().url().optional(),
  fileFormat: z.string().min(1).optional(),
  fileSize: z.string().min(1).optional(),
  isGated: z.boolean().optional(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
});

async function checkAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return false;
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true },
  });

  return dbUser?.role === 'ADMIN';
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAdmin = await checkAdmin();
  if (!isAdmin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const validated = resourceUpdateSchema.parse(body);

    // Check if resource exists
    const existing = await prisma.resource.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Resource not found' },
        { status: 404 }
      );
    }

    // Check for slug conflict if updating slug
    if (validated.slug && validated.slug !== existing.slug) {
      const slugExists = await prisma.resource.findUnique({
        where: { slug: validated.slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { success: false, error: 'A resource with this slug already exists' },
          { status: 400 }
        );
      }
    }

    const resource = await prisma.resource.update({
      where: { id },
      data: validated,
    });

    return NextResponse.json({ success: true, data: resource });
  } catch (error) {
    console.error('Failed to update resource:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid data provided', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update resource' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAdmin = await checkAdmin();
  if (!isAdmin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    // Check if resource exists
    const existing = await prisma.resource.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Resource not found' },
        { status: 404 }
      );
    }

    await prisma.resource.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete resource:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete resource' },
      { status: 500 }
    );
  }
}
