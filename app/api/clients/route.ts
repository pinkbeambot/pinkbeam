import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAdmin } from '@/lib/auth/apiMiddleware'

// GET /api/clients - List all clients with pagination (ADMIN ONLY)
export const GET = withAdmin(async (request, { auth }) => {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '50', 10)

    // Validate pagination params
    const validatedPage = Math.max(1, page)
    const validatedLimit = Math.min(Math.max(1, limit), 100) // Max 100 per page
    const skip = (validatedPage - 1) * validatedLimit

    const where = { role: 'CLIENT' as const }

    // Get total count
    const total = await prisma.user.count({ where })

    const clients = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        company: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: validatedLimit,
    })

    return NextResponse.json({
      success: true,
      data: clients,
      pagination: {
        page: validatedPage,
        limit: validatedLimit,
        total,
        totalPages: Math.ceil(total / validatedLimit),
        hasMore: validatedPage * validatedLimit < total
      }
    })
  } catch (error) {
    console.error('Error fetching clients:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch clients' },
      { status: 500 }
    )
  }
})
