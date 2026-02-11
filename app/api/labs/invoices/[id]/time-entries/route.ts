import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/labs/invoices/[id]/time-entries - Get available time entries for this invoice's client/project
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    
    // Get the invoice to determine client/project context
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      select: { clientId: true, projectId: true }
    })

    // Build query for unbilled time entries
    const where: any = {
      invoiced: false,
      billable: true,
      endTime: { not: null }, // Only completed entries
    }

    if (invoice) {
      // If invoice exists, get entries for this client/project
      where.userId = invoice.clientId
      if (invoice.projectId) {
        where.projectId = invoice.projectId
      }
    } else {
      // For new invoices, get clientId from query params
      const clientId = searchParams.get('clientId')
      const projectId = searchParams.get('projectId')
      
      if (clientId) {
        where.userId = clientId
      }
      if (projectId) {
        where.projectId = projectId
      }
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
