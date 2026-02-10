// --- Supabase Storage base URL ---

export function getStorageBaseUrl(): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl) throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set')
  return `${supabaseUrl}/storage/v1`
}

// --- Image transform types ---

export interface ImageTransformOptions {
  width?: number
  height?: number
  quality?: number
  format?: 'origin' | 'avif' | 'webp'
  resize?: 'cover' | 'contain' | 'fill'
}

// --- Responsive image size presets ---

export const IMAGE_PRESETS = {
  thumbnail: { width: 96, height: 96, quality: 70, resize: 'cover' as const },
  avatar: { width: 128, height: 128, quality: 75, resize: 'cover' as const },
  card: { width: 400, height: 300, quality: 80, resize: 'cover' as const },
  hero: { width: 1200, height: 630, quality: 85, resize: 'cover' as const },
  full: { width: 1920, quality: 85, resize: 'contain' as const },
} as const satisfies Record<string, ImageTransformOptions>

export type ImagePresetName = keyof typeof IMAGE_PRESETS

// --- Responsive sizes strings for <Image> component ---

export const RESPONSIVE_SIZES = {
  card: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  content: '(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 50vw',
  hero: '100vw',
  thumbnail: '96px',
  avatar: '128px',
} as const

// --- URL builders ---

export function getPublicObjectUrl(storagePath: string, bucket = 'public-assets'): string {
  return `${getStorageBaseUrl()}/object/public/${bucket}/${storagePath}`
}

export function getTransformUrl(
  storagePath: string,
  options: ImageTransformOptions = {},
  bucket = 'public-assets'
): string {
  const base = `${getStorageBaseUrl()}/render/image/public/${bucket}/${storagePath}`
  const params = new URLSearchParams()

  if (options.width) params.set('width', String(options.width))
  if (options.height) params.set('height', String(options.height))
  if (options.quality) params.set('quality', String(options.quality))
  if (options.resize) params.set('resize', String(options.resize))
  if (options.format) params.set('format', String(options.format))

  const qs = params.toString()
  return qs ? `${base}?${qs}` : base
}

export function getPresetUrl(
  storagePath: string,
  preset: ImagePresetName,
  bucket = 'public-assets'
): string {
  return getTransformUrl(storagePath, IMAGE_PRESETS[preset], bucket)
}

// --- Blur placeholder ---

export function getBlurPlaceholder(color = 'hsl(330, 80%, 95%)'): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"><rect fill="${color}" width="1" height="1"/></svg>`
  const encoded = Buffer.from(svg).toString('base64')
  return `data:image/svg+xml;base64,${encoded}`
}

// --- Utilities ---

export function isTransformableImage(mimeType: string): boolean {
  return ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif'].includes(mimeType)
}
