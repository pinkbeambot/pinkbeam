import { PlatformDashboard } from "./components/PlatformDashboard";

// TODO: Replace with actual data fetching from database (HOME-010)
// For MVP: Using mock data
// In production:
// - Check authentication
// - Fetch user services from database
// - Aggregate data from all services

interface DashboardService {
  id: string;
  name: string;
  description: string;
  status: "active" | "inactive" | "pending";
  stats: Record<string, string | number>;
}

interface DashboardActivity {
  id: string;
  service: string;
  action: string;
  time: string;
}

interface DashboardData {
  services: DashboardService[];
  recentActivity: DashboardActivity[];
}

const mockDashboardData: DashboardData = {
  services: [
    {
      id: "agents",
      name: "AI Employees",
      description: "Manage your AI workforce",
      status: "active",
      stats: {
        "Active Employees": "3",
        "Tasks Completed": "127",
        "Hours Saved": "45",
      },
    },
    {
      id: "web",
      name: "Web Services",
      description: "Website & SEO management",
      status: "active",
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
      service: "agents",
      action: "Sarah completed competitor analysis",
      time: "2 hours ago",
    },
    {
      id: "2",
      service: "web",
      action: "Website performance optimization completed",
      time: "1 day ago",
    },
  ],
};

export default function PlatformPortalPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PlatformDashboard data={mockDashboardData} />
      </div>
    </div>
  );
}
