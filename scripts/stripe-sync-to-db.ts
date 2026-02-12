#!/usr/bin/env tsx
/**
 * Stripe → Database Sync Script
 *
 * Fetches Stripe products and prices, creates/updates Plan records in database.
 * Run after stripe-seed.ts to sync IDs.
 *
 * Usage:
 *   npm run stripe:sync
 */

import Stripe from 'stripe';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

// Load env vars BEFORE creating Prisma client
dotenv.config({ path: '.env.local', override: true });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY not found in .env.local');
  process.exit(1);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
});

const isTestMode = process.env.STRIPE_SECRET_KEY.startsWith('sk_test_');

console.log(`\n🔄 Syncing Stripe products to database (${isTestMode ? 'TEST' : 'LIVE'} mode)\n`);

// Map Stripe metadata to database enums
function getServiceType(category: string): 'AGENTS' | 'WEB' | 'LABS' | 'SOLUTIONS' {
  const map: Record<string, 'AGENTS' | 'WEB' | 'LABS' | 'SOLUTIONS'> = {
    agent: 'AGENTS',
    web: 'WEB',
    labs: 'LABS',
    solutions: 'SOLUTIONS',
  };
  return map[category] || 'AGENTS';
}

function getTier(tierName: string): 'STARTER' | 'GROWTH' | 'SCALE' | 'ENTERPRISE' | 'CUSTOM' {
  const normalized = tierName.toLowerCase();
  if (normalized.includes('start') || normalized === 'light') return 'STARTER';
  if (normalized.includes('prof') || normalized === 'standard' || normalized === 'business' || normalized === 'growth') return 'GROWTH';
  if (normalized.includes('scale') || normalized === 'premium') return 'SCALE';
  if (normalized.includes('enterprise')) return 'ENTERPRISE';
  return 'CUSTOM';
}

async function syncProducts() {
  try {
    // Fetch all active products from Stripe
    const products = await stripe.products.list({ active: true, limit: 100 });

    console.log(`📦 Found ${products.data.length} active Stripe products\n`);

    for (const product of products.data) {
      console.log(`\n🔍 Processing: ${product.name}`);
      console.log(`   Stripe ID: ${product.id}`);
      console.log(`   Metadata:`, product.metadata);

      // Fetch prices for this product
      const prices = await stripe.prices.list({
        product: product.id,
        active: true,
        limit: 100,
      });

      console.log(`   💰 Found ${prices.data.length} active prices`);

      // Group prices by tier
      const pricesByTier = new Map<string, Stripe.Price[]>();
      for (const price of prices.data) {
        const tier = price.metadata.tier || 'one-time';
        if (!pricesByTier.has(tier)) {
          pricesByTier.set(tier, []);
        }
        pricesByTier.get(tier)!.push(price);
      }

      // Create/update Plan for each tier
      for (const [tierName, tierPrices] of pricesByTier.entries()) {
        const monthlyPrice = tierPrices.find(p => p.recurring?.interval === 'month');
        const annualPrice = tierPrices.find(p => p.recurring?.interval === 'year');
        const oneTimePrice = tierPrices.find(p => !p.recurring);

        const serviceType = getServiceType(product.metadata.category || 'agent');
        const tier = getTier(tierName);
        // Make slug unique by including product name or package identifier
        const productSlug = (product.metadata.package || product.metadata.role || product.name)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-');
        const slug = `${serviceType.toLowerCase()}-${productSlug}-${tierName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

        // Determine pricing
        const priceMonthly = monthlyPrice?.unit_amount || oneTimePrice?.unit_amount || 0;
        const priceAnnual = annualPrice?.unit_amount || (priceMonthly * 12 * 0.9); // 10% annual discount

        // Build features and limits based on service type and tier
        const features = buildFeatures(serviceType, tier, product);
        const limits = buildLimits(serviceType, tier);

        console.log(`   ⚙️  Creating/updating Plan: ${slug}`);
        console.log(`      Service: ${serviceType}, Tier: ${tier}`);
        console.log(`      Monthly: $${(priceMonthly / 100).toFixed(2)}, Annual: $${(priceAnnual / 100).toFixed(2)}`);

        await prisma.plan.upsert({
          where: { slug },
          create: {
            name: `${product.name} - ${tierName}`,
            slug,
            serviceType,
            tier,
            priceMonthly: priceMonthly / 100,
            priceAnnual: priceAnnual / 100,
            features,
            limits,
            // Don't set stripeProductId to avoid unique constraint issues with multi-tier products
            stripeProductId: null,
            stripePriceIdMonthly: monthlyPrice?.id || oneTimePrice?.id || null,
            stripePriceIdAnnual: annualPrice?.id || null,
            active: true,
            description: product.description || null,
          },
          update: {
            name: `${product.name} - ${tierName}`,
            priceMonthly: priceMonthly / 100,
            priceAnnual: priceAnnual / 100,
            stripePriceIdMonthly: monthlyPrice?.id || oneTimePrice?.id || null,
            stripePriceIdAnnual: annualPrice?.id || null,
            description: product.description || null,
          },
        });

        console.log(`   ✅ Synced!`);
      }
    }

    console.log('\n✅ Stripe → Database sync complete!\n');
  } catch (error) {
    console.error('❌ Sync failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

function buildFeatures(serviceType: string, tier: string, product: Stripe.Product): any {
  const baseFeatures = {
    AGENTS: {
      STARTER: ['1 AI employee', '5,000 interactions/month', 'Email support (48hr)', 'Basic analytics'],
      GROWTH: ['3 AI employees', '25,000 interactions/month', 'Priority support (4hr)', 'Advanced analytics', 'All integrations'],
      SCALE: ['5+ AI employees', 'Unlimited interactions', 'Dedicated account manager', 'Custom integrations', 'SLA guarantees'],
      ENTERPRISE: ['10+ AI employees', 'Unlimited everything', 'White-glove service', 'Custom everything'],
    },
    WEB: {
      STARTER: ['5-page website', 'Mobile responsive', 'SEO basics', '1 month support'],
      GROWTH: ['10-page website', 'Advanced SEO', 'Analytics integration', '3 months support'],
      SCALE: ['20-page website', 'E-commerce', 'Custom features', '6 months support'],
      ENTERPRISE: ['Custom pages', 'Advanced features', 'Priority support', '12 months support'],
    },
    LABS: {
      STARTER: ['MVP development', '8-12 weeks', 'Core features', 'Basic support'],
      GROWTH: ['Full product', 'Advanced features', 'Extended timeline', 'Priority support'],
      SCALE: ['Enterprise product', 'All features', 'Flexible timeline', 'Premium support'],
      ENTERPRISE: ['Custom development', 'Dedicated team', 'Flexible scope', 'White-glove support'],
    },
    SOLUTIONS: {
      STARTER: ['Workshop', 'Strategy session', 'Roadmap', 'Follow-up'],
      GROWTH: ['Assessment', 'Full audit', 'Detailed roadmap', 'Implementation guide'],
      SCALE: ['Extended engagement', 'Ongoing strategy', 'Implementation support', 'Team training'],
      ENTERPRISE: ['Fractional CTO', 'Monthly retainer', 'Unlimited consultation', 'On-demand support'],
    },
  };

  return baseFeatures[serviceType as keyof typeof baseFeatures]?.[tier as keyof typeof baseFeatures.AGENTS] || [];
}

function buildLimits(serviceType: string, tier: string): any {
  const baseLimits = {
    AGENTS: {
      STARTER: { employees: 1, interactions: 5000, projects: 3 },
      GROWTH: { employees: 3, interactions: 25000, projects: 10 },
      SCALE: { employees: 5, interactions: 100000, projects: 50 },
      ENTERPRISE: { employees: 999, interactions: -1, projects: -1 }, // -1 = unlimited
    },
    WEB: {
      STARTER: { pages: 5, revisions: 2, supportMonths: 1 },
      GROWTH: { pages: 10, revisions: 5, supportMonths: 3 },
      SCALE: { pages: 20, revisions: 10, supportMonths: 6 },
      ENTERPRISE: { pages: -1, revisions: -1, supportMonths: 12 },
    },
    LABS: {
      STARTER: { sprints: 4, developers: 1, supportHours: 20 },
      GROWTH: { sprints: 8, developers: 2, supportHours: 60 },
      SCALE: { sprints: 16, developers: 3, supportHours: 120 },
      ENTERPRISE: { sprints: -1, developers: 5, supportHours: -1 },
    },
    SOLUTIONS: {
      STARTER: { sessions: 1, hours: 4, followUps: 1 },
      GROWTH: { sessions: 5, hours: 20, followUps: 3 },
      SCALE: { sessions: 10, hours: 40, followUps: 6 },
      ENTERPRISE: { sessions: -1, hours: -1, followUps: -1 },
    },
  };

  return baseLimits[serviceType as keyof typeof baseLimits]?.[tier as keyof typeof baseLimits.AGENTS] || {};
}

syncProducts().catch((error) => {
  console.error('❌ Sync failed:', error);
  process.exit(1);
});
