'use client'

import Link from 'next/link'
import { MessageSquare, Plus, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FadeIn } from '@/components/animations'

const tickets = [
  { 
    id: 'TICK-001', 
    subject: 'Need to update logo on homepage', 
    status: 'open', 
    priority: 'medium',
    created: '2026-02-18',
    lastUpdate: '2 hours ago'
  },
  { 
    id: 'TICK-002', 
    subject: 'Request for additional page', 
    status: 'in-progress', 
    priority: 'high',
    created: '2026-02-15',
    lastUpdate: '1 day ago'
  },
  { 
    id: 'TICK-003', 
    subject: 'Color scheme feedback', 
    status: 'closed', 
    priority: 'low',
    created: '2026-02-10',
    lastUpdate: '5 days ago'
  },
]

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    'open': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    'in-progress': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    'closed': 'bg-green-500/10 text-green-500 border-green-500/20',
  }
  return colors[status] || 'bg-gray-500/10 text-gray-500'
}

function getPriorityColor(priority: string) {
  const colors: Record<string, string> = {
    'high': 'bg-red-500/10 text-red-500 border-red-500/20',
    'medium': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    'low': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  }
  return colors[priority] || 'bg-gray-500/10 text-gray-500'
}

export default function SupportPage() {
  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Support</h1>
            <p className="text-muted-foreground mt-1">
              Get help and track your support tickets
            </p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Ticket
          </Button>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <Card>
          <CardHeader>
            <CardTitle>Your Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-violet-500" />
                    </div>
                    <div>
                      <p className="font-medium">{ticket.subject}</p>
                      <p className="text-sm text-muted-foreground">
                        {ticket.id} • Created {new Date(ticket.created).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                    <Badge variant="outline" className={getStatusColor(ticket.status)}>
                      {ticket.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {ticket.lastUpdate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      <FadeIn delay={0.2}>
        <Card>
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Our team is here to help with any questions or issues. Create a ticket and we&apos;ll respond within 24 hours.
            </p>
            <div className="flex gap-3">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Ticket
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
