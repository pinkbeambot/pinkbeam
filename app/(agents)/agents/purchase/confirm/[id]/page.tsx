import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import ConfirmationClient from './ConfirmationClient'

export const metadata: Metadata = {
  title: 'Purchase Confirmed — Pink Beam Agents',
  description: 'Your purchase request has been received.',
  robots: {
    index: false,
    follow: false,
  },
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ConfirmationPage({ params }: PageProps) {
  const { id } = await params

  // Check authentication
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/sign-in')
  }

  // Fetch quote request
  const quoteRequest = await prisma.quoteRequest.findUnique({
    where: { id },
  })

  if (!quoteRequest) {
    notFound()
  }

  // Verify ownership by email (since QuoteRequest doesn't have userId)
  if (quoteRequest.email !== user.email) {
    redirect('/portal')
  }

  // Parse notes field for metadata
  let metadata: Record<string, any> = {}
  try {
    metadata = quoteRequest.notes ? JSON.parse(quoteRequest.notes) : {}
  } catch (e) {
    // Invalid JSON in notes, use empty object
  }

  return (
    <ConfirmationClient
      quoteRequest={{
        id: quoteRequest.id,
        projectType: quoteRequest.projectType,
        description: quoteRequest.description,
        budgetRange: quoteRequest.budgetRange,
        createdAt: quoteRequest.createdAt.toISOString(),
        metadata,
      }}
      user={{
        name: quoteRequest.fullName,
        email: quoteRequest.email,
      }}
    />
  )
}
