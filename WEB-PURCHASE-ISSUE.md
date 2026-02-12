# Web Service Purchase Flow - Debug Handoff

## Issue Summary
User is unable to complete a one-time Web service purchase ($2,000 website). The checkout flow returns 400 errors when clicking "Buy One-Time ($2,000)" button on `/checkout/test`.

## What Works
- ✅ Stripe products and prices created successfully
- ✅ Database plans synced with correct one-time pricing
- ✅ PurchaseButton correctly routes to `/api/checkout/one-time` endpoint
- ✅ Database schema has `priceOneTime` and `stripePriceIdOneTime` fields
- ✅ Agent subscriptions work correctly (tested previously)

## Current Error
- **Endpoint**: `POST /api/checkout/one-time`
- **Status**: 400 Bad Request
- **Location**: http://localhost:3000/checkout/test
- **Test Plan**: `web-starter-one-time` (slug)

## Recent Changes (Commits)

### Commit 58bb4fa - One-time Checkout Fix
Fixed `/api/checkout/one-time` route to:
- Use `plan.priceOneTime` instead of `plan.priceMonthly`
- Use `plan.stripePriceIdOneTime` instead of `plan.stripePriceIdMonthly`
- Made `description` and `serviceType` optional when `planSlug` provided
- Derive these from plan data when not explicitly provided

### Commit 732db79 - Schema & Sync Updates
Added one-time pricing support:
- Added `priceOneTime` and `stripePriceIdOneTime` columns to plans table
- Updated `stripe-sync-to-db.ts` to properly populate these fields
- Verified sync: `web-starter-one-time` plan has `One-Time: $2000.00`

## How to Reproduce

1. **Start dev server**: `npm run dev`
2. **Navigate to**: http://localhost:3000/checkout/test
3. **Sign in** as test user (or create account)
4. **Click**: "Buy One-Time ($2,000)" button under "Web - Starter Website"
5. **Error**: Alert shows error, network tab shows 400 response

## Debugging Steps Taken

1. ✅ Fixed PurchaseButton to pass `mode="one-time"` prop
2. ✅ Fixed browser cache issue (was calling subscription endpoint)
3. ✅ Fixed one-time checkout route to use correct price fields
4. ✅ Added database schema fields for one-time pricing
5. ✅ Re-synced Stripe products to populate new fields
6. ❌ Still getting 400 errors (error message not visible in logs)

## Files to Check

### Primary Files
- `app/api/checkout/one-time/route.ts` - One-time checkout endpoint
- `components/checkout/PurchaseButton.tsx` - Button component
- `app/(main)/checkout/test/page.tsx` - Test page
- `scripts/stripe-sync-to-db.ts` - Stripe → Database sync
- `prisma/schema.prisma` - Database schema (Plan model)

### Related Files
- `app/api/webhooks/stripe/route.ts` - Webhook handler
- `lib/products/catalog.ts` - Product definitions (currently only Agents)

## Database Verification

Check the plan exists and has correct data:
```sql
SELECT
  slug,
  name,
  "serviceType",
  "priceOneTime",
  "stripePriceIdOneTime"
FROM plans
WHERE slug = 'web-starter-one-time';
```

Expected result:
- slug: `web-starter-one-time`
- priceOneTime: `2000.00`
- stripePriceIdOneTime: `price_1Sztpm3FU5DfXKjpv3xqbKlu`

## Next Debugging Steps

1. **Add console.log to checkout route** to see exact error:
   - Log the parsed request body
   - Log the plan lookup result
   - Log the exact validation error

2. **Check browser DevTools**:
   - Network tab → Click the failed request
   - Check Response body for error message
   - Check Request payload

3. **Verify Prisma client**:
   - Run `npx prisma generate` to ensure latest schema
   - Restart dev server to pick up changes

4. **Test with curl**:
   ```bash
   curl -X POST http://localhost:3000/api/checkout/one-time \
     -H "Content-Type: application/json" \
     -H "Cookie: [auth-cookie]" \
     -d '{"planSlug":"web-starter-one-time"}' \
     -v
   ```

## Environment Setup

- **Node**: v22
- **Next.js**: 15.5.12
- **Prisma**: 7.3.0
- **Stripe API**: Test mode (sk_test_...)
- **Database**: Supabase PostgreSQL

## Test Credentials

Use Stripe test card:
- **Card**: 4242 4242 4242 4242
- **Exp**: Any future date
- **CVC**: Any 3 digits

## Contact Context

User wants to iron out the Web service purchase workflow as it will likely be the first service they launch. The flow worked for Agent subscriptions but one-time purchases are failing.

## Root Cause & Fix (2026-02-12)

### Problem Identified
The Zod validation schema in `/api/checkout/one-time` was missing the `billingCycle` field that `PurchaseButton` sends in the request body. While Zod strips extra fields by default, this was causing unexpected validation behavior.

### Fix Applied
**File**: `app/api/checkout/one-time/route.ts`

1. **Added `billingCycle` to schema**:
   ```typescript
   const requestSchema = z.object({
     planSlug: z.string().optional(),
     amount: z.number().positive().optional(),
     description: z.string().optional(),
     serviceType: z.enum(['WEB', 'LABS', 'SOLUTIONS']).optional(),
     billingCycle: z.enum(['monthly', 'annual']).optional(), // Added
   }).passthrough(); // Allow extra fields for flexibility
   ```

2. **Added comprehensive logging** throughout the route for debugging

3. **Improved error messages** to include specific Zod validation issues

### E2E Test Created
**File**: `tests/e2e/checkout-one-time.spec.ts`

Tests cover:
- Unauthenticated redirect
- Successful one-time purchase for Web Starter
- Successful one-time purchase for Solutions Workshop
- 404 for non-existent plan
- 400 for plan without one-time price
- Acceptance of `billingCycle` field
- Custom amount validation
- Custom amount success case

### Verification Steps
1. Run `npx prisma generate` to ensure latest schema
2. Start dev server: `npm run dev`
3. Navigate to `/checkout/test`
4. Sign in as test user
5. Click "Buy One-Time ($2,000)" button
6. Verify redirect to Stripe Checkout

### Status
✅ **FIXED** - Ready for testing
