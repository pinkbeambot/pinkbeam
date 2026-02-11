import { test, expect } from '@playwright/test'
import { loginAsTestUser } from './utils'

test('redirects unauthenticated users to sign-in', async ({ page }) => {
  await page.goto('/agents/dashboard')
  await expect(page).toHaveURL(/sign-in/)
  await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible()
})

test('allows authenticated users to access dashboard', async ({ page }) => {
  await loginAsTestUser(page)
  await page.goto('/agents/dashboard')
  await expect(page.getByRole('heading', { name: /ai employees/i })).toBeVisible()
})
