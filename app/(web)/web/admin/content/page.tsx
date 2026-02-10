'use client'

import { PenTool, FileText, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FadeIn } from '@/components/animations'

const blogPosts = [
  { id: '1', title: 'Why Your Website Needs to Load in Under 2 Seconds', status: 'published', views: 234 },
  { id: '2', title: 'SEO in 2025: What Actually Works', status: 'published', views: 189 },
  { id: '3', title: 'Building Trust Through Design', status: 'published', views: 156 },
]

export default function ContentPage() {
  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Content</h1>
            <p className="text-muted-foreground mt-1">Manage blog posts and content</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <Card>
          <CardHeader>
            <CardTitle>Blog Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {blogPosts.map((post) => (
                <div key={post.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-violet-500" />
                    </div>
                    <div>
                      <p className="font-medium">{post.title}</p>
                      <p className="text-sm text-muted-foreground">{post.views} views</p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground capitalize">{post.status}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  )
}
