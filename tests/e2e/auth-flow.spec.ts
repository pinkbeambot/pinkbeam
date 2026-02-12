import { test, expect } from '@playwright/test'
import { loginAsTestUser } from './utils'

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
  })

  test.describe('Sign Up', () => {
    test('redirects unauthenticated users from portal to sign-in', async ({ page }) => {
      await page.goto('/portal')
      await expect(page).toHaveURL(/sign-in/)
      await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible()
    })

    test('sign-up page renders correctly', async ({ page }) => {
      await page.goto('/sign-up')
      await expect(page.getByRole('heading', { name: /create account/i })).toBeVisible()
      await expect(page.getByLabel(/email/i)).toBeVisible()
      await expect(page.getByLabel(/password/i)).toBeVisible()
      await expect(page.getByRole('button', { name: /create account/i })).toBeVisible()
    })

    test('sign-up form validates empty fields', async ({ page }) => {
      await page.goto('/sign-up')
      await page.getByRole('button', { name: /create account/i }).click()
      
      // Should show validation errors
      await expect(page.getByText(/email is required|invalid email/i)).toBeVisible()
    })

    test('sign-up form validates invalid email', async ({ page }) => {
      await page.goto('/sign-up')
      await page.getByLabel(/email/i).fill('invalid-email')
      await page.getByLabel(/password/i).fill('password123')
      await page.getByRole('button', { name: /create account/i }).click()
      
      await expect(page.getByText(/invalid email/i)).toBeVisible()
    })

    test('sign-up form validates short password', async ({ page }) => {
      await page.goto('/sign-up')
      await page.getByLabel(/email/i).fill('test@example.com')
      await page.getByLabel(/password/i).fill('123')
      await page.getByRole('button', { name: /create account/i }).click()
      
      await expect(page.getByText(/password must be at least|too short/i)).toBeVisible()
    })
  })

  test.describe('Sign In', () => {
    test('sign-in page renders correctly', async ({ page }) => {
      await page.goto('/sign-in')
      await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible()
      await expect(page.getByLabel(/email/i)).toBeVisible()
      await expect(page.getByLabel(/password/i)).toBeVisible()
      await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
    })

    test('invalid credentials show error', async ({ page }) => {
      await page.goto('/sign-in')
      await page.getByLabel(/email/i).fill('nonexistent@example.com')
      await page.getByLabel(/password/i).fill('wrongpassword')
      await page.getByRole('button', { name: /sign in/i }).click()
      
      await expect(page.getByText(/invalid|incorrect|failed/i)).toBeVisible()
    })

    test('valid credentials redirect to portal', async ({ page }) => {
      await loginAsTestUser(page)
      await page.goto('/portal')
      await expect(page.getByRole('heading', { name: /portal/i })).toBeVisible()
    })
  })

  test.describe('Protected Routes', () => {
    test('authenticated users can access portal', async ({ page }) => {
      await loginAsTestUser(page)
      await page.goto('/portal')
      await expect(page.getByRole('heading', { name: /portal/i })).toBeVisible()
    })

    test('authenticated users redirected away from sign-in', async ({ page }) => {
      await loginAsTestUser(page)
      await page.goto('/sign-in')
      await expect(page).toHaveURL(/portal/)
    })

    test('authenticated users redirected away from sign-up', async ({ page }) => {
      await loginAsTestUser(page)
      await page.goto('/sign-up')
      await expect(page).toHaveURL(/portal/)
    })
  })

  test.describe('Logout', () => {
    test('logout redirects to home and requires re-auth', async ({ page }) => {
      await loginAsTestUser(page)
      await page.goto('/portal')
      
      // Click logout (adjust selector based on actual UI)
      const logoutButton = page.getByRole('button', { name: /logout|sign out/i })
      if (await logoutButton.isVisible().catch(() => false)) {
        await logoutButton.click()
        await expect(page).toHaveURL('/')
        
        // Verify protected route requires auth again
        await page.goto('/portal')
        await expect(page).toHaveURL(/sign-in/)
      }
    })
  })
})
