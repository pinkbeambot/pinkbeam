'use client'

import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FadeIn } from '@/components/animations/FadeIn'
import { CheckCircle, ArrowRight, Mail, Calendar, CreditCard } from 'lucide-react'

interface ConfirmationClientProps {
  quoteRequest: {
    id: string
    projectType: string
    description: string
    budgetRange: string
    createdAt: string
    metadata: Record<string, any>
  }
  user: {
    name: string
    email: string
  }
}

export default function ConfirmationClient({ quoteRequest, user }: ConfirmationClientProps) {
  const { metadata } = quoteRequest

  return (
    <div className="py-20 md:py-32">
      <Container>
        <FadeIn>
          <div className="max-w-3xl mx-auto">
            {/* Success Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-6">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
                Request Received!
              </h1>
              <p className="text-xl text-muted-foreground">
                Thank you, {user.name}. We'll get back to you shortly.
              </p>
            </div>

            {/* Order Details */}
            <Card className="p-6 md:p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Order Details</h2>
                <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600">
                  Pending Approval
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b">
                  <span className="text-muted-foreground">Request ID:</span>
                  <span className="font-mono text-sm">{quoteRequest.id.slice(0, 8)}</span>
                </div>

                <div className="flex justify-between py-3 border-b">
                  <span className="text-muted-foreground">Plan:</span>
                  <span className="font-medium capitalize">{metadata.tierId}</span>
                </div>

                <div className="flex justify-between py-3 border-b">
                  <span className="text-muted-foreground">Billing Cycle:</span>
                  <span className="font-medium capitalize">{metadata.billingCycle}</span>
                </div>

                {metadata.addOns && metadata.addOns.length > 0 && (
                  <div className="flex justify-between py-3 border-b">
                    <span className="text-muted-foreground">Add-ons:</span>
                    <span className="font-medium">{metadata.addOns.length} selected</span>
                  </div>
                )}

                <div className="flex justify-between py-3">
                  <span className="text-muted-foreground">Total:</span>
                  <span className="text-2xl font-bold">{quoteRequest.budgetRange}</span>
                </div>
              </div>
            </Card>

            {/* Next Steps */}
            <Card className="p-6 md:p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6">What happens next?</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-pink-500/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-pink-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">1. Check Your Email</h3>
                    <p className="text-sm text-muted-foreground">
                      We've sent a confirmation to <strong>{user.email}</strong>. You'll receive
                      further instructions within 24 hours.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-pink-500/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-pink-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">2. Schedule Onboarding</h3>
                    <p className="text-sm text-muted-foreground">
                      Our team will reach out to schedule a brief onboarding call to customize your
                      AI employees for your specific needs.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-pink-500/10 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-pink-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">3. Complete Payment</h3>
                    <p className="text-sm text-muted-foreground">
                      Once everything is configured, we'll send you a secure payment link to
                      activate your subscription.
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-pink-500 hover:bg-pink-600 text-white">
                <Link href="/portal">
                  Go to Portal
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">Contact Support</Link>
              </Button>
            </div>

            {/* Footer Note */}
            <div className="mt-12 p-6 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground text-center">
                <strong>Need help?</strong> Our support team is available Monday-Friday, 9am-5pm
                PST. Email us at{' '}
                <a href="mailto:support@pinkbeam.ai" className="text-pink-500 hover:underline">
                  support@pinkbeam.ai
                </a>{' '}
                or call{' '}
                <a href="tel:+1-555-PINK-BEAM" className="text-pink-500 hover:underline">
                  (555) PINK-BEAM
                </a>
                .
              </p>
            </div>
          </div>
        </FadeIn>
      </Container>
    </div>
  )
}
