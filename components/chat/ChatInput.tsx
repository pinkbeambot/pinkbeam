'use client'

import { useState, useRef, KeyboardEvent } from 'react'
import { Send, Paperclip, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

interface ChatInputProps {
  conversationId: string | null
  onSend?: (message: string) => void
}

const AI_EMPLOYEES = [
  { name: '@Mike', description: 'SDR - Sales Development' },
  { name: '@Sarah', description: 'Researcher - Analysis & Research' },
  { name: '@Alex', description: 'Support - Customer Support' },
  { name: '@Casey', description: 'Content - Content Writer' },
  { name: '@LUMEN', description: 'Designer - Design Strategy' },
  { name: '@FLUX', description: 'Video - Video Producer' },
]

export function ChatInput({ conversationId, onSend }: ChatInputProps) {
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [showMentions, setShowMentions] = useState(false)
  const [mentionFilter, setMentionFilter] = useState('')
  const [selectedMentionIndex, setSelectedMentionIndex] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const filteredEmployees = AI_EMPLOYEES.filter((emp) =>
    emp.name.toLowerCase().includes(mentionFilter.toLowerCase())
  )

  const handleInputChange = (value: string) => {
    setMessage(value)

    // Check for @ mentions
    const cursorPos = textareaRef.current?.selectionStart || 0
    const textBeforeCursor = value.slice(0, cursorPos)
    const lastAtSymbol = textBeforeCursor.lastIndexOf('@')

    if (lastAtSymbol !== -1) {
      const textAfterAt = textBeforeCursor.slice(lastAtSymbol + 1)
      // Show mentions if @ is at start of word
      if (!textAfterAt.includes(' ')) {
        setMentionFilter(textAfterAt)
        setShowMentions(true)
        setSelectedMentionIndex(0)
        return
      }
    }

    setShowMentions(false)
  }

  const insertMention = (mention: string) => {
    const cursorPos = textareaRef.current?.selectionStart || 0
    const textBeforeCursor = message.slice(0, cursorPos)
    const textAfterCursor = message.slice(cursorPos)
    const lastAtSymbol = textBeforeCursor.lastIndexOf('@')

    const newText =
      message.slice(0, lastAtSymbol) +
      mention +
      ' ' +
      textAfterCursor

    setMessage(newText)
    setShowMentions(false)
    setMentionFilter('')

    // Focus back on textarea
    setTimeout(() => {
      textareaRef.current?.focus()
      const newCursorPos = lastAtSymbol + mention.length + 1
      textareaRef.current?.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle mention autocomplete navigation
    if (showMentions) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedMentionIndex((prev) =>
          Math.min(prev + 1, filteredEmployees.length - 1)
        )
        return
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedMentionIndex((prev) => Math.max(prev - 1, 0))
        return
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault()
        if (filteredEmployees[selectedMentionIndex]) {
          insertMention(filteredEmployees[selectedMentionIndex].name)
        }
        return
      }
      if (e.key === 'Escape') {
        e.preventDefault()
        setShowMentions(false)
        return
      }
    }

    // Handle send on Enter (without shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSend = async () => {
    if (!message.trim() || !conversationId || isSending) return

    setIsSending(true)
    const messageToSend = message.trim()
    setMessage('')

    try {
      const response = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: messageToSend }),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to send message')
      }

      onSend?.(messageToSend)

      // Check for @mentions and trigger delegation
      if (messageToSend.includes('@')) {
        try {
          await fetch('/api/chat/delegate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: messageToSend,
              conversationId,
            }),
          })
        } catch (delegationError) {
          console.error('Delegation failed:', delegationError)
          // Don't block on delegation failure
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      // Restore message on error
      setMessage(messageToSend)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="relative p-4">
      {/* Mention autocomplete dropdown */}
      {showMentions && filteredEmployees.length > 0 && (
        <div className="absolute bottom-full left-4 right-4 mb-2 bg-popover border rounded-lg shadow-lg overflow-hidden z-10">
          <div className="py-1">
            {filteredEmployees.map((emp, index) => (
              <button
                key={emp.name}
                onClick={() => insertMention(emp.name)}
                className={cn(
                  'w-full px-4 py-2 text-left hover:bg-muted transition-colors',
                  index === selectedMentionIndex && 'bg-muted'
                )}
              >
                <div className="font-medium text-sm">{emp.name}</div>
                <div className="text-xs text-muted-foreground">{emp.description}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="flex gap-2 items-end">
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              conversationId
                ? 'Type @ to mention an AI employee...'
                : 'Select a conversation to start chatting'
            }
            disabled={!conversationId || isSending}
            className="min-h-[80px] max-h-[200px] resize-none pr-10"
          />

          {/* File attachment button (UI only for now) */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 bottom-2 h-8 w-8"
            disabled={!conversationId || isSending}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
        </div>

        {/* Send button */}
        <Button
          onClick={handleSend}
          disabled={!conversationId || !message.trim() || isSending}
          className="h-[80px] px-6 bg-pink-500 hover:bg-pink-600"
        >
          {isSending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Keyboard hint */}
      <div className="mt-2 text-xs text-muted-foreground text-center">
        <span className="font-mono bg-muted px-1 rounded">Enter</span> to send,{' '}
        <span className="font-mono bg-muted px-1 rounded">Shift + Enter</span> for new line
      </div>
    </div>
  )
}
