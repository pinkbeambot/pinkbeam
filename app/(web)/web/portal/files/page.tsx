'use client'

import Link from 'next/link'
import { FileText, Download, Eye, CheckCircle, Clock, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FadeIn } from '@/components/animations'

const files = [
  { id: 1, name: 'Homepage Design v2.fig', type: 'figma', size: '12.5 MB', date: '2026-02-18', status: 'in-review' },
  { id: 2, name: 'Style Guide.pdf', type: 'pdf', size: '3.2 MB', date: '2026-02-15', status: 'approved' },
  { id: 3, name: 'Wireframes v1.fig', type: 'figma', size: '8.1 MB', date: '2026-02-10', status: 'approved' },
  { id: 4, name: 'Brand Assets.zip', type: 'zip', size: '45.2 MB', date: '2026-02-05', status: 'approved' },
]

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    'approved': 'bg-green-500/10 text-green-500 border-green-500/20',
    'in-review': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    'pending': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  }
  return colors[status] || 'bg-gray-500/10 text-gray-500'
}

export default function FilesPage() {
  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Files</h1>
            <p className="text-muted-foreground mt-1">
              Access all your project files and deliverables
            </p>
          </div>
          <Button>
            Upload File
          </Button>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <Card>
          <CardHeader>
            <CardTitle>All Files</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {files.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-violet-500" />
                    </div>
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {file.size} • {new Date(file.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={getStatusColor(file.status)}>
                      {file.status}
                    </Badge>
                    <Button variant="ghost" size="icon">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  )
}
