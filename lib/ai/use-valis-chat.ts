'use client'

import { useState, useCallback } from 'react'

interface ChatMessage {
  id?: string
  role: 'user' | 'assistant'
  content: string
  timestamp?: string
}

interface UseValisChatOptions {
  conversationId?: string
  onError?: (error: string) => void
}

export function useValisChat(options: UseValisChatOptions = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')

  /**
   * Send message with streaming response
   */
  const sendMessageStream = useCallback(
    async (message: string) => {
      if (!message.trim() || isLoading || isStreaming) return

      // Add user message immediately
      const userMessage: ChatMessage = {
        role: 'user',
        content: message,
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, userMessage])

      setIsLoading(true)
      setIsStreaming(true)
      setStreamingContent('')

      try {
        const response = await fetch('/api/chat/stream', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message,
            conversationId: options.conversationId,
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to get response')
        }

        const reader = response.body?.getReader()
        const decoder = new TextDecoder()
        let fullContent = ''
        let messageId = ''

        while (reader) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6))

                if (data.type === 'chunk') {
                  fullContent += data.content
                  setStreamingContent(fullContent)
                } else if (data.type === 'done') {
                  messageId = data.messageId
                } else if (data.type === 'error') {
                  throw new Error(data.message)
                }
              } catch (e) {
                console.error('Error parsing SSE:', e)
              }
            }
          }
        }

        // Add assistant message
        const assistantMessage: ChatMessage = {
          id: messageId,
          role: 'assistant',
          content: fullContent,
          timestamp: new Date().toISOString(),
        }
        setMessages((prev) => [...prev, assistantMessage])
      } catch (error) {
        console.error('Chat error:', error)
        options.onError?.(
          error instanceof Error
            ? error.message
            : 'Failed to send message'
        )
      } finally {
        setIsLoading(false)
        setIsStreaming(false)
        setStreamingContent('')
      }
    },
    [isLoading, isStreaming, options]
  )

  /**
   * Send message without streaming (complete response at once)
   */
  const sendMessage = useCallback(
    async (message: string) => {
      if (!message.trim() || isLoading) return

      // Add user message
      const userMessage: ChatMessage = {
        role: 'user',
        content: message,
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, userMessage])

      setIsLoading(true)

      try {
        const response = await fetch('/api/chat/message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message,
            conversationId: options.conversationId,
          }),
        })

        const result = await response.json()

        if (!result.success) {
          throw new Error(result.error || 'Failed to send message')
        }

        // Add assistant message
        const assistantMessage: ChatMessage = {
          id: result.data.message.id,
          role: 'assistant',
          content: result.data.message.content,
          timestamp: result.data.message.createdAt,
        }
        setMessages((prev) => [...prev, assistantMessage])

        return result.data.conversationId
      } catch (error) {
        console.error('Chat error:', error)
        options.onError?.(
          error instanceof Error
            ? error.message
            : 'Failed to send message'
        )
      } finally {
        setIsLoading(false)
      }
    },
    [isLoading, options]
  )

  /**
   * Clear chat history
   */
  const clearMessages = useCallback(() => {
    setMessages([])
    setStreamingContent('')
  }, [])

  return {
    messages,
    isLoading,
    isStreaming,
    streamingContent,
    sendMessage,
    sendMessageStream,
    clearMessages,
    setMessages, // For loading initial messages
  }
}
