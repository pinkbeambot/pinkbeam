'use client'

import { useEffect, useRef, useState } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { format } from 'date-fns'

interface Message {
  id: string
  senderId: string | null
  senderType: string
  content: string
  contentType: string
  agentType?: string | null
  createdAt: string
}

interface ChatMessagesProps {
  conversationId: string | null
}

const SENDER_COLORS: Record<string, string> = {
  USER: 'bg-blue-500',
  VALIS: 'bg-pink-500',
  MIKE: 'bg-purple-500',
  SARAH: 'bg-cyan-500',
  ALEX: 'bg-green-500',
  CASEY: 'bg-orange-500',
  LUMEN: 'bg-violet-500',
  FLUX: 'bg-amber-500',
  ADMIN: 'bg-red-500',
}

const SENDER_NAMES: Record<string, string> = {
  USER: 'You',
  VALIS: 'VALIS',
  MIKE: 'Mike (SDR)',
  SARAH: 'Sarah (Researcher)',
  ALEX: 'Alex (Support)',
  CASEY: 'Casey (Content)',
  LUMEN: 'LUMEN (Designer)',
  FLUX: 'FLUX (Video)',
  ADMIN: 'Admin',
}

export function ChatMessages({ conversationId }: ChatMessagesProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (conversationId) {
      loadMessages(conversationId)
    } else {
      setMessages([])
    }
  }, [conversationId])

  const loadMessages = async (convId: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/conversations/${convId}/messages?limit=100`)
      const result = await response.json()

      if (result.success) {
        setMessages(result.data)
        setTimeout(() => scrollToBottom(), 100)
      }
    } catch (error) {
      console.error('Failed to load messages:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const getSenderInfo = (message: Message) => {
    if (message.senderType === 'AGENT' && message.agentType) {
      return {
        name: SENDER_NAMES[message.agentType] || message.agentType,
        color: SENDER_COLORS[message.agentType] || SENDER_COLORS.VALIS,
        initials: message.agentType.slice(0, 2),
      }
    }

    return {
      name: SENDER_NAMES[message.senderType] || message.senderType,
      color: SENDER_COLORS[message.senderType] || 'bg-gray-500',
      initials: message.senderType.slice(0, 2),
    }
  }

  if (!conversationId) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-center">
        <div className="max-w-md">
          <div className="w-16 h-16 rounded-full bg-pink-500/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">💬</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">Start a conversation</h3>
          <p className="text-sm text-muted-foreground">
            Select a conversation from the list or create a new one to chat with VALIS and
            your AI employees.
          </p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading messages...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="mb-2">No messages yet</p>
          <p className="text-sm">Start the conversation below</p>
        </div>
      ) : (
        messages.map((message) => {
          const sender = getSenderInfo(message)
          const isUser = message.senderType === 'USER' || message.senderType === 'ADMIN'

          return (
            <div
              key={message.id}
              className={cn('flex gap-3', isUser && 'flex-row-reverse')}
            >
              {/* Avatar */}
              <Avatar className={cn('h-8 w-8 flex-shrink-0', sender.color)}>
                <AvatarFallback className="text-white text-xs">
                  {sender.initials}
                </AvatarFallback>
              </Avatar>

              {/* Message content */}
              <div className={cn('flex-1 max-w-[80%]', isUser && 'items-end')}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">{sender.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(message.createdAt), 'h:mm a')}
                  </span>
                </div>

                <div
                  className={cn(
                    'rounded-lg px-4 py-3 text-sm',
                    isUser
                      ? 'bg-pink-500 text-white'
                      : 'bg-muted'
                  )}
                >
                  {(ReactMarkdown as any)({
                    className: "prose prose-sm max-w-none dark:prose-invert",
                    children: message.content,
                    components: {
                      code({ node, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || '')
                        const isInline = !match
                        return !isInline && match ? (
                          <SyntaxHighlighter
                            style={vscDarkPlus}
                            language={match[1]}
                            PreTag="div"
                            className="rounded-md my-2"
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code
                            className={cn(
                              'bg-black/20 px-1 py-0.5 rounded text-xs',
                              isUser ? 'text-white' : ''
                            )}
                            {...props}
                          >
                            {children}
                          </code>
                        )
                      },
                      p: ({ children }: any) => <p className="mb-2 last:mb-0">{children}</p>,
                      ul: ({ children }: any) => (
                        <ul className="list-disc list-inside mb-2">{children}</ul>
                      ),
                      ol: ({ children }: any) => (
                        <ol className="list-decimal list-inside mb-2">{children}</ol>
                      ),
                    },
                  })}
                </div>
              </div>
            </div>
          )
        })
      )}

      <div ref={messagesEndRef} />
    </div>
  )
}
