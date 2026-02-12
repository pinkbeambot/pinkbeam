import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getUserRole } from '@/lib/auth/getUserRole'
import { ClientManagementClient } from './ClientManagementClient'

export const metadata: Metadata = {
  title: 'Client Management — Pink Beam Admin',
  description: 'Manage all clients, subscriptions, and projects',
}

export default async function AdminClientsPage() {
  const role = await getUserRole()

  // Redirect non-admins
  if (role !== 'ADMIN' && role !== 'MANAGER') {
    redirect('/portal')
  }

  return <ClientManagementClient />
}
