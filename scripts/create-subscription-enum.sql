-- Create SubscriptionStatus enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE "public"."SubscriptionStatus" AS ENUM (
        'ACTIVE',
        'PAST_DUE',
        'PAUSED',
        'CANCELED',
        'TRIALING',
        'INCOMPLETE'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create PaymentStatus enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE "public"."PaymentStatus" AS ENUM (
        'ACTIVE',
        'PAST_DUE',
        'FAILED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create BillingCycle enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE "public"."BillingCycle" AS ENUM (
        'monthly',
        'annual'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
