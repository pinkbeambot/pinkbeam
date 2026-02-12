import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Users,
  Globe,
  Code,
  Lightbulb,
  ArrowRight,
  Activity,
  UserCog,
  FolderKanban,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserInfo } from "@/lib/auth/getUserRole";
import { prisma } from "@/lib/prisma";

interface ServiceCard {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  href: string;
  stats: Record<string, string | number>;
}

async function getPortalStats(userId: string, isAdmin: boolean) {
  if (isAdmin) {
    // Admin stats
    const [
      totalClients,
      activeClients,
      totalProjects,
      activeProjects,
      subscriptions,
    ] = await Promise.all([
      prisma.user.count({ where: { role: { in: ['CLIENT', 'MANAGER'] } } }),
      prisma.user.count({
        where: {
          role: { in: ['CLIENT', 'MANAGER'] },
          subscriptions: { some: { status: 'ACTIVE' } }
        }
      }),
      prisma.project.count(),
      prisma.project.count({ where: { status: { in: ['IN_PROGRESS', 'REVIEW'] } } }),
      prisma.subscription.findMany({
        where: { status: 'ACTIVE' },
        include: { plan: true }
      }),
    ]);

    // Calculate MRR from active subscriptions
    const mrr = subscriptions.reduce((total, sub) => {
      const monthlyPrice = sub.billingCycle === 'monthly'
        ? Number(sub.plan.priceMonthly)
        : Number(sub.plan.priceAnnual) / 12;
      return total + monthlyPrice;
    }, 0);

    return {
      totalClients,
      activeClients,
      totalProjects,
      activeProjects,
      overdueProjects: 0, // TODO: Calculate based on deadline
      mrr: Math.round(mrr / 100), // Convert cents to dollars
    };
  } else {
    // Client stats
    const [agentSubs, totalProjects, activeProjects] = await Promise.all([
      prisma.subscription.count({
        where: {
          userId,
          status: 'ACTIVE',
          plan: { serviceType: 'AGENTS' }
        }
      }),
      prisma.project.count({
        where: {
          clientId: userId,
        }
      }),
      prisma.project.count({
        where: {
          clientId: userId,
          status: { in: ['IN_PROGRESS', 'REVIEW'] }
        }
      }),
    ]);

    return {
      agentSubs,
      totalProjects,
      activeProjects,
    };
  }
}

export default async function PortalPage() {
  const userInfo = await getUserInfo();
  if (!userInfo) {
    redirect('/sign-in');
  }

  const { userId, role } = userInfo;
  const isAdmin = role === 'ADMIN';
  const isClient = role === 'CLIENT';

  const stats = await getPortalStats(userId, isAdmin);

  const clientServices: ServiceCard[] = [
    {
      id: "agents",
      name: "AI Employees",
      description: "Manage your AI workforce",
      icon: Users,
      color: "from-pink-500 to-pink-600",
      href: "/portal/agents",
      stats: {
        "Active Subscriptions": stats.agentSubs ?? 0,
        "Status": (stats.agentSubs ?? 0) > 0 ? `${stats.agentSubs} active` : "No subscriptions",
      },
    },
    {
      id: "projects",
      name: "All Projects",
      description: "Track all your projects",
      icon: FolderKanban,
      color: "from-violet-500 to-violet-600",
      href: "/portal/projects",
      stats: {
        "Total Projects": stats.totalProjects ?? 0,
        "Active": (stats.activeProjects ?? 0) > 0 ? `${stats.activeProjects} active` : "No active projects",
      },
    },
    {
      id: "billing",
      name: "Billing",
      description: "Manage subscriptions & invoices",
      icon: DollarSign,
      color: "from-emerald-500 to-emerald-600",
      href: "/portal/billing",
      stats: {
        "Subscriptions": stats.agentSubs ?? 0,
        "Status": (stats.agentSubs ?? 0) > 0 ? "Active" : "No subscriptions",
      },
    },
    {
      id: "support",
      name: "Support",
      description: "Get help from our team",
      icon: Activity,
      color: "from-cyan-500 to-cyan-600",
      href: "/portal/support",
      stats: {
        "Open Tickets": 0,
        "Status": "All resolved",
      },
    },
  ];

  const adminCards: ServiceCard[] = [
    {
      id: "clients",
      name: "All Clients",
      description: "Manage client accounts",
      icon: UserCog,
      color: "from-slate-500 to-slate-600",
      href: "/portal/admin/clients",
      stats: {
        "Total Clients": stats.totalClients || 0,
        "Active": stats.activeClients || 0,
      },
    },
    {
      id: "projects",
      name: "All Projects",
      description: "Track all active projects",
      icon: FolderKanban,
      color: "from-blue-500 to-blue-600",
      href: "/portal/admin/projects",
      stats: {
        "Total Projects": stats.totalProjects || 0,
        "Active": stats.activeProjects || 0,
      },
    },
    {
      id: "revenue",
      name: "Revenue",
      description: "Financial metrics",
      icon: DollarSign,
      color: "from-emerald-500 to-emerald-600",
      href: "/portal/admin/revenue",
      stats: {
        "MRR": `$${stats.mrr || 0}`,
        "Growth": "N/A",
      },
    },
  ];

  const services = isAdmin ? adminCards : clientServices;
  const title = isAdmin ? "Admin Portal" : "Welcome to Pink Beam Portal";
  const subtitle = isAdmin
    ? "Manage clients, projects, and business metrics"
    : "Manage all your Pink Beam services in one place";

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>
        {!isAdmin && (
          <Button asChild>
            <Link href="/">
              Explore Services
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div
                  className={`w-10 h-10 rounded-lg bg-gradient-to-br ${service.color} flex items-center justify-center text-white`}
                >
                  <service.icon className="w-5 h-5" />
                </div>
              </div>
              <CardTitle className="mt-4">{service.name}</CardTitle>
              <CardDescription>{service.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(service.stats).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{key}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                asChild
              >
                <Link href={service.href}>
                  Open
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}

        {isClient && (
          <Card className="border-dashed hover:border-solid hover:border-primary/50 transition-colors">
            <CardHeader className="text-center">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mx-auto">
                <span className="text-xl">+</span>
              </div>
              <CardTitle className="mt-4">Add Service</CardTitle>
              <CardDescription>Discover more Pink Beam services</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/">Browse Services</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isAdmin ? "Quick Actions" : "Getting Started"}</CardTitle>
          <CardDescription>
            {isAdmin
              ? "Common admin tasks and shortcuts"
              : "New to Pink Beam? Here's how to get the most out of your services."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isAdmin ? (
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Review revenue metrics</p>
                  <p className="text-sm text-muted-foreground">
                    Check monthly recurring revenue and growth trends
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <FolderKanban className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Track project deadlines</p>
                  <p className="text-sm text-muted-foreground">
                    View upcoming milestones and overdue items
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <UserCog className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Manage client accounts</p>
                  <p className="text-sm text-muted-foreground">
                    View client subscriptions and service status
                  </p>
                </div>
              </li>
            </ul>
          ) : (
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Activity className="w-5 h-5 text-pink-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Hire your first AI employee</p>
                  <p className="text-sm text-muted-foreground">
                    Visit the AI Employees section to choose and activate your first AI worker.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Activity className="w-5 h-5 text-violet-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Launch your website</p>
                  <p className="text-sm text-muted-foreground">
                    Submit a project request to get your website built.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Activity className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Build custom software</p>
                  <p className="text-sm text-muted-foreground">
                    Start a Labs project to build web apps, APIs, or AI integrations.
                  </p>
                </div>
              </li>
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
