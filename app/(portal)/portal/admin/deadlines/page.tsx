import { Breadcrumb } from "@/components/portal/Breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

// Admin: Deadlines & Schedule
// TODO: Implement in PROD-031 (Admin Project & Deadlines)
export default function DeadlinesPage() {
  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Deadlines" }]} />

      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight">Deadlines & Schedule</h1>
        <p className="text-muted-foreground">Track project deadlines and milestones</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Project Timeline
          </CardTitle>
          <CardDescription>Upcoming deadlines and milestones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8 text-muted-foreground">
            Coming soon (PROD-031)
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
