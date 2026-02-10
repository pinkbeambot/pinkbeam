'use client'

import { useState, useEffect, useCallback, use } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Loader2,
  Send,
  Clock,
  AlertTriangle,
  User,
  MessageSquare,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { FadeIn } from '@/components/animations'

// TODO: Replace with real auth context from WEB-008
const CLIENT_ID = 'test-client'

interface TicketDetail {
  id: string
  title: string
  description: string
  status: string
  priority: string
  category: string
  slaDeadline: string | null
  slaBreach: boolean
  createdAt: string
  updatedAt: string
  resolvedAt: string | null
  closedAt: string | null
  client: { id: string; name: string; email: string; company: string | null }
  assignee: { id: string; name: string; email: string } | null
  comments: Comment[]
}

interface Comment {
  id: string
  body: string
  isInternal: boolean
  createdAt: string
  author: { id: string; name: string; email: string; role: string }
}

interface ActivityEntry {
  id: string
  action: string
  metadata: Record<string, string> | null
  createdAt: string
}

const statusLabels: Record<string, string> = {
  OPEN: 'Open',
  IN_PROGRESS: 'In Progress',
  WAITING_CLIENT: 'Waiting on You',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
}

const priorityLabels: Record<string, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  URGENT: 'Urgent',
}

const categoryLabels: Record<string, string> = {
  GENERAL: 'General',
  BUG: 'Bug Report',
  FEATURE_REQUEST: 'Feature Request',
  BILLING: 'Billing',
  TECHNICAL: 'Technical',
}

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    OPEN: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    IN_PROGRESS: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    WAITING_CLIENT: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    RESOLVED: 'bg-green-500/10 text-green-500 border-green-500/20',
    CLOSED: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  }
  return colors[status] || 'bg-gray-500/10 text-gray-500'
}

function getPriorityColor(priority: string) {
  const colors: Record<string, string> = {
    URGENT: 'bg-red-500/10 text-red-500 border-red-500/20',
    HIGH: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    MEDIUM: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    LOW: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  }
  return colors[priority] || 'bg-gray-500/10 text-gray-500'
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function SlaCountdown({ deadline, breached }: { deadline: string | null; breached: boolean }) {
  const [, setTick] = useState(0)

  useEffect(() => {
    if (!deadline || breached) return
    const interval = setInterval(() => setTick((t) => t + 1), 60000) // update every minute
    return () => clearInterval(interval)
  }, [deadline, breached])

  if (!deadline) return null

  if (breached) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
        <AlertTriangle className="w-4 h-4 text-red-500" />
        <div>
          <p className="text-sm font-medium text-red-500">SLA Breached</p>
          <p className="text-xs text-red-400">Response deadline has passed</p>
        </div>
      </div>
    )
  }

  const now = new Date()
  const dl = new Date(deadline)
  const diffMs = dl.getTime() - now.getTime()

  if (diffMs <= 0) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
        <AlertTriangle className="w-4 h-4 text-red-500" />
        <div>
          <p className="text-sm font-medium text-red-500">SLA Breached</p>
          <p className="text-xs text-red-400">Response deadline has passed</p>
        </div>
      </div>
    )
  }

  const totalMins = Math.floor(diffMs / 60000)
  const hours = Math.floor(totalMins / 60)
  const mins = totalMins % 60
  const isWarning = hours < 4
  const isCritical = hours < 1

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
      isCritical
        ? 'bg-red-500/10 border-red-500/20'
        : isWarning
          ? 'bg-amber-500/10 border-amber-500/20'
          : 'bg-muted/50 border-border'
    }`}>
      <Clock className={`w-4 h-4 ${
        isCritical ? 'text-red-500' : isWarning ? 'text-amber-500' : 'text-muted-foreground'
      }`} />
      <div>
        <p className={`text-sm font-medium ${
          isCritical ? 'text-red-500' : isWarning ? 'text-amber-500' : ''
        }`}>
          {hours > 24
            ? `${Math.floor(hours / 24)}d ${hours % 24}h remaining`
            : hours > 0
              ? `${hours}h ${mins}m remaining`
              : `${mins}m remaining`}
        </p>
        <p className="text-xs text-muted-foreground">
          Expected response by {formatDateTime(deadline)}
        </p>
      </div>
    </div>
  )
}

export default function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [ticket, setTicket] = useState<TicketDetail | null>(null)
  const [activity, setActivity] = useState<ActivityEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newComment, setNewComment] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)

  const fetchTicket = useCallback(async () => {
    try {
      setError(null)
      const res = await fetch(`/api/tickets/${id}`)
      const data = await res.json()
      if (data.success) {
        // Filter out internal comments for client view
        const clientComments = data.data.comments.filter((c: Comment) => !c.isInternal)
        setTicket({ ...data.data, comments: clientComments })
        if (data.activity) setActivity(data.activity)
      } else {
        setError('Ticket not found')
      }
    } catch {
      setError('Failed to load ticket')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchTicket()
  }, [fetchTicket])

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return
    setSubmittingComment(true)
    try {
      const res = await fetch(`/api/tickets/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorId: CLIENT_ID,
          body: newComment.trim(),
          isInternal: false,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setNewComment('')
        fetchTicket() // refresh to get latest comments + activity
      }
    } catch {
      // silent
    } finally {
      setSubmittingComment(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !ticket) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">{error || 'Ticket not found'}</p>
        <Button asChild variant="outline">
          <Link href="/web/portal/support">Back to Support</Link>
        </Button>
      </div>
    )
  }

  const isOpen = !['RESOLVED', 'CLOSED'].includes(ticket.status)

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Back + Header */}
      <FadeIn>
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/web/portal/support">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Support
          </Link>
        </Button>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{ticket.title}</h1>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Badge variant="outline" className={getStatusColor(ticket.status)}>
                {statusLabels[ticket.status]}
              </Badge>
              <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                {priorityLabels[ticket.priority]}
              </Badge>
              <Badge variant="outline">
                {categoryLabels[ticket.category]}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Opened {formatDate(ticket.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* SLA Countdown */}
      {isOpen && (
        <FadeIn delay={0.05}>
          <SlaCountdown deadline={ticket.slaDeadline} breached={ticket.slaBreach} />
        </FadeIn>
      )}

      {/* Ticket Info */}
      <FadeIn delay={0.1}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ticket Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Category:</span>{' '}
                {categoryLabels[ticket.category]}
              </div>
              <div>
                <span className="text-muted-foreground">Priority:</span>{' '}
                {priorityLabels[ticket.priority]}
              </div>
              {ticket.assignee && (
                <div>
                  <span className="text-muted-foreground">Assigned to:</span>{' '}
                  {ticket.assignee.name || ticket.assignee.email}
                </div>
              )}
              {ticket.resolvedAt && (
                <div>
                  <span className="text-muted-foreground">Resolved:</span>{' '}
                  {formatDate(ticket.resolvedAt)}
                </div>
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Description</p>
              <p className="text-sm whitespace-pre-wrap bg-muted/50 p-3 rounded-md">
                {ticket.description}
              </p>
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Comments Thread */}
      <FadeIn delay={0.2}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Conversation
              {ticket.comments.length > 0 && (
                <span className="text-sm font-normal text-muted-foreground">
                  ({ticket.comments.length})
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Comment list */}
            {ticket.comments.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No replies yet. Our team will respond shortly.
              </p>
            ) : (
              <div className="space-y-4">
                {ticket.comments.map((comment) => {
                  const isClient = comment.author.role === 'CLIENT'
                  return (
                    <div key={comment.id} className={`flex gap-3 ${isClient ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        isClient ? 'bg-violet-500/20' : 'bg-pink-500/20'
                      }`}>
                        <User className={`w-4 h-4 ${isClient ? 'text-violet-500' : 'text-pink-500'}`} />
                      </div>
                      <div className={`flex-1 max-w-[80%] ${isClient ? 'text-right' : ''}`}>
                        <div className={`inline-block rounded-lg px-4 py-3 text-sm ${
                          isClient
                            ? 'bg-violet-500/10 border border-violet-500/20'
                            : 'bg-muted border border-border'
                        }`}>
                          <div className={`flex items-center gap-2 mb-1 ${isClient ? 'justify-end' : ''}`}>
                            <span className="font-medium text-xs">
                              {isClient ? 'You' : comment.author.name || 'Support Team'}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatDateTime(comment.createdAt)}
                            </span>
                          </div>
                          <p className="whitespace-pre-wrap text-left">{comment.body}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* New comment form */}
            {isOpen ? (
              <form onSubmit={submitComment} className="space-y-3 pt-4 border-t">
                <Textarea
                  placeholder="Type your reply..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    size="sm"
                    disabled={submittingComment || !newComment.trim()}
                  >
                    {submittingComment ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Send className="w-4 h-4 mr-2" />
                    )}
                    Send Reply
                  </Button>
                </div>
              </form>
            ) : (
              <div className="text-center py-4 border-t">
                <p className="text-sm text-muted-foreground">
                  This ticket is {ticket.status === 'RESOLVED' ? 'resolved' : 'closed'}.
                  Need more help?{' '}
                  <Link href="/web/portal/support/new" className="text-violet-500 hover:underline">
                    Open a new ticket
                  </Link>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </FadeIn>

      {/* Activity Timeline */}
      {activity.length > 0 && (
        <FadeIn delay={0.3}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activity
                  .filter((e) => !e.action.includes('internal'))
                  .map((entry) => (
                    <div key={entry.id} className="flex items-start gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-violet-500 mt-1.5 shrink-0" />
                      <div className="flex-1">
                        <p>
                          {entry.action === 'ticket_created' && 'Ticket created'}
                          {entry.action === 'status_change' && entry.metadata && (
                            <>
                              Status changed to{' '}
                              <Badge variant="outline" className={`${getStatusColor(entry.metadata.to)} text-xs`}>
                                {statusLabels[entry.metadata.to] || entry.metadata.to}
                              </Badge>
                            </>
                          )}
                          {entry.action === 'priority_change' && entry.metadata && (
                            <>
                              Priority changed to{' '}
                              <Badge variant="outline" className={`${getPriorityColor(entry.metadata.to)} text-xs`}>
                                {priorityLabels[entry.metadata.to] || entry.metadata.to}
                              </Badge>
                            </>
                          )}
                          {entry.action === 'assignment_change' && 'Ticket assigned to support team'}
                          {entry.action === 'comment_added' && 'New reply added'}
                        </p>
                        <p className="text-xs text-muted-foreground">{formatDateTime(entry.createdAt)}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      )}
    </div>
  )
}
