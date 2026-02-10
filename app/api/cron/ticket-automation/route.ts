import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/cron/ticket-automation — Run ticket automations
// Protected by CRON_SECRET bearer token
export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const results = {
    autoAssigned: 0,
    autoClosed: 0,
    slaBreaches: 0,
  }

  // AUTO1: Auto-assign based on category
  // Assigns unassigned OPEN tickets to the first available ADMIN user
  try {
    const unassigned = await prisma.supportTicket.findMany({
      where: { assigneeId: null, status: 'OPEN' },
    })

    if (unassigned.length > 0) {
      const admins = await prisma.user.findMany({
        where: { role: 'ADMIN' },
        select: { id: true },
      })

      if (admins.length > 0) {
        for (const ticket of unassigned) {
          // Round-robin: assign based on ticket index % admin count
          const admin = admins[results.autoAssigned % admins.length]
          await prisma.supportTicket.update({
            where: { id: ticket.id },
            data: { assigneeId: admin.id },
          })
          await prisma.activityLog.create({
            data: {
              action: 'assignment_change',
              entityType: 'SupportTicket',
              entityId: ticket.id,
              metadata: { from: 'unassigned', to: admin.id, reason: 'auto-assign' },
            },
          })
          results.autoAssigned++
        }
      }
    }
  } catch (error) {
    console.error('[cron] auto-assign error:', error)
  }

  // AUTO4: Close resolved tickets after 3 days
  try {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    const staleResolved = await prisma.supportTicket.findMany({
      where: {
        status: 'RESOLVED',
        resolvedAt: { lt: threeDaysAgo },
      },
    })

    for (const ticket of staleResolved) {
      await prisma.supportTicket.update({
        where: { id: ticket.id },
        data: { status: 'CLOSED', closedAt: new Date() },
      })
      await prisma.activityLog.create({
        data: {
          action: 'status_change',
          entityType: 'SupportTicket',
          entityId: ticket.id,
          metadata: { from: 'RESOLVED', to: 'CLOSED', reason: 'auto-close-3-days' },
        },
      })
      results.autoClosed++
    }
  } catch (error) {
    console.error('[cron] auto-close error:', error)
  }

  // AUTO3: Detect and mark SLA breaches
  try {
    const breached = await prisma.supportTicket.findMany({
      where: {
        slaBreach: false,
        slaDeadline: { lt: new Date() },
        status: { in: ['OPEN', 'IN_PROGRESS', 'WAITING_CLIENT'] },
      },
    })

    for (const ticket of breached) {
      await prisma.supportTicket.update({
        where: { id: ticket.id },
        data: { slaBreach: true, slaBreachedAt: new Date() },
      })
      await prisma.activityLog.create({
        data: {
          action: 'sla_breach',
          entityType: 'SupportTicket',
          entityId: ticket.id,
          metadata: { deadline: ticket.slaDeadline?.toISOString() || '' },
        },
      })
      results.slaBreaches++
    }
  } catch (error) {
    console.error('[cron] SLA breach detection error:', error)
  }

  return NextResponse.json({
    success: true,
    results,
    timestamp: new Date().toISOString(),
  })
}
