import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  getStorageBaseUrl,
  getPublicObjectUrl,
  getTransformUrl,
  getPresetUrl,
  getBlurPlaceholder,
  isTransformableImage,
  IMAGE_PRESETS,
  RESPONSIVE_SIZES,
} from '../images'

const MOCK_SUPABASE_URL = 'https://test-project.supabase.co'

beforeEach(() => {
  vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', MOCK_SUPABASE_URL)
})

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('getStorageBaseUrl', () => {
  it('returns storage v1 URL from env', () => {
    expect(getStorageBaseUrl()).toBe(`${MOCK_SUPABASE_URL}/storage/v1`)
  })

  it('throws when env var is missing', () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', '')
    expect(() => getStorageBaseUrl()).toThrow('NEXT_PUBLIC_SUPABASE_URL is not set')
  })
})

describe('getPublicObjectUrl', () => {
  it('constructs public object URL with default bucket', () => {
    const url = getPublicObjectUrl('branding/logo.png')
    expect(url).toBe(
      `${MOCK_SUPABASE_URL}/storage/v1/object/public/public-assets/branding/logo.png`
    )
  })

  it('constructs URL with custom bucket', () => {
    const url = getPublicObjectUrl('file.pdf', 'attachments')
    expect(url).toContain('/object/public/attachments/file.pdf')
  })
})

describe('getTransformUrl', () => {
  it('constructs render URL with no options', () => {
    const url = getTransformUrl('img.jpg')
    expect(url).toBe(
      `${MOCK_SUPABASE_URL}/storage/v1/render/image/public/public-assets/img.jpg`
    )
  })

  it('adds width and height params', () => {
    const url = getTransformUrl('img.jpg', { width: 400, height: 300 })
    expect(url).toContain('width=400')
    expect(url).toContain('height=300')
  })

  it('adds quality param', () => {
    const url = getTransformUrl('img.jpg', { quality: 75 })
    expect(url).toContain('quality=75')
  })

  it('adds resize param', () => {
    const url = getTransformUrl('img.jpg', { resize: 'cover' })
    expect(url).toContain('resize=cover')
  })

  it('adds format param', () => {
    const url = getTransformUrl('img.jpg', { format: 'webp' })
    expect(url).toContain('format=webp')
  })

  it('combines multiple options', () => {
    const url = getTransformUrl('img.jpg', { width: 200, quality: 80, resize: 'contain' })
    expect(url).toContain('width=200')
    expect(url).toContain('quality=80')
    expect(url).toContain('resize=contain')
  })

  it('uses custom bucket', () => {
    const url = getTransformUrl('img.jpg', { width: 100 }, 'deliverables')
    expect(url).toContain('/render/image/public/deliverables/')
  })
})

describe('getPresetUrl', () => {
  it('uses thumbnail preset dimensions', () => {
    const url = getPresetUrl('img.jpg', 'thumbnail')
    expect(url).toContain('width=96')
    expect(url).toContain('height=96')
  })

  it('uses hero preset dimensions', () => {
    const url = getPresetUrl('img.jpg', 'hero')
    expect(url).toContain('width=1200')
    expect(url).toContain('height=630')
  })

  it('uses card preset dimensions', () => {
    const url = getPresetUrl('img.jpg', 'card')
    expect(url).toContain('width=400')
    expect(url).toContain('height=300')
  })

  it('uses avatar preset dimensions', () => {
    const url = getPresetUrl('img.jpg', 'avatar')
    expect(url).toContain('width=128')
    expect(url).toContain('height=128')
  })

  it('uses full preset width', () => {
    const url = getPresetUrl('img.jpg', 'full')
    expect(url).toContain('width=1920')
    expect(url).not.toContain('height=')
  })
})

describe('getBlurPlaceholder', () => {
  it('returns a data URI', () => {
    const placeholder = getBlurPlaceholder()
    expect(placeholder).toMatch(/^data:image\/svg\+xml;base64,/)
  })

  it('accepts custom color', () => {
    const placeholder = getBlurPlaceholder('#ff0000')
    const base64 = placeholder.replace('data:image/svg+xml;base64,', '')
    const svg = Buffer.from(base64, 'base64').toString()
    expect(svg).toContain('#ff0000')
  })

  it('contains SVG with rect element', () => {
    const placeholder = getBlurPlaceholder()
    const base64 = placeholder.replace('data:image/svg+xml;base64,', '')
    const svg = Buffer.from(base64, 'base64').toString()
    expect(svg).toContain('<rect')
    expect(svg).toContain('viewBox="0 0 1 1"')
  })
})

describe('isTransformableImage', () => {
  it('returns true for JPEG', () => {
    expect(isTransformableImage('image/jpeg')).toBe(true)
  })

  it('returns true for PNG', () => {
    expect(isTransformableImage('image/png')).toBe(true)
  })

  it('returns true for WebP', () => {
    expect(isTransformableImage('image/webp')).toBe(true)
  })

  it('returns true for GIF', () => {
    expect(isTransformableImage('image/gif')).toBe(true)
  })

  it('returns true for AVIF', () => {
    expect(isTransformableImage('image/avif')).toBe(true)
  })

  it('returns false for SVG', () => {
    expect(isTransformableImage('image/svg+xml')).toBe(false)
  })

  it('returns false for PDF', () => {
    expect(isTransformableImage('application/pdf')).toBe(false)
  })

  it('returns false for non-image types', () => {
    expect(isTransformableImage('text/plain')).toBe(false)
  })
})

describe('IMAGE_PRESETS', () => {
  it('defines all expected presets', () => {
    expect(IMAGE_PRESETS).toHaveProperty('thumbnail')
    expect(IMAGE_PRESETS).toHaveProperty('avatar')
    expect(IMAGE_PRESETS).toHaveProperty('card')
    expect(IMAGE_PRESETS).toHaveProperty('hero')
    expect(IMAGE_PRESETS).toHaveProperty('full')
  })

  it('thumbnail has expected values', () => {
    expect(IMAGE_PRESETS.thumbnail.width).toBe(96)
    expect(IMAGE_PRESETS.thumbnail.height).toBe(96)
    expect(IMAGE_PRESETS.thumbnail.quality).toBe(70)
  })

  it('hero has expected values', () => {
    expect(IMAGE_PRESETS.hero.width).toBe(1200)
    expect(IMAGE_PRESETS.hero.height).toBe(630)
  })
})

describe('RESPONSIVE_SIZES', () => {
  it('defines all expected size strings', () => {
    expect(RESPONSIVE_SIZES).toHaveProperty('card')
    expect(RESPONSIVE_SIZES).toHaveProperty('content')
    expect(RESPONSIVE_SIZES).toHaveProperty('hero')
    expect(RESPONSIVE_SIZES).toHaveProperty('thumbnail')
    expect(RESPONSIVE_SIZES).toHaveProperty('avatar')
  })

  it('hero is 100vw', () => {
    expect(RESPONSIVE_SIZES.hero).toBe('100vw')
  })

  it('thumbnail is 96px', () => {
    expect(RESPONSIVE_SIZES.thumbnail).toBe('96px')
  })
})
