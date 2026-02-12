'use client'

import { Settings, Building, Mail, Bell, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FadeIn } from '@/components/animations'

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <FadeIn>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Configure your agency settings</p>
      </FadeIn>

      <FadeIn delay={0.1}>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Agency Information</CardTitle>
                <CardDescription>Your agency details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="agencyName">Agency Name</Label>
                  <Input id="agencyName" defaultValue="Pink Beam" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Contact Email</Label>
                  <Input id="email" type="email" defaultValue="hello@pinkbeam.io" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" defaultValue="+1 (555) 123-4567" />
                </div>
                <Button>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Services & Pricing</CardTitle>
                <CardDescription>Manage your service offerings</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Service management coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure email notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-violet-500" />
                    <div>
                      <p className="font-medium">New Quote Requests</p>
                      <p className="text-sm text-muted-foreground">Email when new quotes come in</p>
                    </div>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-violet-500" />
                    <div>
                      <p className="font-medium">Project Updates</p>
                      <p className="text-sm text-muted-foreground">Email when projects are updated</p>
                    </div>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </div>
                <Button>Save Preferences</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage access and security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <Button>Update Password</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </FadeIn>
    </div>
  )
}
