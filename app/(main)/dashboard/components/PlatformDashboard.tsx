"use client";

import Link from "next/link";
import { Users, Globe, ArrowRight, Activity, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FadeIn } from "@/components/animations";

interface PlatformDashboardProps {
  data: {
    services: Array<{
      id: string;
      name: string;
      description: string;
      status: "active" | "inactive" | "pending";
      stats: Record<string, string | number>;
    }>;
    recentActivity: Array<{
      id: string;
      service: string;
      action: string;
      time: string;
    }>;
  };
}

const serviceIcons: Record<string, React.ReactNode> = {
  agents: <Users className="w-5 h-5" />,
  web: <Globe className="w-5 h-5" />,
  labs: <Activity className="w-5 h-5" />,
  solutions: <Bell className="w-5 h-5" />,
};

const serviceColors: Record<string, string> = {
  agents: "from-pink-500 to-pink-600",
  web: "from-violet-500 to-violet-600",
  labs: "from-cyan-500 to-cyan-600",
  solutions: "from-amber-500 to-amber-600",
};

export function PlatformDashboard({ data }: PlatformDashboardProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Manage all your Pink Beam services in one place
            </p>
          </div>
          <Button asChild>
            <Link href="/">
              Explore Services
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </FadeIn>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.services.map((service, index) => (
          <FadeIn key={service.id} delay={index * 0.1} direction="up">
            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${serviceColors[service.id]} flex items-center justify-center text-white`}>
                    {serviceIcons[service.id]}
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    service.status === "active" 
                      ? "bg-green-500/10 text-green-500" 
                      : "bg-yellow-500/10 text-yellow-500"
                  }`}>
                    {service.status}
                  </span>
                </div>
                <CardTitle className="mt-4">{service.name}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(service.stats).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-muted-foreground capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  asChild
                >
                  <Link href={`/${service.id}/dashboard`}>
                    Open Dashboard
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </FadeIn>
        ))}

        {/* Add Service Card */}
        <FadeIn delay={data.services.length * 0.1} direction="up">
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
                <Link href="/">
                  Browse Services
                </Link>
              </Button>
            </CardContent>
          </Card>
        </FadeIn>
      </div>

      {/* Recent Activity */}
      <FadeIn direction="up">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates across your services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentActivity.map((activity) => (
                <div 
                  key={activity.id} 
                  className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${serviceColors[activity.service]} flex items-center justify-center text-white shrink-0`}>
                    {serviceIcons[activity.service]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}
