import { PlatformDashboard } from "@/app/(main)/dashboard/components/PlatformDashboard";

// TODO: Replace with actual data fetching from database (HOME-010)
// For MVP: Using mock data
// In production:
// - Check authentication
// - Fetch user services from database
// - Aggregate data from all services

const mockDashboardData = {
  services: [
    {
      id: "agents" as const,
      name: "AI Employees",
      description: "Manage your AI workforce",
      status: "active" as const,
      stats: {
        "Active Employees": "3",
        "Tasks Completed": "127",
        "Hours Saved": "45",
      },
    },
    {
      id: "web" as const,
      name: "Web Services",
      description: "Website & SEO management",
      status: "active" as const,
      stats: {
        "Sites": "1",
        "Uptime": "99.9%",
        "Last Update": "2 days ago",
      },
    },
  ],
  recentActivity: [
    {
      id: "1",
      service: "agents" as const,
      action: "Sarah completed competitor analysis",
      time: "2 hours ago",
    },
    {
      id: "2",
      service: "web" as const,
      action: "Website performance optimization completed",
      time: "1 day ago",
    },
  ],
};

export default function PlatformDashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PlatformDashboard data={mockDashboardData as any} />
      </div>
    </div>
  );
}
