import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/auth/apiMiddleware'

const purchaseSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  userEmail: z.string().email('Valid email is required'),
  userName: z.string().min(1, 'Name is required'),
  userCompany: z.string().optional(),
  tierId: z.string().min(1, 'Tier ID is required'),
  tierName: z.string().min(1, 'Tier name is required'),
  billingCycle: z.enum(['monthly', 'annual']),
  addOns: z.array(z.string()).default([]),
  totalPrice: z.number().positive('Total price must be positive'),
})

// POST /api/agents/purchase - Create purchase request (authenticated)
export const POST = withAuth(async (request, { auth }) => {
  try {
    const body = await request.json()
    const result = purchaseSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.flatten() },
        { status: 400 }
      )
    }

    // Verify user owns this purchase request
    if (result.data.userId !== auth.userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: User ID mismatch' },
        { status: 403 }
      )
    }

    // Create quote request for the purchase
    // Map to existing QuoteRequest model fields
    const description = `AI Employee Subscription - ${result.data.tierName} Plan (${result.data.billingCycle} billing)${
      result.data.addOns.length > 0 ? ` + ${result.data.addOns.length} add-ons` : ''
    }`

    const quoteRequest = await prisma.quoteRequest.create({
      data: {
        fullName: result.data.userName,
        email: result.data.userEmail,
        company: result.data.userCompany || null,
        projectType: 'AGENTS',
        services: ['AI_AGENTS'],
        budgetRange: `$${result.data.totalPrice}/month`,
        timeline: 'ASAP',
        description,
        status: 'NEW',
        leadScore: 80, // High score for direct purchases
        leadQuality: 'hot',
        notes: JSON.stringify({
          tierId: result.data.tierId,
          tierName: result.data.tierName,
          billingCycle: result.data.billingCycle,
          addOns: result.data.addOns,
          totalPrice: result.data.totalPrice,
          source: 'purchase_flow',
        }),
      },
    })

    return NextResponse.json(
      { success: true, data: quoteRequest },
      { status: 201 }
    )
  } catch (error) {
    console.error('Purchase request error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process purchase request' },
      { status: 500 }
    )
  }
})
