-- ==================================================================
-- Pink Beam - Create Missing Database Tables
-- ==================================================================
-- This SQL creates only the tables that don't exist yet.
-- Safe to run multiple times (uses CREATE TABLE IF NOT EXISTS).
-- Run this in Supabase Dashboard → SQL Editor
-- ==================================================================

-- Subscription & Billing Tables
-- ==================================================================

CREATE TABLE IF NOT EXISTS "plans" (
  "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL UNIQUE,
  "serviceType" TEXT NOT NULL,
  "tier" TEXT NOT NULL,
  "priceMonthly" DECIMAL(10,2) NOT NULL,
  "priceAnnual" DECIMAL(10,2) NOT NULL,
  "features" JSONB NOT NULL,
  "limits" JSONB NOT NULL,
  "stripeProductId" TEXT UNIQUE,
  "stripePriceIdMonthly" TEXT UNIQUE,
  "stripePriceIdAnnual" TEXT UNIQUE,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "displayOrder" INTEGER NOT NULL DEFAULT 0,
  "description" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "subscriptions" (
  "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT NOT NULL,
  "planId" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'ACTIVE',
  "billingCycle" TEXT NOT NULL DEFAULT 'monthly',
  "currentPeriodStart" TIMESTAMP(3) NOT NULL,
  "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
  "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
  "canceledAt" TIMESTAMP(3),
  "trialStart" TIMESTAMP(3),
  "trialEnd" TIMESTAMP(3),
  "stripeCustomerId" TEXT,
  "stripeSubscriptionId" TEXT UNIQUE,
  "stripePriceId" TEXT,
  "paymentStatus" TEXT NOT NULL DEFAULT 'ACTIVE',
  "failedAt" TIMESTAMP(3),
  "gracePeriodEnds" TIMESTAMP(3),
  "pausedAt" TIMESTAMP(3),
  "lastDunningEmail" TIMESTAMP(3),
  "dunningEmailCount" INTEGER NOT NULL DEFAULT 0,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
  CONSTRAINT "subscriptions_planId_fkey" FOREIGN KEY ("planId") REFERENCES "plans"("id")
);

CREATE TABLE IF NOT EXISTS "agent_assignments" (
  "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "subscriptionId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "agentType" TEXT NOT NULL,
  "agentName" TEXT NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "configuredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "customConfig" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "agent_assignments_subscriptionId_agentType_key" UNIQUE ("subscriptionId", "agentType"),
  CONSTRAINT "agent_assignments_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "usage_records" (
  "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "subscriptionId" TEXT NOT NULL,
  "agentAssignmentId" TEXT,
  "period" TEXT NOT NULL,
  "interactionCount" INTEGER NOT NULL DEFAULT 0,
  "tokenUsage" INTEGER NOT NULL DEFAULT 0,
  "apiCost" DECIMAL(10,6) NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "usage_records_subscriptionId_period_key" UNIQUE ("subscriptionId", "period"),
  CONSTRAINT "usage_records_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE CASCADE,
  CONSTRAINT "usage_records_agentAssignmentId_fkey" FOREIGN KEY ("agentAssignmentId") REFERENCES "agent_assignments"("id") ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS "ai_usage" (
  "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT NOT NULL,
  "subscriptionId" TEXT,
  "agentAssignmentId" TEXT,
  "employeeType" TEXT NOT NULL,
  "model" TEXT NOT NULL,
  "inputTokens" INTEGER NOT NULL,
  "outputTokens" INTEGER NOT NULL,
  "costUSD" DECIMAL(10,6) NOT NULL,
  "conversationId" TEXT,
  "taskType" TEXT,
  "requestData" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ai_usage_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE SET NULL,
  CONSTRAINT "ai_usage_agentAssignmentId_fkey" FOREIGN KEY ("agentAssignmentId") REFERENCES "agent_assignments"("id") ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS "one_time_orders" (
  "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT NOT NULL,
  "serviceType" TEXT NOT NULL,
  "projectType" TEXT,
  "description" TEXT,
  "priceQuoted" DECIMAL(10,2) NOT NULL,
  "pricePaid" DECIMAL(10,2),
  "currency" TEXT NOT NULL DEFAULT 'usd',
  "stripePaymentIntentId" TEXT UNIQUE,
  "stripeInvoiceId" TEXT,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "metadata" JSONB,
  "paidAt" TIMESTAMP(3),
  "refundedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Real-Time Messaging Tables
-- ==================================================================

CREATE TABLE IF NOT EXISTS "conversations" (
  "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "title" TEXT,
  "participants" TEXT[] NOT NULL DEFAULT '{}',
  "lastMessageAt" TIMESTAMP(3),
  "unreadCount" INTEGER NOT NULL DEFAULT 0,
  "metadata" JSONB,
  "archived" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "messages" (
  "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "conversationId" TEXT NOT NULL,
  "senderId" TEXT,
  "senderType" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "contentType" TEXT NOT NULL DEFAULT 'TEXT',
  "agentType" TEXT,
  "fileUrl" TEXT,
  "fileName" TEXT,
  "fileSize" INTEGER,
  "fileMimeType" TEXT,
  "metadata" JSONB,
  "editedAt" TIMESTAMP(3),
  "deletedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "announcements" (
  "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "type" TEXT NOT NULL DEFAULT 'NEWS',
  "targetAudience" TEXT NOT NULL DEFAULT 'ALL',
  "sentCount" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Payment Table (create if doesn't exist, then add Stripe fields)
-- ==================================================================

CREATE TABLE IF NOT EXISTS "payments" (
  "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "invoiceId" TEXT NOT NULL,
  "amount" DECIMAL(10,2) NOT NULL,
  "method" TEXT NOT NULL,
  "reference" TEXT,
  "notes" TEXT,
  "paidAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "recordedById" TEXT NOT NULL,
  "stripePaymentIntentId" TEXT UNIQUE,
  "stripeInvoiceId" TEXT,
  CONSTRAINT "payments_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE CASCADE
);

-- If payments table already existed without Stripe fields, add them
ALTER TABLE "payments" ADD COLUMN IF NOT EXISTS "stripePaymentIntentId" TEXT UNIQUE;
ALTER TABLE "payments" ADD COLUMN IF NOT EXISTS "stripeInvoiceId" TEXT;

-- Create Indexes
-- ==================================================================

-- Plan indexes
CREATE INDEX IF NOT EXISTS "plans_serviceType_idx" ON "plans"("serviceType");
CREATE INDEX IF NOT EXISTS "plans_active_idx" ON "plans"("active");
CREATE INDEX IF NOT EXISTS "plans_serviceType_active_idx" ON "plans"("serviceType", "active");

-- Subscription indexes
CREATE INDEX IF NOT EXISTS "subscriptions_userId_idx" ON "subscriptions"("userId");
CREATE INDEX IF NOT EXISTS "subscriptions_planId_idx" ON "subscriptions"("planId");
CREATE INDEX IF NOT EXISTS "subscriptions_stripeCustomerId_idx" ON "subscriptions"("stripeCustomerId");
CREATE INDEX IF NOT EXISTS "subscriptions_stripeSubscriptionId_idx" ON "subscriptions"("stripeSubscriptionId");
CREATE INDEX IF NOT EXISTS "subscriptions_status_idx" ON "subscriptions"("status");
CREATE INDEX IF NOT EXISTS "subscriptions_paymentStatus_idx" ON "subscriptions"("paymentStatus");
CREATE INDEX IF NOT EXISTS "subscriptions_userId_status_idx" ON "subscriptions"("userId", "status");
CREATE INDEX IF NOT EXISTS "subscriptions_status_currentPeriodEnd_idx" ON "subscriptions"("status", "currentPeriodEnd");

-- Agent assignment indexes
CREATE INDEX IF NOT EXISTS "agent_assignments_userId_idx" ON "agent_assignments"("userId");
CREATE INDEX IF NOT EXISTS "agent_assignments_subscriptionId_idx" ON "agent_assignments"("subscriptionId");
CREATE INDEX IF NOT EXISTS "agent_assignments_active_idx" ON "agent_assignments"("active");

-- Usage record indexes
CREATE INDEX IF NOT EXISTS "usage_records_subscriptionId_idx" ON "usage_records"("subscriptionId");
CREATE INDEX IF NOT EXISTS "usage_records_agentAssignmentId_idx" ON "usage_records"("agentAssignmentId");
CREATE INDEX IF NOT EXISTS "usage_records_period_idx" ON "usage_records"("period");

-- AI usage indexes
CREATE INDEX IF NOT EXISTS "ai_usage_userId_idx" ON "ai_usage"("userId");
CREATE INDEX IF NOT EXISTS "ai_usage_subscriptionId_idx" ON "ai_usage"("subscriptionId");
CREATE INDEX IF NOT EXISTS "ai_usage_agentAssignmentId_idx" ON "ai_usage"("agentAssignmentId");
CREATE INDEX IF NOT EXISTS "ai_usage_createdAt_idx" ON "ai_usage"("createdAt");
CREATE INDEX IF NOT EXISTS "ai_usage_userId_createdAt_idx" ON "ai_usage"("userId", "createdAt");
CREATE INDEX IF NOT EXISTS "ai_usage_subscriptionId_createdAt_idx" ON "ai_usage"("subscriptionId", "createdAt");

-- One-time order indexes
CREATE INDEX IF NOT EXISTS "one_time_orders_userId_idx" ON "one_time_orders"("userId");
CREATE INDEX IF NOT EXISTS "one_time_orders_status_idx" ON "one_time_orders"("status");
CREATE INDEX IF NOT EXISTS "one_time_orders_serviceType_idx" ON "one_time_orders"("serviceType");
CREATE INDEX IF NOT EXISTS "one_time_orders_stripePaymentIntentId_idx" ON "one_time_orders"("stripePaymentIntentId");
CREATE INDEX IF NOT EXISTS "one_time_orders_createdAt_idx" ON "one_time_orders"("createdAt");

-- Conversation indexes
CREATE INDEX IF NOT EXISTS "conversations_userId_idx" ON "conversations"("userId");
CREATE INDEX IF NOT EXISTS "conversations_type_idx" ON "conversations"("type");
CREATE INDEX IF NOT EXISTS "conversations_userId_lastMessageAt_idx" ON "conversations"("userId", "lastMessageAt");
CREATE INDEX IF NOT EXISTS "conversations_archived_idx" ON "conversations"("archived");

-- Message indexes
CREATE INDEX IF NOT EXISTS "messages_conversationId_idx" ON "messages"("conversationId");
CREATE INDEX IF NOT EXISTS "messages_senderId_idx" ON "messages"("senderId");
CREATE INDEX IF NOT EXISTS "messages_conversationId_createdAt_idx" ON "messages"("conversationId", "createdAt");
CREATE INDEX IF NOT EXISTS "messages_senderType_idx" ON "messages"("senderType");

-- Announcement indexes
CREATE INDEX IF NOT EXISTS "announcements_createdAt_idx" ON "announcements"("createdAt");
CREATE INDEX IF NOT EXISTS "announcements_type_idx" ON "announcements"("type");

-- Webhook retry index (Phase 2 requirement)
CREATE INDEX IF NOT EXISTS "webhook_events_source_processed_createdAt_idx" ON "webhook_events"("source", "processed", "createdAt");

-- ==================================================================
-- DONE! All missing tables and indexes created.
-- Now run: npx prisma generate
-- ==================================================================
