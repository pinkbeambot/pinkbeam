import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PurchaseFlowClient from './PurchaseFlowClient'
import { pricingTiers } from '../../pricing/data/pricing'

export const metadata: Metadata = {
  title: 'Configure Your Plan — Pink Beam Agents',
  description: 'Customize your AI employee package and complete your purchase.',
  robots: {
    index: false,
    follow: false,
  },
}

interface PageProps {
  params: Promise<{ tier: string }>
  searchParams: Promise<{ billing?: string }>
}

export default async function PurchaseFlowPage({ params, searchParams }: PageProps) {
  const { tier } = await params
  const { billing } = await searchParams

  // Verify tier exists
  const selectedTier = pricingTiers.find((t) => t.id === tier)
  if (!selectedTier) {
    notFound()
  }

  // Check authentication
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    // Redirect to sign-in with return URL
    redirect(`/sign-in?redirect=/agents/purchase/${tier}${billing ? `?billing=${billing}` : ''}`)
  }

  // Get user details for pre-filling form
  const { data: userData } = await supabase
    .from('users')
    .select('name, email, company')
    .eq('id', user.id)
    .single()

  return (
    <PurchaseFlowClient
      tier={selectedTier}
      initialBilling={billing === 'annual' ? 'annual' : 'monthly'}
      user={{
        id: user.id,
        email: user.email || '',
        name: userData?.name || '',
        company: userData?.company || '',
      }}
    />
  )
}
