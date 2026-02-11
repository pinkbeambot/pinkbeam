'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  FolderKanban, 
  FileText, 
  Receipt, 
  MessageSquare,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Rocket
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface TutorialStepProps {
  onComplete: () => void
  isSubmitting: boolean
}

const FEATURES = [
  {
    id: 'dashboard',
    icon: LayoutDashboard,
    title: 'Your Dashboard',
    description: 'Get a quick overview of all your projects, invoices, and recent activity in one place.',
    color: 'violet',
    tip: 'Check here daily for updates on your projects.',
  },
  {
    id: 'projects',
    icon: FolderKanban,
    title: 'Project Management',
    description: 'Track project progress, view milestones, and communicate with your team directly.',
    color: 'blue',
    tip: 'Upload files and leave comments on specific projects.',
  },
  {
    id: 'files',
    icon: FileText,
    title: 'File Sharing',
    description: 'Upload, organize, and share files with your project team securely.',
    color: 'amber',
    tip: 'Drag and drop files to upload them quickly.',
  },
  {
    id: 'invoices',
    icon: Receipt,
    title: 'Invoices & Payments',
    description: 'View and pay invoices, track payment history, and download receipts.',
    color: 'green',
    tip: 'Set up autopay for recurring invoices.',
  },
  {
    id: 'support',
    icon: MessageSquare,
    title: 'Support Tickets',
    description: 'Submit support requests, track their status, and get help when you need it.',
    color: 'pink',
    tip: 'Use tickets for any questions or issues you have.',
  },
] as const

export function TutorialStep({ onComplete, isSubmitting }: TutorialStepProps) {
  const [currentFeature, setCurrentFeature] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)

  const handleNext = () => {
    if (currentFeature < FEATURES.length - 1) {
      setCurrentFeature(prev => prev + 1)
    } else {
      setShowCelebration(true)
    }
  }

  const handleFinish = () => {
    onComplete()
  }

  if (showCelebration) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 mb-6 animate-bounce">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-4">You&apos;re All Set! 🎉</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Your account is ready to go. We&apos;ve received your project details and our team will be in touch soon.
        </p>
        
        <div className="bg-violet-50 rounded-xl p-6 mb-8 max-w-md mx-auto">
          <h3 className="font-semibold text-violet-900 mb-2 flex items-center gap-2">
            <Rocket className="w-5 h-5" />
            What happens next?
          </h3>
          <ul className="text-left text-sm text-violet-800 space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
              Our team will review your project details
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
              You&apos;ll receive a welcome email with resources
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
              We&apos;ll schedule a kickoff call within 24-48 hours
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
              Your first project will appear in the Projects tab
            </li>
          </ul>
        </div>

        <Button 
          size="lg"
          onClick={handleFinish}
          disabled={isSubmitting}
          className="px-8"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Finishing up...
            </>
          ) : (
            <>
              Go to Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </motion.div>
    )
  }

  const feature = FEATURES[currentFeature]
  const Icon = feature.icon

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Tour the Portal</h2>
        <p className="text-sm text-muted-foreground">
          Here&apos;s a quick look at what you can do in your client portal.
        </p>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-2">
        {FEATURES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentFeature(index)}
            className={cn(
              'w-2 h-2 rounded-full transition-all',
              index === currentFeature
                ? 'w-8 bg-violet-500'
                : index < currentFeature
                ? 'bg-violet-300'
                : 'bg-gray-200'
            )}
          />
        ))}
      </div>

      {/* Feature Card */}
      <motion.div
        key={feature.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.2 }}
      >
        <Card className={cn(
          'p-6 border-2 transition-colors',
          feature.color === 'violet' && 'border-violet-200 bg-violet-50/50',
          feature.color === 'blue' && 'border-blue-200 bg-blue-50/50',
          feature.color === 'amber' && 'border-amber-200 bg-amber-50/50',
          feature.color === 'green' && 'border-green-200 bg-green-50/50',
          feature.color === 'pink' && 'border-pink-200 bg-pink-50/50',
        )}>
          <div className={cn(
            'w-14 h-14 rounded-xl flex items-center justify-center mb-4',
            feature.color === 'violet' && 'bg-violet-100 text-violet-600',
            feature.color === 'blue' && 'bg-blue-100 text-blue-600',
            feature.color === 'amber' && 'bg-amber-100 text-amber-600',
            feature.color === 'green' && 'bg-green-100 text-green-600',
            feature.color === 'pink' && 'bg-pink-100 text-pink-600',
          )}>
            <Icon className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
          <p className="text-muted-foreground mb-4">{feature.description}</p>
          
          <div className={cn(
            'p-3 rounded-lg text-sm',
            feature.color === 'violet' && 'bg-violet-100 text-violet-800',
            feature.color === 'blue' && 'bg-blue-100 text-blue-800',
            feature.color === 'amber' && 'bg-amber-100 text-amber-800',
            feature.color === 'green' && 'bg-green-100 text-green-800',
            feature.color === 'pink' && 'bg-pink-100 text-pink-800',
          )}>
            <strong>💡 Pro tip:</strong> {feature.tip}
          </div>
        </Card>
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button
          variant="ghost"
          onClick={() => setCurrentFeature(prev => Math.max(0, prev - 1))}
          disabled={currentFeature === 0}
        >
          Previous
        </Button>
        <Button onClick={handleNext}>
          {currentFeature === FEATURES.length - 1 ? (
            'Finish Tour'
          ) : (
            <>
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
