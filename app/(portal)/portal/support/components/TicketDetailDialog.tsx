'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { Clock, CheckCircle2, Loader2, MessageSquare, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from '@/components/ui/error-handling'

interface Ticket {
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

interface TicketDetailDialogProps {
  ticket: Ticket
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: () => void
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

export function TicketDetailDialog({
  ticket,
  open,
  onOpenChange,
  onUpdate,
}: TicketDetailDialogProps) {
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddComment = async () => {
    if (!comment.trim()) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/support-tickets/${ticket.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: comment,
        }),
      })

      const result = await response.json()
      
      if (result.success) {
        toast.success('Comment added successfully!')
        setComment('')
        onUpdate()
      } else {
        toast.error(result.error || 'Failed to add comment')
      }
    } catch (error) {
      console.error('Failed to add comment:', error)
      toast.error('Failed to add comment. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const statusInfo = STATUS_CONFIG[ticket.status]
  const priorityInfo = PRIORITY_CONFIG[ticket.priority]
  const StatusIcon = statusInfo.icon

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-xl mb-2">{ticket.title}</DialogTitle>
              <div className="flex items-center gap-2">
                <Badge className={cn('gap-1', statusInfo.color, 'text-white')}>
                  <StatusIcon className="h-3 w-3" />
                  {statusInfo.label}
                </Badge>
                <Badge className={cn('gap-1', priorityInfo.color, 'text-white')}>
                  {priorityInfo.label}
                </Badge>
                <Badge variant="outline">{ticket.category}</Badge>
              </div>
            </div>
          </div>
          <DialogDescription className="mt-4">
            <p className="text-sm text-muted-foreground mb-2">
              Created {format(new Date(ticket.createdAt), 'MMMM d, yyyy \'at\' h:mm a')}
            </p>
            <p className="whitespace-pre-wrap">{ticket.description}</p>
          </DialogDescription>
        </DialogHeader>

        {/* Comments Thread */}
        <div className="max-h-[300px] overflow-y-auto space-y-4 py-4">
          {ticket.comments.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                No responses yet. We'll update you as soon as we can!
              </p>
            </div>
          ) : (
            ticket.comments.map((comment) => {
              const isAdmin = comment.authorName !== 'Client'
              
              return (
                <div
                  key={comment.id}
                  className={cn(
                    'border-l-2 pl-4',
                    isAdmin ? 'border-pink-500' : 'border-blue-500'
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <User className="h-3 w-3" />
                    <span className="text-sm font-medium">{comment.authorName}</span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(comment.createdAt), 'MMM d, h:mm a')}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              )
            })
          )}
        </div>

        {/* Add Comment */}
        {(ticket.status === 'OPEN' || ticket.status === 'IN_PROGRESS') && (
          <div className="space-y-4 pt-4 border-t">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Add a comment
              </label>
              <Textarea
                placeholder="Type your message..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
              />
            </div>
            <DialogFooter>
              <Button
                onClick={handleAddComment}
                disabled={isSubmitting || !comment.trim()}
                className="bg-pink-500 hover:bg-pink-600"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Comment'
                )}
              </Button>
            </DialogFooter>
          </div>
        )}

        {(ticket.status === 'RESOLVED' || ticket.status === 'CLOSED') && (
          <div className="pt-4 border-t">
            <p className="text-sm text-center text-muted-foreground">
              This ticket has been {ticket.status.toLowerCase()}. If you need further assistance, please create a new request.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
