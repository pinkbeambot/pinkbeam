'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, X, Loader2, CheckCircle, AlertCircle, Paperclip } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ALL_ALLOWED_MIME_TYPES, MAX_FILE_SIZE, formatFileSize } from '@/lib/storage'
import type { FileRecord } from '@/types/file'

interface FileUploadProps {
  bucket: string
  uploadedById: string
  projectId?: string
  ticketId?: string
  commentId?: string
  invoiceId?: string
  versionGroupId?: string
  replaceFileId?: string
  onUploadComplete?: (file: FileRecord) => void
  maxFiles?: number
  compact?: boolean
}

interface QueuedFile {
  clientId: string
  file: File
  progress: number
  status: 'queued' | 'uploading' | 'complete' | 'error'
  error?: string
  serverRecord?: FileRecord
}

export function FileUpload({
  bucket,
  uploadedById,
  projectId,
  ticketId,
  commentId,
  invoiceId,
  versionGroupId,
  replaceFileId,
  onUploadComplete,
  maxFiles = 10,
  compact = false,
}: FileUploadProps) {
  const [queue, setQueue] = useState<QueuedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const uploadSingleFile = useCallback(async (qf: QueuedFile) => {
    setQueue((prev) =>
      prev.map((f) => (f.clientId === qf.clientId ? { ...f, status: 'uploading' as const } : f))
    )

    const formData = new FormData()
    formData.append('file', qf.file)
    formData.append('uploadedById', uploadedById)
    formData.append('bucket', bucket)
    if (projectId) formData.append('projectId', projectId)
    if (ticketId) formData.append('ticketId', ticketId)
    if (commentId) formData.append('commentId', commentId)
    if (invoiceId) formData.append('invoiceId', invoiceId)
    if (versionGroupId) formData.append('versionGroupId', versionGroupId)
    if (replaceFileId) formData.append('replaceFileId', replaceFileId)

    try {
      const res = await fetch('/api/files/upload', { method: 'POST', body: formData })
      const data = await res.json()

      if (!res.ok || !data.success) {
        setQueue((prev) =>
          prev.map((f) =>
            f.clientId === qf.clientId
              ? { ...f, status: 'error' as const, error: data.error || 'Upload failed' }
              : f
          )
        )
        return
      }

      setQueue((prev) =>
        prev.map((f) =>
          f.clientId === qf.clientId
            ? { ...f, status: 'complete' as const, progress: 100, serverRecord: data.data }
            : f
        )
      )
      onUploadComplete?.(data.data)
    } catch {
      setQueue((prev) =>
        prev.map((f) =>
          f.clientId === qf.clientId
            ? { ...f, status: 'error' as const, error: 'Network error' }
            : f
        )
      )
    }
  }, [
    bucket,
    uploadedById,
    projectId,
    ticketId,
    commentId,
    invoiceId,
    versionGroupId,
    replaceFileId,
    onUploadComplete,
  ])

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const newFiles: QueuedFile[] = []
      const fileArray = Array.from(files)

      for (const file of fileArray) {
        if (queue.length + newFiles.length >= maxFiles) break

        if (!ALL_ALLOWED_MIME_TYPES.includes(file.type)) {
          newFiles.push({
            clientId: crypto.randomUUID(),
            file,
            progress: 0,
            status: 'error',
            error: `"${file.type || 'unknown'}" is not an allowed file type`,
          })
          continue
        }
        if (file.size > MAX_FILE_SIZE) {
          newFiles.push({
            clientId: crypto.randomUUID(),
            file,
            progress: 0,
            status: 'error',
            error: `File exceeds ${formatFileSize(MAX_FILE_SIZE)} limit`,
          })
          continue
        }

        newFiles.push({
          clientId: crypto.randomUUID(),
          file,
          progress: 0,
          status: 'queued',
        })
      }

      setQueue((prev) => [...prev, ...newFiles])

      // Upload queued files
      for (const qf of newFiles) {
        if (qf.status === 'queued') {
          uploadSingleFile(qf)
        }
      }
    },
    [queue.length, maxFiles, uploadSingleFile]
  )

  const removeFromQueue = (clientId: string) => {
    setQueue((prev) => prev.filter((f) => f.clientId !== clientId))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files)
    }
  }

  const handleClick = () => inputRef.current?.click()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files)
      e.target.value = ''
    }
  }

  // Compact mode for inline use in forms
  if (compact) {
    return (
      <div className="space-y-2">
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          data-testid="file-upload-input"
          accept={ALL_ALLOWED_MIME_TYPES.join(',')}
          onChange={handleInputChange}
        />
        <button
          type="button"
          onClick={handleClick}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Paperclip className="w-4 h-4" />
          Attach files
        </button>
        {queue.length > 0 && (
          <div className="space-y-1">
            {queue.map((qf) => (
              <div
                key={qf.clientId}
                className="flex items-center gap-2 text-sm rounded px-2 py-1 bg-muted/50"
              >
                {qf.status === 'uploading' && <Loader2 className="w-3 h-3 animate-spin" />}
                {qf.status === 'complete' && (
                  <CheckCircle className="w-3 h-3 text-green-500" />
                )}
                {qf.status === 'error' && <AlertCircle className="w-3 h-3 text-red-500" />}
                <span className="truncate flex-1">{qf.file.name}</span>
                <span className="text-muted-foreground">{formatFileSize(qf.file.size)}</span>
                <button type="button" onClick={() => removeFromQueue(qf.clientId)}>
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Full mode with drag-and-drop zone
  return (
    <div className="space-y-4">
      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        data-testid="file-upload-input"
        accept={ALL_ALLOWED_MIME_TYPES.join(',')}
        onChange={handleInputChange}
      />
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragging ? 'border-pink-500 bg-pink-500/5' : 'border-muted-foreground/25 hover:border-muted-foreground/50'}
        `}
      >
        <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
        <p className="font-medium">Drop files here or click to browse</p>
        <p className="text-sm text-muted-foreground mt-1">
          Max {formatFileSize(MAX_FILE_SIZE)} per file. Images, documents, archives, and text
          files.
        </p>
      </div>

      {queue.length > 0 && (
        <div className="space-y-2">
          {queue.map((qf) => (
            <div
              key={qf.clientId}
              className="flex items-center gap-3 p-3 rounded-lg border bg-card"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {qf.status === 'uploading' && (
                    <Loader2 className="w-4 h-4 animate-spin text-pink-500 shrink-0" />
                  )}
                  {qf.status === 'complete' && (
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                  )}
                  {qf.status === 'error' && (
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  )}
                  {qf.status === 'queued' && (
                    <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/50 shrink-0" />
                  )}
                  <span className="text-sm font-medium truncate">{qf.file.name}</span>
                </div>
                {qf.error && <p className="text-xs text-red-500 mt-1">{qf.error}</p>}
                {qf.status === 'uploading' && (
                  <div className="w-full bg-muted rounded-full h-1 mt-2">
                    <div className="bg-pink-500 h-1 rounded-full animate-pulse w-2/3" />
                  </div>
                )}
              </div>
              <span className="text-xs text-muted-foreground shrink-0">
                {formatFileSize(qf.file.size)}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0"
                onClick={(e) => {
                  e.stopPropagation()
                  removeFromQueue(qf.clientId)
                }}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
