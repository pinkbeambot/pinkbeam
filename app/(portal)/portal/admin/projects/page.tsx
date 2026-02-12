import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getUserRole } from '@/lib/auth/getUserRole'
import { ProjectManagementClient } from './ProjectManagementClient'

export const metadata: Metadata = {
  title: 'Project Management — Pink Beam Admin',
  description: 'Manage all client projects, deadlines, and deliverables',
}

export default async function AdminProjectsPage() {
  const role = await getUserRole()

  if (role !== 'ADMIN' && role !== 'MANAGER') {
    redirect('/portal')
  }

  return <ProjectManagementClient />
}
