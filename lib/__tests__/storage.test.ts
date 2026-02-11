import { describe, it, expect } from 'vitest'
import {
  validateFileType,
  validateFileSize,
  validateFile,
  generateStoragePath,
  formatFileSize,
  getFileCategory,
  getPreviewTransform,
  isPreviewableMimeType,
  IMAGE_PREVIEW_TRANSFORM,
  ALL_ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE,
  BUCKETS,
} from '../storage'

describe('BUCKETS', () => {
  it('defines three bucket names', () => {
    expect(BUCKETS).toEqual(['attachments', 'deliverables', 'public-assets'])
  })
})

describe('validateFileType', () => {
  it('accepts JPEG images', () => {
    expect(validateFileType('image/jpeg').valid).toBe(true)
  })

  it('accepts PNG images', () => {
    expect(validateFileType('image/png').valid).toBe(true)
  })

  it('accepts GIF images', () => {
    expect(validateFileType('image/gif').valid).toBe(true)
  })

  it('accepts WebP images', () => {
    expect(validateFileType('image/webp').valid).toBe(true)
  })

  it('accepts AVIF images', () => {
    expect(validateFileType('image/avif').valid).toBe(true)
  })

  it('accepts SVG images', () => {
    expect(validateFileType('image/svg+xml').valid).toBe(true)
  })

  it('accepts PDF documents', () => {
    expect(validateFileType('application/pdf').valid).toBe(true)
  })

  it('accepts Word documents', () => {
    expect(validateFileType('application/msword').valid).toBe(true)
    expect(
      validateFileType(
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ).valid
    ).toBe(true)
  })

  it('accepts Excel spreadsheets', () => {
    expect(validateFileType('application/vnd.ms-excel').valid).toBe(true)
    expect(
      validateFileType(
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ).valid
    ).toBe(true)
  })

  it('accepts ZIP archives', () => {
    expect(validateFileType('application/zip').valid).toBe(true)
    expect(validateFileType('application/x-zip-compressed').valid).toBe(true)
  })

  it('accepts text files', () => {
    expect(validateFileType('text/plain').valid).toBe(true)
    expect(validateFileType('text/csv').valid).toBe(true)
    expect(validateFileType('text/markdown').valid).toBe(true)
  })

  it('rejects executable files', () => {
    const result = validateFileType('application/x-executable')
    expect(result.valid).toBe(false)
    expect(result.error).toContain('not allowed')
  })

  it('rejects JavaScript files', () => {
    expect(validateFileType('application/javascript').valid).toBe(false)
  })

  it('rejects empty string', () => {
    expect(validateFileType('').valid).toBe(false)
  })

  it('rejects video files', () => {
    expect(validateFileType('video/mp4').valid).toBe(false)
  })
})

describe('validateFileSize', () => {
  it('accepts 1 byte file', () => {
    expect(validateFileSize(1).valid).toBe(true)
  })

  it('accepts files at exactly the limit', () => {
    expect(validateFileSize(MAX_FILE_SIZE).valid).toBe(true)
  })

  it('accepts typical file sizes', () => {
    expect(validateFileSize(1024).valid).toBe(true) // 1 KB
    expect(validateFileSize(5 * 1024 * 1024).valid).toBe(true) // 5 MB
  })

  it('rejects files exceeding the limit', () => {
    const result = validateFileSize(MAX_FILE_SIZE + 1)
    expect(result.valid).toBe(false)
    expect(result.error).toContain('exceeds')
  })

  it('rejects empty files', () => {
    const result = validateFileSize(0)
    expect(result.valid).toBe(false)
    expect(result.error).toContain('empty')
  })
})

describe('validateFile', () => {
  it('returns valid for acceptable file', () => {
    const result = validateFile({ size: 1024, type: 'image/png' })
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('returns error for bad type only', () => {
    const result = validateFile({ size: 1024, type: 'application/x-executable' })
    expect(result.valid).toBe(false)
    expect(result.errors).toHaveLength(1)
  })

  it('returns error for bad size only', () => {
    const result = validateFile({ size: MAX_FILE_SIZE + 1, type: 'image/png' })
    expect(result.valid).toBe(false)
    expect(result.errors).toHaveLength(1)
  })

  it('returns multiple errors for both bad type and size', () => {
    const result = validateFile({ size: MAX_FILE_SIZE + 1, type: 'video/mp4' })
    expect(result.valid).toBe(false)
    expect(result.errors).toHaveLength(2)
  })
})

describe('generateStoragePath', () => {
  it('generates ticket-scoped path', () => {
    const path = generateStoragePath('attachments', 'screenshot.png', {
      ticketId: 'ticket-abc',
    })
    expect(path).toMatch(/^tickets\/ticket-abc\/\d+-screenshot\.png$/)
  })

  it('generates project-scoped path', () => {
    const path = generateStoragePath('deliverables', 'design.fig', {
      projectId: 'proj-123',
    })
    expect(path).toMatch(/^projects\/proj-123\/\d+-design\.fig$/)
  })

  it('generates comment-scoped path', () => {
    const path = generateStoragePath('attachments', 'log.txt', {
      commentId: 'comment-xyz',
    })
    expect(path).toMatch(/^comments\/comment-xyz\/\d+-log\.txt$/)
  })

  it('generates invoice-scoped path', () => {
    const path = generateStoragePath('deliverables', 'invoice.pdf', {
      invoiceId: 'inv-001',
    })
    expect(path).toMatch(/^invoices\/inv-001\/\d+-invoice\.pdf$/)
  })

  it('generates general path when no context given', () => {
    const path = generateStoragePath('attachments', 'file.txt')
    expect(path).toMatch(/^general\/\d+-file\.txt$/)
  })

  it('prioritizes ticket over project when both given', () => {
    const path = generateStoragePath('attachments', 'file.pdf', {
      ticketId: 'tick-1',
      projectId: 'proj-1',
    })
    expect(path).toContain('tickets/tick-1/')
  })

  it('sanitizes filenames with spaces and special chars', () => {
    const path = generateStoragePath('attachments', 'my file (v2) [final].pdf')
    expect(path).not.toContain(' ')
    expect(path).not.toContain('(')
    expect(path).not.toContain('[')
    expect(path).toMatch(/my_file__v2___final_\.pdf$/)
  })

  it('preserves dots, hyphens, and underscores', () => {
    const path = generateStoragePath('attachments', 'my-file_v2.0.pdf')
    expect(path).toMatch(/my-file_v2\.0\.pdf$/)
  })
})

describe('formatFileSize', () => {
  it('formats 0 bytes', () => {
    expect(formatFileSize(0)).toBe('0 B')
  })

  it('formats bytes', () => {
    expect(formatFileSize(500)).toBe('500 B')
  })

  it('formats kilobytes', () => {
    expect(formatFileSize(1024)).toBe('1.0 KB')
    expect(formatFileSize(1536)).toBe('1.5 KB')
  })

  it('formats megabytes', () => {
    expect(formatFileSize(1048576)).toBe('1.0 MB')
    expect(formatFileSize(5 * 1024 * 1024)).toBe('5.0 MB')
  })

  it('formats gigabytes', () => {
    expect(formatFileSize(1073741824)).toBe('1.0 GB')
  })
})

describe('getFileCategory', () => {
  it('categorizes images', () => {
    expect(getFileCategory('image/png')).toBe('image')
    expect(getFileCategory('image/jpeg')).toBe('image')
  })

  it('categorizes documents', () => {
    expect(getFileCategory('application/pdf')).toBe('document')
    expect(getFileCategory('application/msword')).toBe('document')
  })

  it('categorizes archives', () => {
    expect(getFileCategory('application/zip')).toBe('archive')
  })

  it('categorizes text', () => {
    expect(getFileCategory('text/plain')).toBe('text')
    expect(getFileCategory('text/csv')).toBe('text')
  })

  it('returns other for unknown types', () => {
    expect(getFileCategory('application/octet-stream')).toBe('other')
  })
})

describe('isPreviewableMimeType', () => {
  it('returns true for images', () => {
    expect(isPreviewableMimeType('image/png')).toBe(true)
  })

  it('returns true for PDFs', () => {
    expect(isPreviewableMimeType('application/pdf')).toBe(true)
  })

  it('returns false for archives', () => {
    expect(isPreviewableMimeType('application/zip')).toBe(false)
  })
})

describe('getPreviewTransform', () => {
  it('returns the preview transform for images', () => {
    expect(getPreviewTransform('image/jpeg')).toEqual(IMAGE_PREVIEW_TRANSFORM)
  })

  it('returns null for non-transformable types', () => {
    expect(getPreviewTransform('application/pdf')).toBeNull()
    expect(getPreviewTransform('text/plain')).toBeNull()
  })
})

describe('ALL_ALLOWED_MIME_TYPES', () => {
  it('contains all expected types', () => {
    expect(ALL_ALLOWED_MIME_TYPES).toContain('image/jpeg')
    expect(ALL_ALLOWED_MIME_TYPES).toContain('application/pdf')
    expect(ALL_ALLOWED_MIME_TYPES).toContain('application/zip')
    expect(ALL_ALLOWED_MIME_TYPES).toContain('text/plain')
  })

  it('has at least 14 types', () => {
    expect(ALL_ALLOWED_MIME_TYPES.length).toBeGreaterThanOrEqual(14)
  })
})
