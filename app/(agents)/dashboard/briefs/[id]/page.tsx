'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, ArrowLeft, Share2, Check, Mail } from 'lucide-react'
import Link from 'next/link'

interface Brief {
  id: string
  title: string
  content: {
    executiveSummary?: string[]
    competitorActivity?: string[]
    industryTrends?: string[]
    keyInsights?: string[]
    recommendedActions?: string[]
  }
  sources: string[]
  status: 'draft' | 'sent'
  created_at: string
}

export default function BriefPage() {
  const router = useRouter()
  const params = useParams()
  const briefId = params.id as string
  
  const [brief, setBrief] = useState<Brief | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    const loadBrief = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/sign-in')
        return
      }

      const { data } = await supabase
        .from('briefs')
        .select('*')
        .eq('id', briefId)
        .eq('user_id', user.id)
        .single()

      if (data) {
        setBrief(data)
      }
      setLoading(false)
    }
    
    loadBrief()
  }, [briefId, router])

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!brief) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Brief not found</p>
        <Link href="/dashboard/briefs">
          <Button variant="outline" className="mt-4 gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Briefs
          </Button>
        </Link>
      </div>
    )
  }

  const sections = [
    { title: 'Executive Summary', items: brief.content.executiveSummary },
    { title: 'Competitor Activity', items: brief.content.competitorActivity },
    { title: 'Industry Trends', items: brief.content.industryTrends },
    { title: 'Key Insights', items: brief.content.keyInsights },
    { title: 'Recommended Actions', items: brief.content.recommendedActions },
  ]

  const handleShare = async () => {
    const url = `${window.location.origin}/dashboard/briefs/${brief.id}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSendEmail = async () => {
    setSending(true)
    try {
      const response = await fetch('/api/send-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ briefId: brief.id })
      })
      if (response.ok) {
        setSent(true)
        setBrief(prev => prev ? { ...prev, status: 'sent' } : null)
        setTimeout(() => setSent(false), 3000)
      }
    } catch (error) {
      console.error('Failed to send:', error)
    }
    setSending(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link href="/dashboard/sarah">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Sarah
            </Button>
          </Link>
          <div className="flex gap-2">
            {brief.status === 'draft' && (
              <Button 
                variant="outline" 
                className="gap-2" 
                onClick={handleSendEmail}
                disabled={sending}
              >
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : sent ? <Check className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
                {sent ? 'Sent!' : sending ? 'Sending...' : 'Send Email'}
              </Button>
            )}
            <Button variant="outline" className="gap-2" onClick={handleShare}>
              {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
              {copied ? 'Copied!' : 'Share'}
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold">{brief.title}</h1>
          <Badge variant={brief.status === 'sent' ? 'default' : 'secondary'}>
            {brief.status}
          </Badge>
        </div>
        <p className="text-muted-foreground mb-8">
          Generated on {new Date(brief.created_at).toLocaleDateString()}
        </p>

        <div className="space-y-6">
          {sections.map((section) => (
            section.items && section.items.length > 0 && (
              <Card key={section.title}>
                <CardHeader>
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {section.items.map((item, i) => (
                      <li key={i} className="text-sm leading-relaxed">{item}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          ))}
        </div>

        {brief.sources && brief.sources.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                {brief.sources.map((source, i) => (
                  <li key={i} className="text-sm text-muted-foreground">{source}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}