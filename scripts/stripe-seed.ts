#!/usr/bin/env tsx
/**
 * Stripe Product & Price Seed Script
 *
 * Creates all Pink Beam products and prices in Stripe.
 * Idempotent - safe to run multiple times to update prices.
 *
 * Usage:
 *   npm run stripe:seed
 *
 * Environment:
 *   STRIPE_SECRET_KEY (test or live)
 */

import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local', override: true });

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY not found in .env.local');
  process.exit(1);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
});

const isTestMode = process.env.STRIPE_SECRET_KEY.startsWith('sk_test_');

console.log(`\n🔧 Running in ${isTestMode ? 'TEST' : 'LIVE'} mode\n`);

// Product definitions
const products = [
  // AI Employees - Recurring Subscriptions (6 roles × 3 tiers each = 18 prices)
  {
    name: 'Sarah - Research Agent',
    description: 'AI research assistant that delivers comprehensive insights and analysis.',
    metadata: { category: 'agent', role: 'sarah' },
    prices: [
      { tier: 'starter', amount: 39700, interval: 'month' }, // $397/mo
      { tier: 'professional', amount: 79700, interval: 'month' }, // $797/mo
      { tier: 'enterprise', amount: 149700, interval: 'month' }, // $1,497/mo
    ],
  },
  {
    name: 'Mike - Sales Agent',
    description: 'AI sales development rep for lead qualification and outreach.',
    metadata: { category: 'agent', role: 'mike' },
    prices: [
      { tier: 'starter', amount: 39700, interval: 'month' },
      { tier: 'professional', amount: 79700, interval: 'month' },
      { tier: 'enterprise', amount: 149700, interval: 'month' },
    ],
  },
  {
    name: 'Alex - Support Agent',
    description: 'AI customer support specialist available 24/7.',
    metadata: { category: 'agent', role: 'alex' },
    prices: [
      { tier: 'starter', amount: 39700, interval: 'month' },
      { tier: 'professional', amount: 79700, interval: 'month' },
      { tier: 'enterprise', amount: 149700, interval: 'month' },
    ],
  },
  {
    name: 'Casey - Content Agent',
    description: 'AI content creator for blogs, social media, and marketing materials.',
    metadata: { category: 'agent', role: 'casey' },
    prices: [
      { tier: 'starter', amount: 39700, interval: 'month' },
      { tier: 'professional', amount: 79700, interval: 'month' },
      { tier: 'enterprise', amount: 149700, interval: 'month' },
    ],
  },
  {
    name: 'Jordan - Design Agent',
    description: 'AI design assistant for graphics, layouts, and brand assets.',
    metadata: { category: 'agent', role: 'jordan' },
    prices: [
      { tier: 'starter', amount: 39700, interval: 'month' },
      { tier: 'professional', amount: 79700, interval: 'month' },
      { tier: 'enterprise', amount: 149700, interval: 'month' },
    ],
  },
  {
    name: 'LUMEN - Analytics Agent',
    description: 'AI analytics specialist for data insights and reporting.',
    metadata: { category: 'agent', role: 'lumen' },
    prices: [
      { tier: 'starter', amount: 39700, interval: 'month' },
      { tier: 'professional', amount: 79700, interval: 'month' },
      { tier: 'enterprise', amount: 149700, interval: 'month' },
    ],
  },

  // Web Services - One-time & Recurring
  {
    name: 'Web - Starter Website',
    description: '5-page professional website with SEO foundation.',
    metadata: { category: 'web', package: 'starter' },
    prices: [
      { tier: 'one-time', amount: 200000, interval: null }, // $2,000
      { tier: 'monthly', amount: 9900, interval: 'month' }, // $99/mo maintenance
    ],
  },
  {
    name: 'Web - Business Website',
    description: '10-page business website with advanced SEO and analytics.',
    metadata: { category: 'web', package: 'business' },
    prices: [
      { tier: 'one-time', amount: 500000, interval: null }, // $5,000
      { tier: 'monthly', amount: 19900, interval: 'month' }, // $199/mo maintenance
    ],
  },
  {
    name: 'Web - Enterprise Website',
    description: 'Custom enterprise website with advanced features.',
    metadata: { category: 'web', package: 'enterprise' },
    prices: [
      { tier: 'one-time', amount: 1000000, interval: null }, // $10,000
      { tier: 'monthly', amount: 29900, interval: 'month' }, // $299/mo maintenance
    ],
  },

  // Labs - Project-based & Retainers
  {
    name: 'Labs - MVP Development',
    description: 'Custom software MVP development (8-12 weeks).',
    metadata: { category: 'labs', package: 'mvp' },
    prices: [
      { tier: 'one-time', amount: 3000000, interval: null }, // $30,000 - $50,000 (start at lower)
    ],
  },
  {
    name: 'Labs - Monthly Retainer',
    description: 'Ongoing development support and feature builds.',
    metadata: { category: 'labs', package: 'retainer' },
    prices: [
      { tier: 'light', amount: 500000, interval: 'month' }, // $5,000/mo
      { tier: 'standard', amount: 1000000, interval: 'month' }, // $10,000/mo
      { tier: 'premium', amount: 2000000, interval: 'month' }, // $20,000/mo
    ],
  },

  // Solutions - Consulting & Workshops
  {
    name: 'Solutions - AI Strategy Workshop',
    description: 'Half-day AI strategy and implementation planning workshop.',
    metadata: { category: 'solutions', package: 'workshop-ai' },
    prices: [
      { tier: 'one-time', amount: 250000, interval: null }, // $2,500
    ],
  },
  {
    name: 'Solutions - Digital Transformation Assessment',
    description: 'Comprehensive technology audit and roadmap.',
    metadata: { category: 'solutions', package: 'assessment' },
    prices: [
      { tier: 'one-time', amount: 500000, interval: null }, // $5,000
    ],
  },
  {
    name: 'Solutions - Fractional CTO',
    description: 'Part-time technical leadership and advisory.',
    metadata: { category: 'solutions', package: 'fractional-cto' },
    prices: [
      { tier: 'monthly', amount: 500000, interval: 'month' }, // $5,000/mo
    ],
  },
];

async function archiveOldPrices(productId: string) {
  const prices = await stripe.prices.list({
    product: productId,
    active: true,
    limit: 100,
  });

  for (const price of prices.data) {
    await stripe.prices.update(price.id, { active: false });
    console.log(`   📦 Archived old price: ${price.id}`);
  }
}

async function seedProducts() {
  console.log('🌱 Seeding Stripe products and prices...\n');

  for (const productDef of products) {
    console.log(`📦 ${productDef.name}`);

    // Find or create product
    const existingProducts = await stripe.products.search({
      query: `name:'${productDef.name}'`,
    });

    let product: Stripe.Product;
    if (existingProducts.data.length > 0) {
      product = existingProducts.data[0];
      console.log(`   ✓ Found existing product: ${product.id}`);

      // Archive old prices
      await archiveOldPrices(product.id);
    } else {
      product = await stripe.products.create({
        name: productDef.name,
        description: productDef.description,
        metadata: productDef.metadata,
      });
      console.log(`   ✓ Created product: ${product.id}`);
    }

    // Create prices
    for (const priceDef of productDef.prices) {
      const priceData: Stripe.PriceCreateParams = {
        product: product.id,
        unit_amount: priceDef.amount,
        currency: 'usd',
        metadata: { tier: priceDef.tier },
      };

      if (priceDef.interval) {
        priceData.recurring = {
          interval: priceDef.interval as 'month' | 'year',
        };
      }

      const price = await stripe.prices.create(priceData);

      const formattedAmount = `$${(priceDef.amount / 100).toLocaleString()}`;
      const suffix = priceDef.interval ? `/${priceDef.interval}` : ' (one-time)';
      console.log(`   💰 Created price: ${price.id} - ${priceDef.tier} ${formattedAmount}${suffix}`);
    }

    console.log('');
  }

  console.log('✅ Seed complete!\n');
  console.log('Next steps:');
  console.log('  1. Visit https://dashboard.stripe.com/test/products');
  console.log('  2. Test checkout with card: 4242 4242 4242 4242');
  console.log('  3. Set up webhook endpoint for subscription events\n');
}

seedProducts().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
