'use client'

import { useState } from 'react'
import { User, Building2, Globe, Phone, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { onboardingProfileSchema, type OnboardingProfileInput } from '@/lib/validation'
import { useToast } from '@/hooks/use-toast'

interface ProfileStepProps {
  onComplete: () => void
  isSubmitting: boolean
}

export function ProfileStep({ onComplete, isSubmitting }: ProfileStepProps) {
  const { toast } = useToast()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState<OnboardingProfileInput>({
    name: '',
    phone: '',
    company: '',
    website: '',
  })

  const handleChange = (field: keyof OnboardingProfileInput, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const result = onboardingProfileSchema.safeParse(formData)
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
      const response = await fetch('/api/onboarding/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Failed to save profile')

      toast({
        title: 'Profile saved',
        description: 'Your profile information has been updated.',
      })

      onComplete()
    } catch {
      toast({
        title: 'Error saving profile',
        description: 'Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-violet-100 mb-4">
          <User className="w-6 h-6 text-violet-600" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Complete Your Profile</h2>
        <p className="text-sm text-muted-foreground">
          Tell us a bit about yourself so we can personalize your experience.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">
            Full Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={e => handleChange('name', e.target.value)}
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="phone"
              placeholder="+1 (555) 123-4567"
              value={formData.phone}
              onChange={e => handleChange('phone', e.target.value)}
              className={`pl-10 ${errors.phone ? 'border-red-500' : ''}`}
            />
          </div>
          {errors.phone && (
            <p className="text-sm text-red-500">{errors.phone}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="company">
            <Building2 className="inline w-4 h-4 mr-1" />
            Company Name
          </Label>
          <Input
            id="company"
            placeholder="Acme Corp"
            value={formData.company}
            onChange={e => handleChange('company', e.target.value)}
            className={errors.company ? 'border-red-500' : ''}
          />
          {errors.company && (
            <p className="text-sm text-red-500">{errors.company}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">
            <Globe className="inline w-4 h-4 mr-1" />
            Website URL
          </Label>
          <Input
            id="website"
            type="url"
            placeholder="https://example.com"
            value={formData.website}
            onChange={e => handleChange('website', e.target.value)}
            className={errors.website ? 'border-red-500' : ''}
          />
          {errors.website && (
            <p className="text-sm text-red-500">{errors.website}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Optional: Link to your current website
          </p>
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
              Saving...
            </>
          ) : (
            'Continue'
          )}
        </Button>
      </div>
    </form>
  )
}
