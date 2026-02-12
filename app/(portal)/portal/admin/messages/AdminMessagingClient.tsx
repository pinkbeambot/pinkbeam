'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  MessageSquare,
  Megaphone,
  Ticket,
  Search,
  Plus,
  Users,
} from 'lucide-react'
import { DirectMessaging } from './components/DirectMessaging'
import { BulkAnnouncements } from './components/BulkAnnouncements'
import { SupportTicketResponses } from './components/SupportTicketResponses'

interface Stats {
  unreadMessages: number
  openTickets: number
  activeConversations: number
}

export function AdminMessagingClient() {
  const [stats, setStats] = useState<Stats>({
    unreadMessages: 0,
    openTickets: 0,
    activeConversations: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      // Load messaging stats
      const conversationsRes = await fetch('/api/conversations')
      const conversationsData = await conversationsRes.json()
      
      if (conversationsData.success) {
        const activeConvos = conversationsData.data.filter(
          (c: any) => !c.archived
        ).length
        const unread = conversationsData.data.reduce(
          (sum: number, c: any) => sum + (c.unreadCount || 0),
          0
        )
        
        setStats((prev) => ({
          ...prev,
          activeConversations: activeConvos,
          unreadMessages: unread,
        }))
      }

      // Load support ticket stats
      const ticketsRes = await fetch('/api/support-tickets?status=OPEN')
      const ticketsData = await ticketsRes.json()
      
      if (ticketsData.success) {
        setStats((prev) => ({
          ...prev,
          openTickets: ticketsData.data.length,
        }))
      }
    } catch (error) {
      console.error('Failed to load messaging stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading messages...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Messages & Communication</h1>
          <p className="text-muted-foreground mt-1">
            Connect with clients, send announcements, and manage support
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-pink-500/10 flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-pink-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Conversations</p>
              <p className="text-2xl font-bold">{stats.activeConversations}</p>
            </div>
          </div>
          {stats.unreadMessages > 0 && (
            <Badge variant="secondary" className="mt-2">
              {stats.unreadMessages} unread
            </Badge>
          )}
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <Ticket className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Open Tickets</p>
              <p className="text-2xl font-bold">{stats.openTickets}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Megaphone className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Announcements</p>
              <Button size="sm" className="mt-1 h-7 bg-pink-500 hover:bg-pink-600">
                <Plus className="h-3 w-3 mr-1" />
                New
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="messages" className="space-y-4">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="messages" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Direct Messages
          </TabsTrigger>
          <TabsTrigger value="announcements" className="gap-2">
            <Megaphone className="h-4 w-4" />
            Announcements
          </TabsTrigger>
          <TabsTrigger value="tickets" className="gap-2">
            <Ticket className="h-4 w-4" />
            Support Tickets
          </TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="space-y-4">
          <DirectMessaging onStatsChange={loadStats} />
        </TabsContent>

        <TabsContent value="announcements" className="space-y-4">
          <BulkAnnouncements />
        </TabsContent>

        <TabsContent value="tickets" className="space-y-4">
          <SupportTicketResponses onStatsChange={loadStats} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
