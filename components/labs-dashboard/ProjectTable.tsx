'use client'

import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { format } from 'date-fns'
type ProjectStatus = 'LEAD' | 'QUOTED' | 'ACCEPTED' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED'

interface ProjectMember {
  id: string
  role: string
  user: {
    id: string
    name: string | null
    email: string
  }
}

interface ProjectMilestone {
  id: string
  title: string
  dueDate: string | null
  completedAt: string | null
}

interface ProjectClient {
  id: string
  name: string | null
  email: string
}

interface Project {
  id: string
  title: string
  description: string | null
  status: ProjectStatus | string
  progress: number
  budget: string | null
  deadline: string | null
  startDate: string | null
  targetEndDate: string | null
  createdAt: string
  updatedAt: string
  client: ProjectClient
  members?: ProjectMember[]
  milestones?: ProjectMilestone[]
  _count: {
    files: number
  }
}

interface ProjectTableProps {
  projects: Project[]
  onArchive?: (id: string) => void
}

const statusConfig: Record<ProjectStatus, { label: string; className: string }> = {
  LEAD: { label: 'Lead', className: 'bg-gray-500/10 text-gray-400 border-gray-500/20' },
  QUOTED: { label: 'Quoted', className: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  ACCEPTED: { label: 'Accepted', className: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  IN_PROGRESS: { label: 'In Progress', className: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
  REVIEW: { label: 'Review', className: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  COMPLETED: { label: 'Completed', className: 'bg-green-500/10 text-green-400 border-green-500/20' },
  ON_HOLD: { label: 'On Hold', className: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  CANCELLED: { label: 'Cancelled', className: 'bg-red-500/10 text-red-400 border-red-500/20' },
}

export function ProjectTable({ projects, onArchive }: ProjectTableProps) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No projects found</p>
        <Button asChild className="mt-4 bg-cyan-600 hover:bg-cyan-700">
          <Link href="/labs/dashboard/projects/new">Create your first project</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Project</th>
            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Progress</th>
            <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden sm:table-cell">Deadline</th>
            <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden md:table-cell">Client</th>
            <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id} className="border-b hover:bg-muted/50 transition-colors">
              <td className="py-4 px-4">
                <div>
                  <p className="font-medium">{project.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {project._count.files} files
                  </p>
                </div>
              </td>
              <td className="py-4 px-4">
                <Badge 
                  variant="outline" 
                  className={statusConfig[project.status as ProjectStatus].className}
                >
                  {statusConfig[project.status as ProjectStatus].label}
                </Badge>
              </td>
              <td className="py-4 px-4">
                <div className="w-full max-w-[120px]">
                  <Progress value={project.progress} className="h-2" />
                  <span className="text-xs text-muted-foreground mt-1">{project.progress}%</span>
                </div>
              </td>
              <td className="py-4 px-4 text-sm text-muted-foreground hidden sm:table-cell">
                {project.deadline ? format(new Date(project.deadline), 'MMM d, yyyy') : '—'}
              </td>
              <td className="py-4 px-4 text-sm text-muted-foreground hidden md:table-cell">
                {project.client.name || project.client.email}
              </td>
              <td className="py-4 px-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/labs/dashboard/projects/${project.id}`}>
                      View
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/labs/dashboard/projects/${project.id}`}>
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/labs/dashboard/projects/${project.id}?tab=settings`}>
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      {onArchive && (
                        <DropdownMenuItem 
                          className="text-red-500"
                          onClick={() => onArchive(project.id)}
                        >
                          Archive
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
