'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  MessageSquare,
  Plus,
  Loader2,
  Search,
  Filter,
  Clock,
  AlertTriangle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { FadeIn } from '@/components/animations'

// TODO: Replace with real auth context from WEB-008
const CLIENT_ID = 'test-client'

interface Ticket {
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
  assignee: { id: string; name: string; email: string } | null
  _count: { comments: number }
}

const statusFilters = ['all', 'OPEN', 'IN_PROGRESS', 'WAITING_CLIENT', 'RESOLVED', 'CLOSED']

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

function formatTimeAgo(dateStr: string) {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function SlaIndicator({ deadline, breached }: { deadline: string | null; breached: boolean }) {
  if (!deadline) return null
  if (breached) {
    return (
      <span className="flex items-center gap-1 text-xs text-red-500">
        <AlertTriangle className="w-3 h-3" />
        SLA breached
      </span>
    )
  }
  const now = new Date()
  const dl = new Date(deadline)
  const diffMs = dl.getTime() - now.getTime()
  if (diffMs <= 0) {
    return (
      <span className="flex items-center gap-1 text-xs text-red-500">
        <AlertTriangle className="w-3 h-3" />
        SLA breached
      </span>
    )
  }
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
  const isWarning = diffHours < 4
  return (
    <span className={`flex items-center gap-1 text-xs ${isWarning ? 'text-amber-500' : 'text-muted-foreground'}`}>
      <Clock className="w-3 h-3" />
      {diffHours > 24
        ? `${Math.floor(diffHours / 24)}d ${diffHours % 24}h left`
        : diffHours > 0
          ? `${diffHours}h ${diffMins}m left`
          : `${diffMins}m left`}
    </span>
  )
}

export default function SupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const fetchTickets = useCallback(async () => {
    try {
      setError(null)
      const params = new URLSearchParams({ clientId: CLIENT_ID })
      if (filter !== 'all') params.set('status', filter)
      const res = await fetch(`/api/tickets?${params}`)
      const data = await res.json()
      if (data.success) {
        setTickets(data.data)
      } else {
        setError('Failed to load tickets')
      }
    } catch {
      setError('Failed to load tickets')
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    fetchTickets()
  }, [fetchTickets])

  const filtered = tickets.filter((t) => {
    if (!search) return true
    const term = search.toLowerCase()
    return (
      t.title.toLowerCase().includes(term) ||
      t.id.toLowerCase().includes(term) ||
      t.category.toLowerCase().includes(term)
    )
  })

  const openCount = tickets.filter((t) => t.status === 'OPEN' || t.status === 'IN_PROGRESS' || t.status === 'WAITING_CLIENT').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Support</h1>
            <p className="text-muted-foreground mt-1">
              Get help and track your support tickets
              {openCount > 0 && (
                <Badge className="ml-2 bg-blue-500">{openCount} open</Badge>
              )}
            </p>
          </div>
          <Button asChild>
            <Link href="/web/portal/support/new">
              <Plus className="w-4 h-4 mr-2" />
              New Ticket
            </Link>
          </Button>
        </div>
      </FadeIn>

      {/* Search & Filters */}
      <FadeIn delay={0.1}>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search tickets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-muted-foreground" />
            {statusFilters.map((status) => (
              <Button
                key={status}
                variant={filter === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => { setFilter(status); setLoading(true) }}
              >
                {status === 'all' ? 'All' : statusLabels[status] || status}
              </Button>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-center py-12">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={fetchTickets} variant="outline">Try Again</Button>
        </div>
      )}

      {/* Ticket List */}
      {!loading && !error && (
        <FadeIn delay={0.2}>
          <Card>
            <CardHeader>
              <CardTitle>Your Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filtered.map((ticket) => (
                  <Link
                    key={ticket.id}
                    href={`/web/portal/support/${ticket.id}`}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors block"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
                        <MessageSquare className="w-5 h-5 text-violet-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium truncate">{ticket.title}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{ticket.id.slice(0, 8)}</span>
                          <span>&middot;</span>
                          <span className="capitalize">{ticket.category.toLowerCase().replace('_', ' ')}</span>
                          <span>&middot;</span>
                          <span>Updated {formatTimeAgo(ticket.updatedAt)}</span>
                        </div>
                        <SlaIndicator deadline={ticket.slaDeadline} breached={ticket.slaBreach} />
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-4">
                      <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                        {priorityLabels[ticket.priority]}
                      </Badge>
                      <Badge variant="outline" className={getStatusColor(ticket.status)}>
                        {statusLabels[ticket.status]}
                      </Badge>
                      {ticket._count.comments > 0 && (
                        <span className="text-xs text-muted-foreground">
                          {ticket._count.comments} {ticket._count.comments === 1 ? 'reply' : 'replies'}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
                {filtered.length === 0 && (
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No tickets found</h3>
                    <p className="text-muted-foreground">
                      {tickets.length === 0
                        ? "You haven't created any support tickets yet."
                        : 'Try adjusting your search or filters.'}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      )}

      {/* Help Card */}
      <FadeIn delay={0.3}>
        <Card>
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Our team is here to help with any questions or issues. Create a ticket and we&apos;ll respond within 24 hours.
            </p>
            <div className="flex gap-3">
              <Button asChild>
                <Link href="/web/portal/support/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Ticket
                </Link>
              </Button>
              <Button variant="outline">
                View Documentation
              </Button>
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  )
}
