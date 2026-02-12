import { redirect } from "next/navigation";
import { Breadcrumb } from "@/components/portal/Breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Receipt, AlertCircle, ExternalLink } from "lucide-react";
import { getUserInfo } from "@/lib/auth/getUserRole";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import Link from "next/link";
import { SubscriptionStatus } from "@prisma/client";

async function getUserSubscriptions(userId: string) {
  const subscriptions = await prisma.subscription.findMany({
    where: { userId },
    include: {
      plan: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return subscriptions;
}

const statusColors: Record<SubscriptionStatus, string> = {
  ACTIVE: "bg-green-500",
  PAST_DUE: "bg-yellow-500",
  CANCELED: "bg-gray-500",
  PAUSED: "bg-orange-500",
  TRIALING: "bg-blue-500",
  INCOMPLETE: "bg-red-500",
};

const statusLabels: Record<SubscriptionStatus, string> = {
  ACTIVE: "Active",
  PAST_DUE: "Past Due",
  CANCELED: "Canceled",
  PAUSED: "Paused",
  TRIALING: "Trial",
  INCOMPLETE: "Incomplete",
};

export default async function BillingPortalPage() {
  const userInfo = await getUserInfo();
  if (!userInfo) {
    redirect('/sign-in');
  }

  const { userId } = userInfo;
  const subscriptions = await getUserSubscriptions(userId);

  const activeSubscriptions = subscriptions.filter(s => s.status === 'ACTIVE');
  const totalMonthlySpend = activeSubscriptions.reduce((total, sub) => {
    const monthlyAmount = sub.billingCycle === 'monthly'
      ? Number(sub.plan.priceMonthly)
      : Number(sub.plan.priceAnnual) / 12;
    return total + monthlyAmount;
  }, 0);

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Billing" }]} />

      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight">Billing</h1>
        <p className="text-muted-foreground">
          Manage your subscription, payment methods, and invoices
        </p>
      </div>

      {/* Monthly Spend Summary */}
      {activeSubscriptions.length > 0 && (
        <Card className="border-pink-500/20 bg-pink-500/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Spend</p>
                <p className="text-3xl font-bold">${(totalMonthlySpend / 100).toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">{activeSubscriptions.length} active subscription{activeSubscriptions.length !== 1 ? 's' : ''}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Next billing: {format(new Date(activeSubscriptions[0].currentPeriodEnd), 'MMM d, yyyy')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Subscriptions */}
      <Card>
        <CardHeader>
          <CardTitle>Subscriptions</CardTitle>
          <CardDescription>Your active Pink Beam subscriptions</CardDescription>
        </CardHeader>
        <CardContent>
          {subscriptions.length === 0 ? (
            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">No active subscriptions</p>
                <p className="text-xs text-muted-foreground">
                  Visit service pages to purchase plans.
                </p>
              </div>
              <Button size="sm" className="ml-auto" asChild>
                <Link href="/">Browse Services</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {subscriptions.map((subscription) => (
                <div
                  key={subscription.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{subscription.plan.name}</h3>
                      <Badge className={`${statusColors[subscription.status]} text-white`}>
                        {statusLabels[subscription.status]}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {subscription.plan.serviceType} • {subscription.plan.tier}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {subscription.status === 'ACTIVE' && (
                        <>
                          Renews {format(new Date(subscription.currentPeriodEnd), 'MMM d, yyyy')}
                        </>
                      )}
                      {subscription.status === 'CANCELED' && subscription.canceledAt && (
                        <>
                          Canceled {format(new Date(subscription.canceledAt), 'MMM d, yyyy')}
                        </>
                      )}
                      {subscription.status === 'PAST_DUE' && (
                        <>
                          Payment failed • Grace period until {format(new Date(subscription.gracePeriodEnds || subscription.currentPeriodEnd), 'MMM d, yyyy')}
                        </>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-bold">
                        ${(Number(subscription.billingCycle === 'monthly' ? subscription.plan.priceMonthly : subscription.plan.priceAnnual) / 100).toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        per {subscription.billingCycle === 'monthly' ? 'month' : 'year'}
                      </p>
                    </div>
                    {subscription.status === 'ACTIVE' && (
                      <Button size="sm" variant="outline">
                        Manage
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your payment methods via Stripe</CardDescription>
            </div>
            {subscriptions.length > 0 && subscriptions[0].stripeCustomerId && (
              <Button size="sm" variant="outline" asChild>
                <a href={`https://billing.stripe.com/p/login/test_${subscriptions[0].stripeCustomerId}`} target="_blank" rel="noopener noreferrer">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Manage in Stripe
                  <ExternalLink className="w-3 h-3 ml-2" />
                </a>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
            <AlertCircle className="w-5 h-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Payment methods are managed through Stripe's secure portal. Click "Manage in Stripe" above to update your payment information.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Invoices */}
      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
          <CardDescription>View and download past invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
            <Receipt className="w-5 h-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {subscriptions.length === 0
                ? "No invoices yet. Invoices will appear here after your first payment."
                : "Invoice history is available in your Stripe customer portal. Click 'Manage in Stripe' above to view invoices."}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
