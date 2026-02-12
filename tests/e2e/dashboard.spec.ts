import { test, expect } from '@playwright/test'
import { loginAsTestUser } from './utils'

test('portal platform navigation works', async ({ page }) => {
  await loginAsTestUser(page)
  await page.goto('/portal/platform')

  await expect(page.getByRole('heading', { name: 'Portal' })).toBeVisible()
  await expect(page.getByText('Manage all your Pink Beam services in one place')).toBeVisible()

  await page.getByRole('link', { name: /open dashboard/i }).first().click()
  await expect(page).toHaveURL(/portal\/agents/)
  await expect(page.getByRole('heading', { name: /ai employees/i })).toBeVisible()
})
