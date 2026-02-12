import { redirect } from 'next/navigation'

interface TasksPageProps {
  params: Promise<{ id: string }>
}

export default async function TasksPage({ params }: TasksPageProps) {
  const { id } = await params
  redirect(`/portal/admin/labs/projects/${id}/tasks/board`)
}
