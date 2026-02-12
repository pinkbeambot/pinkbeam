'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Search, MessageSquare, Send, User } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { ChatPanel } from '@/components/chat/ChatPanel'

interface Client {
  id: string
  name: string | null
  email: string
  company: string | null
}

interface Conversation {
  id: string
  userId: string
  title: string | null
  lastMessageAt: Date | null
  unreadCount: number
  user: Client
  messages: Array<{
    id: string
    content: string
    createdAt: Date
    senderType: string
  }>
}

interface DirectMessagingProps {
  onStatsChange?: () => void
}

export function DirectMessaging({ onStatsChange }: DirectMessagingProps) {
  const [clients, setClients] = useState<Client[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Load all clients
      const clientsRes = await fetch('/api/clients')
      const clientsData = await clientsRes.json()
      if (clientsData.success) {
        setClients(clientsData.data)
      }

      // Load all conversations
      const convosRes = await fetch('/api/conversations')
      const convosData = await convosRes.json()
      if (convosData.success) {
        setConversations(convosData.data)
      }
    } catch (error) {
      console.error('Failed to load messaging data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const startConversation = async (clientId: string) => {
    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: clientId,
          type: 'ADMIN_CHAT',
        }),
      })

      const result = await response.json()
      if (result.success) {
        setSelectedConversation(result.data.id)
        await loadData()
        onStatsChange?.()
      }
    } catch (error) {
      console.error('Failed to start conversation:', error)
    }
  }

  const filteredClients = clients.filter((client) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      client.name?.toLowerCase().includes(query) ||
      client.email.toLowerCase().includes(query) ||
      client.company?.toLowerCase().includes(query)
    )
  })

  const filteredConversations = conversations.filter((convo) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      convo.user.name?.toLowerCase().includes(query) ||
      convo.user.email.toLowerCase().includes(query) ||
      convo.user.company?.toLowerCase().includes(query)
    )
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-6 h-6 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Loading conversations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Conversations List - Hidden on mobile when conversation selected */}
      <div className={cn(
        "lg:col-span-1 space-y-4",
        selectedConversation && "hidden lg:block"
      )}>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold">Conversations</h3>
            <Badge variant="secondary" className="ml-auto">
              {conversations.length}
            </Badge>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No conversations found
              </div>
            ) : (
              filteredConversations.map((convo) => (
                <button
                  key={convo.id}
                  onClick={() => setSelectedConversation(convo.id)}
                  className={cn(
                    'w-full p-3 rounded-lg border text-left transition-colors hover:bg-muted/50',
                    selectedConversation === convo.id &&
                      'bg-pink-500/5 border-pink-500/30'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-pink-500 text-white">
                        {(convo.user.name || convo.user.email)[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="font-medium truncate">
                          {convo.user.name || convo.user.email}
                        </p>
                        {convo.unreadCount > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {convo.unreadCount}
                          </Badge>
                        )}
                      </div>
                      {convo.user.company && (
                        <p className="text-xs text-muted-foreground truncate">
                          {convo.user.company}
                        </p>
                      )}
                      {convo.messages[0] && (
                        <p className="text-xs text-muted-foreground truncate mt-1">
                          {convo.messages[0].content}
                        </p>
                      )}
                      {convo.lastMessageAt && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(convo.lastMessageAt), 'MMM d, h:mm a')}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </Card>

        {/* Start New Conversation */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <User className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold">All Clients</h3>
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {filteredClients.map((client) => (
              <div
                key={client.id}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {(client.name || client.email)[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {client.name || client.email}
                    </p>
                    {client.company && (
                      <p className="text-xs text-muted-foreground truncate">
                        {client.company}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => startConversation(client.id)}
                  className="shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Chat View - Full screen on mobile when conversation selected */}
      <div className={cn(
        "lg:col-span-2",
        !selectedConversation && "hidden lg:block"
      )}>
        {selectedConversation ? (
          <div className="relative">
            {/* Mobile back button */}
            <Button
              variant="ghost"
              onClick={() => setSelectedConversation(null)}
              className="lg:hidden absolute top-4 left-4 z-10"
            >
              ← Back to conversations
            </Button>
            <ChatPanel
              conversationId={selectedConversation}
              defaultState="fullpage"
              onClose={() => setSelectedConversation(null)}
            />
          </div>
        ) : (
          <Card className="p-12 text-center border-dashed">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No conversation selected</h3>
            <p className="text-sm text-muted-foreground">
              Select a conversation from the list or start a new one with a client
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}
