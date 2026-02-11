'use client'

import { useState, useEffect, useCallback } from 'react'
import { PageHeader } from '@/components/labs-dashboard/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Search, Loader2, Eye, Send, Copy, MoreHorizontal, Trash2, FileText } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface Quote {
  id: string
  quoteNumber: string
  title: string
  description: string | null
  status: string
  subtotal: number
  taxAmount: number | null
  total: number
  validUntil: string | null
  createdAt: string
  sentAt: string | null
  acceptedAt: string | null
  declinedAt: string | null
  clientId: string
  projectId: string | null
  client: {
    id: string
    name: string | null
    email: string
    company: string | null
  }
  project: {
    id: string
    title: string
  } | null
  lineItems: Array<{
    id: string
    description: string
    quantity: number
    unitPrice: number
    total: number
  }>
  _count: {
    lineItems: number
  }
}

const statusOptions = [
  { value: 'ALL', label: 'All Statuses' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'SENT', label: 'Sent' },
  { value: 'VIEWED', label: 'Viewed' },
  { value: 'ACCEPTED', label: 'Accepted' },
  { value: 'DECLINED', label: 'Declined' },
  { value: 'EXPIRED', label: 'Expired' },
]

const statusColors: Record<string, string> = {
  DRAFT: 'bg-gray-500',
  SENT: 'bg-blue-500',
  VIEWED: 'bg-purple-500',
  ACCEPTED: 'bg-green-500',
  DECLINED: 'bg-red-500',
  EXPIRED: 'bg-orange-500',
}

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [deleteQuoteId, setDeleteQuoteId] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchQuotes = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (statusFilter !== 'ALL') params.append('status', statusFilter)
      if (searchQuery) params.append('search', searchQuery)
      params.append('sortBy', sortBy)
      params.append('sortOrder', sortOrder)

      const response = await fetch(`/api/labs/quotes?${params.toString()}`)
      const result = await response.json()

      if (result.success) {
        setQuotes(result.data)
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to fetch quotes',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch quotes',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [statusFilter, searchQuery, sortBy, sortOrder, toast])

  useEffect(() => {
    fetchQuotes()
  }, [fetchQuotes])

  const handleSend = async (id: string) => {
    try {
      const response = await fetch(`/api/labs/quotes/${id}/send`, {
        method: 'POST',
      })
      const result = await response.json()

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Quote sent successfully',
        })
        fetchQuotes()
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to send quote',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send quote',
        variant: 'destructive',
      })
    }
  }

  const handleDuplicate = async (quote: Quote) => {
    try {
      const response = await fetch('/api/labs/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${quote.title} (Copy)`,
          description: quote.description,
          clientId: quote.clientId,
          projectId: quote.projectId,
          lineItems: quote.lineItems.map(item => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
          taxRate: quote.taxAmount ? (quote.taxAmount / quote.subtotal) * 100 : 0,
          validUntil: quote.validUntil,
          notes: '',
          terms: '',
        }),
      })
      const result = await response.json()

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Quote duplicated successfully',
        })
        fetchQuotes()
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to duplicate quote',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to duplicate quote',
        variant: 'destructive',
      })
    }
  }

  const handleDelete = async () => {
    if (!deleteQuoteId) return

    try {
      const response = await fetch(`/api/labs/quotes/${deleteQuoteId}`, {
        method: 'DELETE',
      })
      const result = await response.json()

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Quote deleted successfully',
        })
        fetchQuotes()
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to delete quote',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete quote',
        variant: 'destructive',
      })
    } finally {
      setDeleteQuoteId(null)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Quotes & Estimates"
        description="Create and manage client quotes"
      />

      {/* Actions Bar */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search quotes..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Date Created</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="total">Total Amount</SelectItem>
              <SelectItem value="validUntil">Valid Until</SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Link href="/labs/dashboard/quotes/new">
          <Button className="bg-cyan-600 hover:bg-cyan-700 w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            New Quote
          </Button>
        </Link>
      </div>

      {/* Quotes Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Quotes</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
            </div>
          ) : quotes.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No quotes found</h3>
              <p className="text-muted-foreground mb-4">
                Create your first quote to get started
              </p>
              <Link href="/labs/dashboard/quotes/new">
                <Button className="bg-cyan-600 hover:bg-cyan-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Quote
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Quote #</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Title</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Client</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Total</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Valid Until</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {quotes.map((quote) => (
                    <tr key={quote.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-mono text-sm">{quote.quoteNumber}</td>
                      <td className="py-3 px-4">
                        <div className="font-medium">{quote.title}</div>
                        {quote.project && (
                          <div className="text-sm text-muted-foreground">
                            Project: {quote.project.title}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div>{quote.client.name || quote.client.email}</div>
                        {quote.client.company && (
                          <div className="text-sm text-muted-foreground">{quote.client.company}</div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={`${statusColors[quote.status]} text-white`}>
                          {quote.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right font-medium">
                        {formatCurrency(quote.total)}
                      </td>
                      <td className="py-3 px-4">
                        {quote.validUntil ? (
                          <span className={new Date(quote.validUntil) < new Date() ? 'text-red-500' : ''}>
                            {formatDate(quote.validUntil)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/labs/dashboard/quotes/${quote.id}`}>
                                <Eye className="w-4 h-4 mr-2" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/labs/dashboard/quotes/${quote.id}/preview`}>
                                <FileText className="w-4 h-4 mr-2" />
                                Preview
                              </Link>
                            </DropdownMenuItem>
                            {quote.status === 'DRAFT' && (
                              <DropdownMenuItem onClick={() => handleSend(quote.id)}>
                                <Send className="w-4 h-4 mr-2" />
                                Send to Client
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleDuplicate(quote)}>
                              <Copy className="w-4 h-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => setDeleteQuoteId(quote.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteQuoteId} onOpenChange={() => setDeleteQuoteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the quote.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}