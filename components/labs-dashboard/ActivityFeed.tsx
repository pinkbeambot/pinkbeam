import { cn } from '@/lib/utils'
import { FolderKanban, CheckCircle, Receipt, MessageSquare } from 'lucide-react'

interface Activity {
  id: string
  type: 'project_created' | 'task_completed' | 'invoice_paid' | 'comment_added'
  title: string
  description: string
  time: string
}

interface ActivityFeedProps {
  activities: Activity[]
}

const iconMap = {
  project_created: FolderKanban,
  task_completed: CheckCircle,
  invoice_paid: Receipt,
  comment_added: MessageSquare,
}

const iconColors = {
  project_created: 'bg-cyan-500/10 text-cyan-400',
  task_completed: 'bg-green-500/10 text-green-400',
  invoice_paid: 'bg-yellow-500/10 text-yellow-400',
  comment_added: 'bg-purple-500/10 text-purple-400',
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <div className="space-y-4">
      {activities.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No recent activity</p>
      ) : (
        activities.map((activity) => {
          const Icon = iconMap[activity.type]
          return (
            <div key={activity.id} className="flex items-start gap-4">
              <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center shrink-0', iconColors[activity.type])}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium">{activity.title}</p>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
                <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
