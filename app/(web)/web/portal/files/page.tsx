'use client'

import { useState, useEffect, useCallback } from 'react'
import { Upload, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { FadeIn } from '@/components/animations'
import { FileUpload } from '@/components/file-upload'
import { FileList } from '@/components/file-list'
import { formatFileSize } from '@/lib/storage'
import type { FileRecord } from '@/types/file'

// TODO: Replace with real auth context from WEB-008
const CLIENT_ID = 'test-client'

const bucketFilters = [
  { value: '', label: 'All Files' },
  { value: 'deliverables', label: 'Deliverables' },
  { value: 'attachments', label: 'Attachments' },
]

export default function FilesPage() {
  const [files, setFiles] = useState<FileRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [bucketFilter, setBucketFilter] = useState('')
  const [usage, setUsage] = useState<{
    totalBytes: number
    totalFiles: number
    byBucket: { bucket: string; totalBytes: number; totalFiles: number }[]
  } | null>(null)

  const fetchFiles = useCallback(async () => {
    try {
      const params = new URLSearchParams({ uploadedById: CLIENT_ID })
      if (bucketFilter) params.set('bucket', bucketFilter)
      const res = await fetch(`/api/files?${params}`)
      const data = await res.json()
      if (data.success) setFiles(data.data)
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [bucketFilter])

  const fetchUsage = useCallback(async () => {
    try {
      const params = new URLSearchParams({ uploadedById: CLIENT_ID, latest: 'true' })
      if (bucketFilter) params.set('bucket', bucketFilter)
      const res = await fetch(`/api/files/usage?${params}`)
      const data = await res.json()
      if (data.success) setUsage(data.data)
    } catch {
      // silent
    }
  }, [bucketFilter])

  useEffect(() => {
    fetchFiles()
    fetchUsage()
  }, [fetchFiles, fetchUsage])

  const handleUploadComplete = (file: FileRecord) => {
    setFiles((prev) => [file, ...prev])
    fetchUsage()
  }

  const handleDelete = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId))
    fetchUsage()
  }

  const handleVersionUploaded = (file: FileRecord, replacedFileId: string) => {
    setFiles((prev) => [file, ...prev.filter((f) => f.id !== replacedFileId)])
    fetchUsage()
  }

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Files</h1>
            <p className="text-muted-foreground mt-1">
              Access all your project files and deliverables
            </p>
            {usage && (
              <p className="text-xs text-muted-foreground mt-2">
                Storage used: {formatFileSize(usage.totalBytes)} across {usage.totalFiles} files
              </p>
            )}
          </div>
          <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="w-4 h-4 mr-2" />
                Upload File
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Files</DialogTitle>
              </DialogHeader>
              <FileUpload
                bucket="deliverables"
                uploadedById={CLIENT_ID}
                onUploadComplete={handleUploadComplete}
                maxFiles={10}
              />
            </DialogContent>
          </Dialog>
        </div>
      </FadeIn>

      <FadeIn delay={0.05}>
        <div className="flex gap-2">
          {bucketFilters.map((f) => (
            <Badge
              key={f.value}
              variant="outline"
              className={`cursor-pointer transition-colors ${
                bucketFilter === f.value
                  ? 'bg-violet-500/10 text-violet-500 border-violet-500/30'
                  : 'hover:bg-muted'
              }`}
              onClick={() => setBucketFilter(f.value)}
            >
              {f.label}
            </Badge>
          ))}
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <Card>
          <CardHeader>
            <CardTitle>
              {bucketFilter
                ? bucketFilters.find((f) => f.value === bucketFilter)?.label
                : 'All Files'}
              {files.length > 0 && (
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  ({files.length})
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <FileList
                files={files}
                canDelete
                onDelete={handleDelete}
                canPreview
                enableVersioning
                uploadedById={CLIENT_ID}
                onVersionUploaded={handleVersionUploaded}
                emptyMessage="No files yet. Upload your first file to get started."
              />
            )}
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  )
}
