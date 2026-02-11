import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// In-memory storage for retrospective data (in production, this would be a database table)
// Key format: sprintId
const retrospectivesStore = new Map<string, {
  whatWentWell: Array<{ id: string; content: string; votes: number; createdAt: string }>
  whatWentWrong: Array<{ id: string; content: string; votes: number; createdAt: string }>
  actionItems: Array<{ id: string; content: string; votes: number; createdAt: string }>
  createdAt: string
}>()

// GET /api/labs/projects/[id]/sprints/[sprintId]/retrospective - Get retrospective data
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; sprintId: string }> }
) {
  try {
    const { id: projectId, sprintId } = await params

    const sprint = await prisma.sprint.findFirst({
      where: {
        id: sprintId,
        projectId,
      },
    })

    if (!sprint) {
      return NextResponse.json(
        { success: false, error: 'Sprint not found' },
        { status: 404 }
      )
    }

    // Get or create retrospective data
    let retrospective = retrospectivesStore.get(sprintId)
    
    if (!retrospective) {
      retrospective = {
        whatWentWell: [],
        whatWentWrong: [],
        actionItems: [],
        createdAt: new Date().toISOString(),
      }
      retrospectivesStore.set(sprintId, retrospective)
    }

    return NextResponse.json({
      success: true,
      data: {
        id: sprintId,
        sprintId,
        ...retrospective,
      },
    })
  } catch (error) {
    console.error('Error fetching retrospective:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch retrospective data' },
      { status: 500 }
    )
  }
}

// POST /api/labs/projects/[id]/sprints/[sprintId]/retrospective - Add item, vote, or delete
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; sprintId: string }> }
) {
  try {
    const { id: projectId, sprintId } = await params
    const body = await request.json()

    const sprint = await prisma.sprint.findFirst({
      where: {
        id: sprintId,
        projectId,
      },
    })

    if (!sprint) {
      return NextResponse.json(
        { success: false, error: 'Sprint not found' },
        { status: 404 }
      )
    }

    // Get or create retrospective
    let retrospective = retrospectivesStore.get(sprintId)
    if (!retrospective) {
      retrospective = {
        whatWentWell: [],
        whatWentWrong: [],
        actionItems: [],
        createdAt: new Date().toISOString(),
      }
      retrospectivesStore.set(sprintId, retrospective)
    }

    // Handle different actions
    type ColumnKey = 'whatWentWell' | 'whatWentWrong' | 'actionItems'
    
    if (body.action === 'vote') {
      const { column, itemId } = body as { column: ColumnKey; itemId: string }
      const items = retrospective[column]
      const item = items.find((i: { id: string }) => i.id === itemId)
      
      if (item) {
        item.votes += 1
      }
    } else if (body.action === 'delete') {
      const { column, itemId } = body as { column: ColumnKey; itemId: string }
      retrospective[column] = retrospective[column].filter((i: { id: string }) => i.id !== itemId)
    } else {
      // Add new item
      const { column, content } = body as { column: ColumnKey; content: string }
      const newItem = {
        id: crypto.randomUUID(),
        content,
        votes: 0,
        createdAt: new Date().toISOString(),
      }
      retrospective[column].push(newItem)
    }

    // Save updated retrospective
    retrospectivesStore.set(sprintId, retrospective)

    return NextResponse.json({
      success: true,
      data: {
        id: sprintId,
        sprintId,
        ...retrospective,
      },
    })
  } catch (error) {
    console.error('Error updating retrospective:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update retrospective' },
      { status: 500 }
    )
  }
}
