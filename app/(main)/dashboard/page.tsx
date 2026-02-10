import { redirect } from "next/navigation";

// Dashboard entry point - redirects based on user services
// HOME-009: Dashboard Foundation
// 
// TODO: Replace with actual user service detection (HOME-010)
// For now, redirect all users to agents dashboard as default
// In production:
// - Check user authentication
// - Query user_services table
// - Single service → redirect to /{service}/dashboard
// - Multiple services → redirect to /dashboard/platform
// - No services → redirect to /?onboarding=true

export default function DashboardPage() {
  // For MVP: redirect to agents dashboard
  // This will be enhanced when HOME-010 (database schema) is complete
  redirect("/agents/dashboard");
}
