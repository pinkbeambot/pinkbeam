-- Add priceOneTime and stripePriceIdOneTime columns to plans table

ALTER TABLE plans
ADD COLUMN IF NOT EXISTS "priceOneTime" DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS "stripePriceIdOneTime" TEXT;

-- Add unique constraint for stripePriceIdOneTime
CREATE UNIQUE INDEX IF NOT EXISTS "plans_stripePriceIdOneTime_key"
ON plans("stripePriceIdOneTime") WHERE "stripePriceIdOneTime" IS NOT NULL;
