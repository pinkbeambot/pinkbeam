'use client'

import * as React from 'react'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Bell, Check, CheckCheck, FileText, MessageSquare, DollarSign, Folder, Settings, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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

const typeIcons: Record<NotificationType, React.ReactNode> = {
  PROJECT_UPDATE: <Folder className="w-4 h-4" />,
  QUOTE_STATUS: <FileText className="w-4 h-4" />,
  TICKET_REPLY: <MessageSquare className="w-4 h-4" />,
  INVOICE_CREATED: <DollarSign className="w-4 h-4" />,
  FILE_SHARED: <FileText className="w-4 h-4" />,
  SYSTEM: <Settings className="w-4 h-4" />,
}

const typeColors: Record<NotificationType, string> = {
  PROJECT_UPDATE: 'text-blue-500 bg-blue-500/10',
  QUOTE_STATUS: 'text-violet-500 bg-violet-500/10',
  TICKET_REPLY: 'text-amber-500 bg-amber-500/10',
  INVOICE_CREATED: 'text-emerald-500 bg-emerald-500/10',
  FILE_SHARED: 'text-cyan-500 bg-cyan-500/10',
  SYSTEM: 'text-slate-500 bg-slate-500/10',
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const router = useRouter()

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      const response = await fetch('/api/notifications?limit=5')
      if (!response.ok) throw new Error('Failed to fetch')
      const result = await response.json()
      if (result.success) {
        setNotifications(result.data)
        setUnreadCount(result.meta.unread)
      }
    } catch (error) {
      console.error('[NotificationBell] Failed to fetch notifications:', error)
    }
  }, [])

  // Fetch unread count only (for polling)
  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await fetch('/api/notifications/unread-count')
      if (!response.ok) throw new Error('Failed to fetch')
      const result = await response.json()
      if (result.success) {
        setUnreadCount(result.count)
      }
    } catch (error) {
      console.error('[NotificationBell] Failed to fetch unread count:', error)
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  // Polling for new notifications (every 30 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!open) {
        // Only poll for count when dropdown is closed
        fetchUnreadCount()
      } else {
        // Fetch full list when dropdown is open
        fetchNotifications()
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [open, fetchNotifications, fetchUnreadCount])

  // Mark single notification as read
  const markAsRead = async (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation()
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: true }),
      })
      if (response.ok) {
        setNotifications(prev =>
          prev.map(n =>
            n.id === notificationId ? { ...n, isRead: true, readAt: new Date().toISOString() } : n
          )
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error('[NotificationBell] Failed to mark as read:', error)
    }
  }

  // Mark all as read
  const markAllAsRead = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setLoading(true)
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
        setUnreadCount(0)
      }
    } catch (error) {
      console.error('[NotificationBell] Failed to mark all as read:', error)
    } finally {
      setLoading(false)
    }
  }

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    // Mark as read if unread
    if (!notification.isRead) {
      fetch(`/api/notifications/${notification.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: true }),
      }).then(() => {
        setNotifications(prev =>
          prev.map(n =>
            n.id === notification.id ? { ...n, isRead: true, readAt: new Date().toISOString() } : n
          )
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
      })
    }

    // Navigate if there's a link in the data
    const link = notification.data?.link as string | undefined
    if (link) {
      router.push(link)
    }

    setOpen(false)
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96">
        <div className="flex items-center justify-between px-3 py-2 border-b">
          <h3 className="font-semibold text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs"
              onClick={markAllAsRead}
              disabled={loading}
            >
              <CheckCheck className="mr-1.5 h-3.5 w-3.5" />
              Mark all read
            </Button>
          )}
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
              <AlertCircle className="h-10 w-10 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">No new notifications</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={cn(
                  'flex items-start gap-3 p-3 cursor-pointer border-l-2',
                  !notification.isRead
                    ? 'bg-accent/50 border-l-pink-500'
                    : 'border-l-transparent'
                )}
                onClick={() => handleNotificationClick(notification)}
              >
                <div
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                    typeColors[notification.type]
                  )}
                >
                  {typeIcons[notification.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn('text-sm font-medium', !notification.isRead && 'text-foreground')}>
                    {notification.title}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                    {notification.message}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {formatRelativeTime(notification.createdAt)}
                  </p>
                </div>
                {!notification.isRead && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 hover:opacity-100"
                    onClick={(e) => markAsRead(e, notification.id)}
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span className="sr-only">Mark as read</span>
                  </Button>
                )}
              </DropdownMenuItem>
            ))
          )}
        </div>

        <DropdownMenuSeparator />
        <Link
          href="/notifications"
          className="block px-3 py-2 text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setOpen(false)}
        >
          View all notifications
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}