'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Ticket,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  User,
} from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

interface SupportTicket {
  id: string
  title: string
  description: string
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  category: string
  createdAt: Date
  updatedAt: Date
  client: {
    name: string | null
    email: string
    company: string | null
  }
  comments: Array<{
    id: string
    content: string
    createdAt: Date
    authorName: string
  }>
}

interface SupportTicketResponsesProps {
  onStatsChange?: () => void
}

const PRIORITY_CONFIG = {
  LOW: { label: 'Low', color: 'bg-gray-500', icon: Clock },
  MEDIUM: { label: 'Medium', color: 'bg-blue-500', icon: AlertCircle },
  HIGH: { label: 'High', color: 'bg-orange-500', icon: AlertCircle },
  URGENT: { label: 'Urgent', color: 'bg-red-500', icon: AlertCircle },
}

const STATUS_CONFIG = {
  OPEN: { label: 'Open', color: 'bg-yellow-500', icon: Clock },
  IN_PROGRESS: { label: 'In Progress', color: 'bg-blue-500', icon: Clock },
  RESOLVED: { label: 'Resolved', color: 'bg-green-500', icon: CheckCircle2 },
  CLOSED: { label: 'Closed', color: 'bg-gray-500', icon: CheckCircle2 },
}

export function SupportTicketResponses({ onStatsChange }: SupportTicketResponsesProps) {
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [responseText, setResponseText] = useState('')
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    loadTickets()
  }, [statusFilter, priorityFilter])

  const loadTickets = async () => {
    try {
      let url = '/api/support-tickets'
      const params = new URLSearchParams()
      
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (priorityFilter !== 'all') params.append('priority', priorityFilter)
      
      if (params.toString()) url += `?${params.toString()}`

      const response = await fetch(url)
      const result = await response.json()
      
      if (result.success) {
        setTickets(result.data)
      }
    } catch (error) {
      console.error('Failed to load support tickets:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const sendResponse = async () => {
    if (!selectedTicket || !responseText.trim()) return

    setIsSending(true)
    try {
      const response = await fetch(`/api/support-tickets/${selectedTicket.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: responseText,
          authorName: 'Admin',
        }),
      })

      const result = await response.json()
      if (result.success) {
        setResponseText('')
        await loadTickets()
        onStatsChange?.()
        // Reload the selected ticket to show new comment
        const ticketRes = await fetch(`/api/support-tickets/${selectedTicket.id}`)
        const ticketData = await ticketRes.json()
        if (ticketData.success) {
          setSelectedTicket(ticketData.data)
        }
      }
    } catch (error) {
      console.error('Failed to send response:', error)
    } finally {
      setIsSending(false)
    }
  }

  const updateTicketStatus = async (status: string) => {
    if (!selectedTicket) return

    try {
      const response = await fetch(`/api/support-tickets/${selectedTicket.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      const result = await response.json()
      if (result.success) {
        await loadTickets()
        setSelectedTicket(result.data)
        onStatsChange?.()
      }
    } catch (error) {
      console.error('Failed to update ticket status:', error)
    }
  }

  const filteredTickets = tickets.filter((ticket) => {
    if (statusFilter !== 'all' && ticket.status !== statusFilter) return false
    if (priorityFilter !== 'all' && ticket.priority !== priorityFilter) return false
    return true
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-6 h-6 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Loading support tickets...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="OPEN">Open</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="RESOLVED">Resolved</SelectItem>
              <SelectItem value="CLOSED">Closed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="URGENT">Urgent</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="LOW">Low</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-muted-foreground">
              {filteredTickets.length} ticket{filteredTickets.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </Card>

      {/* Tickets List */}
      <div className="grid gap-4">
        {filteredTickets.length === 0 ? (
          <Card className="p-12 text-center border-dashed">
            <Ticket className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No tickets found</h3>
            <p className="text-sm text-muted-foreground">
              All support tickets matching your filters have been addressed
            </p>
          </Card>
        ) : (
          filteredTickets.map((ticket) => {
            const statusInfo = STATUS_CONFIG[ticket.status]
            const priorityInfo = PRIORITY_CONFIG[ticket.priority]

            return (
              <Card key={ticket.id} className="p-6 cursor-pointer hover:shadow-md transition-shadow">
                <div onClick={() => setSelectedTicket(ticket)}>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={cn('gap-1', statusInfo.color, 'text-white')}>
                          {statusInfo.label}
                        </Badge>
                        <Badge className={cn('gap-1', priorityInfo.color, 'text-white')}>
                          {priorityInfo.label}
                        </Badge>
                        <Badge variant="outline">{ticket.category}</Badge>
                      </div>
                      <h3 className="text-lg font-semibold mb-1">{ticket.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {ticket.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>{ticket.client.name || ticket.client.email}</span>
                      {ticket.client.company && (
                        <span className="text-xs">({ticket.client.company})</span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-muted-foreground">
                      {ticket.comments.length > 0 && (
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>{ticket.comments.length}</span>
                        </div>
                      )}
                      <span className="text-xs">
                        {format(new Date(ticket.createdAt), 'MMM d, h:mm a')}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })
        )}
      </div>

      {/* Ticket Detail Dialog */}
      <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
          {selectedTicket && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <DialogTitle className="text-xl mb-2">{selectedTicket.title}</DialogTitle>
                    <div className="flex items-center gap-2">
                      <Badge className={cn('gap-1', STATUS_CONFIG[selectedTicket.status].color, 'text-white')}>
                        {STATUS_CONFIG[selectedTicket.status].label}
                      </Badge>
                      <Badge className={cn('gap-1', PRIORITY_CONFIG[selectedTicket.priority].color, 'text-white')}>
                        {PRIORITY_CONFIG[selectedTicket.priority].label}
                      </Badge>
                    </div>
                  </div>
                  <Select
                    value={selectedTicket.status}
                    onValueChange={updateTicketStatus}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OPEN">Open</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="RESOLVED">Resolved</SelectItem>
                      <SelectItem value="CLOSED">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <DialogDescription className="mt-4">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4" />
                    <span>{selectedTicket.client.name || selectedTicket.client.email}</span>
                    {selectedTicket.client.company && (
                      <span>({selectedTicket.client.company})</span>
                    )}
                  </div>
                  <p className="mt-2">{selectedTicket.description}</p>
                </DialogDescription>
              </DialogHeader>

              {/* Comments Thread */}
              <div className="max-h-[300px] overflow-y-auto space-y-4 py-4">
                {selectedTicket.comments.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No responses yet
                  </p>
                ) : (
                  selectedTicket.comments.map((comment) => (
                    <div key={comment.id} className="border-l-2 border-pink-500 pl-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{comment.authorName}</span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(comment.createdAt), 'MMM d, h:mm a')}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Response Box */}
              <div className="space-y-4 pt-4 border-t">
                <Textarea
                  placeholder="Type your response..."
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  rows={4}
                />
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedTicket(null)}
                  >
                    Close
                  </Button>
                  <Button
                    onClick={sendResponse}
                    disabled={isSending || !responseText.trim()}
                    className="bg-pink-500 hover:bg-pink-600"
                  >
                    {isSending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Sending...
                      </>
                    ) : (
                      'Send Response'
                    )}
                  </Button>
                </DialogFooter>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
