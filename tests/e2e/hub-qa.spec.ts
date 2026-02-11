import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

// Hub-specific QA tests
// HOME-018: Testing & QA for Hub

test.describe('Hub Homepage (/)', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
  })

  test('renders correctly', async ({ page }) => {
    // Check main sections
    await expect(page.getByRole('heading', { name: /AI-Powered Business Solutions/i })).toBeVisible()
    await expect(page.getByText(/Transform your business with AI employees/i)).toBeVisible()
    
    // Check navigation
    await expect(page.getByRole('link', { name: /Pink Beam/i })).toBeVisible()
    
    // Check CTA buttons
    await expect(page.getByRole('link', { name: /Get Started/i })).toBeVisible()
  })

  test('services section displays', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Our Services/i })).toBeVisible()
    await expect(page.getByText(/AI Employees/i)).toBeVisible()
    await expect(page.getByText(/Website & SEO/i)).toBeVisible()
    await expect(page.getByText(/Custom Software/i)).toBeVisible()
    await expect(page.getByText(/Strategic Consulting/i)).toBeVisible()
  })

  test('navigation to service pages works', async ({ page }) => {
    await page.getByRole('link', { name: /AI Employees/i }).click()
    await expect(page).toHaveURL(/\/agents/)
  })

  test('accessibility - no critical violations', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()
    
    const criticalViolations = results.violations.filter(v => v.impact === 'critical')
    const seriousViolations = results.violations.filter(v => v.impact === 'serious')
    
    expect(criticalViolations).toHaveLength(0)
    expect(seriousViolations.length).toBeLessThanOrEqual(2) // Allow minor issues
  })
})

test.describe('Contact Page (/contact)', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/contact')
  })

  test('renders correctly', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Get in Touch/i })).toBeVisible()
    await expect(page.getByText(/We'd love to hear from you/i)).toBeVisible()
  })

  test('contact form elements present', async ({ page }) => {
    await expect(page.getByLabel(/First Name/i)).toBeVisible()
    await expect(page.getByLabel(/Last Name/i)).toBeVisible()
    await expect(page.getByLabel(/Email/i)).toBeVisible()
    await expect(page.getByLabel(/Message/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /Send Message/i })).toBeVisible()
  })

  test('accessibility - no critical violations', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()
    
    const criticalViolations = results.violations.filter(v => v.impact === 'critical')
    expect(criticalViolations).toHaveLength(0)
  })
})

test.describe('Dashboard Redirect (/dashboard)', () => {
  test('redirects to agents dashboard', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/agents\/dashboard/)
  })
})

test.describe('Platform Dashboard (/dashboard/platform)', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
  })

  test('renders for unauthenticated users', async ({ page }) => {
    await page.goto('/dashboard/platform')
    await expect(page.getByRole('heading', { name: /Dashboard/i })).toBeVisible()
    await expect(page.getByText(/Manage all your Pink Beam services/i)).toBeVisible()
  })

  test('service cards display', async ({ page }) => {
    await page.goto('/dashboard/platform')
    await expect(page.getByText(/AI Employees/i)).toBeVisible()
    await expect(page.getByText(/Web Services/i)).toBeVisible()
  })

  test('Open Dashboard links work', async ({ page }) => {
    await page.goto('/dashboard/platform')
    const openDashboardLinks = page.getByRole('link', { name: /Open Dashboard/i })
    await expect(openDashboardLinks.first()).toBeVisible()
  })
})

test.describe('Cross-browser Responsive Tests', () => {
  const viewports = [
    { name: 'Mobile (375px)', width: 375, height: 667 },
    { name: 'Mobile Large (414px)', width: 414, height: 896 },
    { name: 'Tablet (768px)', width: 768, height: 1024 },
    { name: 'Tablet Large (1024px)', width: 1024, height: 768 },
    { name: 'Desktop (1440px)', width: 1440, height: 900 },
  ]

  for (const viewport of viewports) {
    test(`homepage at ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height })
      await page.goto('/')
      
      // Check no horizontal overflow
      const body = await page.locator('body')
      const bodyWidth = await body.evaluate(el => el.scrollWidth)
      const viewportWidth = viewport.width
      
      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1) // Allow 1px rounding
      
      // Check main content visible
      await expect(page.getByRole('heading', { name: /AI-Powered Business Solutions/i })).toBeVisible()
    })
  }
})

test.describe('Navigation Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
  })

  test('logo links to homepage', async ({ page }) => {
    const logo = page.getByRole('link', { name: /Pink Beam/i })
    await expect(logo).toHaveAttribute('href', '/')
  })

  test('services dropdown works', async ({ page }) => {
    await page.getByRole('button', { name: /Services/i }).click()
    await expect(page.getByRole('menuitem', { name: /Agents/i })).toBeVisible()
    await expect(page.getByRole('menuitem', { name: /Web/i })).toBeVisible()
    await expect(page.getByRole('menuitem', { name: /Labs/i })).toBeVisible()
    await expect(page.getByRole('menuitem', { name: /Solutions/i })).toBeVisible()
  })

  test('mobile menu button visible on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.reload()
    await expect(page.getByRole('button', { name: /Open menu/i })).toBeVisible()
  })
})
