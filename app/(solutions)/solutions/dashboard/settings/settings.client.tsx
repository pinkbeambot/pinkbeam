'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  ArrowLeft,
  User as UserIcon,
  Building2,
  Bell,
  Palette,
  Save,
  Loader2,
  Moon,
  Sun,
  Monitor,
  Mail,
  MessageSquare,
  Calendar
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { FadeIn } from '@/components/animations'
import { useTheme } from 'next-themes'
import type { User } from '@supabase/supabase-js'

interface SettingsViewProps {
  user: User
  profile: any
}

export default function SettingsView({ user, profile }: SettingsViewProps) {
  const { theme, setTheme } = useTheme()
  const [saving, setSaving] = useState(false)
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    fullName: profile?.full_name || '',
    email: user.email || '',
    phone: profile?.phone || '',
    jobTitle: profile?.job_title || '',
  })
  
  // Company form state
  const [companyData, setCompanyData] = useState({
    companyName: profile?.company_name || '',
    website: profile?.website || '',
    industry: profile?.industry || '',
    companySize: profile?.company_size || '',
    address: profile?.address || '',
  })
  
  // Notification preferences state
  const [notifications, setNotifications] = useState({
    emailDeliverables: true,
    emailMeetings: true,
    emailUpdates: true,
    emailMarketing: false,
    browserNotifications: true,
  })

  const handleSaveProfile = async () => {
    setSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
  }

  const handleSaveCompany = async () => {
    setSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeIn>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/solutions/dashboard">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your profile and preferences</p>
          </div>
        </div>
      </FadeIn>

      {/* Tabs */}
      <FadeIn delay={0.1}>
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="profile">
              <UserIconclassName="w-4 h-4 mr-2 hidden sm:inline" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="company">
              <Building2 className="w-4 h-4 mr-2 hidden sm:inline" />
              Company
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="w-4 h-4 mr-2 hidden sm:inline" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="appearance">
              <Palette className="w-4 h-4 mr-2 hidden sm:inline" />
              Appearance
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <UserIconclassName="w-8 h-8 text-amber-500" />
                  </div>
                  <div>
                    <Button variant="outline" size="sm">Change Avatar</Button>
                    <p className="text-xs text-muted-foreground mt-2">JPG, PNG or GIF. Max 2MB.</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input 
                      id="fullName" 
                      value={profileData.fullName}
                      onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email"
                      value={profileData.email}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">Contact support to change your email</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input 
                      id="jobTitle" 
                      value={profileData.jobTitle}
                      onChange={(e) => setProfileData({...profileData, jobTitle: e.target.value})}
                      placeholder="e.g. Chief Technology Officer"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleSaveProfile} disabled={saving} className="bg-amber-500 hover:bg-amber-600">
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Company Tab */}
          <TabsContent value="company" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Details</CardTitle>
                <CardDescription>Information about your organization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input 
                      id="companyName" 
                      value={companyData.companyName}
                      onChange={(e) => setCompanyData({...companyData, companyName: e.target.value})}
                      placeholder="Enter company name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input 
                      id="website" 
                      type="url"
                      value={companyData.website}
                      onChange={(e) => setCompanyData({...companyData, website: e.target.value})}
                      placeholder="https://example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Input 
                      id="industry" 
                      value={companyData.industry}
                      onChange={(e) => setCompanyData({...companyData, industry: e.target.value})}
                      placeholder="e.g. Technology, Healthcare, Finance"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companySize">Company Size</Label>
                    <Input 
                      id="companySize" 
                      value={companyData.companySize}
                      onChange={(e) => setCompanyData({...companyData, companySize: e.target.value})}
                      placeholder="e.g. 50-200 employees"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input 
                    id="address" 
                    value={companyData.address}
                    onChange={(e) => setCompanyData({...companyData, address: e.target.value})}
                    placeholder="Enter company address"
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleSaveCompany} disabled={saving} className="bg-amber-500 hover:bg-amber-600">
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>Choose what emails you want to receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-amber-500" />
                      </div>
                      <div>
                        <p className="font-medium">New Deliverables</p>
                        <p className="text-sm text-muted-foreground">Get notified when new files are uploaded</p>
                      </div>
                    </div>
                    <Switch 
                      checked={notifications.emailDeliverables}
                      onCheckedChange={(checked) => setNotifications({...notifications, emailDeliverables: checked})}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-violet-500" />
                      </div>
                      <div>
                        <p className="font-medium">Meeting Reminders</p>
                        <p className="text-sm text-muted-foreground">Receive reminders before scheduled calls</p>
                      </div>
                    </div>
                    <Switch 
                      checked={notifications.emailMeetings}
                      onCheckedChange={(checked) => setNotifications({...notifications, emailMeetings: checked})}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <p className="font-medium">Project Updates</p>
                        <p className="text-sm text-muted-foreground">Updates on milestones and progress</p>
                      </div>
                    </div>
                    <Switch 
                      checked={notifications.emailUpdates}
                      onCheckedChange={(checked) => setNotifications({...notifications, emailUpdates: checked})}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        <Mail className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">Marketing & Newsletters</p>
                        <p className="text-sm text-muted-foreground">Tips, insights, and company news</p>
                      </div>
                    </div>
                    <Switch 
                      checked={notifications.emailMarketing}
                      onCheckedChange={(checked) => setNotifications({...notifications, emailMarketing: checked})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Browser Notifications</CardTitle>
                <CardDescription>Push notifications in your browser</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <Bell className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="font-medium">Enable Browser Notifications</p>
                      <p className="text-sm text-muted-foreground">Get notified even when not on the site</p>
                    </div>
                  </div>
                  <Switch 
                    checked={notifications.browserNotifications}
                    onCheckedChange={(checked) => setNotifications({...notifications, browserNotifications: checked})}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Theme</CardTitle>
                <CardDescription>Choose your preferred color scheme</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    onClick={() => setTheme('light')}
                    className={`p-4 rounded-lg border text-center transition-colors ${
                      theme === 'light' 
                        ? 'border-amber-500 bg-amber-500/10' 
                        : 'border-border hover:border-amber-500/30'
                    }`}
                  >
                    <Sun className="w-8 h-8 mx-auto mb-2 text-amber-500" />
                    <p className="font-medium text-sm">Light</p>
                  </button>
                  
                  <button
                    onClick={() => setTheme('dark')}
                    className={`p-4 rounded-lg border text-center transition-colors ${
                      theme === 'dark' 
                        ? 'border-amber-500 bg-amber-500/10' 
                        : 'border-border hover:border-amber-500/30'
                    }`}
                  >
                    <Moon className="w-8 h-8 mx-auto mb-2 text-violet-500" />
                    <p className="font-medium text-sm">Dark</p>
                  </button>
                  
                  <button
                    onClick={() => setTheme('system')}
                    className={`p-4 rounded-lg border text-center transition-colors ${
                      theme === 'system' 
                        ? 'border-amber-500 bg-amber-500/10' 
                        : 'border-border hover:border-amber-500/30'
                    }`}
                  >
                    <Monitor className="w-8 h-8 mx-auto mb-2 text-amber-500" />
                    <p className="font-medium text-sm">System</p>
                  </button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Accent Color</CardTitle>
                <CardDescription>Coming soon - customize your dashboard accent color</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-500 ring-2 ring-offset-2 ring-amber-500" />
                  <span className="text-sm text-muted-foreground">Cyan (Default)</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </FadeIn>
    </div>
  )
}
