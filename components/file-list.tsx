'use client'

import { useRef, useState } from 'react'
import {
  FileText,
  Image,
  Archive,
  File,
  Download,
  Trash2,
  Loader2,
  Eye,
  History,
  UploadCloud,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  ALL_ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE,
  formatFileSize,
  isPreviewableMimeType,
} from '@/lib/storage'
import type { FileRecord } from '@/types/file'

interface FileListProps {
  files: FileRecord[]
  canDelete?: boolean
  onDelete?: (fileId: string) => void
  emptyMessage?: string
  canPreview?: boolean
  enableVersioning?: boolean
  uploadedById?: string
  onVersionUploaded?: (file: FileRecord, replacedFileId: string) => void
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
  canPreview = true,
  enableVersioning = false,
  uploadedById,
  onVersionUploaded,
}: FileListProps) {
  const [downloading, setDownloading] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [previewFile, setPreviewFile] = useState<FileRecord | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [previewError, setPreviewError] = useState<string | null>(null)
  const [versionsOpen, setVersionsOpen] = useState(false)
  const [versionsLoading, setVersionsLoading] = useState(false)
  const [versions, setVersions] = useState<FileRecord[]>([])
  const [activeVersionFile, setActiveVersionFile] = useState<FileRecord | null>(null)
  const [versionUploadingId, setVersionUploadingId] = useState<string | null>(null)
  const [versionUploadError, setVersionUploadError] = useState<string | null>(null)
  const [versionTarget, setVersionTarget] = useState<FileRecord | null>(null)
  const versionInputRef = useRef<HTMLInputElement>(null)

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

  const handlePreview = async (file: FileRecord) => {
    if (!canPreview || !isPreviewableMimeType(file.mimeType)) return
    setPreviewFile(file)
    setPreviewUrl(null)
    setPreviewError(null)
    setPreviewLoading(true)

    try {
      const res = await fetch(`/api/files/${file.id}`)
      const data = await res.json()
      if (!res.ok || !data.success) {
        setPreviewError(data.error || 'Preview failed')
        return
      }
      const url = data.data.previewUrl || data.data.downloadUrl || null
      if (!url) {
        setPreviewError('Preview is not available for this file.')
        return
      }
      setPreviewUrl(url)
    } catch (err) {
      console.error('Preview failed:', err)
      setPreviewError('Preview failed')
    } finally {
      setPreviewLoading(false)
    }
  }

  const closePreview = () => {
    setPreviewFile(null)
    setPreviewUrl(null)
    setPreviewError(null)
    setPreviewLoading(false)
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

  const openVersions = async (file: FileRecord) => {
    if (!file.versionGroupId) return
    setVersionsOpen(true)
    setVersionsLoading(true)
    setVersions([])
    setActiveVersionFile(file)
    try {
      const params = new URLSearchParams({
        versionGroupId: file.versionGroupId,
        latest: 'false',
      })
      const res = await fetch(`/api/files?${params}`)
      const data = await res.json()
      if (data.success) {
        setVersions(data.data)
      }
    } catch (err) {
      console.error('Failed to load versions:', err)
    } finally {
      setVersionsLoading(false)
    }
  }

  const closeVersions = () => {
    setVersionsOpen(false)
    setVersions([])
    setActiveVersionFile(null)
  }

  const handleVersionUploadClick = (file: FileRecord) => {
    if (!uploadedById) return
    setVersionUploadError(null)
    setVersionTarget(file)
    versionInputRef.current?.click()
  }

  const handleVersionInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    e.target.value = ''
    if (!selectedFile || !versionTarget || !uploadedById) return

    if (!ALL_ALLOWED_MIME_TYPES.includes(selectedFile.type)) {
      setVersionUploadError(`"${selectedFile.type || 'unknown'}" is not an allowed file type`)
      return
    }
    if (selectedFile.size > MAX_FILE_SIZE) {
      setVersionUploadError(`File exceeds ${formatFileSize(MAX_FILE_SIZE)} limit`)
      return
    }

    setVersionUploadingId(versionTarget.id)
    setVersionUploadError(null)
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('uploadedById', uploadedById)
      formData.append('bucket', versionTarget.bucket)
      formData.append('replaceFileId', versionTarget.id)

      const res = await fetch('/api/files/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok || !data.success) {
        setVersionUploadError(data.error || 'Upload failed')
        return
      }
      onVersionUploaded?.(data.data, versionTarget.id)
    } catch (err) {
      console.error('Version upload failed:', err)
      setVersionUploadError('Version upload failed')
    } finally {
      setVersionUploadingId(null)
      setVersionTarget(null)
    }
  }

  if (files.length === 0) {
    return <p className="text-sm text-muted-foreground py-4 text-center">{emptyMessage}</p>
  }

  return (
    <>
      <input
        ref={versionInputRef}
        type="file"
        className="hidden"
        data-testid="file-version-input"
        accept={ALL_ALLOWED_MIME_TYPES.join(',')}
        onChange={handleVersionInputChange}
      />

      {versionUploadError && (
        <p className="text-xs text-red-500 text-center">{versionUploadError}</p>
      )}

      <div className="space-y-2">
        {files.map((file) => {
          const Icon = getFileIcon(file.mimeType)
          const iconColor = getIconColor(file.mimeType)
          const previewable = isPreviewableMimeType(file.mimeType)

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
                    {typeof file.version === 'number' && (
                      <>
                        {' · '}v{file.version}
                        {file.isLatest === false ? ' (archived)' : ''}
                      </>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {canPreview && previewable && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handlePreview(file)}
                    disabled={previewLoading && previewFile?.id === file.id}
                    aria-label={`Preview ${file.name}`}
                  >
                    {previewLoading && previewFile?.id === file.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleDownload(file.id, file.name)}
                  disabled={downloading === file.id}
                  aria-label={`Download ${file.name}`}
                >
                  {downloading === file.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                </Button>
                {enableVersioning && file.versionGroupId && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => openVersions(file)}
                    aria-label={`View versions for ${file.name}`}
                  >
                    <History className="w-4 h-4" />
                  </Button>
                )}
                {enableVersioning && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleVersionUploadClick(file)}
                    disabled={!uploadedById || versionUploadingId === file.id}
                    aria-label={`Upload new version for ${file.name}`}
                  >
                    {versionUploadingId === file.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <UploadCloud className="w-4 h-4" />
                    )}
                  </Button>
                )}
                {canDelete && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                    onClick={() => handleDelete(file.id)}
                    disabled={deleting === file.id}
                    aria-label={`Delete ${file.name}`}
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

      <Dialog open={Boolean(previewFile)} onOpenChange={(open) => !open && closePreview()}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{previewFile?.name}</DialogTitle>
          </DialogHeader>
          {previewLoading && (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          )}
          {!previewLoading && previewError && (
            <p className="text-sm text-red-500 text-center py-6">{previewError}</p>
          )}
          {!previewLoading && !previewError && previewUrl && previewFile && (
            <div className="rounded-lg border bg-muted/30 p-4">
              {previewFile.mimeType.startsWith('image/') ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt={previewFile.name}
                  className="max-h-[70vh] w-full object-contain rounded-md"
                />
              ) : previewFile.mimeType === 'application/pdf' ? (
                <iframe
                  src={previewUrl}
                  title={previewFile.name}
                  className="w-full h-[70vh] rounded-md"
                />
              ) : (
                <p className="text-sm text-muted-foreground text-center py-6">
                  Preview not available for this file type.
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={versionsOpen} onOpenChange={(open) => !open && closeVersions()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Versions for {activeVersionFile?.name}</DialogTitle>
          </DialogHeader>
          {versionsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-2">
              {versions.map((version) => (
                <div
                  key={version.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{version.name}</p>
                    <p className="text-xs text-muted-foreground">
                      v{version.version ?? 1}
                      {version.isLatest === false ? ' (archived)' : ' (latest)'}
                      {' · '}
                      {formatFileSize(version.size)}
                      {' · '}
                      {new Date(version.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {canPreview && isPreviewableMimeType(version.mimeType) && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handlePreview(version)}
                        aria-label={`Preview ${version.name}`}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDownload(version.id, version.name)}
                      aria-label={`Download ${version.name}`}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {versions.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No versions found.
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
