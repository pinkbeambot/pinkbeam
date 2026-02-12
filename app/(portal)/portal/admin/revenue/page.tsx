import { Breadcrumb } from "@/components/portal/Breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

// Admin: Revenue Portal
// TODO: Implement in PROD-032 (Admin Revenue Dashboard)
export default function RevenuePortalPage() {
  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Revenue" }]} />

      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight">Revenue Portal</h1>
        <p className="text-muted-foreground">Track revenue, subscriptions, and payments</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Revenue Analytics
          </CardTitle>
          <CardDescription>Financial metrics and reporting</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8 text-muted-foreground">
            Coming soon (PROD-032)
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
