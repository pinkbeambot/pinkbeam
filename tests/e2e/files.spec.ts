import { test, expect } from '@playwright/test'

type FileRecord = {
  id: string
  name: string
  mimeType: string
  size: number
  bucket: string
  createdAt: string
  uploadedBy?: { id: string; name: string | null; email: string }
  versionGroupId?: string | null
  version?: number | null
  isLatest?: boolean | null
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`
}

function toDataUrl(): string {
  const pngHeader = Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
  ])
  const ihdr = Buffer.from([
    0x00, 0x00, 0x00, 0x0d,
    0x49, 0x48, 0x44, 0x52,
    0x00, 0x00, 0x00, 0x01,
    0x00, 0x00, 0x00, 0x01,
    0x08,
    0x06,
    0x00,
    0x00,
    0x00,
    0x1f, 0x15, 0xc4, 0x89,
  ])
  const idat = Buffer.from([
    0x00, 0x00, 0x00, 0x0a,
    0x49, 0x44, 0x41, 0x54,
    0x78, 0x9c, 0x63, 0x60, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01,
    0x0d, 0x0a, 0x2d, 0xb4,
  ])
  const iend = Buffer.from([
    0x00, 0x00, 0x00, 0x00,
    0x49, 0x45, 0x4e, 0x44,
    0xae, 0x42, 0x60, 0x82,
  ])
  const png = Buffer.concat([pngHeader, ihdr, idat, iend])
  return `data:image/png;base64,${png.toString('base64')}`
}

test('files page upload, versioning, preview, and usage', async ({ page }) => {
  const now = new Date().toISOString()
  let files: FileRecord[] = [
    {
      id: 'file-brief',
      name: 'brief.pdf',
      mimeType: 'application/pdf',
      size: 2048,
      bucket: 'deliverables',
      createdAt: now,
      uploadedBy: { id: 'user-1', name: 'Test User', email: 'test@example.com' },
      versionGroupId: 'vg-brief',
      version: 1,
      isLatest: true,
    },
  ]
  let uploadCount = 0

  const computeUsage = (subset: FileRecord[]) => {
    const latestFiles = subset.filter((file) => file.isLatest !== false)
    const totalBytes = latestFiles.reduce((sum, file) => sum + file.size, 0)
    const buckets = new Map<string, { totalBytes: number; totalFiles: number }>()
    for (const file of latestFiles) {
      const current = buckets.get(file.bucket) ?? { totalBytes: 0, totalFiles: 0 }
      current.totalBytes += file.size
      current.totalFiles += 1
      buckets.set(file.bucket, current)
    }
    return {
      totalBytes,
      totalFiles: latestFiles.length,
      byBucket: Array.from(buckets.entries()).map(([bucket, stats]) => ({
        bucket,
        totalBytes: stats.totalBytes,
        totalFiles: stats.totalFiles,
      })),
    }
  }

  await page.route(/\/api\/files(?:\/.*)?/, async (route) => {
    const request = route.request()
    const url = new URL(request.url())
    const path = url.pathname

    if (path.endsWith('/api/files/usage')) {
      const bucketFilter = url.searchParams.get('bucket')
      const versionGroupId = url.searchParams.get('versionGroupId')
      const latestParam = url.searchParams.get('latest')

      let filtered = [...files]
      if (bucketFilter) filtered = filtered.filter((file) => file.bucket === bucketFilter)
      if (versionGroupId) filtered = filtered.filter((file) => file.versionGroupId === versionGroupId)
      if (!versionGroupId && latestParam !== 'false') {
        filtered = filtered.filter((file) => file.isLatest !== false)
      }

      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: computeUsage(filtered) }),
      })
    }

    if (path.endsWith('/api/files/upload') && request.method() === 'POST') {
      uploadCount += 1

      if (uploadCount === 1) {
        const newFile: FileRecord = {
          id: 'file-concept-v1',
          name: 'concept.png',
          mimeType: 'image/png',
          size: 1024,
          bucket: 'deliverables',
          createdAt: new Date(Date.now() + 1000).toISOString(),
          uploadedBy: { id: 'user-1', name: 'Test User', email: 'test@example.com' },
          versionGroupId: 'vg-concept',
          version: 1,
          isLatest: true,
        }
        files = [newFile, ...files]
        return route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, data: newFile }),
        })
      }

      const currentLatest = files.find(
        (file) => file.versionGroupId === 'vg-concept' && file.isLatest !== false
      )
      if (currentLatest) currentLatest.isLatest = false
      const newVersion: FileRecord = {
        id: 'file-concept-v2',
        name: 'concept-v2.png',
        mimeType: 'image/png',
        size: 3072,
        bucket: 'deliverables',
        createdAt: new Date(Date.now() + 2000).toISOString(),
        uploadedBy: { id: 'user-1', name: 'Test User', email: 'test@example.com' },
        versionGroupId: 'vg-concept',
        version: (currentLatest?.version ?? 1) + 1,
        isLatest: true,
      }
      files = [newVersion, ...files]

      return route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: newVersion }),
      })
    }

    const fileIdMatch = path.match(/\/api\/files\/([^/]+)$/)
    if (fileIdMatch && request.method() === 'GET') {
      const fileId = fileIdMatch[1]
      const file = files.find((entry) => entry.id === fileId)
      if (!file) {
        return route.fulfill({
          status: 404,
          contentType: 'application/json',
          body: JSON.stringify({ success: false, error: 'File not found' }),
        })
      }
      const previewUrl = file.mimeType.startsWith('image/') ? toDataUrl() : null
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            ...file,
            downloadUrl: 'https://example.com/download',
            previewUrl,
          },
        }),
      })
    }

    if (path.endsWith('/api/files') && request.method() === 'GET') {
      const bucketFilter = url.searchParams.get('bucket')
      const versionGroupId = url.searchParams.get('versionGroupId')
      const latestParam = url.searchParams.get('latest')

      let filtered = [...files]
      if (bucketFilter) filtered = filtered.filter((file) => file.bucket === bucketFilter)
      if (versionGroupId) {
        filtered = filtered
          .filter((file) => file.versionGroupId === versionGroupId)
          .sort((a, b) => (b.version ?? 0) - (a.version ?? 0))
      } else if (latestParam !== 'false') {
        filtered = filtered.filter((file) => file.isLatest !== false)
      }

      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: filtered }),
      })
    }

    return route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ success: false, error: 'Unhandled request' }),
    })
  })

  await page.goto('/web/portal/files')
  await expect(page.getByRole('heading', { name: 'Files' })).toBeVisible()
  await expect(
    page.getByText(`Storage used: ${formatFileSize(2048)} across 1 files`)
  ).toBeVisible()
  await expect(page.getByText('brief.pdf')).toBeVisible()

  await page.getByRole('button', { name: 'Upload File' }).click()
  await page.getByTestId('file-upload-input').setInputFiles({
    name: 'concept.png',
    mimeType: 'image/png',
    buffer: Buffer.from('mock-image'),
  })

  const uploadDialog = page.getByRole('dialog', { name: /upload files/i })
  await expect(uploadDialog.getByText('concept.png')).toBeVisible()
  await page.keyboard.press('Escape')

  await expect(page.locator('main').getByText('concept.png')).toBeVisible()
  await expect(
    page.getByText(`Storage used: ${formatFileSize(3072)} across 2 files`)
  ).toBeVisible()

  await page.locator('main').getByRole('button', { name: /Preview concept\.png/i }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page.locator('img[alt="concept.png"]')).toBeVisible()
  await page.keyboard.press('Escape')

  await page
    .locator('main')
    .getByRole('button', { name: /Upload new version for concept\.png/i })
    .click()
  await page.getByTestId('file-version-input').setInputFiles({
    name: 'concept-v2.png',
    mimeType: 'image/png',
    buffer: Buffer.from('mock-image-v2'),
  })

  const versionRow = page.locator('main').getByText('concept-v2.png').locator('..')
  await expect(versionRow).toBeVisible()
  await expect(versionRow).toContainText('v2')
  await expect(
    page.getByText(`Storage used: ${formatFileSize(5120)} across 2 files`)
  ).toBeVisible()

  await page
    .locator('main')
    .getByRole('button', { name: /View versions for concept-v2\.png/i })
    .click()
  const versionsDialog = page.getByRole('dialog', { name: /Versions for concept-v2\.png/i })
  await expect(versionsDialog).toBeVisible()
  await expect(versionsDialog.getByText('v2 (latest)')).toBeVisible()
  await expect(versionsDialog.getByText('v1 (archived)')).toBeVisible()
})
