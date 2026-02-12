-- Fix plans table columns to use enum types
DO $$
BEGIN
    -- Fix serviceType column in plans table
    IF EXISTS (
        SELECT FROM information_schema.columns
        WHERE table_name = 'plans'
        AND column_name = 'serviceType'
        AND data_type = 'text'
    ) THEN
        ALTER TABLE plans ALTER COLUMN "serviceType" DROP DEFAULT;
        ALTER TABLE plans
        ALTER COLUMN "serviceType" TYPE "PlanServiceType"
        USING "serviceType"::"PlanServiceType";
        RAISE NOTICE 'Plans.serviceType converted to PlanServiceType enum';
    END IF;

    -- Fix tier column in plans table
    IF EXISTS (
        SELECT FROM information_schema.columns
        WHERE table_name = 'plans'
        AND column_name = 'tier'
        AND data_type = 'text'
    ) THEN
        ALTER TABLE plans ALTER COLUMN tier DROP DEFAULT;
        ALTER TABLE plans
        ALTER COLUMN tier TYPE "PlanTier"
        USING tier::"PlanTier";
        RAISE NOTICE 'Plans.tier converted to PlanTier enum';
    END IF;
END $$;
