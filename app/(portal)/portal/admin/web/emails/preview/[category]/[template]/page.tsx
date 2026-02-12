'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Eye,
  Smartphone,
  Monitor,
  Sun,
  Moon,
  Send,
  Copy,
  Check,
  Code,
  Type,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { FadeIn } from '@/components/animations'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

// Test data generators
const testDataGenerators: Record<string, Record<string, () => Record<string, string>>> = {
  quotes: {
    'admin-notification': () => ({
      id: 'quote-123',
      fullName: 'Jane Smith',
      email: 'jane@example.com',
      company: 'TechStart Inc',
      projectType: 'Website Redesign',
      services: 'Design, Development, SEO',
      budgetRange: '$10,000 - $25,000',
      timeline: '2-3 months',
      description: 'Looking to redesign our company website with modern aesthetics and improved performance.',
      leadScore: '85',
      leadQuality: 'hot',
    }),
    'client-auto-response': () => ({
      fullName: 'Jane Smith',
      projectType: 'Website Redesign',
      services: 'Design, Development, SEO',
      budgetRange: '$10,000 - $25,000',
      timeline: '2-3 months',
    }),
    'status-update': () => ({
      fullName: 'Jane Smith',
      status: 'QUALIFIED',
    }),
    'follow-up-day-1': () => ({
      fullName: 'Jane Smith',
      projectType: 'Website Redesign',
    }),
    'follow-up-day-3': () => ({
      fullName: 'Jane Smith',
    }),
    'follow-up-day-7': () => ({
      fullName: 'Jane Smith',
      projectType: 'Website Redesign',
      company: 'TechStart Inc',
    }),
  },
  tickets: {
    'ticket-created': () => ({
      id: 'ticket-456',
      title: 'Website not loading on mobile',
      clientName: 'Bob Johnson',
      priority: 'HIGH',
      category: 'Bug Report',
    }),
    'ticket-admin-notification': () => ({
      id: 'ticket-456',
      clientName: 'Bob Johnson',
      clientEmail: 'bob@example.com',
      title: 'Website not loading on mobile',
      priority: 'HIGH',
      category: 'Bug Report',
    }),
    'ticket-status-update': () => ({
      id: 'ticket-456',
      title: 'Website not loading on mobile',
      clientName: 'Bob Johnson',
      status: 'IN_PROGRESS',
    }),
    'ticket-comment': () => ({
      id: 'ticket-456',
      title: 'Website not loading on mobile',
      clientName: 'Bob Johnson',
      commentBody: 'We\'ve identified the issue and are working on a fix. Should be resolved within 2 hours.',
      authorName: 'Support Team',
    }),
  },
  auth: {
    welcome: () => ({
      fullName: 'John Doe',
      loginUrl: 'https://pinkbeam.ai/login',
    }),
    'onboarding-welcome': () => ({
      fullName: 'John Doe',
      portalUrl: 'https://pinkbeam.ai/portal',
    }),
    'password-reset': () => ({
      fullName: 'John Doe',
      resetUrl: 'https://pinkbeam.ai/reset-password?token=abc123',
      expiresInMinutes: '60',
    }),
    'account-verification': () => ({
      fullName: 'John Doe',
      verificationUrl: 'https://pinkbeam.ai/verify?token=xyz789',
      expiresInMinutes: '1440',
      code: '123456',
    }),
  },
  invoices: {
    'invoice-notification': () => ({
      clientName: 'Alice Williams',
      invoiceNumber: 'INV-2026-001',
      amount: '$5,500.00',
      status: 'due',
      dueDate: '2026-03-15',
      invoiceUrl: 'https://pinkbeam.ai/invoices/INV-2026-001',
    }),
    'invoice-receipt': () => ({
      clientName: 'Alice Williams',
      invoiceNumber: 'INV-2026-001',
      amount: '$5,500.00',
      paymentDate: '2026-02-10',
      invoiceUrl: 'https://pinkbeam.ai/invoices/INV-2026-001',
    }),
  },
  projects: {
    'project-status-update': () => ({
      clientName: 'Charlie Brown',
      projectName: 'E-commerce Platform',
      status: 'in-progress',
      progress: '65',
      dueDate: '2026-04-01',
      milestoneName: 'Design Review',
      milestoneDescription: 'Initial design mockups ready for review',
      projectUrl: 'https://pinkbeam.ai/projects/proj-789',
    }),
    'file-shared': () => ({
      fileName: 'brand-assets-v2.zip',
      fileSize: '15.4 MB',
      fileType: 'application/zip',
      uploadedBy: 'Design Team',
      projectName: 'Brand Refresh',
      downloadUrl: 'https://pinkbeam.ai/files/download/abc123',
      expiresAt: '2026-03-01',
    }),
  },
  meetings: {
    'meeting-reminder': () => ({
      meetingTitle: 'Project Kickoff',
      meetingDate: 'Monday, February 15, 2026',
      meetingTime: '10:00 AM PST',
      meetingDuration: '30 minutes',
      meetingType: 'zoom',
      joinUrl: 'https://zoom.us/j/1234567890',
      agenda: 'Discuss project goals, timeline, and next steps',
    }),
    'meeting-invitation': () => ({
      meetingTitle: 'Design Review',
      meetingDate: 'Wednesday, February 17, 2026',
      meetingTime: '2:00 PM PST',
      senderName: 'Project Manager',
      acceptUrl: 'https://pinkbeam.ai/meetings/accept/123',
      declineUrl: 'https://pinkbeam.ai/meetings/decline/123',
    }),
  },
}

interface PreviewData {
  subject: string
  html: string
  text: string
}

export default function EmailPreviewPage() {
  const params = useParams()
  const router = useRouter()
  const { category, template } = params as { category: string; template: string }
  
  const [previewData, setPreviewData] = useState<PreviewData | null>(null)
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop')
  const [darkMode, setDarkMode] = useState(false)
  const [copied, setCopied] = useState(false)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    async function fetchPreview() {
      try {
        const testData = testDataGenerators[category]?.[template]?.() || {}
        const res = await fetch('/api/test/email/preview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category, template, testData }),
        })
        const data = await res.json()
        if (data.success) {
          setPreviewData(data.data)
        }
      } catch (error) {
        console.error('Failed to fetch preview:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPreview()
  }, [category, template])

  const handleCopyHtml = () => {
    if (previewData?.html) {
      navigator.clipboard.writeText(previewData.html)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleSendTest = async () => {
    setSending(true)
    try {
      const testData = testDataGenerators[category]?.[template]?.() || {}
      await fetch('/api/test/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, template, testData }),
      })
    } catch (error) {
      console.error('Failed to send test email:', error)
    } finally {
      setSending(false)
    }
  }

  const formatTemplateName = (name: string) => {
    return name.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!previewData) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Template not found</p>
        <Button className="mt-4" asChild>
          <Link href="/portal/admin/web/emails">Back to Templates</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/portal/admin/web/emails">
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{formatTemplateName(template)}</h1>
                <Badge variant="secondary">{category}</Badge>
              </div>
              <p className="text-muted-foreground text-sm">
                Subject: {previewData.subject}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyHtml}
            >
              {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              {copied ? 'Copied!' : 'Copy HTML'}
            </Button>
            <Button
              size="sm"
              onClick={handleSendTest}
              disabled={sending}
            >
              <Send className="w-4 h-4 mr-2" />
              {sending ? 'Sending...' : 'Send Test'}
            </Button>
          </div>
        </div>
      </FadeIn>

      {/* Toolbar */}
      <FadeIn delay={0.1}>
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* View Mode Toggle */}
                <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                  <Button
                    variant={viewMode === 'desktop' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('desktop')}
                  >
                    <Monitor className="w-4 h-4 mr-2" />
                    Desktop
                  </Button>
                  <Button
                    variant={viewMode === 'mobile' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('mobile')}
                  >
                    <Smartphone className="w-4 h-4 mr-2" />
                    Mobile
                  </Button>
                </div>

                {/* Dark Mode Toggle */}
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-muted-foreground" />
                  <Switch
                    id="dark-mode"
                    checked={darkMode}
                    onCheckedChange={setDarkMode}
                  />
                  <Moon className="w-4 h-4 text-muted-foreground" />
                  <Label htmlFor="dark-mode" className="sr-only">Dark mode</Label>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Variables:</span>
                <div className="flex gap-1">
                  {Object.keys(testDataGenerators[category]?.[template]?.() || {}).slice(0, 4).map(key => (
                    <code key={key} className="text-xs bg-muted px-1.5 py-0.5 rounded">{key}</code>
                  ))}
                  {Object.keys(testDataGenerators[category]?.[template]?.() || {}).length > 4 && (
                    <span className="text-xs">+{Object.keys(testDataGenerators[category]?.[template]?.() || {}).length - 4}</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Preview */}
      <FadeIn delay={0.2}>
        <Tabs defaultValue="preview">
          <TabsList>
            <TabsTrigger value="preview">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="html">
              <Code className="w-4 h-4 mr-2" />
              HTML
            </TabsTrigger>
            <TabsTrigger value="text">
              <Type className="w-4 h-4 mr-2" />
              Plain Text
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="mt-4">
            <Card className={darkMode ? 'dark' : ''}>
              <CardContent className="p-0 overflow-hidden">
                <div 
                  className="bg-background transition-all duration-300"
                  style={{
                    maxWidth: viewMode === 'mobile' ? '375px' : '100%',
                    margin: '0 auto',
                    minHeight: '400px',
                  }}
                >
                  <iframe
                    srcDoc={previewData.html}
                    style={{
                      width: '100%',
                      height: '600px',
                      border: 'none',
                    }}
                    title="Email Preview"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="html" className="mt-4">
            <Card>
              <CardContent className="p-4">
                <pre className="text-xs overflow-auto max-h-[600px] bg-muted p-4 rounded-lg">
                  <code>{previewData.html}</code>
                </pre>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="text" className="mt-4">
            <Card>
              <CardContent className="p-4">
                <pre className="text-sm whitespace-pre-wrap font-sans bg-muted p-4 rounded-lg">
                  {previewData.text}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </FadeIn>
    </div>
  )
}
