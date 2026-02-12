import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getUserRole } from '@/lib/auth/getUserRole'
import { AdminMessagingClient } from './AdminMessagingClient'

export const metadata: Metadata = {
  title: 'Messages — Pink Beam Admin',
  description: 'Communicate with clients and manage support requests',
}

export default async function AdminMessagesPage() {
  const role = await getUserRole()

  if (role !== 'ADMIN' && role !== 'MANAGER') {
    redirect('/portal')
  }

  return <AdminMessagingClient />
}
