import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/clients - List all clients (users with CLIENT role)
export async function GET() {
  try {
    const clients = await prisma.user.findMany({
      where: {
        role: 'CLIENT'
      },
      select: {
        id: true,
        name: true,
        email: true,
        company: true,
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json({ success: true, data: clients })
  } catch (error) {
    console.error('Error fetching clients:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch clients' },
      { status: 500 }
    )
  }
}
