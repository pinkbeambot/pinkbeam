'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Ticket, Clock, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { CreateTicketDialog } from './components/CreateTicketDialog'
import { TicketDetailDialog } from './components/TicketDetailDialog'
import { LoadingSpinner } from '@/components/ui/loading'
import { EmptyState } from '@/components/ui/empty-states/EmptyState'

interface SupportTicket {
  id: string
  title: string
  description: string
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  category: string
  createdAt: Date
  updatedAt: Date
  comments: Array<{
    id: string
    content: string
    createdAt: Date
    authorName: string
  }>
}

const STATUS_CONFIG = {
  OPEN: { label: 'Open', color: 'bg-yellow-500', icon: Clock },
  IN_PROGRESS: { label: 'In Progress', color: 'bg-blue-500', icon: Clock },
  RESOLVED: { label: 'Resolved', color: 'bg-green-500', icon: CheckCircle2 },
  CLOSED: { label: 'Closed', color: 'bg-gray-500', icon: CheckCircle2 },
}

const PRIORITY_CONFIG = {
  LOW: { label: 'Low', color: 'bg-gray-500' },
  MEDIUM: { label: 'Medium', color: 'bg-blue-500' },
  HIGH: { label: 'High', color: 'bg-orange-500' },
  URGENT: { label: 'Urgent', color: 'bg-red-500' },
}

export function SupportTicketsClient() {
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')

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
      console.error('Failed to load tickets:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTicketCreated = () => {
    setShowCreateDialog(false)
    loadTickets()
  }

  const filteredTickets = tickets.filter((ticket) => {
    if (statusFilter !== 'all' && ticket.status !== statusFilter) return false
    if (priorityFilter !== 'all' && ticket.priority !== priorityFilter) return false
    return true
  })

  const openTickets = tickets.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS')

  if (isLoading) {
    return <LoadingSpinner text="Loading tickets..." />
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Support Tickets</h1>
          <p className="text-muted-foreground mt-1">
            Submit requests and track their progress
          </p>
        </div>
        <Button
          onClick={() => setShowCreateDialog(true)}
          className="bg-pink-500 hover:bg-pink-600 gap-2"
        >
          <Plus className="h-4 w-4" />
          New Request
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total Tickets</p>
          <p className="text-2xl font-bold mt-1">{tickets.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Open</p>
          <p className="text-2xl font-bold mt-1 text-yellow-600">
            {tickets.filter(t => t.status === 'OPEN').length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">In Progress</p>
          <p className="text-2xl font-bold mt-1 text-blue-600">
            {tickets.filter(t => t.status === 'IN_PROGRESS').length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Resolved</p>
          <p className="text-2xl font-bold mt-1 text-green-600">
            {tickets.filter(t => t.status === 'RESOLVED').length}
          </p>
        </Card>
      </div>

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
          <EmptyState
            icon={Ticket}
            title="No tickets yet"
            description="Submit your first support request to get help from our team"
            action={{
              label: 'New Request',
              onClick: () => setShowCreateDialog(true),
            }}
          />
        ) : (
          filteredTickets.map((ticket) => {
            const statusInfo = STATUS_CONFIG[ticket.status]
            const priorityInfo = PRIORITY_CONFIG[ticket.priority]
            const StatusIcon = statusInfo.icon

            return (
              <Card
                key={ticket.id}
                className="p-6 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedTicket(ticket)}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={cn('gap-1', statusInfo.color, 'text-white')}>
                        <StatusIcon className="h-3 w-3" />
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
                  <div className="flex items-center gap-4 text-muted-foreground">
                    {ticket.comments.length > 0 && (
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{ticket.comments.length}</span>
                      </div>
                    )}
                    <span className="text-xs">
                      Created {format(new Date(ticket.createdAt), 'MMM d, h:mm a')}
                    </span>
                  </div>
                  {ticket.status === 'OPEN' && (
                    <span className="text-xs text-muted-foreground">
                      Waiting for response
                    </span>
                  )}
                </div>
              </Card>
            )
          })
        )}
      </div>

      {/* Dialogs */}
      <CreateTicketDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={handleTicketCreated}
      />

      {selectedTicket && (
        <TicketDetailDialog
          ticket={selectedTicket}
          open={!!selectedTicket}
          onOpenChange={() => setSelectedTicket(null)}
          onUpdate={loadTickets}
        />
      )}
    </div>
  )
}
