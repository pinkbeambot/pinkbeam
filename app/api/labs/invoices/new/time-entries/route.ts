import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/labs/invoices/new/time-entries - Get available time entries for a client/project
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get('clientId')
    const projectId = searchParams.get('projectId')

    if (!clientId) {
      return NextResponse.json(
        { success: false, error: 'Client ID is required' },
        { status: 400 }
      )
    }

    // Build query for unbilled time entries
    const where: any = {
      invoiced: false,
      billable: true,
      endTime: { not: null }, // Only completed entries
      userId: clientId,
    }

    if (projectId) {
      where.projectId = projectId
    }

    const timeEntries = await prisma.timeEntry.findMany({
      where,
      orderBy: { startTime: 'desc' },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        project: {
          select: { id: true, title: true }
        },
        task: {
          select: { id: true, title: true }
        },
      }
    })

    // Calculate amounts for each entry based on hourly rate
    const entriesWithAmounts = timeEntries.map(entry => {
      const hours = entry.duration / 60
      const hourlyRate = entry.hourlyRate?.toNumber() || 150 // Default rate
      const amount = hours * hourlyRate

      return {
        ...entry,
        hours: Math.round(hours * 100) / 100,
        hourlyRate,
        amount: Math.round(amount * 100) / 100,
      }
    })

    return NextResponse.json({ success: true, data: entriesWithAmounts })
  } catch (error) {
    console.error('Error fetching time entries:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch time entries' },
      { status: 500 }
    )
  }
}
