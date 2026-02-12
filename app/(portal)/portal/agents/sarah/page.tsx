'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Plus, X, Globe, FileText } from 'lucide-react'
import Link from 'next/link'

interface SarahConfig {
  id: string
  competitors: string[]
  focus_topics: string[]
  schedule_day: number
  schedule_hour: number
}

interface ResearchSource {
  id: string
  url: string
  name: string
  type: 'competitor' | 'industry' | 'news'
  active: boolean
}

interface Brief {
  id: string
  title: string
  created_at: string
  status: 'draft' | 'sent'
}

export default function SarahPortalPage() {
  const router = useRouter()
  const [config, setConfig] = useState<SarahConfig | null>(null)
  const [sources, setSources] = useState<ResearchSource[]>([])
  const [briefs, setBriefs] = useState<Brief[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [newCompetitor, setNewCompetitor] = useState('')
  const [newTopic, setNewTopic] = useState('')
  const [newSourceUrl, setNewSourceUrl] = useState('')
  const [newSourceName, setNewSourceName] = useState('')

  useEffect(() => {
    const loadData = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/sign-in')
      return
    }

    // Load config
    const { data: configData } = await supabase
      .from('sarah_configs')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (configData) {
      setConfig(configData)
    } else {
      // Create default config
      const { data: newConfig } = await supabase
        .from('sarah_configs')
        .insert({ user_id: user.id })
        .select()
        .single()
      setConfig(newConfig)
    }

    // Load sources
    const { data: sourcesData } = await supabase
      .from('research_sources')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setSources(sourcesData || [])

    // Load briefs
    const { data: briefsData } = await supabase
      .from('briefs')
      .select('id, title, created_at, status')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5)
    setBriefs(briefsData || [])

    setLoading(false)
    }
    loadData()
  }, [router])

  const addCompetitor = async () => {
    if (!newCompetitor.trim() || !config) return
    const supabase = createClient()
    const updated = [...config.competitors, newCompetitor.trim()]
    await supabase.from('sarah_configs').update({ competitors: updated }).eq('id', config.id)
    setConfig({ ...config, competitors: updated })
    setNewCompetitor('')
  }

  const removeCompetitor = async (index: number) => {
    if (!config) return
    const supabase = createClient()
    const updated = config.competitors.filter((_, i) => i !== index)
    await supabase.from('sarah_configs').update({ competitors: updated }).eq('id', config.id)
    setConfig({ ...config, competitors: updated })
  }

  const addTopic = async () => {
    if (!newTopic.trim() || !config) return
    const supabase = createClient()
    const updated = [...config.focus_topics, newTopic.trim()]
    await supabase.from('sarah_configs').update({ focus_topics: updated }).eq('id', config.id)
    setConfig({ ...config, focus_topics: updated })
    setNewTopic('')
  }

  const removeTopic = async (index: number) => {
    if (!config) return
    const supabase = createClient()
    const updated = config.focus_topics.filter((_, i) => i !== index)
    await supabase.from('sarah_configs').update({ focus_topics: updated }).eq('id', config.id)
    setConfig({ ...config, focus_topics: updated })
  }

  const addSource = async () => {
    if (!newSourceUrl.trim()) return
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase.from('research_sources').insert({
      user_id: user.id,
      url: newSourceUrl.trim(),
      name: newSourceName.trim() || newSourceUrl.trim(),
      type: 'competitor'
    }).select().single()

    if (data) {
      setSources([data, ...sources])
      setNewSourceUrl('')
      setNewSourceName('')
    }
  }

  const removeSource = async (id: string) => {
    const supabase = createClient()
    await supabase.from('research_sources').delete().eq('id', id)
    setSources(sources.filter(s => s.id !== id))
  }

  const generateBrief = async () => {
    if (!config || sources.length === 0) return
    setGenerating(true)

    try {
      const response = await fetch('/api/generate-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          competitors: config.competitors,
          topics: config.focus_topics,
          sources: sources.filter(s => s.active).map(s => s.url)
        })
      })

      if (response.ok) {
        const { briefId } = await response.json()
        router.push(`/portal/agents/briefs/${briefId}`)
      }
    } catch (error) {
      console.error('Failed to generate brief:', error)
    }

    setGenerating(false)
  }

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Sarah</h1>
            <p className="text-muted-foreground">Your Market Intelligence Analyst</p>
          </div>
          <Button
            onClick={generateBrief}
            disabled={generating || sources.length === 0}
            className="gap-2"
          >
            {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
            Generate Brief
          </Button>
        </div>

        {/* Competitors */}
        <Card>
          <CardHeader>
            <CardTitle>Competitors</CardTitle>
            <CardDescription>Companies Sarah should monitor</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Add competitor (e.g., OpenAI)"
                value={newCompetitor}
                onChange={(e) => setNewCompetitor(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addCompetitor()}
              />
              <Button onClick={addCompetitor} size="icon"><Plus className="h-4 w-4" /></Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {config?.competitors.map((comp, i) => (
                <Badge key={i} variant="secondary" className="gap-1">
                  {comp}
                  <button onClick={() => removeCompetitor(i)} className="ml-1 hover:text-destructive"><X className="h-3 w-3" /></button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Topics */}
        <Card>
          <CardHeader>
            <CardTitle>Focus Topics</CardTitle>
            <CardDescription>Key areas to research</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Add topic (e.g., AI regulation)"
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTopic()}
              />
              <Button onClick={addTopic} size="icon"><Plus className="h-4 w-4" /></Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {config?.focus_topics.map((topic, i) => (
                <Badge key={i} variant="outline" className="gap-1">
                  {topic}
                  <button onClick={() => removeTopic(i)} className="ml-1 hover:text-destructive"><X className="h-3 w-3" /></button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Research Sources</CardTitle>
            <CardDescription>URLs Sarah will monitor</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="https://company.com/blog"
                value={newSourceUrl}
                onChange={(e) => setNewSourceUrl(e.target.value)}
              />
              <Input
                placeholder="Source name (optional)"
                value={newSourceName}
                onChange={(e) => setNewSourceName(e.target.value)}
                className="w-40"
              />
              <Button onClick={addSource} size="icon"><Plus className="h-4 w-4" /></Button>
            </div>
            <div className="space-y-2">
              {sources.map((source) => (
                <div key={source.id} className="flex items-center justify-between p-2 bg-muted rounded">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{source.name}</span>
                    <span className="text-xs text-muted-foreground">{source.url}</span>
                  </div>
                  <button onClick={() => removeSource(source.id)} className="hover:text-destructive"><X className="h-4 w-4" /></button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Briefs */}
        {briefs.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Briefs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {briefs.map((brief) => (
                <Link key={brief.id} href={`/portal/agents/briefs/${brief.id}`}>
                  <div className="flex items-center justify-between p-3 bg-muted rounded hover:bg-muted/80 transition-colors">
                    <div>
                      <p className="font-medium">{brief.title}</p>
                      <p className="text-xs text-muted-foreground">{new Date(brief.created_at).toLocaleDateString()}</p>
                    </div>
                    <Badge variant={brief.status === 'sent' ? 'default' : 'secondary'}>
                      {brief.status}
                    </Badge>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
