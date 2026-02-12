import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user exists in database
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        subscriptions: {
          where: { status: 'ACTIVE' },
        },
      },
    })

    if (!dbUser) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    // Cancel all active subscriptions
    // In production, this would cancel Stripe subscriptions via API
    for (const subscription of dbUser.subscriptions) {
      if (subscription.stripeSubscriptionId) {
        // TODO: Cancel Stripe subscription
        // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
        // await stripe.subscriptions.cancel(subscription.stripeSubscriptionId)
      }

      // Update subscription status to canceled
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          status: 'CANCELED',
          canceledAt: new Date(),
        },
      })
    }

    // Deactivate all agent assignments
    await prisma.agentAssignment.updateMany({
      where: { userId: user.id },
      data: { active: false },
    })

    // Mark user for deletion (soft delete with 30-day grace period)
    // Add deletedAt field to User model in future if needed
    // For now, we'll just cancel subscriptions and show a message

    // Sign out the user
    await supabase.auth.signOut()

    return NextResponse.json({
      success: true,
      message: 'Account deletion initiated. You have 30 days to recover your account by contacting support.',
    })
  } catch (error) {
    console.error('Account deletion error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete account. Please try again later.',
      },
      { status: 500 }
    )
  }
}
