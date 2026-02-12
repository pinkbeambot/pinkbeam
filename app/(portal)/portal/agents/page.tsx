import Link from "next/link";
import { redirect } from "next/navigation";
import { Search, Users, Headphones, PenTool, Plus, Activity, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/animations";
import { getUserInfo } from "@/lib/auth/getUserRole";
import { prisma } from "@/lib/prisma";
import { SubscriptionStatus } from "@prisma/client";

async function getUserAgentData(userId: string) {
  // Get user's agent subscriptions
  const subscriptions = await prisma.subscription.findMany({
    where: {
      userId,
      plan: {
        serviceType: 'AGENTS',
      },
    },
    include: {
      plan: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // TODO: When PROD-019 is complete, fetch AgentAssignment records
  // const assignments = await prisma.agentAssignment.findMany({
  //   where: { userId, status: 'ACTIVE' },
  // });

  return {
    subscriptions,
    activeSubscriptions: subscriptions.filter(s => s.status === 'ACTIVE'),
  };
}

const employeeIcons: Record<string, React.ReactNode> = {
  Research: <Search className="w-4 h-4" />,
  Sales: <Users className="w-4 h-4" />,
  Support: <Headphones className="w-4 h-4" />,
  Content: <PenTool className="w-4 h-4" />,
};

export default async function AgentsPortalPage() {
  const userInfo = await getUserInfo();
  if (!userInfo) {
    redirect('/sign-in');
  }

  const { userId } = userInfo;
  const data = await getUserAgentData(userId);

  const hasSubscriptions = data.subscriptions.length > 0;
  const hasActiveSubscriptions = data.activeSubscriptions.length > 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">AI Employees</h1>
            <p className="text-muted-foreground">
              Manage your AI workforce and track performance
            </p>
          </div>
          <Button className="bg-gradient-beam hover:opacity-90" asChild>
            <Link href="/agents">
              <Plus className="w-4 h-4 mr-2" />
              Browse AI Employees
            </Link>
          </Button>
        </div>
      </FadeIn>

      {/* No Subscriptions State */}
      {!hasSubscriptions && (
        <FadeIn delay={0.1}>
          <Card className="border-dashed">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center py-8">
                <div className="w-16 h-16 rounded-full bg-pink-500/10 flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-pink-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No AI Employees Yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Start building your AI workforce today. Choose from 6 specialized AI employees that work 24/7 to grow your business.
                </p>
                <Button asChild className="bg-gradient-beam hover:opacity-90">
                  <Link href="/agents">
                    Explore AI Employees
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      )}

      {/* Active Subscriptions */}
      {hasSubscriptions && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FadeIn delay={0.1}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                  <Activity className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.activeSubscriptions.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {data.activeSubscriptions.length === 1 ? 'AI employee' : 'AI employees'} working for you
                  </p>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={0.2}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
                  <Activity className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Coming Soon</div>
                  <p className="text-xs text-muted-foreground">Task tracking in development</p>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={0.3}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Hours Saved</CardTitle>
                  <Users className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Coming Soon</div>
                  <p className="text-xs text-muted-foreground">Time tracking in development</p>
                </CardContent>
              </Card>
            </FadeIn>
          </div>

          {/* Subscriptions List */}
          <FadeIn direction="up">
            <Card>
              <CardHeader>
                <CardTitle>Your Subscriptions</CardTitle>
                <CardDescription>Manage your AI employee subscriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.subscriptions.map((subscription) => (
                    <div
                      key={subscription.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border"
                    >
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-10 h-10 rounded-lg bg-gradient-beam flex items-center justify-center text-white">
                          <Users className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{subscription.plan.name}</h3>
                            <Badge
                              className={`${
                                subscription.status === 'ACTIVE'
                                  ? 'bg-green-500'
                                  : subscription.status === 'PAST_DUE'
                                  ? 'bg-yellow-500'
                                  : 'bg-gray-500'
                              } text-white`}
                            >
                              {subscription.status === 'ACTIVE' && 'Active'}
                              {subscription.status === 'PAST_DUE' && 'Past Due'}
                              {subscription.status === 'CANCELED' && 'Canceled'}
                              {subscription.status === 'PAUSED' && 'Paused'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {subscription.plan.tier} Plan • {subscription.billingCycle === 'monthly' ? 'Monthly' : 'Annual'} billing
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-3 sm:mt-0">
                        <div className="text-right">
                          <p className="text-lg font-bold">
                            ${(Number(subscription.billingCycle === 'monthly' ? subscription.plan.priceMonthly : subscription.plan.priceAnnual) / 100).toFixed(2)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            per {subscription.billingCycle === 'monthly' ? 'month' : 'year'}
                          </p>
                        </div>
                        <Button size="sm" variant="outline" asChild>
                          <Link href="/portal/billing">Manage</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {!hasActiveSubscriptions && (
                  <div className="flex items-center gap-4 p-4 bg-amber-500/10 rounded-lg border border-amber-500/20 mt-4">
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                    <p className="text-sm text-amber-900 dark:text-amber-100">
                      You have no active AI employee subscriptions. Visit the billing page to reactivate or purchase a new plan.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </FadeIn>

          {/* Coming Soon Notice */}
          <FadeIn direction="up">
            <Card className="border-blue-500/20 bg-blue-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-500" />
                  Task Management Coming Soon
                </CardTitle>
                <CardDescription>
                  We're building the agent task dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Soon you'll be able to assign tasks, track progress, and view detailed activity logs for each AI employee.
                  This feature is currently in development as part of our agent provisioning system (PROD-019).
                </p>
              </CardContent>
            </Card>
          </FadeIn>
        </>
      )}

      {/* Back to Portal */}
      <FadeIn>
        <div className="flex justify-center">
          <Button variant="outline" asChild>
            <Link href="/portal">
              Back to Portal
            </Link>
          </Button>
        </div>
      </FadeIn>
    </div>
  );
}
