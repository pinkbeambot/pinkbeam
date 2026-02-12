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
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { toast } from '@/components/ui/error-handling'

interface CreateTicketDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

const SERVICE_CATEGORIES = {
  AGENTS: ['Configuration', 'Performance', 'Integration', 'Billing', 'Other'],
  WEB: ['Content Update', 'Bug Fix', 'Design Change', 'New Page', 'Other'],
  LABS: ['Feature Request', 'Bug Report', 'Performance', 'Change Request', 'Other'],
  SOLUTIONS: ['Schedule Session', 'Follow-up', 'Question', 'Report Request', 'Other'],
}

export function CreateTicketDialog({ open, onOpenChange, onSuccess }: CreateTicketDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT',
    serviceType: '' as keyof typeof SERVICE_CATEGORIES | '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.description || !formData.category) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/support-tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const result = await response.json()
      
      if (result.success) {
        toast.success('Support ticket created successfully!')
        setFormData({
          title: '',
          description: '',
          category: '',
          priority: 'MEDIUM',
          serviceType: '',
        })
        onSuccess()
      } else {
        toast.error(result.error || 'Failed to create ticket')
      }
    } catch (error) {
      console.error('Failed to create ticket:', error)
      toast.error('Failed to create ticket. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const availableCategories = formData.serviceType
    ? SERVICE_CATEGORIES[formData.serviceType]
    : []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Support Request</DialogTitle>
            <DialogDescription>
              Submit a request and our team will get back to you as soon as possible
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Service Type */}
            <div className="space-y-2">
              <Label htmlFor="serviceType">
                Service Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.serviceType}
                onValueChange={(value: any) => {
                  setFormData({ ...formData, serviceType: value, category: '' })
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select service..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AGENTS">AI Employees</SelectItem>
                  <SelectItem value="WEB">Web Design</SelectItem>
                  <SelectItem value="LABS">Custom Software</SelectItem>
                  <SelectItem value="SOLUTIONS">Strategy & Consulting</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">
                Category <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                disabled={!formData.serviceType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category..." />
                </SelectTrigger>
                <SelectContent>
                  {availableCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: any) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Subject <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Brief description of your request..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Provide details about your request..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={6}
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
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-pink-500 hover:bg-pink-600"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Request'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
