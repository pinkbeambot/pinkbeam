-- CreateIndex
CREATE INDEX "subscriptions_status_currentPeriodEnd_idx" ON "subscriptions"("status", "currentPeriodEnd");

-- AlterTable: Add Stripe fields to Payment
ALTER TABLE "payments" ADD COLUMN "stripePaymentIntentId" TEXT;
ALTER TABLE "payments" ADD COLUMN "stripeInvoiceId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "payments_stripePaymentIntentId_key" ON "payments"("stripePaymentIntentId");

-- CreateIndex
CREATE INDEX "webhook_events_source_processed_createdAt_idx" ON "webhook_events"("source", "processed", "createdAt");
