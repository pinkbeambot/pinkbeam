import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
});

const requestSchema = z.object({
  planSlug: z.string().optional(),
  amount: z.number().positive().optional(),
  description: z.string(),
  serviceType: z.enum(['WEB', 'LABS', 'SOLUTIONS']),
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
    const { planSlug, amount, description, serviceType } = requestSchema.parse(body);

    let priceAmount: number;
    let priceId: string | null = null;
    let planId: string | null = null;

    // 3. Determine price (either from plan or custom amount)
    if (planSlug) {
      // Use predefined plan
      const plan = await prisma.plan.findUnique({
        where: { slug: planSlug, active: true },
      });

      if (!plan) {
        return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
      }

      priceAmount = Math.round(Number(plan.priceMonthly) * 100); // Convert to cents
      priceId = plan.stripePriceIdMonthly;
      planId = plan.id;
    } else if (amount) {
      // Use custom amount (for variable pricing)
      priceAmount = Math.round(amount * 100); // Convert to cents
    } else {
      return NextResponse.json(
        { error: 'Either planSlug or amount must be provided' },
        { status: 400 }
      );
    }

    // 4. Get or create Stripe Customer
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { email: true, name: true },
    });

    const existingSubscription = await prisma.subscription.findFirst({
      where: { userId: user.id, stripeCustomerId: { not: null } },
      select: { stripeCustomerId: true },
    });

    let customerId = existingSubscription?.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: dbUser?.email || user.email!,
        name: dbUser?.name || undefined,
        metadata: {
          userId: user.id,
        },
      });
      customerId = customer.id;
    }

    // 5. Create Checkout Session
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    if (priceId) {
      // Use existing Stripe Price
      lineItems.push({
        price: priceId,
        quantity: 1,
      });
    } else {
      // Create price on-the-fly for custom amount
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: description,
            metadata: {
              serviceType,
            },
          },
          unit_amount: priceAmount,
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'payment',
      line_items: lineItems,
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout/cancel`,
      metadata: {
        userId: user.id,
        serviceType,
        ...(planId && { planId }),
        ...(planSlug && { planSlug }),
        paymentType: 'one-time',
      },
      payment_intent_data: {
        metadata: {
          userId: user.id,
          serviceType,
          ...(planId && { planId }),
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
    console.error('One-time checkout creation failed:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
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
