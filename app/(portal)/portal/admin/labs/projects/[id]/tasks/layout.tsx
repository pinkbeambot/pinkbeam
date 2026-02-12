'use client'

import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LayoutGrid, List } from 'lucide-react'

export default function TasksLayout({ children }: { children: React.ReactNode }) {
  const params = useParams()
  const pathname = usePathname()
  const projectId = params.id as string
  
  const activeTab = pathname.includes('/tasks/list') ? 'list' : 'board'
  
  return (
    <div className="h-full flex flex-col">
      {/* Sub-navigation */}
      <div className="flex items-center justify-between mb-6">
        <Tabs value={activeTab} className="w-auto">
          <TabsList>
            <TabsTrigger value="board" asChild>
              <Link href={`/portal/admin/labs/projects/${projectId}/tasks/board`}>
                <LayoutGrid className="w-4 h-4 mr-2" />
                Board
              </Link>
            </TabsTrigger>
            <TabsTrigger value="list" asChild>
              <Link href={`/portal/admin/labs/projects/${projectId}/tasks/list`}>
                <List className="w-4 h-4 mr-2" />
                List
              </Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  )
}
