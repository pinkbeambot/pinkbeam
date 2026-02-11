'use client'

import { useState } from 'react'
import { Building2, Users, Briefcase, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { onboardingCompanySchema, type OnboardingCompanyInput } from '@/lib/validation'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

interface CompanyStepProps {
  onComplete: () => void
  isSubmitting: boolean
}

const INDUSTRIES = [
  { value: 'technology', label: 'Technology', icon: '💻' },
  { value: 'healthcare', label: 'Healthcare', icon: '🏥' },
  { value: 'finance', label: 'Finance', icon: '💰' },
  { value: 'retail', label: 'Retail', icon: '🛍️' },
  { value: 'education', label: 'Education', icon: '🎓' },
  { value: 'manufacturing', label: 'Manufacturing', icon: '🏭' },
  { value: 'real-estate', label: 'Real Estate', icon: '🏢' },
  { value: 'other', label: 'Other', icon: '📦' },
] as const

const COMPANY_SIZES = [
  { value: '1-10', label: '1-10 employees', description: 'Small team' },
  { value: '11-50', label: '11-50 employees', description: 'Growing business' },
  { value: '51-200', label: '51-200 employees', description: 'Mid-size company' },
  { value: '201-500', label: '201-500 employees', description: 'Large company' },
  { value: '500+', label: '500+ employees', description: 'Enterprise' },
] as const

const SERVICES = [
  { value: 'design', label: 'Web Design', description: 'UI/UX & visual design' },
  { value: 'development', label: 'Development', description: 'Frontend & backend' },
  { value: 'seo', label: 'SEO', description: 'Search optimization' },
  { value: 'maintenance', label: 'Maintenance', description: 'Ongoing support' },
  { value: 'consulting', label: 'Consulting', description: 'Strategy & advice' },
  { value: 'hosting', label: 'Hosting', description: 'Server & infrastructure' },
] as const

export function CompanyStep({ onComplete, isSubmitting }: CompanyStepProps) {
  const { toast } = useToast()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState<OnboardingCompanyInput>({
    industry: '',
    companySize: '',
    servicesNeeded: [],
  })

  const toggleService = (service: string) => {
    setFormData(prev => {
      const services = prev.servicesNeeded.includes(service)
        ? prev.servicesNeeded.filter(s => s !== service)
        : [...prev.servicesNeeded, service]
      return { ...prev, servicesNeeded: services }
    })
    if (errors.servicesNeeded) {
      setErrors(prev => ({ ...prev, servicesNeeded: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const result = onboardingCompanySchema.safeParse(formData)
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
      const response = await fetch('/api/onboarding/company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Failed to save company details')

      toast({
        title: 'Company details saved',
        description: 'We\'ve noted your requirements.',
      })

      onComplete()
    } catch {
      toast({
        title: 'Error saving details',
        description: 'Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100 mb-4">
          <Building2 className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Tell Us About Your Company</h2>
        <p className="text-sm text-muted-foreground">
          This helps us understand your business and tailor our services.
        </p>
      </div>

      <div className="space-y-6">
        {/* Industry Selection */}
        <div className="space-y-3">
          <Label>
            What industry are you in? <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {INDUSTRIES.map(industry => (
              <button
                key={industry.value}
                type="button"
                onClick={() => {
                  setFormData(prev => ({ ...prev, industry: industry.value }))
                  if (errors.industry) {
                    setErrors(prev => ({ ...prev, industry: '' }))
                  }
                }}
                className={cn(
                  'p-3 rounded-lg border text-left transition-all hover:border-violet-300',
                  formData.industry === industry.value
                    ? 'border-violet-500 bg-violet-50 ring-1 ring-violet-500'
                    : 'border-border bg-card'
                )}
              >
                <span className="text-2xl mb-1 block">{industry.icon}</span>
                <span className="text-sm font-medium">{industry.label}</span>
              </button>
            ))}
          </div>
          {errors.industry && (
            <p className="text-sm text-red-500">{errors.industry}</p>
          )}
        </div>

        {/* Company Size */}
        <div className="space-y-3">
          <Label>
            <Users className="inline w-4 h-4 mr-1" />
            Company Size <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {COMPANY_SIZES.map(size => (
              <button
                key={size.value}
                type="button"
                onClick={() => {
                  setFormData(prev => ({ ...prev, companySize: size.value }))
                  if (errors.companySize) {
                    setErrors(prev => ({ ...prev, companySize: '' }))
                  }
                }}
                className={cn(
                  'p-3 rounded-lg border text-left transition-all hover:border-violet-300',
                  formData.companySize === size.value
                    ? 'border-violet-500 bg-violet-50 ring-1 ring-violet-500'
                    : 'border-border bg-card'
                )}
              >
                <span className="font-medium">{size.label}</span>
                <p className="text-xs text-muted-foreground">{size.description}</p>
              </button>
            ))}
          </div>
          {errors.companySize && (
            <p className="text-sm text-red-500">{errors.companySize}</p>
          )}
        </div>

        {/* Services Needed */}
        <div className="space-y-3">
          <Label>
            <Briefcase className="inline w-4 h-4 mr-1" />
            What services do you need? <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {SERVICES.map(service => {
              const isSelected = formData.servicesNeeded.includes(service.value)
              return (
                <button
                  key={service.value}
                  type="button"
                  onClick={() => toggleService(service.value)}
                  className={cn(
                    'p-3 rounded-lg border text-left transition-all hover:border-violet-300',
                    isSelected
                      ? 'border-violet-500 bg-violet-50 ring-1 ring-violet-500'
                      : 'border-border bg-card'
                  )}
                >
                  <div className="flex items-start gap-2">
                    <div
                      className={cn(
                        'w-4 h-4 rounded border mt-0.5 flex items-center justify-center',
                        isSelected
                          ? 'bg-violet-500 border-violet-500'
                          : 'border-muted-foreground'
                      )}
                    >
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <span className="font-medium text-sm">{service.label}</span>
                      <p className="text-xs text-muted-foreground">{service.description}</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
          {errors.servicesNeeded && (
            <p className="text-sm text-red-500">{errors.servicesNeeded}</p>
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
