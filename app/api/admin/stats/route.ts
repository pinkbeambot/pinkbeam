import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAdmin } from '@/lib/auth/apiMiddleware'
import { startOfMonth } from 'date-fns'

// GET /api/admin/stats - Get admin dashboard statistics
export const GET = withAdmin(async (request, { auth }) => {
  try {
    const now = new Date()
    const monthStart = startOfMonth(now)

    // Get total clients (all users with CLIENT role)
    const totalClients = await prisma.user.count({
      where: { role: 'CLIENT' },
    })

    // Get active clients (with active subscriptions)
    const activeClients = await prisma.user.count({
      where: {
        role: 'CLIENT',
        subscriptions: {
          some: {
            status: 'ACTIVE',
          },
        },
      },
    })

    // Calculate MRR (placeholder - would use actual subscription amounts)
    const totalMRR = activeClients * 997 // Simplified calculation

    // Get active projects
    const activeProjects = await prisma.project.count({
      where: {
        status: {
          in: ['IN_PROGRESS', 'REVIEW', 'ACCEPTED'],
        },
      },
    })

    // Get new clients this month
    const newThisMonth = await prisma.user.count({
      where: {
        role: 'CLIENT',
        createdAt: {
          gte: monthStart,
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        totalClients,
        activeClients,
        totalMRR,
        activeProjects,
        newThisMonth,
      },
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch admin stats' },
      { status: 500 }
    )
  }
})
