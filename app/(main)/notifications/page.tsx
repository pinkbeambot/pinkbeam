'use client'

import * as React from 'react'
import { useEffect, useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  FileText,
  MessageSquare,
  DollarSign,
  Folder,
  Settings,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { NotificationType } from '@prisma/client'

interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  data: Record<string, unknown> | null
  isRead: boolean
  readAt: string | null
  createdAt: string
}

interface NotificationMeta {
  total: number
  unread: number
  limit: number
  offset: number
  hasMore: boolean
}

const typeIcons: Record<NotificationType, React.ReactNode> = {
  PROJECT_UPDATE: <Folder className="w-5 h-5" />,
  QUOTE_STATUS: <FileText className="w-5 h-5" />,
  TICKET_REPLY: <MessageSquare className="w-5 h-5" />,
  INVOICE_CREATED: <DollarSign className="w-5 h-5" />,
  FILE_SHARED: <FileText className="w-5 h-5" />,
  SYSTEM: <Settings className="w-5 h-5" />,
}

const typeColors: Record<NotificationType, string> = {
  PROJECT_UPDATE: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  QUOTE_STATUS: 'text-violet-500 bg-violet-500/10 border-violet-500/20',
  TICKET_REPLY: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  INVOICE_CREATED: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  FILE_SHARED: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
  SYSTEM: 'text-slate-500 bg-slate-500/10 border-slate-500/20',
}

const typeLabels: Record<NotificationType, string> = {
  PROJECT_UPDATE: 'Project',
  QUOTE_STATUS: 'Quote',
  TICKET_REPLY: 'Ticket',
  INVOICE_CREATED: 'Invoice',
  FILE_SHARED: 'File',
  SYSTEM: 'System',
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()
  
  if (isToday) {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  }
  
  const isThisYear = date.getFullYear() === now.getFullYear()
  if (isThisYear) {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [meta, setMeta] = useState<NotificationMeta | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<NotificationType | 'ALL'>('ALL')
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const limit = 20
  const offset = parseInt(searchParams.get('offset') || '0')

  const fetchNotifications = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
      })
      if (filter !== 'ALL') {
        params.set('type', filter)
      }

      const response = await fetch(`/api/notifications?${params}`)
      if (!response.ok) throw new Error('Failed to fetch')
      const result = await response.json()
      if (result.success) {
        setNotifications(result.data)
        setMeta(result.meta)
      }
    } catch (error) {
      console.error('[NotificationsPage] Failed to fetch notifications:', error)
    } finally {
      setLoading(false)
    }
  }, [filter, offset])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  // Mark single as read/unread
  const toggleRead = async (notificationId: string, isRead: boolean) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead }),
      })
      if (response.ok) {
        setNotifications(prev =>
          prev.map(n =>
            n.id === notificationId
              ? { ...n, isRead, readAt: isRead ? new Date().toISOString() : null }
              : n
          )
        )
        if (meta) {
          setMeta({
            ...meta,
            unread: isRead ? meta.unread - 1 : meta.unread + 1,
          })
        }
      }
    } catch (error) {
      console.error('[NotificationsPage] Failed to toggle read status:', error)
    }
  }

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'markAllRead' }),
      })
      if (response.ok) {
        setNotifications(prev =>
          prev.map(n => ({ ...n, isRead: true, readAt: new Date().toISOString() }))
        )
        if (meta) {
          setMeta({ ...meta, unread: 0 })
        }
      }
    } catch (error) {
      console.error('[NotificationsPage] Failed to mark all as read:', error)
    }
  }

  // Delete notification
  const deleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setNotifications(prev => prev.filter(n => n.id !== notificationId))
        if (meta) {
          setMeta({ ...meta, total: meta.total - 1 })
        }
      }
    } catch (error) {
      console.error('[NotificationsPage] Failed to delete notification:', error)
    }
  }

  // Handle click on notification
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      toggleRead(notification.id, true)
    }
    const link = notification.data?.link as string | undefined
    if (link) {
      router.push(link)
    }
  }

  // Pagination
  const handlePrevPage = () => {
    const newOffset = Math.max(0, offset - limit)
    router.push(`/notifications?offset=${newOffset}`)
  }

  const handleNextPage = () => {
    if (meta?.hasMore) {
      router.push(`/notifications?offset=${offset + limit}`)
    }
  }

  return (
    <div className="container max-w-4xl py-8 px-4 sm:px-6 lg:px-8">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Bell className="h-6 w-6 text-pink-500" />
            <div>
              <CardTitle>Notifications</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {meta?.unread ? `${meta.unread} unread` : 'No unread notifications'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={filter}
              onValueChange={(value) => {
                setFilter(value as NotificationType | 'ALL')
                router.push('/notifications')
              }}
            >
              <SelectTrigger className="w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All types</SelectItem>
                {Object.values(NotificationType).map((type) => (
                  <SelectItem key={type} value={type}>
                    {typeLabels[type]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {meta && meta.unread > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                <CheckCheck className="mr-1.5 h-4 w-4" />
                Mark all read
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="py-12 text-center">
              <div className="animate-spin h-8 w-8 border-2 border-pink-500 border-t-transparent rounded-full mx-auto" />
              <p className="text-sm text-muted-foreground mt-3">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium">No notifications</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {filter === 'ALL'
                  ? "You're all caught up! No notifications yet."
                  : `No ${typeLabels[filter].toLowerCase()} notifications found.`}
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    'flex items-start gap-4 p-4 transition-colors hover:bg-accent/50 cursor-pointer',
                    !notification.isRead && 'bg-accent/30'
                  )}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div
                    className={cn(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border',
                      typeColors[notification.type]
                    )}
                  >
                    {typeIcons[notification.type]}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4
                          className={cn(
                            'text-sm font-medium',
                            !notification.isRead && 'text-foreground'
                          )}
                        >
                          {notification.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="text-[10px]">
                            {typeLabels[notification.type]}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(notification.createdAt)}
                          </span>
                          {!notification.isRead && (
                            <span className="inline-flex h-2 w-2 rounded-full bg-pink-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 hover:opacity-100">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleRead(notification.id, !notification.isRead)
                      }}
                      title={notification.isRead ? 'Mark as unread' : 'Mark as read'}
                    >
                      <Check
                        className={cn('h-4 w-4', notification.isRead && 'text-muted-foreground')}
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-red-500"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteNotification(notification.id)
                      }}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {meta && meta.total > 0 && (
            <div className="flex items-center justify-between px-4 py-4 border-t">
              <p className="text-sm text-muted-foreground">
                Showing {offset + 1}-{Math.min(offset + notifications.length, meta.total)} of{' '}
                {meta.total}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevPage}
                  disabled={offset === 0}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={!meta.hasMore}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}