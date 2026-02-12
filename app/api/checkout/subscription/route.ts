import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

const requestSchema = z.object({
  planSlug: z.string(),
  billingCycle: z.enum(['monthly', 'annual']).default('monthly'),
});

export async function POST(request: NextRequest) {
  try {
    // 1. Verify authentication
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse and validate request
    const body = await request.json();
    const { planSlug, billingCycle } = requestSchema.parse(body);

    // 3. Look up Plan in database
    const plan = await prisma.plan.findUnique({
      where: { slug: planSlug, active: true },
    });

    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    // 4. Get or create Stripe Customer
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { email: true, name: true },
    });

    // Check if user already has a Stripe customer ID
    const existingSubscription = await prisma.subscription.findFirst({
      where: { userId: user.id, stripeCustomerId: { not: null } },
      select: { stripeCustomerId: true },
    });

    let customerId = existingSubscription?.stripeCustomerId;

    if (!customerId) {
      // Create new Stripe customer
      const customer = await stripe.customers.create({
        email: dbUser?.email || user.email!,
        name: dbUser?.name || undefined,
        metadata: {
          userId: user.id,
        },
      });
      customerId = customer.id;
    }

    // 5. Get the correct Stripe Price ID
    const priceId =
      billingCycle === 'annual'
        ? plan.stripePriceIdAnnual || plan.stripePriceIdMonthly
        : plan.stripePriceIdMonthly;

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price not configured for this plan' },
        { status: 400 }
      );
    }

    // 6. Create Checkout Session
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout/cancel`,
      metadata: {
        userId: user.id,
        planId: plan.id,
        planSlug: plan.slug,
        serviceType: plan.serviceType,
        tier: plan.tier,
      },
      subscription_data: {
        metadata: {
          userId: user.id,
          planId: plan.id,
          planSlug: plan.slug,
        },
      },
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
    });

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Checkout session creation failed:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode || 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
