'use client'

import { createClient } from '@/lib/supabase/client'
import { RealtimeChannel } from '@supabase/supabase-js'

export type MessageCallback = (payload: {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE'
  new: Record<string, unknown>
  old: Record<string, unknown>
}) => void

export type ConversationCallback = (payload: {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE'
  new: Record<string, unknown>
  old: Record<string, unknown>
}) => void

/**
 * Subscribe to real-time messages in a conversation
 * @param conversationId - The conversation to subscribe to
 * @param onMessage - Callback fired when a new message arrives
 * @returns Supabase channel (call channel.unsubscribe() to cleanup)
 */
export function subscribeToConversation(
  conversationId: string,
  onMessage: MessageCallback
): RealtimeChannel {
  const supabase = createClient()

  const channel = supabase
    .channel(`conversation:${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'messages',
        filter: `conversationId=eq.${conversationId}`,
      },
      (payload) => {
        onMessage({
          eventType: payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE',
          new: payload.new as Record<string, unknown>,
          old: payload.old as Record<string, unknown>,
        })
      }
    )
    .subscribe()

  return channel
}

/**
 * Subscribe to all conversations for a user
 * @param userId - The user's ID
 * @param onConversationUpdate - Callback fired when conversation changes
 * @returns Supabase channel (call channel.unsubscribe() to cleanup)
 */
export function subscribeToUserConversations(
  userId: string,
  onConversationUpdate: ConversationCallback
): RealtimeChannel {
  const supabase = createClient()

  const channel = supabase
    .channel(`user:${userId}:conversations`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'conversations',
        filter: `userId=eq.${userId}`,
      },
      (payload) => {
        onConversationUpdate({
          eventType: payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE',
          new: payload.new as Record<string, unknown>,
          old: payload.old as Record<string, unknown>,
        })
      }
    )
    .subscribe()

  return channel
}

/**
 * Send typing indicator to conversation
 * @param conversationId - The conversation ID
 * @param userId - The typing user's ID
 * @param userName - The typing user's name
 */
export function sendTypingIndicator(
  conversationId: string,
  userId: string,
  userName: string
) {
  const supabase = createClient()
  const channel = supabase.channel(`conversation:${conversationId}`)

  channel.send({
    type: 'broadcast',
    event: 'typing',
    payload: { userId, userName, timestamp: Date.now() },
  })
}

/**
 * Subscribe to typing indicators in a conversation
 * @param conversationId - The conversation ID
 * @param onTyping - Callback fired when someone types
 * @returns Supabase channel (call channel.unsubscribe() to cleanup)
 */
export function subscribeToTypingIndicators(
  conversationId: string,
  onTyping: (payload: { userId: string; userName: string; timestamp: number }) => void
): RealtimeChannel {
  const supabase = createClient()

  const channel = supabase
    .channel(`conversation:${conversationId}`)
    .on('broadcast', { event: 'typing' }, ({ payload }) => {
      onTyping(payload)
    })
    .subscribe()

  return channel
}

/**
 * Cleanup and unsubscribe from a channel
 * @param channel - The channel to cleanup
 */
export async function unsubscribeChannel(channel: RealtimeChannel) {
  await channel.unsubscribe()
}

/**
 * Cleanup all active channels for the current client
 */
export async function unsubscribeAllChannels() {
  const supabase = createClient()
  await supabase.removeAllChannels()
}
