import { Metadata } from 'next'
import { ProjectsClient } from './ProjectsClient'

export const metadata: Metadata = {
  title: 'My Projects — Pink Beam Portal',
  description: 'View and track your project progress',
}

export default function ProjectsPage() {
  return <ProjectsClient />
}
