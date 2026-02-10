// Dashboard types for type-safe development
// These types define the contract between services and the dashboard system

export interface DashboardService {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name
  color: string;
  status: "active" | "inactive" | "pending";
  dashboardUrl: string;
  // Widget data that the service provides to the dashboard
  widgets?: DashboardWidget[];
}

export interface DashboardWidget {
  id: string;
  type: "stat" | "chart" | "list" | "alert";
  title: string;
  serviceId: string;
  data: unknown;
  lastUpdated: Date;
}

export interface DashboardStat {
  label: string;
  value: string | number;
  change?: {
    value: number;
    direction: "up" | "down" | "neutral";
  };
  icon?: string;
}

export interface DashboardActivity {
  id: string;
  serviceId: string;
  type: "create" | "update" | "delete" | "complete";
  title: string;
  description: string;
  timestamp: Date;
  link?: string;
}

export interface UserDashboardData {
  user: {
    id: string;
    email: string;
    name?: string;
  };
  services: DashboardService[];
  widgets: DashboardWidget[];
  recentActivity: DashboardActivity[];
  notifications: DashboardNotification[];
}

export interface DashboardNotification {
  id: string;
  serviceId: string;
  type: "info" | "warning" | "success" | "error";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}
