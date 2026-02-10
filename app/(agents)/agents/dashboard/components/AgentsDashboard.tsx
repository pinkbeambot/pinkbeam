"use client";

import Link from "next/link";
import { Search, Users, Headphones, PenTool, ArrowRight, Plus, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FadeIn } from "@/components/animations";

interface AgentsDashboardProps {
  data: {
    employees: Array<{
      id: string;
      name: string;
      role: string;
      status: "active" | "idle" | "busy";
      tasksCompleted: number;
    }>;
    recentActivity: Array<{
      id: string;
      employee: string;
      action: string;
      time: string;
    }>;
    stats: {
      totalTasks: number;
      hoursSaved: number;
      activeEmployees: number;
    };
  };
}

const employeeIcons: Record<string, React.ReactNode> = {
  Research: <Search className="w-4 h-4" />,
  Sales: <Users className="w-4 h-4" />,
  Support: <Headphones className="w-4 h-4" />,
  Content: <PenTool className="w-4 h-4" />,
};

const statusColors: Record<string, string> = {
  active: "bg-green-500",
  idle: "bg-yellow-500",
  busy: "bg-blue-500",
};

export function AgentsDashboard({ data }: AgentsDashboardProps) {
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
            <Link href="/agents/employees">
              <Plus className="w-4 h-4 mr-2" />
              Hire Employee
            </Link>
          </Button>
        </div>
      </FadeIn>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FadeIn delay={0.1}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <Activity className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.stats.totalTasks}</div>
              <p className="text-xs text-muted-foreground">+12 from last week</p>
            </CardContent>
          </Card>
        </FadeIn>
        
        <FadeIn delay={0.2}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hours Saved</CardTitle>
              <Activity className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.stats.hoursSaved}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </FadeIn>
        
        <FadeIn delay={0.3}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.stats.activeEmployees}</div>
              <p className="text-xs text-muted-foreground">of 6 available</p>
            </CardContent>
          </Card>
        </FadeIn>
      </div>

      {/* Employees */}
      <FadeIn direction="up">
        <Card>
          <CardHeader>
            <CardTitle>Your Team</CardTitle>
            <CardDescription>Active AI employees working for you</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.employees.map((employee) => (
                <Link
                  key={employee.id}
                  href={`/agents/employees/${employee.id}`}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-beam flex items-center justify-center text-white">
                      {employeeIcons[employee.role] || <Users className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="font-medium">{employee.name}</p>
                      <p className="text-sm text-muted-foreground">{employee.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">{employee.tasksCompleted} tasks</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <span className={`w-2 h-2 rounded-full ${statusColors[employee.status]}`} />
                        {employee.status}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Recent Activity */}
      <FadeIn direction="up">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions from your AI employees</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentActivity.map((activity) => (
                <div 
                  key={activity.id} 
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-500 text-sm font-medium">
                      {activity.employee.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">{activity.employee}</span>
                        {" "}{activity.action}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Back to Platform */}
      <FadeIn>
        <div className="flex justify-center">
          <Button variant="outline" asChild>
            <Link href="/dashboard/platform">
              View All Services
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </FadeIn>
    </div>
  );
}
