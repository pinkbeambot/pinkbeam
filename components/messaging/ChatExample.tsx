'use client'

/**
 * Example component demonstrating real-time chat functionality
 * This is a reference implementation showing how to use the messaging infrastructure
 */

import { useState, useRef, useEffect } from 'react'
import { useConversation, useTypingIndicator, useConversationMessages } from '@/lib/realtime/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

interface ChatExampleProps {
  conversationId: string
  currentUserId: string
  currentUserName: string
}

export function ChatExample({
  conversationId,
  currentUserId,
  currentUserName,
}: ChatExampleProps) {
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load initial messages and set up pagination
  const {
    messages: initialMessages,
    isLoading,
    hasMore,
    loadMore,
    setMessages,
  } = useConversationMessages(conversationId)

  // Subscribe to real-time updates
  const { sendMessage, isConnected } = useConversation({
    conversationId,
    enabled: true,
    onNewMessage: (newMessage) => {
      // Message is automatically added to the list
      scrollToBottom()
    },
  })

  // Merge initial messages with real-time updates
  useEffect(() => {
    setMessages(initialMessages)
  }, [initialMessages, setMessages])

  // Typing indicators
  const { typingUsers, notifyTyping } = useTypingIndicator({
    conversationId,
    currentUserId,
    currentUserName,
    enabled: true,
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSend = async () => {
    if (!inputValue.trim()) return

    await sendMessage(inputValue.trim())
    setInputValue('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    notifyTyping()
  }

  return (
    <Card className="flex flex-col h-[600px] p-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4 mb-4">
        <h3 className="font-semibold">Chat</h3>
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-green-500' : 'bg-gray-400'
            }`}
          />
          <span className="text-xs text-muted-foreground">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        {hasMore && (
          <Button
            onClick={loadMore}
            disabled={isLoading}
            variant="ghost"
            size="sm"
            className="w-full"
          >
            {isLoading ? 'Loading...' : 'Load older messages'}
          </Button>
        )}

        {initialMessages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.senderId === currentUserId ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg px-4 py-2 ${
                message.senderId === currentUserId
                  ? 'bg-pink-500 text-white'
                  : 'bg-muted'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <span className="text-xs opacity-70">
                {new Date(message.createdAt).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}

        {/* Typing indicators */}
        {typingUsers.length > 0 && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg px-4 py-2">
              <p className="text-sm text-muted-foreground italic">
                {typingUsers.map((u) => u.userName).join(', ')} typing...
              </p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          disabled={!isConnected}
        />
        <Button onClick={handleSend} disabled={!isConnected || !inputValue.trim()}>
          Send
        </Button>
      </div>
    </Card>
  )
}
