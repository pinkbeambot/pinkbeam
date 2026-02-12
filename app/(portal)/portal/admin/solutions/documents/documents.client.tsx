'use client'

import Link from 'next/link'
import { useState } from 'react'
import { 
  FileText, 
  Folder, 
  Download, 
  Search,
  ArrowLeft,
  ChevronRight,
  MoreHorizontal,
  File,
  FileSpreadsheet,
  FileImage,
  FileCode,
  Eye,
  Grid3X3,
  List
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FadeIn } from '@/components/animations'
import type { User } from '@supabase/supabase-js'

interface DocumentsViewProps {
  user: User
}

// Mock data - will be replaced with real API calls
const folders = [
  { 
    id: '1', 
    name: 'Digital Transformation Strategy', 
    engagementId: '1',
    fileCount: 12,
    lastUpdated: '2026-02-08'
  },
  { 
    id: '2', 
    name: 'Process Automation Assessment', 
    engagementId: '2',
    fileCount: 8,
    lastUpdated: '2026-02-05'
  },
  { 
    id: '3', 
    name: 'AI Strategy Workshop', 
    engagementId: '3',
    fileCount: 15,
    lastUpdated: '2025-12-15'
  },
  { 
    id: '4', 
    name: 'General Documents', 
    engagementId: null,
    fileCount: 5,
    lastUpdated: '2026-01-20'
  },
]

const files = [
  { 
    id: '1', 
    name: 'Digital Transformation Roadmap v2.pdf', 
    folderId: '1',
    type: 'pdf',
    size: '4.2 MB',
    uploadedAt: '2026-02-08',
    uploadedBy: 'Sarah Chen'
  },
  { 
    id: '2', 
    name: 'Stakeholder Interview Summary.docx', 
    folderId: '1',
    type: 'doc',
    size: '1.8 MB',
    uploadedAt: '2026-02-05',
    uploadedBy: 'Sarah Chen'
  },
  { 
    id: '3', 
    name: 'Technology Assessment Matrix.xlsx', 
    folderId: '1',
    type: 'xls',
    size: '856 KB',
    uploadedAt: '2026-02-01',
    uploadedBy: 'Sarah Chen'
  },
  { 
    id: '4', 
    name: 'Current State Process Maps.pptx', 
    folderId: '2',
    type: 'ppt',
    size: '12.4 MB',
    uploadedAt: '2026-02-05',
    uploadedBy: 'Marcus Johnson'
  },
  { 
    id: '5', 
    name: 'Gap Analysis Findings.pdf', 
    folderId: '2',
    type: 'pdf',
    size: '3.1 MB',
    uploadedAt: '2026-01-28',
    uploadedBy: 'Marcus Johnson'
  },
  { 
    id: '6', 
    name: 'Process Inventory.xlsx', 
    folderId: '2',
    type: 'xls',
    size: '2.3 MB',
    uploadedAt: '2026-01-25',
    uploadedBy: 'Marcus Johnson'
  },
  { 
    id: '7', 
    name: 'Workshop Photos.zip', 
    folderId: '3',
    type: 'zip',
    size: '45.6 MB',
    uploadedAt: '2025-12-10',
    uploadedBy: 'Dr. Emily Rodriguez'
  },
  { 
    id: '8', 
    name: 'AI Use Case Analysis.pdf', 
    folderId: '3',
    type: 'pdf',
    size: '5.7 MB',
    uploadedAt: '2025-12-08',
    uploadedBy: 'Dr. Emily Rodriguez'
  },
  { 
    id: '9', 
    name: 'Implementation Roadmap.pptx', 
    folderId: '3',
    type: 'ppt',
    size: '8.9 MB',
    uploadedAt: '2025-12-05',
    uploadedBy: 'Dr. Emily Rodriguez'
  },
  { 
    id: '10', 
    name: 'Master Services Agreement.pdf', 
    folderId: '4',
    type: 'pdf',
    size: '1.2 MB',
    uploadedAt: '2026-01-20',
    uploadedBy: 'Pink Beam Legal'
  },
  { 
    id: '11', 
    name: 'NDA Template.docx', 
    folderId: '4',
    type: 'doc',
    size: '45 KB',
    uploadedAt: '2026-01-15',
    uploadedBy: 'Pink Beam Legal'
  },
]

function getFileIcon(type: string) {
  switch (type) {
    case 'pdf':
      return <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center"><FileText className="w-5 h-5 text-red-500" /></div>
    case 'doc':
      return <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center"><FileText className="w-5 h-5 text-blue-500" /></div>
    case 'xls':
      return <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center"><FileSpreadsheet className="w-5 h-5 text-green-500" /></div>
    case 'ppt':
      return <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center"><FileText className="w-5 h-5 text-orange-500" /></div>
    case 'zip':
      return <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center"><FileCode className="w-5 h-5 text-violet-500" /></div>
    case 'image':
      return <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center"><FileImage className="w-5 h-5 text-pink-500" /></div>
    default:
      return <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center"><File className="w-5 h-5" /></div>
  }
}

function getFileExtension(name: string) {
  return name.split('.').pop()?.toUpperCase() || ''
}

function FolderCard({ folder, onClick }: { folder: typeof folders[0], onClick: () => void }) {
  return (
    <Card 
      className="cursor-pointer hover:border-amber-500/30 hover:bg-amber-500/5 transition-colors group"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
            <Folder className="w-6 h-6 text-amber-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{folder.name}</h3>
            <p className="text-sm text-muted-foreground">{folder.fileCount} files</p>
            <p className="text-xs text-muted-foreground">Updated {new Date(folder.lastUpdated).toLocaleDateString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function FileRow({ file }: { file: typeof files[0] }) {
  const isPdf = file.type === 'pdf'
  
  return (
    <div className="flex items-center gap-4 p-4 rounded-lg border hover:border-amber-500/30 hover:bg-amber-500/5 transition-colors group">
      {getFileIcon(file.type)}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium truncate">{file.name}</h4>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Badge variant="secondary" className="text-xs">{getFileExtension(file.name)}</Badge>
          <span>•</span>
          <span>{file.size}</span>
          <span>•</span>
          <span>{new Date(file.uploadedAt).toLocaleDateString()}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {isPdf && (
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Eye className="w-4 h-4" />
          </Button>
        )}
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Download className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

export default function DocumentsView({ user }: DocumentsViewProps) {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [searchQuery, setSearchQuery] = useState('')

  const currentFolder = selectedFolder ? folders.find(f => f.id === selectedFolder) : null
  const folderFiles = selectedFolder ? files.filter(f => f.folderId === selectedFolder) : []
  
  const filteredFiles = searchQuery 
    ? files.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : folderFiles

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeIn>
        <div className="flex items-center gap-4">
          {selectedFolder ? (
            <Button variant="ghost" size="icon" onClick={() => setSelectedFolder(null)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
          ) : (
            <Button variant="ghost" size="icon" asChild>
              <Link href="/portal/admin/solutions">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold">
              {selectedFolder ? currentFolder?.name : 'Documents'}
            </h1>
            <p className="text-muted-foreground">
              {selectedFolder 
                ? `${folderFiles.length} files in this folder`
                : 'Access your deliverables and project files'
              }
            </p>
          </div>
          {selectedFolder && (
            <div className="flex items-center gap-2">
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'grid' | 'list')}>
                <TabsList>
                  <TabsTrigger value="list"><List className="w-4 h-4" /></TabsTrigger>
                  <TabsTrigger value="grid"><Grid3X3 className="w-4 h-4" /></TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          )}
        </div>
      </FadeIn>

      {/* Search */}
      <FadeIn delay={0.1}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder={selectedFolder ? "Search files..." : "Search folders and files..."}
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </FadeIn>

      {/* Content */}
      {!selectedFolder ? (
        /* Folder Grid */
        <FadeIn delay={0.2}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {folders.map((folder) => (
              <FolderCard 
                key={folder.id} 
                folder={folder} 
                onClick={() => setSelectedFolder(folder.id)}
              />
            ))}
          </div>
        </FadeIn>
      ) : (
        /* File List */
        <FadeIn delay={0.2}>
          {filteredFiles.length > 0 ? (
            <div className="space-y-2">
              {filteredFiles.map((file) => (
                <FileRow key={file.id} file={file} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No files found</h3>
                <p className="text-muted-foreground">{searchQuery ? 'Try a different search term' : 'This folder is empty'}</p>
              </CardContent>
            </Card>
          )}
        </FadeIn>
      )}

      {/* All Files View (when searching from root) */}
      {searchQuery && !selectedFolder && (
        <FadeIn delay={0.3}>
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Search Results</h3>
            {filteredFiles.length > 0 ? (
              <div className="space-y-2">
                {filteredFiles.map((file) => (
                  <FileRow key={file.id} file={file} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No files found</h3>
                  <p className="text-muted-foreground">Try a different search term</p>
                </CardContent>
              </Card>
            )}
          </div>
        </FadeIn>
      )}
    </div>
  )
}
