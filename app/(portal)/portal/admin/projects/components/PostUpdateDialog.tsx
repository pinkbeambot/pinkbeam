'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const UPDATE_TYPES = [
  { value: 'STATUS_CHANGE', label: 'Status Change', icon: '🔄' },
  { value: 'MILESTONE', label: 'Milestone Complete', icon: '✅' },
  { value: 'DELIVERABLE', label: 'Deliverable Added', icon: '📦' },
  { value: 'NOTE', label: 'General Note', icon: '📝' },
  { value: 'BLOCKER', label: 'Blocker', icon: '🚧' },
]

interface PostUpdateDialogProps {
  projectId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function PostUpdateDialog({
  projectId,
  open,
  onOpenChange,
  onSuccess,
}: PostUpdateDialogProps) {
  const [type, setType] = useState<string>('NOTE')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [visible, setVisible] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      toast.error('Please enter a title')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/projects/${projectId}/updates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          title: title.trim(),
          body: body.trim() || undefined,
          visible,
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to post update')
      }

      toast.success('Update posted successfully')

      // Reset form
      setType('NOTE')
      setTitle('')
      setBody('')
      setVisible(true)

      // Close dialog
      onOpenChange(false)

      // Trigger refresh
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error('Failed to post update:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to post update')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Post Project Update</DialogTitle>
            <DialogDescription>
              Share progress with the client or post an internal note.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Update Type */}
            <div className="space-y-2">
              <Label htmlFor="type">Update Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {UPDATE_TYPES.map((updateType) => (
                    <SelectItem key={updateType.value} value={updateType.value}>
                      <span className="flex items-center gap-2">
                        <span>{updateType.icon}</span>
                        <span>{updateType.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Homepage design approved"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Body */}
            <div className="space-y-2">
              <Label htmlFor="body">Details (optional)</Label>
              <Textarea
                id="body"
                placeholder="Add more context about this update..."
                rows={4}
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Supports markdown formatting
              </p>
            </div>

            {/* Visibility Toggle */}
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="visible" className="text-base cursor-pointer">
                  Visible to Client
                </Label>
                <p className="text-sm text-muted-foreground">
                  If disabled, this update will only be visible to admins
                </p>
              </div>
              <Switch
                id="visible"
                checked={visible}
                onCheckedChange={setVisible}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : (
                'Post Update'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
