'use client'

import { UserCircle, Mail, FolderKanban, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FadeIn } from '@/components/animations'

const teamMembers = [
  { id: '1', name: 'Sarah Chen', email: 'sarah@pinkbeam.io', role: 'Project Manager', projects: 3, workload: 'high' },
  { id: '2', name: 'Mike Ross', email: 'mike@pinkbeam.io', role: 'Lead Developer', projects: 2, workload: 'medium' },
  { id: '3', name: 'Emma Wilson', email: 'emma@pinkbeam.io', role: 'Designer', projects: 2, workload: 'medium' },
  { id: '4', name: 'Alex Kim', email: 'alex@pinkbeam.io', role: 'Developer', projects: 1, workload: 'low' },
]

function getWorkloadColor(workload: string) {
  const colors: Record<string, string> = {
    'low': 'bg-green-500/10 text-green-500 border-green-500/20',
    'medium': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    'high': 'bg-red-500/10 text-red-500 border-red-500/20',
  }
  return colors[workload] || 'bg-gray-500/10 text-gray-500'
}

export default function TeamPage() {
  return (
    <div className="space-y-6">
      <FadeIn>
        <h1 className="text-3xl font-bold">Team</h1>
        <p className="text-muted-foreground mt-1">Manage team members and workload</p>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {teamMembers.map((member, index) => (
          <FadeIn key={member.id} delay={0.1 + index * 0.05}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-violet-500/10 flex items-center justify-center">
                      <UserCircle className="w-6 h-6 text-violet-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={getWorkloadColor(member.workload)}>
                    {member.workload}
                  </Badge>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    {member.email}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <FolderKanban className="w-4 h-4" />
                    {member.projects} active projects
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        ))}
      </div>

      <FadeIn delay={0.3}>
        <Card>
          <CardHeader>
            <CardTitle>Team Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold">{teamMembers.length}</p>
                <p className="text-sm text-muted-foreground">Total Members</p>
              </div>
              <div>
                <p className="text-3xl font-bold">{teamMembers.filter(m => m.workload === 'high').length}</p>
                <p className="text-sm text-muted-foreground">High Workload</p>
              </div>
              <div>
                <p className="text-3xl font-bold">{teamMembers.reduce((sum, m) => sum + m.projects, 0)}</p>
                <p className="text-sm text-muted-foreground">Active Projects</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  )
}
