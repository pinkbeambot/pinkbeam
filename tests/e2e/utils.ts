import { expect, type Page } from '@playwright/test'

export async function loginAsTestUser(page: Page) {
  const response = await page.request.post('/api/test/login')
  expect(response.ok()).toBeTruthy()
}
