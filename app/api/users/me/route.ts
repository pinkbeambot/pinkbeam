import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// GET /api/users/me - Get current user
export async function GET() {
  try {
    // For now, return a mock user since we need to integrate with auth
    // In production, this would use the authenticated session
    return NextResponse.json({
      success: true,
      data: {
        id: 'user-1',
        name: 'Admin User',
        email: 'admin@pinkbeam.io',
        role: 'ADMIN',
        company: 'Pink Beam',
      }
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user' },
      { status: 500 }
    )
  }
}

// PUT /api/users/me - Update current user
const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
})

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const result = updateUserSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.flatten() },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        id: 'user-1',
        ...result.data,
      }
    })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 }
    )
  }
}
