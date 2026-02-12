import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { loginAsTestUser } from './utils'

test('basic accessibility checks', async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('theme', 'dark')
  })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const waitForDarkTheme = async () => {
    await page.waitForFunction(() => document.documentElement.classList.contains('dark'))
    await page.waitForFunction(() => getComputedStyle(document.body).color === 'rgb(255, 255, 255)')
  }

  await page.goto('/sign-in')
  await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible()
  await waitForDarkTheme()

  const signInResults = await new AxeBuilder({ page }).analyze()
  expect(signInResults.violations).toEqual([])

  await page.goto('/web/quote')
  await expect(page.getByRole('heading', { name: /request a quote/i })).toBeVisible()
  await waitForDarkTheme()

  const quoteResults = await new AxeBuilder({ page }).analyze()
  expect(quoteResults.violations).toEqual([])

  await loginAsTestUser(page)
  await page.goto('/portal/platform')
  await expect(page.getByRole('heading', { name: 'Portal' })).toBeVisible()
  await waitForDarkTheme()

  const dashboardResults = await new AxeBuilder({ page }).analyze()
  expect(dashboardResults.violations).toEqual([])
})
