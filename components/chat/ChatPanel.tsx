'use client'

import { useState, useEffect } from 'react'
import { X, Minus, Maximize2, MessageSquare, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ConversationList } from './ConversationList'
import { ChatMessages } from './ChatMessages'
import { ChatInput } from './ChatInput'

type ChatPanelState = 'minimized' | 'sidebar' | 'fullpage'

interface ChatPanelProps {
  defaultState?: ChatPanelState
  className?: string
  conversationId?: string | null // Optional controlled conversation ID
  onClose?: () => void // Optional close callback
}

export function ChatPanel({
  defaultState = 'sidebar',
  className,
  conversationId: externalConversationId,
  onClose,
}: ChatPanelProps) {
  const [panelState, setPanelState] = useState<ChatPanelState>(defaultState)
  const [internalConversationId, setInternalConversationId] = useState<string | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [showConversationList, setShowConversationList] = useState(false)

  // Use external conversation ID if provided (controlled), otherwise use internal state
  const selectedConversationId = externalConversationId !== undefined ? externalConversationId : internalConversationId
  const setSelectedConversationId = externalConversationId !== undefined ? () => {} : setInternalConversationId

  // Detect mobile viewport and force fullpage mode on mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      // On mobile, when opening chat, go directly to fullpage mode
      if (mobile && panelState === 'sidebar') {
        setPanelState('fullpage')
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [panelState])

  if (panelState === 'minimized') {
    return (
      <Button
        onClick={() => setPanelState('sidebar')}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-pink-500 hover:bg-pink-600 z-50"
        size="icon"
      >
        <MessageSquare className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs flex items-center justify-center text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>
    )
  }

  if (panelState === 'fullpage') {
    return (
      <div className="fixed inset-0 z-50 bg-background">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="border-b px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
            <h1 className="text-lg md:text-2xl font-bold">Chat with VALIS</h1>
            <div className="flex items-center gap-1 md:gap-2">
              {isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowConversationList(!showConversationList)}
                  className="md:hidden"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              )}
              {!isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setPanelState('sidebar')}
                >
                  <Minus className="h-5 w-5" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setPanelState('minimized')}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Main chat area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Conversation list - hidden on mobile unless toggled */}
            <div
              className={cn(
                'border-r overflow-y-auto bg-background',
                isMobile
                  ? cn(
                      'absolute inset-y-0 left-0 right-0 z-10 transition-transform',
                      showConversationList ? 'translate-x-0' : '-translate-x-full'
                    )
                  : 'w-80 relative'
              )}
            >
              <ConversationList
                selectedId={selectedConversationId}
                onSelect={(id) => {
                  setSelectedConversationId(id)
                  if (isMobile) setShowConversationList(false)
                }}
              />
            </div>

            {/* Messages and input */}
            <div className="flex-1 flex flex-col min-w-0">
              <ChatMessages conversationId={selectedConversationId} />
              <ChatInput conversationId={selectedConversationId} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Sidebar state - full-screen on mobile
  return (
    <Card
      className={cn(
        'fixed shadow-xl flex flex-col z-40 border-l rounded-none',
        isMobile
          ? 'inset-0 border-none'
          : 'right-0 top-0 bottom-0 w-[28rem]',
        className
      )}
    >
      {/* Header */}
      <div className="border-b px-4 py-3 flex items-center justify-between bg-muted/50">
        <h2 className="font-semibold text-sm md:text-base">Chat with VALIS</h2>
        <div className="flex items-center gap-1">
          {!isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPanelState('fullpage')}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setPanelState('minimized')}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setPanelState('minimized')}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Conversation list - collapsible on sidebar, hidden on mobile */}
      {!isMobile && (
        <div className="border-b max-h-48 overflow-y-auto">
          <ConversationList
            selectedId={selectedConversationId}
            onSelect={setSelectedConversationId}
            compact
          />
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <ChatMessages conversationId={selectedConversationId} />
      </div>

      {/* Input */}
      <div className="border-t">
        <ChatInput conversationId={selectedConversationId} />
      </div>
    </Card>
  )
}
