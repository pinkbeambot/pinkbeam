'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, Send, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { FadeIn } from '@/components/animations'
import { ticketTemplates } from '@/lib/ticket-templates'
import { getSuggestedArticles, type KBArticle } from '@/lib/knowledge-base'

// TODO: Replace with real auth context from WEB-008
const CLIENT_ID = 'test-client'

const categories = [
  { value: 'GENERAL', label: 'General Question' },
  { value: 'BUG', label: 'Bug Report' },
  { value: 'FEATURE_REQUEST', label: 'Feature Request' },
  { value: 'BILLING', label: 'Billing Issue' },
  { value: 'TECHNICAL', label: 'Technical Support' },
]

const priorities = [
  { value: 'LOW', label: 'Low', description: 'Not time-sensitive' },
  { value: 'MEDIUM', label: 'Medium', description: 'Normal priority' },
  { value: 'HIGH', label: 'High', description: 'Needs attention soon' },
  { value: 'URGENT', label: 'Urgent', description: 'Critical issue, immediate attention needed' },
]

export default function NewTicketPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('GENERAL')
  const [priority, setPriority] = useState('MEDIUM')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: CLIENT_ID,
          title,
          description,
          category,
          priority,
        }),
      })
      const data = await res.json()
      if (data.success) {
        router.push(`/web/portal/support/${data.data.id}`)
      } else {
        const errMsg = typeof data.error === 'string'
          ? data.error
          : data.error?.fieldErrors
            ? Object.values(data.error.fieldErrors).flat().join(', ')
            : 'Failed to create ticket'
        setError(errMsg)
      }
    } catch {
      setError('Failed to create ticket. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <FadeIn>
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/web/portal/support">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Support
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">New Support Ticket</h1>
          <p className="text-muted-foreground mt-1">
            Describe your issue and we&apos;ll get back to you as soon as possible.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <Card>
          <CardHeader>
            <CardTitle>Ticket Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Quick Templates */}
              <div className="space-y-2">
                <Label>Quick Start (optional)</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ticketTemplates.map((tpl) => (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => {
                        setTitle(tpl.title)
                        setDescription(tpl.description)
                        setCategory(tpl.category)
                        setPriority(tpl.priority)
                      }}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border text-sm hover:bg-muted transition-colors text-left"
                    >
                      <FileText className="w-3 h-3 text-muted-foreground shrink-0" />
                      {tpl.label}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-md">
                  {error}
                </div>
              )}

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Subject</Label>
                <Input
                  id="title"
                  placeholder="Brief summary of your issue"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label>Category</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setCategory(cat.value)}
                      className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                        category === cat.value
                          ? 'bg-violet-500/10 border-violet-500/30 text-violet-500 font-medium'
                          : 'hover:bg-muted'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <Label>Priority</Label>
                <div className="grid grid-cols-2 gap-2">
                  {priorities.map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setPriority(p.value)}
                      className={`px-4 py-3 rounded-lg border text-left transition-colors ${
                        priority === p.value
                          ? 'bg-violet-500/10 border-violet-500/30'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <p className={`text-sm font-medium ${priority === p.value ? 'text-violet-500' : ''}`}>
                        {p.label}
                      </p>
                      <p className="text-xs text-muted-foreground">{p.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* KB Suggestions */}
              {(() => {
                const articles = getSuggestedArticles(category)
                if (articles.length === 0) return null
                return (
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Before you submit, these might help:</Label>
                    <div className="space-y-2">
                      {articles.map((article: KBArticle) => (
                        <div
                          key={article.id}
                          className="flex items-start gap-3 p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                        >
                          <FileText className="w-4 h-4 text-violet-500 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-sm font-medium">{article.title}</p>
                            <p className="text-xs text-muted-foreground">{article.excerpt}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })()}

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Please describe your issue in detail. Include steps to reproduce, expected behavior, and any relevant context..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  required
                  minLength={10}
                />
                <p className="text-xs text-muted-foreground">
                  Minimum 10 characters. The more detail you provide, the faster we can help.
                </p>
              </div>

              {/* Submit */}
              <div className="flex items-center justify-end gap-3">
                <Button variant="outline" type="button" asChild>
                  <Link href="/web/portal/support">Cancel</Link>
                </Button>
                <Button type="submit" disabled={submitting || !title || description.length < 10}>
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  Submit Ticket
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  )
}
