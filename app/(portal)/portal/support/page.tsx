import { Metadata } from 'next'
import { SupportTicketsClient } from './SupportTicketsClient'

export const metadata: Metadata = {
  title: 'Support Tickets — Pink Beam Portal',
  description: 'Submit requests and track support tickets',
}

export default function SupportTicketsPage() {
  return <SupportTicketsClient />
}
