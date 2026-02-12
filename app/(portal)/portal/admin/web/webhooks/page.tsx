'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Webhook,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  ChevronRight,
  Terminal,
  Settings,
  Copy,
  ExternalLink,
  AlertTriangle,
  Filter,
  Search,
  MoreHorizontal,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FadeIn } from '@/components/animations'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

interface WebhookEvent {
  id: string
  source: string
  eventType: string
  payload: Record<string, unknown>
  processed: boolean
  processedAt: string | null
  error: string | null
  createdAt: string
}

interface WebhookEndpoint {
  name: string
  source: string
  endpoint: string
  status: 'active' | 'inactive'
  supportedEvents: string[]
}

const WEBHOOK_ENDPOINTS: WebhookEndpoint[] = [
  {
    name: 'Stripe',
    source: 'stripe',
    endpoint: '/api/webhooks/stripe',
    status: 'active',
    supportedEvents: [
      'invoice.paid',
      'invoice.payment_failed',
      'customer.subscription.created',
      'customer.subscription.updated',
      'customer.subscription.deleted',
    ],
  },
  {
    name: 'GitHub',
    source: 'github',
    endpoint: '/api/webhooks/github',
    status: 'active',
    supportedEvents: ['push', 'pull_request', 'issues'],
  },
]

const SOURCE_COLORS: Record<string, string> = {
  stripe: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  github: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  clerk: 'bg-violet-500/10 text-violet-500 border-violet-500/20',
  test: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
}

export default function WebhooksAdminPage() {
  const [events, setEvents] = useState<WebhookEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<WebhookEvent | null>(null)
  const [sourceFilter, setSourceFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [retrying, setRetrying] = useState<string | null>(null)

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/webhooks/events')
      if (!response.ok) throw new Error('Failed to fetch events')
      const data = await response.json()
      if (data.success) {
        setEvents(data.data)
      }
    } catch (error) {
      console.error('Error fetching webhook events:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  const handleRetry = async (eventId: string) => {
    try {
      setRetrying(eventId)
      const response = await fetch('/api/webhooks/retry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId }),
      })
      const data = await response.json()
      if (data.success) {
        await fetchEvents()
      } else {
        alert(`Retry failed: ${data.error}`)
      }
    } catch (error) {
      console.error('Error retrying event:', error)
      alert('Failed to retry event')
    } finally {
      setRetrying(null)
    }
  }

  const handleCopyEndpoint = (endpoint: string) => {
    const fullUrl = `${window.location.origin}${endpoint}`
    navigator.clipboard.writeText(fullUrl)
  }

  const filteredEvents = events.filter((event) => {
    if (sourceFilter !== 'all' && event.source !== sourceFilter) return false
    if (statusFilter === 'processed' && !event.processed) return false
    if (statusFilter === 'failed' && (event.processed || !event.error)) return false
    if (statusFilter === 'pending' && (event.processed || event.error)) return false
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        event.eventType.toLowerCase().includes(query) ||
        event.id.toLowerCase().includes(query) ||
        event.source.toLowerCase().includes(query)
      )
    }
    return true
  })

  const stats = {
    total: events.length,
    processed: events.filter((e) => e.processed).length,
    failed: events.filter((e) => !e.processed && e.error).length,
    pending: events.filter((e) => !e.processed && !e.error).length,
  }

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Webhooks</h1>
            <p className="text-muted-foreground mt-1">
              Manage webhook endpoints and monitor event processing
            </p>
          </div>
          <Button onClick={fetchEvents} variant="outline" disabled={loading}>
            <RefreshCw className={cn('w-4 h-4 mr-2', loading && 'animate-spin')} />
            Refresh
          </Button>
        </div>
      </FadeIn>

      {/* Stats */}
      <FadeIn delay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground">Total Events</p>
              <p className="text-3xl font-bold mt-2">{stats.total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground">Processed</p>
              <p className="text-3xl font-bold mt-2 text-green-500">{stats.processed}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground">Failed</p>
              <p className="text-3xl font-bold mt-2 text-red-500">{stats.failed}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground">Pending</p>
              <p className="text-3xl font-bold mt-2 text-amber-500">{stats.pending}</p>
            </CardContent>
          </Card>
        </div>
      </FadeIn>

      <Tabs defaultValue="events" className="space-y-6">
        <TabsList>
          <TabsTrigger value="events">Event Log</TabsTrigger>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-6">
          {/* Filters */}
          <FadeIn delay={0.2}>
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search events..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Select value={sourceFilter} onValueChange={setSourceFilter}>
                      <SelectTrigger className="w-[140px]">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sources</SelectItem>
                        <SelectItem value="stripe">Stripe</SelectItem>
                        <SelectItem value="github">GitHub</SelectItem>
                        <SelectItem value="test">Test</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="processed">Processed</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Events List */}
          <FadeIn delay={0.3}>
            <Card>
              <CardHeader>
                <CardTitle>Recent Events</CardTitle>
                <CardDescription>
                  {filteredEvents.length} events ({events.length} total)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredEvents.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Webhook className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No webhook events found</p>
                    <p className="text-sm">Events will appear here when webhooks are received</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredEvents.map((event) => (
                      <EventRow
                        key={event.id}
                        event={event}
                        onView={() => setSelectedEvent(event)}
                        onRetry={() => handleRetry(event.id)}
                        retrying={retrying === event.id}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </FadeIn>
        </TabsContent>

        <TabsContent value="endpoints" className="space-y-6">
          <FadeIn delay={0.2}>
            <div className="grid gap-4">
              {WEBHOOK_ENDPOINTS.map((endpoint) => (
                <Card key={endpoint.source}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{endpoint.name}</h3>
                          <Badge
                            variant="outline"
                            className={
                              endpoint.status === 'active'
                                ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                : 'bg-gray-500/10 text-gray-500 border-gray-500/20'
                            }
                          >
                            {endpoint.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {endpoint.supportedEvents.length} supported events
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyEndpoint(endpoint.endpoint)}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy URL
                      </Button>
                    </div>
                    <div className="mt-4 p-3 bg-muted rounded-lg font-mono text-sm flex items-center justify-between">
                      <span className="text-muted-foreground">
                        {typeof window !== 'undefined' ? window.location.origin : ''}
                        {endpoint.endpoint}
                      </span>
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Supported Events:</p>
                      <div className="flex flex-wrap gap-2">
                        {endpoint.supportedEvents.map((evt) => (
                          <Badge key={evt} variant="secondary" className="text-xs">
                            {evt}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </FadeIn>
        </TabsContent>
      </Tabs>

      {/* Event Detail Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>Webhook Event</span>
              {selectedEvent && (
                <Badge variant="outline" className={SOURCE_COLORS[selectedEvent.source]}>
                  {selectedEvent.source}
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              {selectedEvent && (
                <span className="font-mono text-xs">{selectedEvent.id}</span>
              )}
            </DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4 overflow-auto max-h-[60vh]">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Event Type</p>
                  <p className="font-mono text-sm">{selectedEvent.eventType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <div className="flex items-center gap-2">
                    {selectedEvent.processed ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Processed</span>
                      </>
                    ) : selectedEvent.error ? (
                      <>
                        <XCircle className="w-4 h-4 text-red-500" />
                        <span>Failed</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-4 h-4 text-amber-500" />
                        <span>Pending</span>
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Created</p>
                  <p className="text-sm">
                    {new Date(selectedEvent.createdAt).toLocaleString()}
                  </p>
                </div>
                {selectedEvent.processedAt && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Processed At</p>
                    <p className="text-sm">
                      {new Date(selectedEvent.processedAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              {selectedEvent.error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div className="flex items-center gap-2 text-red-500 mb-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="font-medium">Error</span>
                  </div>
                  <p className="text-sm text-red-500/80">{selectedEvent.error}</p>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Payload</p>
                <pre className="p-4 bg-muted rounded-lg overflow-auto text-xs font-mono">
                  {JSON.stringify(selectedEvent.payload, null, 2)}
                </pre>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setSelectedEvent(null)}>
              Close
            </Button>
            {selectedEvent && !selectedEvent.processed && (
              <Button
                onClick={() => {
                  handleRetry(selectedEvent.id)
                  setSelectedEvent(null)
                }}
                disabled={retrying === selectedEvent?.id}
              >
                <RefreshCw
                  className={cn('w-4 h-4 mr-2', retrying === selectedEvent?.id && 'animate-spin')}
                />
                Retry
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function EventRow({
  event,
  onView,
  onRetry,
  retrying,
}: {
  event: WebhookEvent
  onView: () => void
  onRetry: () => void
  retrying: boolean
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="border rounded-lg overflow-hidden">
      <div
        className="flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setExpanded(!expanded)
            }}
            className="text-muted-foreground hover:text-foreground"
          >
            {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          <Badge variant="outline" className={SOURCE_COLORS[event.source]}>
            {event.source}
          </Badge>
          <div>
            <p className="font-medium">{event.eventType}</p>
            <p className="text-xs text-muted-foreground font-mono">{event.id.slice(0, 16)}...</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {new Date(event.createdAt).toLocaleString()}
          </span>
          {event.processed ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : event.error ? (
            <XCircle className="w-5 h-5 text-red-500" />
          ) : (
            <Clock className="w-5 h-5 text-amber-500" />
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onView}>
                <Terminal className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
              {!event.processed && (
                <DropdownMenuItem onClick={onRetry} disabled={retrying}>
                  <RefreshCw className={cn('w-4 h-4 mr-2', retrying && 'animate-spin')} />
                  Retry
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {expanded && (
        <div className="px-4 pb-4 border-t bg-muted/30">
          <pre className="mt-4 p-4 bg-muted rounded-lg overflow-auto text-xs font-mono max-h-64">
            {JSON.stringify(event.payload, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
