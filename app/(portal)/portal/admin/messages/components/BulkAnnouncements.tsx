'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Megaphone, Plus, Users, AlertCircle, CheckCircle2 } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

interface Announcement {
  id: string
  title: string
  content: string
  type: 'MAINTENANCE' | 'FEATURE' | 'NEWS'
  targetAudience: 'ALL' | 'ACTIVE' | 'INACTIVE'
  createdAt: Date
  sentCount: number
}

const ANNOUNCEMENT_TYPES = [
  { value: 'MAINTENANCE', label: 'Maintenance Notice', color: 'bg-orange-500' },
  { value: 'FEATURE', label: 'Feature Update', color: 'bg-blue-500' },
  { value: 'NEWS', label: 'Company News', color: 'bg-green-500' },
]

const AUDIENCE_OPTIONS = [
  { value: 'ALL', label: 'All Clients' },
  { value: 'ACTIVE', label: 'Active Clients Only' },
  { value: 'INACTIVE', label: 'Inactive Clients Only' },
]

export function BulkAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    type: 'NEWS' as const,
    targetAudience: 'ALL' as const,
  })

  useEffect(() => {
    loadAnnouncements()
  }, [])

  const loadAnnouncements = async () => {
    try {
      const response = await fetch('/api/admin/announcements')
      const result = await response.json()
      if (result.success) {
        setAnnouncements(result.data)
      }
    } catch (error) {
      console.error('Failed to load announcements:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const sendAnnouncement = async () => {
    if (!newAnnouncement.title || !newAnnouncement.content) return

    setIsSending(true)
    try {
      const response = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAnnouncement),
      })

      const result = await response.json()
      if (result.success) {
        setShowDialog(false)
        setNewAnnouncement({
          title: '',
          content: '',
          type: 'NEWS',
          targetAudience: 'ALL',
        })
        await loadAnnouncements()
      }
    } catch (error) {
      console.error('Failed to send announcement:', error)
    } finally {
      setIsSending(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-6 h-6 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Loading announcements...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with New Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Megaphone className="h-6 w-6 text-muted-foreground" />
          <div>
            <h2 className="text-lg font-semibold">Bulk Announcements</h2>
            <p className="text-sm text-muted-foreground">
              Send announcements to all clients or filtered groups
            </p>
          </div>
        </div>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button className="bg-pink-500 hover:bg-pink-600">
              <Plus className="h-4 w-4 mr-2" />
              New Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Send Bulk Announcement</DialogTitle>
              <DialogDescription>
                Create and send an announcement to your selected audience
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Title</label>
                <Input
                  placeholder="Announcement title..."
                  value={newAnnouncement.title}
                  onChange={(e) =>
                    setNewAnnouncement({ ...newAnnouncement, title: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Type</label>
                <Select
                  value={newAnnouncement.type}
                  onValueChange={(value: any) =>
                    setNewAnnouncement({ ...newAnnouncement, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ANNOUNCEMENT_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <div className={cn('w-2 h-2 rounded-full', type.color)} />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Target Audience</label>
                <Select
                  value={newAnnouncement.targetAudience}
                  onValueChange={(value: any) =>
                    setNewAnnouncement({ ...newAnnouncement, targetAudience: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AUDIENCE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Message</label>
                <Textarea
                  placeholder="Write your announcement message..."
                  value={newAnnouncement.content}
                  onChange={(e) =>
                    setNewAnnouncement({ ...newAnnouncement, content: e.target.value })
                  }
                  rows={6}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowDialog(false)}
                disabled={isSending}
              >
                Cancel
              </Button>
              <Button
                onClick={sendAnnouncement}
                disabled={isSending || !newAnnouncement.title || !newAnnouncement.content}
                className="bg-pink-500 hover:bg-pink-600"
              >
                {isSending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Megaphone className="h-4 w-4 mr-2" />
                    Send Announcement
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Announcements List */}
      <div className="grid gap-4">
        {announcements.length === 0 ? (
          <Card className="p-12 text-center border-dashed">
            <Megaphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No announcements yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Send your first announcement to keep clients informed
            </p>
            <Button
              onClick={() => setShowDialog(true)}
              className="bg-pink-500 hover:bg-pink-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Announcement
            </Button>
          </Card>
        ) : (
          announcements.map((announcement) => {
            const typeInfo = ANNOUNCEMENT_TYPES.find((t) => t.value === announcement.type)
            return (
              <Card key={announcement.id} className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className={cn('gap-1', typeInfo?.color, 'text-white')}>
                        {typeInfo?.label || announcement.type}
                      </Badge>
                      <Badge variant="outline" className="gap-1">
                        <Users className="h-3 w-3" />
                        {announcement.sentCount} recipients
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(announcement.createdAt), 'MMM d, yyyy h:mm a')}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{announcement.title}</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {announcement.content}
                    </p>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                </div>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
