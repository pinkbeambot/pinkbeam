import { Breadcrumb } from "@/components/portal/Breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Lock, Bell } from "lucide-react";

// Settings Portal
// TODO: Connect to user data from Supabase (PROD-002)
export default function SettingsPortalPage() {
  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Settings" }]} />

      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile
          </CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="John Doe" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="john@example.com" disabled />
            <p className="text-xs text-muted-foreground">
              Email cannot be changed. Contact support to update.
            </p>
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      {/* Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Password
          </CardTitle>
          <CardDescription>Change your password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input id="current-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input id="new-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input id="confirm-password" type="password" />
          </div>
          <Button>Update Password</Button>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
          <CardDescription>Manage your notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-muted-foreground">
                Receive updates about your services via email
              </p>
            </div>
            <Button variant="outline" size="sm">
              Configure
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Weekly Summary</p>
              <p className="text-sm text-muted-foreground">
                Get a weekly digest of your activity
              </p>
            </div>
            <Button variant="outline" size="sm">
              Configure
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
