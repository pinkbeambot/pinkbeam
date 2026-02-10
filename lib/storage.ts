import { createAdminClient } from '@/lib/supabase/admin'

// --- Buckets ---
export const BUCKETS = ['attachments', 'deliverables', 'public-assets'] as const
export type BucketName = (typeof BUCKETS)[number]

// --- File size limit ---
export const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50 MB

// --- Allowed MIME types ---
export const ALLOWED_MIME_TYPES: Record<string, string[]> = {
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif', 'image/svg+xml'],
  document: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
  archive: ['application/zip', 'application/x-zip-compressed'],
  text: ['text/plain', 'text/csv', 'text/markdown'],
}

export const ALL_ALLOWED_MIME_TYPES = Object.values(ALLOWED_MIME_TYPES).flat()

// --- Validation ---

export function validateFileType(mimeType: string): { valid: boolean; error?: string } {
  if (!ALL_ALLOWED_MIME_TYPES.includes(mimeType)) {
    return { valid: false, error: `File type "${mimeType}" is not allowed` }
  }
  return { valid: true }
}

export function validateFileSize(size: number): { valid: boolean; error?: string } {
  if (size === 0) {
    return { valid: false, error: 'File is empty' }
  }
  if (size > MAX_FILE_SIZE) {
    return { valid: false, error: `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit` }
  }
  return { valid: true }
}

export function validateFile(file: {
  size: number
  type: string
}): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  const typeResult = validateFileType(file.type)
  if (!typeResult.valid) errors.push(typeResult.error!)
  const sizeResult = validateFileSize(file.size)
  if (!sizeResult.valid) errors.push(sizeResult.error!)
  return { valid: errors.length === 0, errors }
}

// --- Storage path generation ---

export function generateStoragePath(
  bucket: BucketName,
  fileName: string,
  context?: {
    ticketId?: string
    projectId?: string
    commentId?: string
    invoiceId?: string
  }
): string {
  const timestamp = Date.now()
  const sanitized = fileName.replace(/[^a-zA-Z0-9._-]/g, '_')
  const uniqueName = `${timestamp}-${sanitized}`

  if (context?.ticketId) return `tickets/${context.ticketId}/${uniqueName}`
  if (context?.projectId) return `projects/${context.projectId}/${uniqueName}`
  if (context?.commentId) return `comments/${context.commentId}/${uniqueName}`
  if (context?.invoiceId) return `invoices/${context.invoiceId}/${uniqueName}`
  return `general/${uniqueName}`
}

// --- Upload ---

export async function uploadFile(
  bucket: BucketName,
  storagePath: string,
  fileBuffer: Buffer,
  mimeType: string
): Promise<{ data: { path: string } | null; error: string | null }> {
  const supabase = createAdminClient()
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(storagePath, fileBuffer, { contentType: mimeType, upsert: false })
  if (error) return { data: null, error: error.message }
  return { data: { path: data.path }, error: null }
}

// --- Signed URL (for private buckets) ---

export async function getSignedUrl(
  bucket: BucketName,
  storagePath: string,
  expiresIn: number = 3600
): Promise<{ url: string | null; error: string | null }> {
  const supabase = createAdminClient()
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(storagePath, expiresIn)
  if (error) return { url: null, error: error.message }
  return { url: data.signedUrl, error: null }
}

// --- Public URL (for public-assets bucket) ---

export function getPublicUrl(storagePath: string): string {
  const supabase = createAdminClient()
  const { data } = supabase.storage.from('public-assets').getPublicUrl(storagePath)
  return data.publicUrl
}

// --- Delete ---

export async function deleteFile(
  bucket: BucketName,
  storagePath: string
): Promise<{ error: string | null }> {
  const supabase = createAdminClient()
  const { error } = await supabase.storage.from(bucket).remove([storagePath])
  if (error) return { error: error.message }
  return { error: null }
}

// --- Human-readable file size ---

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`
}

// --- File type category ---

export function getFileCategory(mimeType: string): string {
  if (mimeType.startsWith('image/')) return 'image'
  if (ALLOWED_MIME_TYPES.document.includes(mimeType)) return 'document'
  if (ALLOWED_MIME_TYPES.archive.includes(mimeType)) return 'archive'
  if (ALLOWED_MIME_TYPES.text.includes(mimeType)) return 'text'
  return 'other'
}
