'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Mail,
  Search,
  Eye,
  Send,
  Settings,
  ChevronRight,
  Layout,
  Users,
  FileText,
  CreditCard,
  FolderKanban,
  Calendar,
  Upload,
  Shield,
  Key,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { FadeIn } from '@/components/animations'

interface TemplateCategory {
  id: string
  name: string
  icon: React.ElementType
  description: string
  templates: EmailTemplate[]
}

interface EmailTemplate {
  id: string
  name: string
  description: string
  category: string
  variables: string[]
  lastUpdated: string
}

const templateCategories: TemplateCategory[] = [
  {
    id: 'quotes',
    name: 'Quote Requests',
    icon: FileText,
    description: 'Templates for quote submissions and follow-ups',
    templates: [
      { id: 'admin-notification', name: 'Admin Notification', description: 'Notifies admins of new quote submissions', category: 'quotes', variables: ['fullName', 'email', 'company', 'projectType', 'services', 'budgetRange', 'timeline', 'description'], lastUpdated: '2026-02-10' },
      { id: 'client-auto-response', name: 'Client Auto-Response', description: 'Automatic confirmation to quote submitters', category: 'quotes', variables: ['fullName', 'projectType', 'services', 'budgetRange', 'timeline'], lastUpdated: '2026-02-10' },
      { id: 'status-update', name: 'Status Update', description: 'Notifies clients of quote status changes', category: 'quotes', variables: ['fullName', 'status'], lastUpdated: '2026-02-10' },
      { id: 'follow-up-day-1', name: 'Follow-up Day 1', description: 'Personal follow-up 1 day after submission', category: 'quotes', variables: ['fullName', 'projectType'], lastUpdated: '2026-02-10' },
      { id: 'follow-up-day-3', name: 'Follow-up Day 3', description: 'Value-add content 3 days after submission', category: 'quotes', variables: ['fullName'], lastUpdated: '2026-02-10' },
      { id: 'follow-up-day-7', name: 'Follow-up Day 7', description: 'Final check-in 7 days after submission', category: 'quotes', variables: ['fullName', 'projectType', 'company'], lastUpdated: '2026-02-10' },
    ],
  },
  {
    id: 'tickets',
    name: 'Support Tickets',
    icon: Mail,
    description: 'Templates for support ticket notifications',
    templates: [
      { id: 'ticket-created', name: 'Ticket Created', description: 'Confirmation when client creates a ticket', category: 'tickets', variables: ['clientName', 'title', 'priority', 'category'], lastUpdated: '2026-02-10' },
      { id: 'ticket-admin-notification', name: 'Admin Notification', description: 'Notifies admins of new tickets', category: 'tickets', variables: ['clientName', 'clientEmail', 'title', 'priority', 'category'], lastUpdated: '2026-02-10' },
      { id: 'ticket-status-update', name: 'Status Update', description: 'Notifies clients of ticket status changes', category: 'tickets', variables: ['clientName', 'title', 'status'], lastUpdated: '2026-02-10' },
      { id: 'ticket-comment', name: 'New Comment', description: 'Notifies clients of new comments on their ticket', category: 'tickets', variables: ['clientName', 'title', 'commentBody', 'authorName'], lastUpdated: '2026-02-10' },
    ],
  },
  {
    id: 'auth',
    name: 'Authentication',
    icon: Shield,
    description: 'User authentication and account emails',
    templates: [
      { id: 'welcome', name: 'Welcome Email', description: 'Sent to new users after signup', category: 'auth', variables: ['fullName', 'loginUrl'], lastUpdated: '2026-02-10' },
      { id: 'onboarding-welcome', name: 'Onboarding Welcome', description: 'Portal welcome for new clients', category: 'auth', variables: ['fullName', 'portalUrl'], lastUpdated: '2026-02-10' },
      { id: 'password-reset', name: 'Password Reset', description: 'Password reset instructions', category: 'auth', variables: ['fullName', 'resetUrl', 'expiresInMinutes'], lastUpdated: '2026-02-10' },
      { id: 'account-verification', name: 'Account Verification', description: 'Email verification for new accounts', category: 'auth', variables: ['fullName', 'verificationUrl', 'expiresInMinutes', 'code'], lastUpdated: '2026-02-10' },
    ],
  },
  {
    id: 'invoices',
    name: 'Invoices & Payments',
    icon: CreditCard,
    description: 'Billing and payment related emails',
    templates: [
      { id: 'invoice-notification', name: 'Invoice Notification', description: 'Notifies clients of new or due invoices', category: 'invoices', variables: ['clientName', 'invoiceNumber', 'amount', 'status', 'dueDate', 'invoiceUrl'], lastUpdated: '2026-02-10' },
      { id: 'invoice-receipt', name: 'Payment Receipt', description: 'Confirms payment received', category: 'invoices', variables: ['clientName', 'invoiceNumber', 'amount', 'paymentDate', 'invoiceUrl'], lastUpdated: '2026-02-10' },
    ],
  },
  {
    id: 'projects',
    name: 'Projects',
    icon: FolderKanban,
    description: 'Project update and management emails',
    templates: [
      { id: 'project-status-update', name: 'Status Update', description: 'Notifies clients of project status changes', category: 'projects', variables: ['clientName', 'projectName', 'status', 'progress', 'dueDate', 'milestoneName'], lastUpdated: '2026-02-10' },
      { id: 'file-shared', name: 'File Shared', description: 'Notifies when files are shared', category: 'projects', variables: ['fileName', 'fileSize', 'uploadedBy', 'downloadUrl', 'projectName'], lastUpdated: '2026-02-10' },
    ],
  },
  {
    id: 'meetings',
    name: 'Meetings',
    icon: Calendar,
    description: 'Meeting reminders and invitations',
    templates: [
      { id: 'meeting-reminder', name: 'Meeting Reminder', description: 'Reminds attendees of upcoming meetings', category: 'meetings', variables: ['meetingTitle', 'meetingDate', 'meetingTime', 'meetingDuration', 'joinUrl', 'agenda'], lastUpdated: '2026-02-10' },
      { id: 'meeting-invitation', name: 'Meeting Invitation', description: 'Invites attendees to a meeting', category: 'meetings', variables: ['meetingTitle', 'meetingDate', 'meetingTime', 'senderName', 'acceptUrl', 'declineUrl'], lastUpdated: '2026-02-10' },
    ],
  },
]

function getVariableColor(variable: string): string {
  const colors: Record<string, string> = {
    fullName: 'bg-blue-500/10 text-blue-500',
    email: 'bg-green-500/10 text-green-500',
    clientName: 'bg-purple-500/10 text-purple-500',
    status: 'bg-amber-500/10 text-amber-500',
    amount: 'bg-emerald-500/10 text-emerald-500',
    url: 'bg-violet-500/10 text-violet-500',
  }
  return colors[variable] || 'bg-gray-500/10 text-gray-500'
}

export default function EmailsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const router = useRouter()

  const filteredCategories = templateCategories
    .map(category => ({
      ...category,
      templates: category.templates.filter(template =>
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter(category => 
      (selectedCategory === null || category.id === selectedCategory) &&
      (searchQuery === '' || category.templates.length > 0)
    )

  const allTemplates = templateCategories.flatMap(c => c.templates)
  const totalTemplates = allTemplates.length

  return (
    <div className="space-y-8">
      {/* Header */}
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Email Templates</h1>
            <p className="text-muted-foreground mt-1">
              Manage and preview email templates
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/web/admin/settings">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Link>
            </Button>
            <Button asChild>
              <Link href="/web/admin/emails/preview/welcome">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Link>
            </Button>
          </div>
        </div>
      </FadeIn>

      {/* Stats */}
      <FadeIn delay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Templates</p>
                  <p className="text-3xl font-bold mt-2">{totalTemplates}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-violet-500/10 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-violet-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Categories</p>
                  <p className="text-3xl font-bold mt-2">{templateCategories.length}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Layout className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                  <p className="text-3xl font-bold mt-2">Today</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Send className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </FadeIn>

      {/* Search and Filter */}
      <FadeIn delay={0.2}>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedCategory === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              All
            </Button>
            {templateCategories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
              >
                <category.icon className="w-4 h-4 mr-2" />
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Template Categories */}
      <FadeIn delay={0.3}>
        <div className="space-y-6">
          {filteredCategories.map((category) => (
            <Card key={category.id}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                    <category.icon className="w-5 h-5 text-violet-500" />
                  </div>
                  <div>
                    <CardTitle>{category.name}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="divide-y">
                  {category.templates.map((template) => (
                    <div
                      key={template.id}
                      className="py-4 first:pt-0 last:pb-0 flex items-center justify-between group"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{template.name}</p>
                          <Badge variant="outline" className="text-xs">
                            {template.variables.length} vars
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {template.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {template.variables.slice(0, 5).map(variable => (
                            <Badge
                              key={variable}
                              variant="secondary"
                              className={`text-xs ${getVariableColor(variable)}`}
                            >
                              {variable}
                            </Badge>
                          ))}
                          {template.variables.length > 5 && (
                            <Badge variant="secondary" className="text-xs">
                              +{template.variables.length - 5}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                        >
                          <Link href={`/web/admin/emails/preview/${template.category}/${template.id}`}>
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </FadeIn>

      {filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No templates found</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSearchQuery('')
              setSelectedCategory(null)
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  )
}
