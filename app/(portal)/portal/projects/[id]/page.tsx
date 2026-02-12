import { Metadata } from 'next'
import { ProjectDetailClient } from './ProjectDetailClient'

export const metadata: Metadata = {
  title: 'Project Details — Pink Beam Portal',
  description: 'View project milestones and deliverables',
}

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  return <ProjectDetailClient projectId={params.id} />
}
