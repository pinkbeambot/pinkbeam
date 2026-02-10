'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  CheckCircle, 
  Circle, 
  FileText,
  MessageSquare,
  MoreVertical
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FadeIn } from '@/components/animations'

// Mock project data
const projectData: Record<string, any> = {
  '1': {
    id: '1',
    name: 'Acme Corp Website Redesign',
    status: 'in-progress',
    progress: 65,
    startDate: '2026-01-15',
    dueDate: '2026-03-15',
    phase: 'Development',
    description: 'Complete redesign of corporate website with modern UI/UX, improved performance, and mobile-first approach.',
    team: [
      { name: 'Sarah Chen', role: 'Project Manager' },
      { name: 'Mike Ross', role: 'Lead Developer' },
      { name: 'Emma Wilson', role: 'UI/UX Designer' },
    ],
    phases: [
      { name: 'Discovery', status: 'completed', date: '2026-01-22' },
      { name: 'Design', status: 'completed', date: '2026-02-05' },
      { name: 'Development', status: 'in-progress', date: '2026-02-20' },
      { name: 'Testing', status: 'pending', date: '2026-03-05' },
      { name: 'Launch', status: 'pending', date: '2026-03-15' },
    ],
    deliverables: [
      { name: 'Homepage Design', type: 'figma', status: 'approved', date: '2026-02-01' },
      { name: 'Style Guide', type: 'pdf', status: 'approved', date: '2026-02-03' },
      { name: 'Homepage Development', type: 'link', status: 'in-review', date: '2026-02-18' },
    ],
  },
  '2': {
    id: '2',
    name: 'E-commerce Platform',
    status: 'planning',
    progress: 15,
    startDate: '2026-02-01',
    dueDate: '2026-04-01',
    phase: 'Discovery',
    description: 'Full-featured e-commerce platform with payment integration, inventory management, and analytics.',
    team: [
      { name: 'Sarah Chen', role: 'Project Manager' },
      { name: 'Alex Kim', role: 'Backend Developer' },
    ],
    phases: [
      { name: 'Discovery', status: 'in-progress', date: '2026-02-15' },
      { name: 'Design', status: 'pending', date: '2026-03-01' },
      { name: 'Development', status: 'pending', date: '2026-03-15' },
      { name: 'Testing', status: 'pending', date: '2026-03-25' },
      { name: 'Launch', status: 'pending', date: '2026-04-01' },
    ],
    deliverables: [
      { name: 'Requirements Doc', type: 'pdf', status: 'approved', date: '2026-02-05' },
    ],
  },
  '3': {
    id: '3',
    name: 'Marketing Landing Pages',
    status: 'review',
    progress: 90,
    startDate: '2026-01-20',
    dueDate: '2026-02-20',
    phase: 'Review',
    description: '5 high-converting landing pages for marketing campaigns with A/B testing setup.',
    team: [
      { name: 'Mike Ross', role: 'Developer' },
      { name: 'Emma Wilson', role: 'Designer' },
    ],
    phases: [
      { name: 'Discovery', status: 'completed', date: '2026-01-25' },
      { name: 'Design', status: 'completed', date: '2026-02-05' },
      { name: 'Development', status: 'completed', date: '2026-02-15' },
      { name: 'Review', status: 'in-progress', date: '2026-02-20' },
      { name: 'Launch', status: 'pending', date: '2026-02-22' },
    ],
    deliverables: [
      { name: 'Landing Page Designs', type: 'figma', status: 'approved', date: '2026-02-05' },
      { name: 'Landing Page 1', type: 'link', status: 'approved', date: '2026-02-15' },
      { name: 'Landing Page 2', type: 'link', status: 'approved', date: '2026-02-15' },
    ],
  },
}

const comments = [
  { id: 1, author: 'Sarah Chen', text: 'Homepage design looks great! Just a few small tweaks needed.', time: '2 hours ago' },
  { id: 2, author: 'You', text: 'Thanks! I\'ve left feedback on the Figma file.', time: '1 hour ago' },
  { id: 3, author: 'Mike Ross', text: 'Development is on track. Will push updates by EOD.', time: '30 min ago' },
]

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    'in-progress': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    'planning': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    'review': 'bg-violet-500/10 text-violet-500 border-violet-500/20',
    'completed': 'bg-green-500/10 text-green-500 border-green-500/20',
  }
  return colors[status] || 'bg-gray-500/10 text-gray-500'
}

export default function ProjectDetailPage() {
  const params = useParams()
  const projectId = params?.id as string
  const project = projectData[projectId]

  if (!project) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-2">Project Not Found</h1>
        <p className="text-muted-foreground mb-4">The project you&apos;re looking for doesn&apos;t exist.</p>
        <Button asChild>
          <Link href="/web/portal/projects">Back to Projects</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <FadeIn>
        <Button variant="ghost" asChild className="-ml-4">
          <Link href="/web/portal/projects">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Link>
        </Button>
      </FadeIn>

      {/* Header */}
      <FadeIn delay={0.1}>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{project.name}</h1>
              <Badge variant="outline" className={getStatusColor(project.status)}>
                {project.status}
              </Badge>
            </div>
            <p className="text-muted-foreground max-w-2xl">{project.description}</p>
          </div>
          <Button variant="outline">
            <MoreVertical className="w-4 h-4 mr-2" />
            Actions
          </Button>
        </div>
      </FadeIn>

      {/* Stats Bar */}
      <FadeIn delay={0.15}>
        <div className="flex flex-wrap gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Due:</span>
            {new Date(project.dueDate).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Phase:</span>
            {project.phase}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Progress:</span>
            <span className="font-medium">{project.progress}%</span>
          </div>
        </div>
      </FadeIn>

      {/* Progress Bar */}
      <FadeIn delay={0.2}>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-violet-500 rounded-full transition-all"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </FadeIn>

      {/* Tabs */}
      <FadeIn delay={0.25}>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="deliverables">Deliverables</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Start Date</p>
                      <p className="font-medium">{new Date(project.startDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Due Date</p>
                      <p className="font-medium">{new Date(project.dueDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className="font-medium capitalize">{project.status}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Current Phase</p>
                      <p className="font-medium">{project.phase}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Team</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {project.team.map((member: any) => (
                      <div key={member.name} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-violet-500">
                            {member.name.split(' ').map((n: string) => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-sm">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-0">
                  {project.phases.map((phase: any, index: number) => (
                    <div key={phase.name} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          phase.status === 'completed' ? 'bg-green-500/20 text-green-500' :
                          phase.status === 'in-progress' ? 'bg-blue-500/20 text-blue-500' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {phase.status === 'completed' ? <CheckCircle className="w-4 h-4" /> :
                           phase.status === 'in-progress' ? <Clock className="w-4 h-4" /> :
                           <Circle className="w-4 h-4" />}
                        </div>
                        {index < project.phases.length - 1 && (
                          <div className="w-0.5 h-12 bg-muted my-1" />
                        )}
                      </div>
                      <div className="pb-8">
                        <p className="font-medium">{phase.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(phase.date).toLocaleDateString()} • {phase.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deliverables" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Deliverables</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {project.deliverables.map((item: any) => (
                    <div key={item.name} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-violet-500" />
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.type.toUpperCase()} • {new Date(item.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comments" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Comments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="w-4 h-4 text-violet-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{comment.author}</span>
                          <span className="text-xs text-muted-foreground">{comment.time}</span>
                        </div>
                        <p className="text-sm">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t">
                  <Button variant="outline" className="w-full">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Add Comment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </FadeIn>
    </div>
  )
}
