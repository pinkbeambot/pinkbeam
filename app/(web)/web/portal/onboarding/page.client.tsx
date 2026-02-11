'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircle2, 
  Sparkles,
  SkipForward,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/hooks/use-toast'
import { ProfileStep } from './steps/ProfileStep'
import { CompanyStep } from './steps/CompanyStep'
import { ProjectStep } from './steps/ProjectStep'
import { TutorialStep } from './steps/TutorialStep'
import type { OnboardingStep, OnboardingStatus } from '@/lib/onboarding'

const STEPS: OnboardingStep[] = ['profile', 'company', 'project', 'tutorial']

interface OnboardingPageProps {
  initialStatus: OnboardingStatus
}

export default function OnboardingPage({ initialStatus }: OnboardingPageProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(
    initialStatus.currentStep === 'complete' ? 'profile' : initialStatus.currentStep
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSkipping, setIsSkipping] = useState(false)
  const [completedSteps, setCompletedSteps] = useState<Set<OnboardingStep>>(new Set())

  const currentStepIndex = STEPS.indexOf(currentStep)
  const progress = ((currentStepIndex + 1) / STEPS.length) * 100

  const handleStepComplete = async (step: OnboardingStep) => {
    setCompletedSteps(prev => new Set(prev).add(step))
    
    const nextIndex = currentStepIndex + 1
    if (nextIndex < STEPS.length) {
      const nextStep = STEPS[nextIndex]
      setCurrentStep(nextStep)
      
      // Update progress in database
      try {
        await fetch('/api/onboarding/step', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ step: nextStep }),
        })
      } catch (error) {
        console.error('Failed to update step:', error)
      }
    } else {
      await completeOnboarding()
    }
  }

  const completeOnboarding = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) throw new Error('Failed to complete onboarding')

      toast({
        title: 'Welcome aboard! 🎉',
        description: 'Your account is all set up. Let\'s get started!',
      })

      // Redirect to dashboard
      router.push('/web/portal')
      router.refresh()
    } catch {
      toast({
        title: 'Something went wrong',
        description: 'Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSkip = async () => {
    setIsSkipping(true)
    try {
      await fetch('/api/onboarding/skip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      toast({
        title: 'Onboarding skipped',
        description: 'You can complete your profile later in settings.',
      })

      router.push('/web/portal')
      router.refresh()
    } catch {
      toast({
        title: 'Something went wrong',
        description: 'Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSkipping(false)
    }
  }

  const goToStep = (index: number) => {
    if (index <= currentStepIndex || completedSteps.has(STEPS[index])) {
      setCurrentStep(STEPS[index])
    }
  }

  const renderStep = () => {
    const props = {
      onComplete: () => handleStepComplete(currentStep),
      isSubmitting,
    }

    switch (currentStep) {
      case 'profile':
        return <ProfileStep {...props} />
      case 'company':
        return <CompanyStep {...props} />
      case 'project':
        return <ProjectStep {...props} />
      case 'tutorial':
        return <TutorialStep {...props} onComplete={completeOnboarding} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome to Pink Beam</h1>
          <p className="text-muted-foreground">
            Let&apos;s get your account set up in just a few steps
          </p>
        </motion.div>

        {/* Progress */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Step {currentStepIndex + 1} of {STEPS.length}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}% complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          
          {/* Step indicators */}
          <div className="flex justify-between mt-4">
            {STEPS.map((step, index) => {
              const isActive = index === currentStepIndex
              const isCompleted = completedSteps.has(step) || index < currentStepIndex
              const isClickable = index <= currentStepIndex || completedSteps.has(step)

              return (
                <button
                  key={step}
                  onClick={() => isClickable && goToStep(index)}
                  disabled={!isClickable}
                  className={`flex flex-col items-center gap-2 transition-all ${
                    isClickable ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isActive
                        ? 'bg-violet-500 text-white ring-4 ring-violet-200'
                        : isCompleted
                        ? 'bg-green-500 text-white'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {isCompleted && !isActive ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </div>
                  <span
                    className={`text-xs font-medium capitalize ${
                      isActive ? 'text-violet-600' : 'text-muted-foreground'
                    }`}
                  >
                    {step}
                  </span>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Step Content */}
        <Card className="p-6 lg:p-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </Card>

        {/* Skip option */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-6"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkip}
            disabled={isSkipping}
            className="text-muted-foreground hover:text-foreground"
          >
            {isSkipping ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <SkipForward className="w-4 h-4 mr-2" />
            )}
            Skip for now
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
