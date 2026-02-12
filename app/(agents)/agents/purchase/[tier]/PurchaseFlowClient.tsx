'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { FadeIn } from '@/components/animations/FadeIn'
import { Check, ArrowRight, ArrowLeft } from 'lucide-react'
import { PricingTier, addOns } from '../../pricing/data/pricing'

interface PurchaseFlowClientProps {
  tier: PricingTier
  initialBilling: 'monthly' | 'annual'
  user: {
    id: string
    email: string
    name: string
    company: string
  }
}

export default function PurchaseFlowClient({
  tier,
  initialBilling,
  user,
}: PurchaseFlowClientProps) {
  const router = useRouter()
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>(initialBilling)
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Calculate pricing
  const basePrice = billingCycle === 'monthly' ? tier.price : tier.annualPrice
  const addOnsTotal = selectedAddOns.reduce((total, addOnId) => {
    const addOn = addOns.find((a) => a.id === addOnId)
    return total + (addOn?.price || 0)
  }, 0)
  const totalPrice = basePrice + addOnsTotal

  // Annual savings calculation
  const monthlyCost = tier.price + addOnsTotal
  const annualCost = billingCycle === 'annual' ? totalPrice : monthlyCost * 12
  const annualSavings = billingCycle === 'annual' ? monthlyCost * 12 - annualCost : 0

  const handleAddOnToggle = (addOnId: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(addOnId) ? prev.filter((id) => id !== addOnId) : [...prev, addOnId]
    )
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/agents/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          userEmail: user.email,
          userName: user.name,
          userCompany: user.company,
          tierId: tier.id,
          tierName: tier.name,
          billingCycle,
          addOns: selectedAddOns,
          totalPrice,
        }),
      })

      const result = await response.json()

      if (result.success) {
        // Redirect to confirmation page
        router.push(`/agents/purchase/confirm/${result.data.id}`)
      } else {
        console.error('Purchase failed:', result.error)
        alert('Failed to process purchase. Please try again.')
      }
    } catch (error) {
      console.error('Purchase error:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="py-20 md:py-32">
      <Container>
        <FadeIn>
          <div className="mb-12">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mb-6 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Pricing
            </Button>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
              Configure Your Plan
            </h1>
            <p className="text-xl text-muted-foreground">
              Customize your AI employee package and complete your purchase.
            </p>
          </div>
        </FadeIn>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Plan Selection */}
            <FadeIn delay={0.1}>
              <Card className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{tier.name}</h2>
                    <p className="text-muted-foreground">{tier.description}</p>
                  </div>
                  {tier.popular && (
                    <Badge variant="secondary" className="bg-pink-500/10 text-pink-500">
                      Most Popular
                    </Badge>
                  )}
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-medium text-muted-foreground">Included features:</p>
                  <ul className="space-y-2">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-pink-500 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </FadeIn>

            {/* Billing Cycle */}
            <FadeIn delay={0.2}>
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Billing Cycle</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => setBillingCycle('monthly')}
                    className={`p-4 rounded-lg border-2 text-left transition-colors ${
                      billingCycle === 'monthly'
                        ? 'border-pink-500 bg-pink-500/5'
                        : 'border-border hover:border-pink-500/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">Monthly</span>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          billingCycle === 'monthly'
                            ? 'border-pink-500 bg-pink-500'
                            : 'border-border'
                        }`}
                      >
                        {billingCycle === 'monthly' && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                    </div>
                    <p className="text-2xl font-bold">${tier.price}</p>
                    <p className="text-sm text-muted-foreground">per month</p>
                  </button>

                  <button
                    onClick={() => setBillingCycle('annual')}
                    className={`p-4 rounded-lg border-2 text-left transition-colors ${
                      billingCycle === 'annual'
                        ? 'border-pink-500 bg-pink-500/5'
                        : 'border-border hover:border-pink-500/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">Annual</span>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          billingCycle === 'annual'
                            ? 'border-pink-500 bg-pink-500'
                            : 'border-border'
                        }`}
                      >
                        {billingCycle === 'annual' && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                    </div>
                    <p className="text-2xl font-bold">${tier.annualPrice}</p>
                    <p className="text-sm text-muted-foreground">per month, billed annually</p>
                    <Badge variant="secondary" className="mt-2 bg-green-500/10 text-green-600">
                      Save 2 months
                    </Badge>
                  </button>
                </div>
              </Card>
            </FadeIn>

            {/* Add-ons */}
            <FadeIn delay={0.3}>
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Add-ons (Optional)</h3>
                <div className="space-y-4">
                  {addOns.map((addOn) => (
                    <div
                      key={addOn.id}
                      className="flex items-start gap-4 p-4 rounded-lg border hover:border-pink-500/50 transition-colors"
                    >
                      <Checkbox
                        id={addOn.id}
                        checked={selectedAddOns.includes(addOn.id)}
                        onCheckedChange={() => handleAddOnToggle(addOn.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <Label
                          htmlFor={addOn.id}
                          className="text-base font-semibold cursor-pointer"
                        >
                          {addOn.name}
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">{addOn.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${addOn.price}</p>
                        <p className="text-xs text-muted-foreground">/month</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </FadeIn>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <FadeIn delay={0.4}>
              <Card className="p-6 sticky top-24">
                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Plan:</span>
                    <span className="font-medium">{tier.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Base price:</span>
                    <span className="font-medium">${basePrice}/mo</span>
                  </div>

                  {selectedAddOns.length > 0 && (
                    <>
                      <div className="border-t pt-3">
                        <p className="text-sm font-medium mb-2">Add-ons:</p>
                        {selectedAddOns.map((addOnId) => {
                          const addOn = addOns.find((a) => a.id === addOnId)
                          return (
                            <div key={addOnId} className="flex justify-between text-sm mb-1">
                              <span className="text-muted-foreground">{addOn?.name}</span>
                              <span className="font-medium">${addOn?.price}/mo</span>
                            </div>
                          )
                        })}
                      </div>
                    </>
                  )}

                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="font-semibold">Total:</span>
                      <div className="text-right">
                        <p className="text-2xl font-bold">${totalPrice}</p>
                        <p className="text-xs text-muted-foreground">
                          per month{billingCycle === 'annual' && ', billed annually'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {billingCycle === 'annual' && annualSavings > 0 && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                      <p className="text-sm font-medium text-green-600">
                        💰 Annual savings: ${annualSavings}
                      </p>
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white"
                  size="lg"
                >
                  {isSubmitting ? 'Processing...' : 'Continue to Payment'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  Your subscription will begin immediately after payment. Cancel anytime.
                </p>
              </Card>
            </FadeIn>
          </div>
        </div>
      </Container>
    </div>
  )
}
