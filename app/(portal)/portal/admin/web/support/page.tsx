'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  MessageSquare,
  Search,
  Filter,
  Loader2,
  ChevronDown,
  Clock,
  AlertTriangle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  BarChart3,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { FadeIn } from '@/components/animations'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

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
  client: { id: string; name: string; email: string; company: string | null }
  assignee: { id: string; name: string; email: string } | null
  _count: { comments: number }
}

type SortField = 'createdAt' | 'priority' | 'slaDeadline'
type SortDir = 'asc' | 'desc'

const statusFilters = ['all', 'OPEN', 'IN_PROGRESS', 'WAITING_CLIENT', 'RESOLVED', 'CLOSED']
const priorityFilters = ['all', 'URGENT', 'HIGH', 'MEDIUM', 'LOW']
const categoryFilters = ['all', 'GENERAL', 'BUG', 'FEATURE_REQUEST', 'BILLING', 'TECHNICAL']

const statusLabels: Record<string, string> = {
  OPEN: 'Open',
  IN_PROGRESS: 'In Progress',
  WAITING_CLIENT: 'Waiting',
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
  BUG: 'Bug',
  FEATURE_REQUEST: 'Feature',
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

const priorityOrder: Record<string, number> = {
  URGENT: 4,
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
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
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function SlaCell({ deadline, breached }: { deadline: string | null; breached: boolean }) {
  if (!deadline) return <span className="text-muted-foreground">-</span>
  if (breached) {
    return (
      <span className="flex items-center gap-1 text-xs text-red-500 font-medium">
        <AlertTriangle className="w-3 h-3" />
        Breached
      </span>
    )
  }
  const now = new Date()
  const dl = new Date(deadline)
  const diffMs = dl.getTime() - now.getTime()
  if (diffMs <= 0) {
    return (
      <span className="flex items-center gap-1 text-xs text-red-500 font-medium">
        <AlertTriangle className="w-3 h-3" />
        Breached
      </span>
    )
  }
  const hours = Math.floor(diffMs / (1000 * 60 * 60))
  const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
  const isWarning = hours < 4
  return (
    <span className={`flex items-center gap-1 text-xs ${isWarning ? 'text-amber-500 font-medium' : 'text-muted-foreground'}`}>
      <Clock className="w-3 h-3" />
      {hours > 24 ? `${Math.floor(hours / 24)}d` : hours > 0 ? `${hours}h ${mins}m` : `${mins}m`}
    </span>
  )
}

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortField, setSortField] = useState<SortField>('createdAt')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const fetchTickets = useCallback(async () => {
    try {
      setError(null)
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.set('status', statusFilter)
      if (priorityFilter !== 'all') params.set('priority', priorityFilter)
      if (categoryFilter !== 'all') params.set('category', categoryFilter)
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
  }, [statusFilter, priorityFilter, categoryFilter])

  useEffect(() => {
    fetchTickets()
  }, [fetchTickets])

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/tickets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      const data = await res.json()
      if (data.success) {
        setTickets((prev) =>
          prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
        )
      }
    } catch {
      // silent
    }
  }

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDir('desc')
    }
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3 ml-1 opacity-40" />
    return sortDir === 'asc'
      ? <ArrowUp className="w-3 h-3 ml-1" />
      : <ArrowDown className="w-3 h-3 ml-1" />
  }

  const sortedTickets = [...tickets]
    .filter((t) => {
      if (!search) return true
      const term = search.toLowerCase()
      return (
        t.title.toLowerCase().includes(term) ||
        t.id.toLowerCase().includes(term) ||
        (t.client.name?.toLowerCase().includes(term) ?? false) ||
        t.client.email.toLowerCase().includes(term) ||
        (t.client.company?.toLowerCase().includes(term) ?? false)
      )
    })
    .sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1
      if (sortField === 'createdAt') {
        return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * dir
      }
      if (sortField === 'priority') {
        return ((priorityOrder[a.priority] ?? 0) - (priorityOrder[b.priority] ?? 0)) * dir
      }
      if (sortField === 'slaDeadline') {
        const aTime = a.slaDeadline ? new Date(a.slaDeadline).getTime() : Infinity
        const bTime = b.slaDeadline ? new Date(b.slaDeadline).getTime() : Infinity
        return (aTime - bTime) * dir
      }
      return 0
    })

  const openCount = tickets.filter((t) => ['OPEN', 'IN_PROGRESS', 'WAITING_CLIENT'].includes(t.status)).length
  const breachedCount = tickets.filter((t) => t.slaBreach).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Support Tickets</h1>
            <p className="text-muted-foreground mt-1">
              Manage client support requests
              {openCount > 0 && (
                <Badge className="ml-2 bg-blue-500">{openCount} open</Badge>
              )}
              {breachedCount > 0 && (
                <Badge className="ml-2 bg-red-500">{breachedCount} SLA breached</Badge>
              )}
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/portal/admin/web/support/reports">
              <BarChart3 className="w-4 h-4 mr-2" />
              Reports
            </Link>
          </Button>
        </div>
      </FadeIn>

      {/* Search & Filters */}
      <FadeIn delay={0.1}>
        <div className="space-y-3">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search tickets, clients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Status Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-muted-foreground" />
              {statusFilters.map((s) => (
                <Button
                  key={s}
                  variant={statusFilter === s ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => { setStatusFilter(s); setLoading(true) }}
                >
                  {s === 'all' ? 'All Status' : statusLabels[s] || s}
                </Button>
              ))}
            </div>
            {/* Priority + Category Filters */}
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Priority: {priorityFilter === 'all' ? 'All' : priorityLabels[priorityFilter]}
                    <ChevronDown className="w-3 h-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {priorityFilters.map((p) => (
                    <DropdownMenuItem key={p} onClick={() => { setPriorityFilter(p); setLoading(true) }}>
                      {p === 'all' ? 'All Priorities' : priorityLabels[p]}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Category: {categoryFilter === 'all' ? 'All' : categoryLabels[categoryFilter]}
                    <ChevronDown className="w-3 h-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {categoryFilters.map((c) => (
                    <DropdownMenuItem key={c} onClick={() => { setCategoryFilter(c); setLoading(true) }}>
                      {c === 'all' ? 'All Categories' : categoryLabels[c]}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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

      {/* Ticket Table */}
      {!loading && !error && (
        <FadeIn delay={0.2}>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-4 font-medium">Ticket</th>
                      <th className="text-left p-4 font-medium">Client</th>
                      <th className="text-left p-4 font-medium">Category</th>
                      <th className="text-left p-4 font-medium">
                        <button
                          className="flex items-center hover:text-foreground transition-colors"
                          onClick={() => toggleSort('priority')}
                        >
                          Priority
                          <SortIcon field="priority" />
                        </button>
                      </th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">
                        <button
                          className="flex items-center hover:text-foreground transition-colors"
                          onClick={() => toggleSort('slaDeadline')}
                        >
                          SLA
                          <SortIcon field="slaDeadline" />
                        </button>
                      </th>
                      <th className="text-left p-4 font-medium">Assignee</th>
                      <th className="text-left p-4 font-medium">
                        <button
                          className="flex items-center hover:text-foreground transition-colors"
                          onClick={() => toggleSort('createdAt')}
                        >
                          Created
                          <SortIcon field="createdAt" />
                        </button>
                      </th>
                      <th className="text-left p-4 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedTickets.map((ticket) => (
                      <tr key={ticket.id} className="border-b hover:bg-muted/50">
                        <td className="p-4">
                          <div>
                            <Link
                              href={`/portal/admin/web/support/${ticket.id}`}
                              className="font-medium hover:text-violet-500 transition-colors"
                            >
                              {ticket.title}
                            </Link>
                            <p className="text-xs text-muted-foreground">{ticket.id.slice(0, 8)}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="text-sm">{ticket.client.name || ticket.client.email}</p>
                            {ticket.client.company && (
                              <p className="text-xs text-muted-foreground">{ticket.client.company}</p>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className="text-xs">
                            {categoryLabels[ticket.category]}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                            {priorityLabels[ticket.priority]}
                          </Badge>
                        </td>
                        <td className="p-4" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="flex items-center gap-1">
                                <Badge variant="outline" className={getStatusColor(ticket.status)}>
                                  {statusLabels[ticket.status]}
                                </Badge>
                                <ChevronDown className="w-3 h-3 text-muted-foreground" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              {(ALLOWED_TRANSITIONS[ticket.status] ?? []).map((value) => (
                                <DropdownMenuItem
                                  key={value}
                                  onClick={() => updateStatus(ticket.id, value)}
                                >
                                  <Badge variant="outline" className={`mr-2 ${getStatusColor(value)}`}>
                                    {statusLabels[value]}
                                  </Badge>
                                </DropdownMenuItem>
                              ))}
                              {(ALLOWED_TRANSITIONS[ticket.status] ?? []).length === 0 && (
                                <DropdownMenuItem disabled>
                                  No transitions available
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                        <td className="p-4">
                          <SlaCell deadline={ticket.slaDeadline} breached={ticket.slaBreach} />
                        </td>
                        <td className="p-4">
                          <span className="text-sm">
                            {ticket.assignee?.name || ticket.assignee?.email || (
                              <span className="text-muted-foreground">Unassigned</span>
                            )}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {formatDate(ticket.createdAt)}
                        </td>
                        <td className="p-4">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/portal/admin/web/support/${ticket.id}`}>
                              <Eye className="w-4 h-4" />
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {sortedTickets.length === 0 && !loading && (
                <div className="text-center py-12">
                  <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No tickets found</h3>
                  <p className="text-muted-foreground">
                    {tickets.length === 0
                      ? 'No support tickets yet.'
                      : 'Try adjusting your filters.'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </FadeIn>
      )}

      {/* Pipeline Summary */}
      {!loading && !error && (
        <FadeIn delay={0.3}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {statusFilters.slice(1).map((status) => {
              const count = tickets.filter((t) => t.status === status).length
              return (
                <Card key={status}>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-sm text-muted-foreground">
                      {statusLabels[status]}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </FadeIn>
      )}
    </div>
  )
}
