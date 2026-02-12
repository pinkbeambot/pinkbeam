-- Fix subscriptions table to use enum types
DO $$
BEGIN
    -- Fix status column
    IF EXISTS (
        SELECT FROM information_schema.columns
        WHERE table_name = 'subscriptions'
        AND column_name = 'status'
        AND data_type = 'text'
    ) THEN
        -- Drop default, change type, add default back
        ALTER TABLE subscriptions ALTER COLUMN status DROP DEFAULT;
        ALTER TABLE subscriptions
        ALTER COLUMN status TYPE "SubscriptionStatus"
        USING status::"SubscriptionStatus";
        ALTER TABLE subscriptions ALTER COLUMN status SET DEFAULT 'ACTIVE'::"SubscriptionStatus";
        RAISE NOTICE 'Status column converted to SubscriptionStatus enum';
    END IF;

    -- Fix billingCycle column
    IF EXISTS (
        SELECT FROM information_schema.columns
        WHERE table_name = 'subscriptions'
        AND column_name = 'billingCycle'
        AND data_type = 'text'
    ) THEN
        ALTER TABLE subscriptions ALTER COLUMN "billingCycle" DROP DEFAULT;
        ALTER TABLE subscriptions
        ALTER COLUMN "billingCycle" TYPE "BillingCycle"
        USING "billingCycle"::"BillingCycle";
        ALTER TABLE subscriptions ALTER COLUMN "billingCycle" SET DEFAULT 'monthly'::"BillingCycle";
        RAISE NOTICE 'BillingCycle column converted to BillingCycle enum';
    END IF;

    -- Fix paymentStatus column
    IF EXISTS (
        SELECT FROM information_schema.columns
        WHERE table_name = 'subscriptions'
        AND column_name = 'paymentStatus'
        AND data_type = 'text'
    ) THEN
        ALTER TABLE subscriptions ALTER COLUMN "paymentStatus" DROP DEFAULT;
        ALTER TABLE subscriptions
        ALTER COLUMN "paymentStatus" TYPE "PaymentStatus"
        USING "paymentStatus"::"PaymentStatus";
        ALTER TABLE subscriptions ALTER COLUMN "paymentStatus" SET DEFAULT 'ACTIVE'::"PaymentStatus";
        RAISE NOTICE 'PaymentStatus column converted to PaymentStatus enum';
    END IF;
END $$;
