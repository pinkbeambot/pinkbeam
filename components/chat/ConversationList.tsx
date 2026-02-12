'use client'

import { useEffect, useState } from 'react'
import { Plus, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'

interface Conversation {
  id: string
  type: string
  title: string | null
  lastMessageAt: Date | null
  unreadCount: number
  messages: Array<{
    content: string
    senderType: string
    createdAt: string
  }>
}

interface ConversationListProps {
  selectedId: string | null
  onSelect: (id: string) => void
  compact?: boolean
}

export function ConversationList({
  selectedId,
  onSelect,
  compact = false,
}: ConversationListProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadConversations()
  }, [])

  const loadConversations = async () => {
    try {
      const response = await fetch('/api/conversations?limit=20')
      const result = await response.json()

      if (result.success) {
        setConversations(result.data)
        // Auto-select first conversation if none selected
        if (!selectedId && result.data.length > 0) {
          onSelect(result.data[0].id)
        }
      }
    } catch (error) {
      console.error('Failed to load conversations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewConversation = async () => {
    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'VALIS_CHAT',
          title: 'New Chat',
        }),
      })

      const result = await response.json()
      if (result.success) {
        setConversations((prev) => [result.data, ...prev])
        onSelect(result.data.id)
      }
    } catch (error) {
      console.error('Failed to create conversation:', error)
    }
  }

  const getConversationTitle = (conv: Conversation) => {
    if (conv.title) return conv.title
    if (conv.type === 'VALIS_CHAT') return 'Chat with VALIS'
    if (conv.type === 'AGENT_CHAT') return 'AI Employee Chat'
    return 'Conversation'
  }

  const getLastMessagePreview = (conv: Conversation) => {
    if (conv.messages && conv.messages.length > 0) {
      const lastMsg = conv.messages[0]
      return lastMsg.content.slice(0, 60) + (lastMsg.content.length > 60 ? '...' : '')
    }
    return 'No messages yet'
  }

  const getTimeAgo = (date: Date | null) => {
    if (!date) return ''
    return formatDistanceToNow(new Date(date), { addSuffix: true })
  }

  if (isLoading) {
    return (
      <div className="p-4 space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col', compact ? 'p-2' : 'p-4')}>
      {/* New conversation button */}
      <Button
        onClick={handleNewConversation}
        variant="outline"
        className={cn('mb-3', compact ? 'h-8 text-xs' : 'h-10')}
      >
        <Plus className={cn(compact ? 'h-3 w-3' : 'h-4 w-4', 'mr-2')} />
        New Conversation
      </Button>

      {/* Conversations list */}
      <div className="space-y-1">
        {conversations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No conversations yet</p>
            <p className="text-xs mt-1">Start chatting with VALIS</p>
          </div>
        ) : (
          conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => onSelect(conv.id)}
              className={cn(
                'w-full text-left p-3 rounded-lg transition-colors hover:bg-muted/50',
                selectedId === conv.id && 'bg-muted',
                compact && 'p-2'
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4
                      className={cn(
                        'font-medium truncate',
                        compact ? 'text-xs' : 'text-sm'
                      )}
                    >
                      {getConversationTitle(conv)}
                    </h4>
                    {conv.unreadCount > 0 && (
                      <span className="bg-pink-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[1.25rem] text-center">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                  <p
                    className={cn(
                      'text-muted-foreground truncate',
                      compact ? 'text-xs' : 'text-sm'
                    )}
                  >
                    {getLastMessagePreview(conv)}
                  </p>
                </div>
                {conv.lastMessageAt && (
                  <span
                    className={cn(
                      'text-muted-foreground flex-shrink-0',
                      compact ? 'text-xs' : 'text-xs'
                    )}
                  >
                    {getTimeAgo(conv.lastMessageAt)}
                  </span>
                )}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )
}
