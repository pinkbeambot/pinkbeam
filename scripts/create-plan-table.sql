-- Create enums if they don't exist
DO $$ BEGIN
    CREATE TYPE "PlanServiceType" AS ENUM ('AGENTS', 'WEB', 'LABS', 'SOLUTIONS');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "PlanTier" AS ENUM ('STARTER', 'GROWTH', 'SCALE', 'ENTERPRISE', 'CUSTOM');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create plans table if it doesn't exist
CREATE TABLE IF NOT EXISTS "plans" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "serviceType" "PlanServiceType" NOT NULL,
    "tier" "PlanTier" NOT NULL,
    "priceMonthly" DECIMAL(10,2) NOT NULL,
    "priceAnnual" DECIMAL(10,2) NOT NULL,
    "features" JSONB NOT NULL,
    "limits" JSONB NOT NULL,
    "stripeProductId" TEXT,
    "stripePriceIdMonthly" TEXT,
    "stripePriceIdAnnual" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plans_pkey" PRIMARY KEY ("id")
);

-- Create unique indexes
CREATE UNIQUE INDEX IF NOT EXISTS "plans_slug_key" ON "plans"("slug");
CREATE UNIQUE INDEX IF NOT EXISTS "plans_stripeProductId_key" ON "plans"("stripeProductId");
CREATE UNIQUE INDEX IF NOT EXISTS "plans_stripePriceIdMonthly_key" ON "plans"("stripePriceIdMonthly");
CREATE UNIQUE INDEX IF NOT EXISTS "plans_stripePriceIdAnnual_key" ON "plans"("stripePriceIdAnnual");

-- Create regular indexes
CREATE INDEX IF NOT EXISTS "plans_serviceType_idx" ON "plans"("serviceType");
CREATE INDEX IF NOT EXISTS "plans_active_idx" ON "plans"("active");
CREATE INDEX IF NOT EXISTS "plans_serviceType_active_idx" ON "plans"("serviceType", "active");
