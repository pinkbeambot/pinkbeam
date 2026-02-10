'use client'

import { useState } from 'react'
import {
  FileText,
  Image,
  Archive,
  File,
  Download,
  Trash2,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatFileSize } from '@/lib/storage'

interface FileRecord {
  id: string
  name: string
  mimeType: string
  size: number
  bucket: string
  createdAt: string
  uploadedBy?: { id: string; name: string | null; email: string }
}

interface FileListProps {
  files: FileRecord[]
  canDelete?: boolean
  onDelete?: (fileId: string) => void
  emptyMessage?: string
}

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith('image/')) return Image
  if (mimeType === 'application/pdf' || mimeType.includes('document') || mimeType.includes('word'))
    return FileText
  if (mimeType.includes('zip') || mimeType.includes('archive')) return Archive
  return File
}

function getIconColor(mimeType: string) {
  if (mimeType.startsWith('image/')) return 'text-blue-500 bg-blue-500/10'
  if (mimeType === 'application/pdf') return 'text-red-500 bg-red-500/10'
  if (mimeType.includes('zip') || mimeType.includes('archive'))
    return 'text-amber-500 bg-amber-500/10'
  return 'text-violet-500 bg-violet-500/10'
}

export function FileList({
  files,
  canDelete = false,
  onDelete,
  emptyMessage = 'No files uploaded yet',
}: FileListProps) {
  const [downloading, setDownloading] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDownload = async (fileId: string, fileName: string) => {
    setDownloading(fileId)
    try {
      const res = await fetch(`/api/files/${fileId}`)
      const data = await res.json()
      if (data.success && data.data.downloadUrl) {
        const link = document.createElement('a')
        link.href = data.data.downloadUrl
        link.download = fileName
        link.target = '_blank'
        link.click()
      }
    } catch (err) {
      console.error('Download failed:', err)
    } finally {
      setDownloading(null)
    }
  }

  const handleDelete = async (fileId: string) => {
    setDeleting(fileId)
    try {
      const res = await fetch(`/api/files/${fileId}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        onDelete?.(fileId)
      }
    } catch (err) {
      console.error('Delete failed:', err)
    } finally {
      setDeleting(null)
    }
  }

  if (files.length === 0) {
    return <p className="text-sm text-muted-foreground py-4 text-center">{emptyMessage}</p>
  }

  return (
    <div className="space-y-2">
      {files.map((file) => {
        const Icon = getFileIcon(file.mimeType)
        const iconColor = getIconColor(file.mimeType)

        return (
          <div
            key={file.id}
            className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${iconColor}`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                  {file.uploadedBy?.name && ` · ${file.uploadedBy.name}`}
                  {' · '}
                  {new Date(file.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleDownload(file.id, file.name)}
                disabled={downloading === file.id}
              >
                {downloading === file.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
              </Button>
              {canDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                  onClick={() => handleDelete(file.id)}
                  disabled={deleting === file.id}
                >
                  {deleting === file.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </Button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
