'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  FileText,
  Search,
  Filter,
  Mail,
  Phone,
  Loader2,
  ChevronDown,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  Globe,
  Clock,
  Save,
  BarChart3,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FadeIn } from '@/components/animations'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface QuoteRequest {
  id: string
  fullName: string
  email: string
  phone: string | null
  company: string | null
  website: string | null
  projectType: string
  services: string[]
  pageCount: string | null
  needsEcommerce: boolean
  cmsPreference: string | null
  budgetRange: string
  timeline: string
  description: string
  referralSource: string | null
  status: string
  notes: string | null
  estimatedAmount: number | null
  leadScore: number
  leadQuality: string | null
  createdAt: string
  updatedAt: string
}

interface ActivityEntry {
  id: string
  action: string
  metadata: Record<string, string> | null
  createdAt: string
}

type SortField = 'createdAt' | 'leadScore' | 'budgetRange'
type SortDir = 'asc' | 'desc'

const statusFilters = ['all', 'NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'ACCEPTED', 'DECLINED']

const statusLabels: Record<string, string> = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  QUALIFIED: 'Qualified',
  PROPOSAL: 'Proposal',
  ACCEPTED: 'Accepted',
  DECLINED: 'Declined',
}

const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  NEW: ['CONTACTED', 'DECLINED'],
  CONTACTED: ['QUALIFIED', 'DECLINED'],
  QUALIFIED: ['PROPOSAL', 'DECLINED'],
  PROPOSAL: ['ACCEPTED', 'DECLINED', 'QUALIFIED'],
  ACCEPTED: [],
  DECLINED: ['NEW'],
}

const budgetOrder: Record<string, number> = {
  'unsure': 0,
  '2k-5k': 1,
  '5k-10k': 2,
  '10k-25k': 3,
  '25k+': 4,
}

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    'NEW': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    'CONTACTED': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    'QUALIFIED': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    'PROPOSAL': 'bg-violet-500/10 text-violet-500 border-violet-500/20',
    'ACCEPTED': 'bg-green-500/10 text-green-500 border-green-500/20',
    'DECLINED': 'bg-red-500/10 text-red-500 border-red-500/20',
  }
  return colors[status] || 'bg-gray-500/10 text-gray-500'
}

function getLeadBadge(quality: string | null) {
  if (!quality) return null
  const styles: Record<string, string> = {
    hot: 'bg-red-500/10 text-red-500 border-red-500/20',
    warm: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    cold: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
  }
  return (
    <Badge variant="outline" className={styles[quality] || ''}>
      {quality}
    </Badge>
  )
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

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [sortField, setSortField] = useState<SortField>('createdAt')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  // Detail dialog state
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null)
  const [activity, setActivity] = useState<ActivityEntry[]>([])
  const [activityLoading, setActivityLoading] = useState(false)
  const [editNotes, setEditNotes] = useState('')
  const [savingNotes, setSavingNotes] = useState(false)
  const [statusError, setStatusError] = useState<string | null>(null)

  const fetchQuotes = useCallback(async () => {
    try {
      setError(null)
      const url = filter === 'all' ? '/api/quotes' : `/api/quotes?status=${filter}`
      const res = await fetch(url)
      const data = await res.json()
      if (data.success) {
        setQuotes(data.data)
      } else {
        setError('Failed to load quotes')
      }
    } catch {
      setError('Failed to load quotes')
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    fetchQuotes()
  }, [fetchQuotes])

  const openDetail = async (quote: QuoteRequest) => {
    setSelectedQuote(quote)
    setEditNotes(quote.notes || '')
    setStatusError(null)
    setActivityLoading(true)
    try {
      const res = await fetch(`/api/quotes/${quote.id}?activity=true`)
      const data = await res.json()
      if (data.activity) setActivity(data.activity)
    } catch {
      setActivity([])
    } finally {
      setActivityLoading(false)
    }
  }

  const updateStatus = async (id: string, newStatus: string) => {
    setStatusError(null)
    try {
      const res = await fetch(`/api/quotes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      const data = await res.json()
      if (data.success) {
        setQuotes((prev) =>
          prev.map((q) => (q.id === id ? { ...q, status: newStatus } : q))
        )
        if (selectedQuote?.id === id) {
          setSelectedQuote((prev) => prev ? { ...prev, status: newStatus } : null)
          // Refresh activity
          const actRes = await fetch(`/api/quotes/${id}?activity=true`)
          const actData = await actRes.json()
          if (actData.activity) setActivity(actData.activity)
        }
      } else {
        setStatusError(data.error || 'Failed to update status')
      }
    } catch {
      setStatusError('Failed to update status')
    }
  }

  const saveNotes = async () => {
    if (!selectedQuote) return
    setSavingNotes(true)
    try {
      const res = await fetch(`/api/quotes/${selectedQuote.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: editNotes }),
      })
      const data = await res.json()
      if (data.success) {
        setQuotes((prev) =>
          prev.map((q) => (q.id === selectedQuote.id ? { ...q, notes: editNotes } : q))
        )
        setSelectedQuote((prev) => prev ? { ...prev, notes: editNotes } : null)
        // Refresh activity
        const actRes = await fetch(`/api/quotes/${selectedQuote.id}?activity=true`)
        const actData = await actRes.json()
        if (actData.activity) setActivity(actData.activity)
      }
    } catch {
      // silent
    } finally {
      setSavingNotes(false)
    }
  }

  // Sorting
  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDir(field === 'createdAt' ? 'desc' : 'desc')
    }
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3 ml-1 opacity-40" />
    return sortDir === 'asc'
      ? <ArrowUp className="w-3 h-3 ml-1" />
      : <ArrowDown className="w-3 h-3 ml-1" />
  }

  const sortedQuotes = [...quotes]
    .filter((quote) => {
      const term = search.toLowerCase()
      return (
        quote.fullName.toLowerCase().includes(term) ||
        (quote.company?.toLowerCase().includes(term) ?? false) ||
        quote.email.toLowerCase().includes(term) ||
        quote.projectType.toLowerCase().includes(term)
      )
    })
    .sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1
      if (sortField === 'createdAt') {
        return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * dir
      }
      if (sortField === 'leadScore') {
        return (a.leadScore - b.leadScore) * dir
      }
      if (sortField === 'budgetRange') {
        return ((budgetOrder[a.budgetRange] ?? 0) - (budgetOrder[b.budgetRange] ?? 0)) * dir
      }
      return 0
    })

  const newQuotesCount = quotes.filter((q) => q.status === 'NEW').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Quote Requests</h1>
            <p className="text-muted-foreground mt-1">
              Manage and respond to quote requests
              {newQuotesCount > 0 && (
                <Badge className="ml-2 bg-red-500">{newQuotesCount} new</Badge>
              )}
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/web/admin/quotes/reports">
              <BarChart3 className="w-4 h-4 mr-2" />
              Reports
            </Link>
          </Button>
        </div>
      </FadeIn>

      {/* Filters */}
      <FadeIn delay={0.1}>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search quotes..."
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
                onClick={() => setFilter(status)}
              >
                {status === 'all' ? 'All' : statusLabels[status] || status}
              </Button>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={fetchQuotes} variant="outline">Try Again</Button>
        </div>
      )}

      {/* Quotes Table */}
      {!loading && !error && (
        <FadeIn delay={0.2}>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-4 font-medium">Client</th>
                      <th className="text-left p-4 font-medium">Project</th>
                      <th className="text-left p-4 font-medium">
                        <button
                          className="flex items-center hover:text-foreground transition-colors"
                          onClick={() => toggleSort('budgetRange')}
                        >
                          Budget
                          <SortIcon field="budgetRange" />
                        </button>
                      </th>
                      <th className="text-left p-4 font-medium">
                        <button
                          className="flex items-center hover:text-foreground transition-colors"
                          onClick={() => toggleSort('leadScore')}
                        >
                          Score
                          <SortIcon field="leadScore" />
                        </button>
                      </th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">
                        <button
                          className="flex items-center hover:text-foreground transition-colors"
                          onClick={() => toggleSort('createdAt')}
                        >
                          Date
                          <SortIcon field="createdAt" />
                        </button>
                      </th>
                      <th className="text-left p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedQuotes.map((quote) => (
                      <tr
                        key={quote.id}
                        className="border-b hover:bg-muted/50 cursor-pointer"
                        onClick={() => openDetail(quote)}
                      >
                        <td className="p-4">
                          <div>
                            <p className="font-medium">{quote.fullName}</p>
                            <p className="text-sm text-muted-foreground">{quote.email}</p>
                            {quote.company && (
                              <p className="text-xs text-muted-foreground">{quote.company}</p>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="capitalize">{quote.projectType.replace(/-/g, ' ')}</p>
                          <p className="text-xs text-muted-foreground">
                            {quote.services.join(', ')}
                          </p>
                        </td>
                        <td className="p-4">{quote.budgetRange}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm">{quote.leadScore}</span>
                            {getLeadBadge(quote.leadQuality)}
                          </div>
                        </td>
                        <td className="p-4" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="flex items-center gap-1">
                                <Badge variant="outline" className={getStatusColor(quote.status)}>
                                  {statusLabels[quote.status] || quote.status}
                                </Badge>
                                <ChevronDown className="w-3 h-3 text-muted-foreground" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              {(ALLOWED_TRANSITIONS[quote.status] ?? []).map((value) => (
                                <DropdownMenuItem
                                  key={value}
                                  onClick={() => updateStatus(quote.id, value)}
                                >
                                  <Badge variant="outline" className={`mr-2 ${getStatusColor(value)}`}>
                                    {statusLabels[value]}
                                  </Badge>
                                </DropdownMenuItem>
                              ))}
                              {(ALLOWED_TRANSITIONS[quote.status] ?? []).length === 0 && (
                                <DropdownMenuItem disabled>
                                  No transitions available
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                        <td className="p-4 text-sm">
                          {formatDate(quote.createdAt)}
                        </td>
                        <td className="p-4" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openDetail(quote)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              asChild
                            >
                              <a href={`mailto:${quote.email}`}>
                                <Mail className="w-4 h-4" />
                              </a>
                            </Button>
                            {quote.phone && (
                              <Button
                                variant="ghost"
                                size="icon"
                                asChild
                              >
                                <a href={`tel:${quote.phone}`}>
                                  <Phone className="w-4 h-4" />
                                </a>
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {sortedQuotes.length === 0 && !loading && (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No quotes found</h3>
                  <p className="text-muted-foreground">
                    {quotes.length === 0
                      ? 'No quote requests yet. They will appear here when submitted.'
                      : 'Try adjusting your search or filters'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </FadeIn>
      )}

      {/* Quote Pipeline Summary */}
      {!loading && !error && (
        <FadeIn delay={0.3}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {statusFilters.slice(1).map((status) => {
              const count = quotes.filter((q) => q.status === status).length
              return (
                <Card key={status}>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-sm text-muted-foreground">
                      {statusLabels[status] || status}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </FadeIn>
      )}

      {/* Quote Detail Dialog */}
      <Dialog open={!!selectedQuote} onOpenChange={(open) => !open && setSelectedQuote(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedQuote && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  {selectedQuote.fullName}
                  <Badge variant="outline" className={getStatusColor(selectedQuote.status)}>
                    {statusLabels[selectedQuote.status]}
                  </Badge>
                  {getLeadBadge(selectedQuote.leadQuality)}
                </DialogTitle>
                <DialogDescription>
                  Submitted {formatDate(selectedQuote.createdAt)} &middot; Score: {selectedQuote.leadScore}/100
                </DialogDescription>
              </DialogHeader>

              {statusError && (
                <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
                  {statusError}
                </div>
              )}

              <Tabs defaultValue="details" className="mt-2">
                <TabsList className="w-full">
                  <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
                  <TabsTrigger value="notes" className="flex-1">Notes</TabsTrigger>
                  <TabsTrigger value="activity" className="flex-1">Activity</TabsTrigger>
                </TabsList>

                {/* Details Tab */}
                <TabsContent value="details" className="space-y-4 mt-4">
                  {/* Contact Info */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Contact</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Email:</span>{' '}
                        <a href={`mailto:${selectedQuote.email}`} className="text-pink-500 hover:underline">
                          {selectedQuote.email}
                        </a>
                      </div>
                      {selectedQuote.phone && (
                        <div>
                          <span className="text-muted-foreground">Phone:</span>{' '}
                          <a href={`tel:${selectedQuote.phone}`} className="text-pink-500 hover:underline">
                            {selectedQuote.phone}
                          </a>
                        </div>
                      )}
                      {selectedQuote.company && (
                        <div>
                          <span className="text-muted-foreground">Company:</span> {selectedQuote.company}
                        </div>
                      )}
                      {selectedQuote.website && (
                        <div className="flex items-center gap-1">
                          <Globe className="w-3 h-3 text-muted-foreground" />
                          <a href={selectedQuote.website} target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:underline text-sm truncate">
                            {selectedQuote.website.replace(/^https?:\/\//, '')}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Project</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div><span className="text-muted-foreground">Type:</span> <span className="capitalize">{selectedQuote.projectType}</span></div>
                      <div><span className="text-muted-foreground">Budget:</span> {selectedQuote.budgetRange}</div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-muted-foreground">Timeline:</span> {selectedQuote.timeline}
                      </div>
                      {selectedQuote.pageCount && (
                        <div><span className="text-muted-foreground">Pages:</span> {selectedQuote.pageCount}</div>
                      )}
                      <div className="col-span-2">
                        <span className="text-muted-foreground">Services:</span>{' '}
                        {selectedQuote.services.map((s) => (
                          <Badge key={s} variant="outline" className="mr-1 mb-1 capitalize">{s}</Badge>
                        ))}
                      </div>
                      {selectedQuote.needsEcommerce && (
                        <div className="col-span-2">
                          <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">E-commerce needed</Badge>
                        </div>
                      )}
                      {selectedQuote.cmsPreference && (
                        <div><span className="text-muted-foreground">CMS:</span> {selectedQuote.cmsPreference}</div>
                      )}
                      {selectedQuote.referralSource && (
                        <div><span className="text-muted-foreground">Source:</span> {selectedQuote.referralSource}</div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Description</h4>
                    <p className="text-sm whitespace-pre-wrap bg-muted/50 p-3 rounded-md">
                      {selectedQuote.description}
                    </p>
                  </div>

                  {/* Status Actions */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Update Status</h4>
                    <div className="flex gap-2 flex-wrap">
                      {(ALLOWED_TRANSITIONS[selectedQuote.status] ?? []).map((value) => (
                        <Button
                          key={value}
                          variant="outline"
                          size="sm"
                          onClick={() => updateStatus(selectedQuote.id, value)}
                        >
                          <Badge variant="outline" className={`mr-1 ${getStatusColor(value)}`}>
                            {statusLabels[value]}
                          </Badge>
                        </Button>
                      ))}
                      {(ALLOWED_TRANSITIONS[selectedQuote.status] ?? []).length === 0 && (
                        <p className="text-sm text-muted-foreground">No transitions available (terminal state)</p>
                      )}
                    </div>
                  </div>
                </TabsContent>

                {/* Notes Tab */}
                <TabsContent value="notes" className="space-y-4 mt-4">
                  <Textarea
                    placeholder="Add internal notes about this quote..."
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    rows={6}
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      Notes are internal only — the client will not see them.
                    </p>
                    <Button
                      size="sm"
                      onClick={saveNotes}
                      disabled={savingNotes || editNotes === (selectedQuote.notes || '')}
                    >
                      {savingNotes ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-1" />
                      ) : (
                        <Save className="w-4 h-4 mr-1" />
                      )}
                      Save Notes
                    </Button>
                  </div>
                </TabsContent>

                {/* Activity Tab */}
                <TabsContent value="activity" className="mt-4">
                  {activityLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : activity.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">No activity yet</p>
                  ) : (
                    <div className="space-y-3">
                      {activity.map((entry) => (
                        <div key={entry.id} className="flex items-start gap-3 text-sm">
                          <div className="w-2 h-2 rounded-full bg-pink-500 mt-1.5 shrink-0" />
                          <div className="flex-1">
                            <p>
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
                              {entry.action === 'notes_updated' && 'Notes updated'}
                              {entry.action === 'estimate_updated' && entry.metadata && (
                                <>Estimate updated to ${entry.metadata.to}</>
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground">{formatDateTime(entry.createdAt)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
