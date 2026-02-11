'use client'

import { useState } from 'react'
import { FolderKanban, DollarSign, Calendar, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { onboardingProjectSchema, type OnboardingProjectInput } from '@/lib/validation'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

interface ProjectStepProps {
  onComplete: () => void
  isSubmitting: boolean
}

const BUDGET_RANGES = [
  { value: '2k-5k', label: '$2,000 - $5,000', description: 'Small project' },
  { value: '5k-10k', label: '$5,000 - $10,000', description: 'Medium project' },
  { value: '10k-25k', label: '$10,000 - $25,000', description: 'Large project' },
  { value: '25k-50k', label: '$25,000 - $50,000', description: 'Complex project' },
  { value: '50k+', label: '$50,000+', description: 'Enterprise project' },
] as const

const TIMELINES = [
  { value: 'asap', label: 'ASAP', description: 'Urgent - within weeks' },
  { value: '1-3-months', label: '1-3 months', description: 'Near-term project' },
  { value: '3-6-months', label: '3-6 months', description: 'Planned project' },
  { value: '6-months-plus', label: '6+ months', description: 'Long-term planning' },
  { value: 'flexible', label: 'Flexible', description: 'No strict deadline' },
] as const

export function ProjectStep({ onComplete, isSubmitting }: ProjectStepProps) {
  const { toast } = useToast()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState<OnboardingProjectInput>({
    projectName: '',
    description: '',
    budgetRange: '',
    timeline: '',
  })

  const handleChange = (field: keyof OnboardingProjectInput, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const result = onboardingProjectSchema.safeParse(formData)
    if (!result.success) {
      const flattened = result.error.flatten()
      const fieldErrors: Record<string, string> = {}
      Object.entries(flattened.fieldErrors).forEach(([field, messages]) => {
        if (messages && messages.length > 0) {
          fieldErrors[field] = messages[0]
        }
      })
      setErrors(fieldErrors)
      return
    }

    try {
      const response = await fetch('/api/onboarding/project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Failed to create project')

      toast({
        title: 'Project kickoff initiated',
        description: 'We\'ve received your project details.',
      })

      onComplete()
    } catch {
      toast({
        title: 'Error creating project',
        description: 'Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-100 mb-4">
          <FolderKanban className="w-6 h-6 text-amber-600" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Project Kickoff</h2>
        <p className="text-sm text-muted-foreground">
          Tell us about your project so we can start planning.
        </p>
      </div>

      <div className="space-y-6">
        {/* Project Name */}
        <div className="space-y-2">
          <Label htmlFor="projectName">
            Project Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="projectName"
            placeholder="e.g., Acme Corp Website Redesign"
            value={formData.projectName}
            onChange={e => handleChange('projectName', e.target.value)}
            className={errors.projectName ? 'border-red-500' : ''}
          />
          {errors.projectName && (
            <p className="text-sm text-red-500">{errors.projectName}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Project Description</Label>
          <Textarea
            id="description"
            placeholder="Briefly describe your project goals, features needed, and any specific requirements..."
            value={formData.description}
            onChange={e => handleChange('description', e.target.value)}
            rows={4}
            className={errors.description ? 'border-red-500' : ''}
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Optional but helpful: What are you trying to achieve?
          </p>
        </div>

        {/* Budget Range */}
        <div className="space-y-3">
          <Label>
            <DollarSign className="inline w-4 h-4 mr-1" />
            Budget Range <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {BUDGET_RANGES.map(budget => (
              <button
                key={budget.value}
                type="button"
                onClick={() => {
                  handleChange('budgetRange', budget.value)
                }}
                className={cn(
                  'p-3 rounded-lg border text-left transition-all hover:border-violet-300',
                  formData.budgetRange === budget.value
                    ? 'border-violet-500 bg-violet-50 ring-1 ring-violet-500'
                    : 'border-border bg-card'
                )}
              >
                <span className="font-medium">{budget.label}</span>
                <p className="text-xs text-muted-foreground">{budget.description}</p>
              </button>
            ))}
          </div>
          {errors.budgetRange && (
            <p className="text-sm text-red-500">{errors.budgetRange}</p>
          )}
        </div>

        {/* Timeline */}
        <div className="space-y-3">
          <Label>
            <Calendar className="inline w-4 h-4 mr-1" />
            Expected Timeline <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {TIMELINES.map(timeline => (
              <button
                key={timeline.value}
                type="button"
                onClick={() => {
                  handleChange('timeline', timeline.value)
                }}
                className={cn(
                  'p-3 rounded-lg border text-left transition-all hover:border-violet-300',
                  formData.timeline === timeline.value
                    ? 'border-violet-500 bg-violet-50 ring-1 ring-violet-500'
                    : 'border-border bg-card'
                )}
              >
                <span className="font-medium text-sm">{timeline.label}</span>
                <p className="text-xs text-muted-foreground">{timeline.description}</p>
              </button>
            ))}
          </div>
          {errors.timeline && (
            <p className="text-sm text-red-500">{errors.timeline}</p>
          )}
        </div>
      </div>

      <div className="pt-4">
        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating project...
            </>
          ) : (
            'Continue'
          )}
        </Button>
      </div>
    </form>
  )
}
