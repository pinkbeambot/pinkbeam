'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { subscribeToConversation, subscribeToTypingIndicators, sendTypingIndicator } from './client'
import type { RealtimeChannel } from '@supabase/supabase-js'

interface Message {
  id: string
  conversationId: string
  senderId: string | null
  senderType: string
  content: string
  contentType: string
  createdAt: string
  // Additional fields from database (metadata, etc.)
  [key: string]: unknown
}

interface UseConversationOptions {
  conversationId: string
  enabled?: boolean
  onNewMessage?: (message: Message) => void
}

/**
 * Hook for real-time conversation updates
 * Automatically subscribes/unsubscribes based on conversationId changes
 */
export function useConversation({ conversationId, enabled = true, onNewMessage }: UseConversationOptions) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const channelRef = useRef<RealtimeChannel | null>(null)

  useEffect(() => {
    if (!enabled || !conversationId) return

    // Subscribe to conversation messages
    const channel = subscribeToConversation(conversationId, (payload) => {
      if (payload.eventType === 'INSERT') {
        const newMessage = payload.new as Message
        setMessages((prev) => [...prev, newMessage])
        onNewMessage?.(newMessage)
      } else if (payload.eventType === 'UPDATE') {
        const updatedMessage = payload.new as Message
        setMessages((prev) =>
          prev.map((msg) => (msg.id === updatedMessage.id ? updatedMessage : msg))
        )
      } else if (payload.eventType === 'DELETE') {
        const deletedMessage = payload.old as Message
        setMessages((prev) => prev.filter((msg) => msg.id !== deletedMessage.id))
      }
    })

    channelRef.current = channel
    setIsConnected(true)

    // Cleanup on unmount or when conversationId changes
    return () => {
      channel.unsubscribe()
      setIsConnected(false)
    }
  }, [conversationId, enabled, onNewMessage])

  const sendMessage = useCallback(
    async (content: string, metadata?: Record<string, unknown>) => {
      if (!conversationId) return

      const response = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, metadata }),
      })

      const result = await response.json()
      return result
    },
    [conversationId]
  )

  return {
    messages,
    sendMessage,
    isConnected,
    setMessages, // Allow manual updates (e.g., loading initial messages)
  }
}

interface TypingUser {
  userId: string
  userName: string
  timestamp: number
}

interface UseTypingIndicatorOptions {
  conversationId: string
  currentUserId: string
  currentUserName: string
  enabled?: boolean
  typingTimeout?: number // ms before considering user stopped typing
}

/**
 * Hook for typing indicators
 * Handles both sending and receiving typing status
 */
export function useTypingIndicator({
  conversationId,
  currentUserId,
  currentUserName,
  enabled = true,
  typingTimeout = 3000,
}: UseTypingIndicatorOptions) {
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([])
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null)
  const cleanupTimersRef = useRef<Map<string, NodeJS.Timeout>>(new Map())

  useEffect(() => {
    if (!enabled || !conversationId) return

    const channel = subscribeToTypingIndicators(conversationId, (payload) => {
      // Ignore own typing indicator
      if (payload.userId === currentUserId) return

      // Add/update typing user
      setTypingUsers((prev) => {
        const filtered = prev.filter((u) => u.userId !== payload.userId)
        return [...filtered, payload]
      })

      // Clear existing cleanup timer for this user
      const existingTimer = cleanupTimersRef.current.get(payload.userId)
      if (existingTimer) clearTimeout(existingTimer)

      // Set cleanup timer to remove user after timeout
      const timer = setTimeout(() => {
        setTypingUsers((prev) => prev.filter((u) => u.userId !== payload.userId))
        cleanupTimersRef.current.delete(payload.userId)
      }, typingTimeout)

      cleanupTimersRef.current.set(payload.userId, timer)
    })

    return () => {
      channel.unsubscribe()
      // Clear all cleanup timers
      cleanupTimersRef.current.forEach((timer) => clearTimeout(timer))
      cleanupTimersRef.current.clear()
    }
  }, [conversationId, currentUserId, enabled, typingTimeout])

  const notifyTyping = useCallback(() => {
    if (!enabled) return

    sendTypingIndicator(conversationId, currentUserId, currentUserName)

    // Reset timer - send indicator every 2 seconds while typing
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current)
    }

    typingTimerRef.current = setTimeout(() => {
      typingTimerRef.current = null
    }, 2000)
  }, [conversationId, currentUserId, currentUserName, enabled])

  return {
    typingUsers: typingUsers.filter(
      (u) => Date.now() - u.timestamp < typingTimeout
    ),
    notifyTyping,
  }
}

/**
 * Hook for fetching conversation messages with pagination
 */
export function useConversationMessages(conversationId: string, initialLimit = 100) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const loadMessages = useCallback(
    async (before?: string) => {
      if (!conversationId || isLoading) return

      setIsLoading(true)
      try {
        const params = new URLSearchParams({
          limit: String(initialLimit),
        })
        if (before) params.set('before', before)

        const response = await fetch(
          `/api/conversations/${conversationId}/messages?${params}`
        )
        const result = await response.json()

        if (result.success) {
          setMessages((prev) =>
            before ? [...result.data, ...prev] : result.data
          )
          setHasMore(result.data.length === initialLimit)
        }
      } catch (error) {
        console.error('Failed to load messages:', error)
      } finally {
        setIsLoading(false)
      }
    },
    [conversationId, initialLimit, isLoading]
  )

  const loadMore = useCallback(() => {
    if (messages.length > 0 && hasMore) {
      loadMessages(messages[0].id)
    }
  }, [messages, hasMore, loadMessages])

  useEffect(() => {
    if (conversationId) {
      setMessages([])
      setHasMore(true)
      loadMessages()
    }
  }, [conversationId]) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    messages,
    isLoading,
    hasMore,
    loadMore,
    setMessages,
  }
}
