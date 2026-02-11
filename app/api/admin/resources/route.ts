import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

const resourceSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  type: z.enum(['TEMPLATE', 'FRAMEWORK', 'CHECKLIST', 'CALCULATOR', 'REPORT', 'TOOL']),
  category: z.string().min(1),
  topics: z.array(z.string()),
  fileUrl: z.string().url(),
  fileFormat: z.string().min(1),
  fileSize: z.string().min(1),
  isGated: z.boolean(),
  featured: z.boolean(),
  published: z.boolean(),
});

async function checkAdmin(authHeader?: string | null) {
  // Get the user from Supabase
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

export async function GET() {
  const isAdmin = await checkAdmin();
  if (!isAdmin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const resources = await prisma.resource.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { downloads: true },
        },
      },
    });

    return NextResponse.json({ success: true, data: resources });
  } catch (error) {
    console.error('Failed to fetch resources:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch resources' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const isAdmin = await checkAdmin();
  if (!isAdmin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validated = resourceSchema.parse(body);

    // Check for duplicate slug
    const existing = await prisma.resource.findUnique({
      where: { slug: validated.slug },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'A resource with this slug already exists' },
        { status: 400 }
      );
    }

    const resource = await prisma.resource.create({
      data: validated,
    });

    return NextResponse.json({ success: true, data: resource });
  } catch (error) {
    console.error('Failed to create resource:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid data provided', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create resource' },
      { status: 500 }
    );
  }
}
