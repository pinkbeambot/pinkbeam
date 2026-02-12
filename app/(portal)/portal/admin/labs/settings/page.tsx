import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PageHeader } from '@/components/labs-dashboard/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Save, User, Bell, Palette } from 'lucide-react'

export default async function SettingsPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/sign-in')
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Settings"
        description="Manage your account preferences"
      />

      <div className="space-y-6 max-w-2xl">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-cyan-400" />
              <CardTitle>Profile Information</CardTitle>
            </div>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  placeholder="Your name"
                  defaultValue={user.user_metadata?.name || ''}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  defaultValue={user.email || ''}
                  disabled
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input 
                id="company" 
                placeholder="Your company name"
                defaultValue={user.user_metadata?.company || ''}
              />
            </div>
            <div className="flex justify-end">
              <Button className="bg-cyan-600 hover:bg-cyan-700">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-cyan-400" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>Choose what notifications you receive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive updates about your projects via email
                </p>
              </div>
              <Switch id="email-notifications" defaultChecked />
            </div>
            <div className="border-t" />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="project-updates">Project Updates</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when projects are updated
                </p>
              </div>
              <Switch id="project-updates" defaultChecked />
            </div>
            <div className="border-t" />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="task-reminders">Task Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Receive reminders for upcoming deadlines
                </p>
              </div>
              <Switch id="task-reminders" />
            </div>
            <div className="border-t" />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="billing-alerts">Billing Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified about invoices and payments
                </p>
              </div>
              <Switch id="billing-alerts" defaultChecked />
            </div>
            <div className="flex justify-end">
              <Button className="bg-cyan-600 hover:bg-cyan-700">
                <Save className="w-4 h-4 mr-2" />
                Save Preferences
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-cyan-400" />
              <CardTitle>Appearance</CardTitle>
            </div>
            <CardDescription>Customize your dashboard look</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Theme</Label>
                <p className="text-sm text-muted-foreground">
                  Currently using dark theme
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-medium">
                  Dark
                </span>
                <span className="text-xs">(More options coming soon)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
