import { AgentsDashboard } from "./components/AgentsDashboard";

// TODO: Fetch actual user data from database (HOME-010)
// For MVP: Using mock data
// In production: Check auth, fetch from Supabase

const mockDashboardData = {
  employees: [
    { id: "sarah", name: "Sarah", role: "Research", status: "active" as const, tasksCompleted: 45 },
    { id: "mike", name: "Mike", role: "Sales", status: "active" as const, tasksCompleted: 32 },
    { id: "alex", name: "Alex", role: "Support", status: "idle" as const, tasksCompleted: 89 },
  ],
  recentActivity: [
    { id: "1", employee: "Sarah", action: "Completed competitor analysis", time: "2 hours ago" },
    { id: "2", employee: "Mike", action: "Sent 15 outreach emails", time: "3 hours ago" },
    { id: "3", employee: "Alex", action: "Resolved 12 support tickets", time: "5 hours ago" },
  ],
  stats: {
    totalTasks: 127,
    hoursSaved: 45,
    activeEmployees: 3,
  },
};

export default function AgentsDashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AgentsDashboard data={mockDashboardData} />
      </div>
    </div>
  );
}
