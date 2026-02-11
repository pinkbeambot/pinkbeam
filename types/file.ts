export interface FileUploader {
  id: string
  name: string | null
  email: string
}

export interface FileRecord {
  id: string
  name: string
  storagePath?: string
  bucket: string
  mimeType: string
  size: number
  createdAt: string
  uploadedBy?: FileUploader
  uploadedById?: string
  projectId?: string | null
  ticketId?: string | null
  commentId?: string | null
  invoiceId?: string | null
  width?: number | null
  height?: number | null
  alt?: string | null
  versionGroupId?: string | null
  version?: number | null
  isLatest?: boolean | null
}
