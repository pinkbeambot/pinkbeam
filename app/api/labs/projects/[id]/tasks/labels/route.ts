import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/labs/projects/[id]/tasks/labels - List all labels
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const labels = await prisma.taskLabel.findMany({
      include: {
        _count: {
          select: {
            tasks: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    })
    
    return NextResponse.json({ success: true, data: labels })
  } catch (error) {
    console.error('Error fetching labels:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch labels' },
      { status: 500 }
    )
  }
}

// POST /api/labs/projects/[id]/tasks/labels - Create a new label
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json()
    const { name, color } = body
    
    // Validate required fields
    if (!name?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Label name is required' },
        { status: 400 }
      )
    }
    
    if (!color?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Label color is required' },
        { status: 400 }
      )
    }
    
    // Check if label with same name already exists
    const existingLabel = await prisma.taskLabel.findUnique({
      where: { name: name.trim() },
    })
    
    if (existingLabel) {
      return NextResponse.json(
        { success: false, error: 'Label with this name already exists' },
        { status: 409 }
      )
    }
    
    const label = await prisma.taskLabel.create({
      data: {
        name: name.trim(),
        color: color.trim(),
      },
    })
    
    return NextResponse.json({ success: true, data: label })
  } catch (error) {
    console.error('Error creating label:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create label' },
      { status: 500 }
    )
  }
}
