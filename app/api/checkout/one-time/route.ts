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
  description: z.string().optional(), // Optional when planSlug is provided
  serviceType: z.enum(['WEB', 'LABS', 'SOLUTIONS']).optional(), // Optional when planSlug is provided
  billingCycle: z.enum(['monthly', 'annual']).optional(), // Passed by PurchaseButton but not used for one-time
}).passthrough(); // Allow extra fields for flexibility

export async function POST(request: NextRequest) {
  try {
    console.log('[One-Time Checkout] Request received');
    
    // 1. Verify authentication
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.log('[One-Time Checkout] Unauthorized - no user');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.log('[One-Time Checkout] User authenticated:', user.id);

    // 2. Parse and validate request
    const body = await request.json();
    console.log('[One-Time Checkout] Request body:', JSON.stringify(body));
    
    const parsed = requestSchema.parse(body);
    console.log('[One-Time Checkout] Parsed data:', JSON.stringify(parsed));

    let priceAmount: number;
    let priceId: string | null = null;
    let planId: string | null = null;
    let description: string;
    let serviceType: 'WEB' | 'LABS' | 'SOLUTIONS';

    // 3. Determine price (either from plan or custom amount)
    if (parsed.planSlug) {
      console.log('[One-Time Checkout] Looking up plan:', parsed.planSlug);
      // Use predefined plan
      const plan = await prisma.plan.findUnique({
        where: { slug: parsed.planSlug, active: true },
      });
      console.log('[One-Time Checkout] Plan lookup result:', plan ? 'found' : 'not found');

      if (!plan) {
        console.log('[One-Time Checkout] Plan not found:', parsed.planSlug);
        return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
      }

      console.log('[One-Time Checkout] Plan data:', JSON.stringify({
        id: plan.id,
        slug: plan.slug,
        priceOneTime: plan.priceOneTime,
        stripePriceIdOneTime: plan.stripePriceIdOneTime,
        serviceType: plan.serviceType,
      }));

      if (!plan.priceOneTime) {
        console.log('[One-Time Checkout] Plan has no priceOneTime');
        return NextResponse.json({ error: 'Plan does not support one-time purchases' }, { status: 400 });
      }

      priceAmount = Math.round(Number(plan.priceOneTime) * 100); // Convert to cents
      priceId = plan.stripePriceIdOneTime;
      planId = plan.id;
      description = parsed.description || plan.description || plan.name;
      serviceType = plan.serviceType as 'WEB' | 'LABS' | 'SOLUTIONS';
      console.log('[One-Time Checkout] Using plan pricing:', { priceAmount, priceId, planId, serviceType });
    } else if (parsed.amount) {
      // Use custom amount (for variable pricing)
      if (!parsed.description || !parsed.serviceType) {
        return NextResponse.json(
          { error: 'description and serviceType are required when using custom amount' },
          { status: 400 }
        );
      }
      priceAmount = Math.round(parsed.amount * 100); // Convert to cents
      description = parsed.description;
      serviceType = parsed.serviceType;
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
        ...(parsed.planSlug && { planSlug: parsed.planSlug }),
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
    console.error('[One-Time Checkout] Error:', error);

    if (error instanceof z.ZodError) {
      const issues = error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ');
      console.error('[One-Time Checkout] Zod validation error:', issues);
      return NextResponse.json(
        { error: `Invalid request data: ${issues}`, details: error.issues },
        { status: 400 }
      );
    }

    if (error instanceof Stripe.errors.StripeError) {
      console.error('[One-Time Checkout] Stripe error:', error.message, error.code);
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode || 500 }
      );
    }

    console.error('[One-Time Checkout] Unknown error type:', typeof error, error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
