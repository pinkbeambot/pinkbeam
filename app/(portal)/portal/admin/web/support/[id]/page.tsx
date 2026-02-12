'use client'

import { useState, useEffect, useCallback, use } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Loader2,
  Send,
  Save,
  Clock,
  AlertTriangle,
  User,
  MessageSquare,
  Shield,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FadeIn } from '@/components/animations'
import { FileUpload } from '@/components/file-upload'
import { FileList } from '@/components/file-list'
import { getErrorMessages, ticketCommentSchema } from '@/lib/validation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// TODO: Replace with real auth context from WEB-008
const ADMIN_ID = 'test-admin'

interface TicketDetail {
  id: string
  title: string
  description: string
  status: string
  priority: string
  category: string
  slaDeadline: string | null
  slaBreach: boolean
  slaBreachedAt: string | null
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
  WAITING_CLIENT: 'Waiting on Client',
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

const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  OPEN: ['IN_PROGRESS', 'CLOSED'],
  IN_PROGRESS: ['WAITING_CLIENT', 'RESOLVED', 'OPEN'],
  WAITING_CLIENT: ['IN_PROGRESS', 'RESOLVED', 'CLOSED'],
  RESOLVED: ['CLOSED', 'OPEN'],
  CLOSED: ['OPEN'],
}

const priorityOptions = ['LOW', 'MEDIUM', 'HIGH', 'URGENT']
const categoryOptions = ['GENERAL', 'BUG', 'FEATURE_REQUEST', 'BILLING', 'TECHNICAL']

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

function SlaCard({ deadline, breached, breachedAt }: { deadline: string | null; breached: boolean; breachedAt: string | null }) {
  if (!deadline) return null

  if (breached) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
        <AlertTriangle className="w-4 h-4 text-red-500" />
        <div>
          <p className="text-sm font-medium text-red-500">SLA Breached</p>
          <p className="text-xs text-red-400">
            Breached {breachedAt ? formatDateTime(breachedAt) : 'unknown'} &middot; Deadline was {formatDateTime(deadline)}
          </p>
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
          <p className="text-xs text-red-400">Deadline was {formatDateTime(deadline)}</p>
        </div>
      </div>
    )
  }

  const hours = Math.floor(diffMs / (1000 * 60 * 60))
  const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
  const isWarning = hours < 4
  const isCritical = hours < 1

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
      isCritical ? 'bg-red-500/10 border-red-500/20' : isWarning ? 'bg-amber-500/10 border-amber-500/20' : 'bg-muted/50 border-border'
    }`}>
      <Clock className={`w-4 h-4 ${isCritical ? 'text-red-500' : isWarning ? 'text-amber-500' : 'text-muted-foreground'}`} />
      <div>
        <p className={`text-sm font-medium ${isCritical ? 'text-red-500' : isWarning ? 'text-amber-500' : ''}`}>
          {hours > 24 ? `${Math.floor(hours / 24)}d ${hours % 24}h` : hours > 0 ? `${hours}h ${mins}m` : `${mins}m`} remaining
        </p>
        <p className="text-xs text-muted-foreground">Deadline: {formatDateTime(deadline)}</p>
      </div>
    </div>
  )
}

export default function AdminTicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [ticket, setTicket] = useState<TicketDetail | null>(null)
  const [activity, setActivity] = useState<ActivityEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Comment state
  const [newComment, setNewComment] = useState('')
  const [isInternal, setIsInternal] = useState(false)
  const [submittingComment, setSubmittingComment] = useState(false)
  const [commentError, setCommentError] = useState<string | null>(null)

  // Admin controls state
  const [assigneeId, setAssigneeId] = useState('')
  const [savingAssignment, setSavingAssignment] = useState(false)
  const [updateError, setUpdateError] = useState<string | null>(null)
  const [files, setFiles] = useState<Array<{ id: string; name: string; mimeType: string; size: number; bucket: string; createdAt: string; uploadedBy?: { id: string; name: string | null; email: string } }>>([])
  const [commentFileIds, setCommentFileIds] = useState<string[]>([])

  const fetchTicket = useCallback(async () => {
    try {
      setError(null)
      const [ticketRes, filesRes] = await Promise.all([
        fetch(`/api/tickets/${id}`),
        fetch(`/api/files?ticketId=${id}`),
      ])
      const data = await ticketRes.json()
      if (data.success) {
        setTicket(data.data)
        setAssigneeId(data.data.assignee?.id || '')
        if (data.activity) setActivity(data.activity)
      } else {
        setError('Ticket not found')
      }
      const filesData = await filesRes.json()
      if (filesData.success) setFiles(filesData.data)
    } catch {
      setError('Failed to load ticket')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchTicket()
  }, [fetchTicket])

  const updateTicket = async (updates: Record<string, unknown>) => {
    setUpdateError(null)
    try {
      const res = await fetch(`/api/tickets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      const data = await res.json()
      if (data.success) {
        fetchTicket()
      } else {
        setUpdateError(typeof data.error === 'string' ? data.error : 'Update failed')
      }
    } catch {
      setUpdateError('Update failed')
    }
  }

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    const validation = ticketCommentSchema.safeParse({ body: newComment })
    if (!validation.success) {
      setCommentError(getErrorMessages(validation.error)[0] ?? 'Comment is required')
      return
    }
    setCommentError(null)
    setSubmittingComment(true)
    try {
      const res = await fetch(`/api/tickets/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorId: ADMIN_ID,
          body: validation.data.body,
          isInternal,
        }),
      })
      const data = await res.json()
      if (data.success) {
        if (commentFileIds.length > 0) {
          await fetch('/api/files/associate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fileIds: commentFileIds, ticketId: id, commentId: data.data.id }),
          }).catch(() => {})
          setCommentFileIds([])
        }
        setNewComment('')
        setIsInternal(false)
        fetchTicket()
      }
    } catch {
      // silent
    } finally {
      setSubmittingComment(false)
    }
  }

  const saveAssignment = async () => {
    setSavingAssignment(true)
    await updateTicket({ assigneeId: assigneeId || null })
    setSavingAssignment(false)
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
          <Link href="/portal/admin/web/support">Back to Support</Link>
        </Button>
      </div>
    )
  }

  const isOpen = !['RESOLVED', 'CLOSED'].includes(ticket.status)

  return (
    <div className="space-y-6">
      {/* Back + Header */}
      <FadeIn>
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/portal/admin/web/support">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tickets
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
                {ticket.id.slice(0, 8)} &middot; {formatDate(ticket.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </FadeIn>

      {updateError && (
        <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
          {updateError}
        </div>
      )}

      {/* SLA */}
      {isOpen && (
        <FadeIn delay={0.05}>
          <SlaCard deadline={ticket.slaDeadline} breached={ticket.slaBreach} breachedAt={ticket.slaBreachedAt} />
        </FadeIn>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <FadeIn delay={0.1}>
            <Tabs defaultValue="conversation">
              <TabsList className="w-full">
                <TabsTrigger value="conversation" className="flex-1">Conversation</TabsTrigger>
                <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
                <TabsTrigger value="activity" className="flex-1">Activity</TabsTrigger>
              </TabsList>

              {/* Conversation Tab */}
              <TabsContent value="conversation" className="mt-4">
                <Card>
                  <CardContent className="p-4 space-y-4">
                    {/* Original description */}
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-violet-500" />
                      </div>
                      <div className="flex-1">
                        <div className="inline-block rounded-lg px-4 py-3 text-sm bg-muted border border-border w-full">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-xs">
                              {ticket.client.name || ticket.client.email}
                            </span>
                            <span className="text-xs text-muted-foreground">{formatDateTime(ticket.createdAt)}</span>
                          </div>
                          <p className="whitespace-pre-wrap">{ticket.description}</p>
                        </div>
                      </div>
                    </div>

                    {/* Comments */}
                    {ticket.comments.map((comment) => {
                      const isClient = comment.author.role === 'CLIENT'
                      return (
                        <div key={comment.id} className="flex gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                            comment.isInternal ? 'bg-amber-500/20' : isClient ? 'bg-violet-500/20' : 'bg-pink-500/20'
                          }`}>
                            {comment.isInternal ? (
                              <Shield className="w-4 h-4 text-amber-500" />
                            ) : (
                              <User className={`w-4 h-4 ${isClient ? 'text-violet-500' : 'text-pink-500'}`} />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className={`inline-block rounded-lg px-4 py-3 text-sm w-full ${
                              comment.isInternal
                                ? 'bg-amber-500/5 border border-amber-500/20'
                                : 'bg-muted border border-border'
                            }`}>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-xs">
                                  {comment.author.name || comment.author.email}
                                </span>
                                {comment.isInternal && (
                                  <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-500 border-amber-500/20">
                                    Internal
                                  </Badge>
                                )}
                                <span className="text-xs text-muted-foreground">{formatDateTime(comment.createdAt)}</span>
                              </div>
                              <p className="whitespace-pre-wrap">{comment.body}</p>
                            </div>
                          </div>
                        </div>
                      )
                    })}

                    {ticket.comments.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No replies yet.
                      </p>
                    )}

                    {/* Reply form */}
                    <form onSubmit={submitComment} className="space-y-3 pt-4 border-t">
                      <Textarea
                        placeholder={isInternal ? 'Add internal note (client will NOT see this)...' : 'Type your reply to the client...'}
                        value={newComment}
                        onChange={(e) => {
                          setNewComment(e.target.value)
                          if (commentError) setCommentError(null)
                        }}
                        rows={3}
                        className={isInternal ? 'border-amber-500/30' : ''}
                        aria-invalid={Boolean(commentError)}
                        aria-describedby={commentError ? 'admin-comment-error' : undefined}
                      />
                      {commentError && (
                        <p id="admin-comment-error" className="text-xs text-destructive">
                          {commentError}
                        </p>
                      )}
                      <FileUpload
                        bucket="attachments"
                        uploadedById={ADMIN_ID}
                        ticketId={id}
                        onUploadComplete={(file) => setCommentFileIds((prev) => [...prev, file.id])}
                        maxFiles={5}
                        compact
                      />
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isInternal}
                            onChange={(e) => setIsInternal(e.target.checked)}
                            className="rounded border-gray-300"
                          />
                          <Shield className={`w-4 h-4 ${isInternal ? 'text-amber-500' : 'text-muted-foreground'}`} />
                          <span className={`text-sm ${isInternal ? 'text-amber-500 font-medium' : 'text-muted-foreground'}`}>
                            Internal note
                          </span>
                        </label>
                        <Button
                          type="submit"
                          size="sm"
                          disabled={submittingComment || !newComment.trim()}
                          variant={isInternal ? 'outline' : 'default'}
                        >
                          {submittingComment ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          ) : (
                            <Send className="w-4 h-4 mr-2" />
                          )}
                          {isInternal ? 'Add Note' : 'Send Reply'}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Details Tab */}
              <TabsContent value="details" className="mt-4 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Client Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Name:</span>{' '}
                      {ticket.client.name || 'N/A'}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Email:</span>{' '}
                      <a href={`mailto:${ticket.client.email}`} className="text-pink-500 hover:underline">
                        {ticket.client.email}
                      </a>
                    </div>
                    {ticket.client.company && (
                      <div>
                        <span className="text-muted-foreground">Company:</span> {ticket.client.company}
                      </div>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Ticket Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div><span className="text-muted-foreground">ID:</span> {ticket.id}</div>
                    <div><span className="text-muted-foreground">Created:</span> {formatDateTime(ticket.createdAt)}</div>
                    <div><span className="text-muted-foreground">Updated:</span> {formatDateTime(ticket.updatedAt)}</div>
                    {ticket.resolvedAt && (
                      <div><span className="text-muted-foreground">Resolved:</span> {formatDateTime(ticket.resolvedAt)}</div>
                    )}
                    {ticket.closedAt && (
                      <div><span className="text-muted-foreground">Closed:</span> {formatDateTime(ticket.closedAt)}</div>
                    )}
                    <div>
                      <span className="text-muted-foreground">SLA Deadline:</span>{' '}
                      {ticket.slaDeadline ? formatDateTime(ticket.slaDeadline) : 'N/A'}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Description:</span>
                      <p className="mt-1 whitespace-pre-wrap bg-muted/50 p-3 rounded-md">
                        {ticket.description}
                      </p>
                    </div>
                    {files.length > 0 && (
                      <div>
                        <span className="text-muted-foreground">Attachments ({files.length})</span>
                        <div className="mt-2">
                          <FileList
                            files={files}
                            canDelete
                            onDelete={(fileId) => setFiles((prev) => prev.filter((f) => f.id !== fileId))}
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Activity Tab */}
              <TabsContent value="activity" className="mt-4">
                <Card>
                  <CardContent className="p-4">
                    {activity.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">No activity yet</p>
                    ) : (
                      <div className="space-y-3">
                        {activity.map((entry) => (
                          <div key={entry.id} className="flex items-start gap-3 text-sm">
                            <div className="w-2 h-2 rounded-full bg-violet-500 mt-1.5 shrink-0" />
                            <div className="flex-1">
                              <p>
                                {entry.action === 'ticket_created' && 'Ticket created'}
                                {entry.action === 'status_change' && entry.metadata && (
                                  <>
                                    Status changed from{' '}
                                    <Badge variant="outline" className={`${getStatusColor(entry.metadata.from)} text-xs`}>
                                      {statusLabels[entry.metadata.from] || entry.metadata.from}
                                    </Badge>
                                    {' '}to{' '}
                                    <Badge variant="outline" className={`${getStatusColor(entry.metadata.to)} text-xs`}>
                                      {statusLabels[entry.metadata.to] || entry.metadata.to}
                                    </Badge>
                                  </>
                                )}
                                {entry.action === 'priority_change' && entry.metadata && (
                                  <>
                                    Priority changed from{' '}
                                    <Badge variant="outline" className={`${getPriorityColor(entry.metadata.from)} text-xs`}>
                                      {priorityLabels[entry.metadata.from] || entry.metadata.from}
                                    </Badge>
                                    {' '}to{' '}
                                    <Badge variant="outline" className={`${getPriorityColor(entry.metadata.to)} text-xs`}>
                                      {priorityLabels[entry.metadata.to] || entry.metadata.to}
                                    </Badge>
                                  </>
                                )}
                                {entry.action === 'assignment_change' && entry.metadata && (
                                  <>Assigned: {entry.metadata.from} → {entry.metadata.to}</>
                                )}
                                {entry.action === 'comment_added' && 'Reply added'}
                                {entry.action === 'internal_note_added' && (
                                  <span className="text-amber-500">Internal note added</span>
                                )}
                              </p>
                              <p className="text-xs text-muted-foreground">{formatDateTime(entry.createdAt)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </FadeIn>
        </div>

        {/* Sidebar — Admin Controls */}
        <div className="space-y-4">
          {/* Status Control */}
          <FadeIn delay={0.15}>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Badge variant="outline" className={`${getStatusColor(ticket.status)} text-sm`}>
                  {statusLabels[ticket.status]}
                </Badge>
                <div className="flex flex-wrap gap-2">
                  {(ALLOWED_TRANSITIONS[ticket.status] ?? []).map((value) => (
                    <Button
                      key={value}
                      variant="outline"
                      size="sm"
                      onClick={() => updateTicket({ status: value })}
                    >
                      → {statusLabels[value]}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Priority Control */}
          <FadeIn delay={0.2}>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Priority</CardTitle>
              </CardHeader>
              <CardContent>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full justify-between">
                      <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                        {priorityLabels[ticket.priority]}
                      </Badge>
                      <span className="text-xs text-muted-foreground">Change</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {priorityOptions.filter((p) => p !== ticket.priority).map((p) => (
                      <DropdownMenuItem key={p} onClick={() => updateTicket({ priority: p })}>
                        <Badge variant="outline" className={`mr-2 ${getPriorityColor(p)}`}>
                          {priorityLabels[p]}
                        </Badge>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Category Control */}
          <FadeIn delay={0.25}>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Category</CardTitle>
              </CardHeader>
              <CardContent>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full justify-between">
                      {categoryLabels[ticket.category]}
                      <span className="text-xs text-muted-foreground">Change</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {categoryOptions.filter((c) => c !== ticket.category).map((c) => (
                      <DropdownMenuItem key={c} onClick={() => updateTicket({ category: c })}>
                        {categoryLabels[c]}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Assignment */}
          <FadeIn delay={0.3}>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Assignment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="assignee" className="text-xs text-muted-foreground">
                    Assignee User ID
                  </Label>
                  <Input
                    id="assignee"
                    placeholder="Enter user ID"
                    value={assigneeId}
                    onChange={(e) => setAssigneeId(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => { setAssigneeId(ADMIN_ID); }}
                    className="flex-1"
                  >
                    Assign to Me
                  </Button>
                  <Button
                    size="sm"
                    onClick={saveAssignment}
                    disabled={savingAssignment}
                    className="flex-1"
                  >
                    {savingAssignment ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-1" />
                    ) : (
                      <Save className="w-4 h-4 mr-1" />
                    )}
                    Save
                  </Button>
                </div>
                {ticket.assignee && (
                  <p className="text-xs text-muted-foreground">
                    Currently: {ticket.assignee.name || ticket.assignee.email}
                  </p>
                )}
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </div>
    </div>
  )
}
