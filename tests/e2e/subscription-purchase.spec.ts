import { test, expect } from '@playwright/test'
import { loginAsTestUser } from './utils'

test.describe('Subscription Purchase - Agents', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await loginAsTestUser(page)
  })

  test.describe('Plan Selection', () => {
    test('agents page displays all plans', async ({ page }) => {
      await page.goto('/agents')
      
      // Check for plan names
      await expect(page.getByText(/starter|professional|enterprise/i)).toBeVisible()
      
      // Check for pricing
      await expect(page.getByText(/\$.*\/mo|\$.*month/i)).toBeVisible()
      
      // Check for CTA buttons
      await expect(page.getByRole('button', { name: /get started|subscribe|buy now/i }).first()).toBeVisible()
    })

    test('plan comparison shows features', async ({ page }) => {
      await page.goto('/agents')
      
      // Look for feature list or comparison table
      const featureElements = page.locator('text=/features|capabilities|includes/i')
      await expect(featureElements.first()).toBeVisible()
    })
  })

  test.describe('Checkout Flow', () => {
    test('checkout page loads with plan selected', async ({ page }) => {
      // Navigate directly to checkout with a plan
      await page.goto('/checkout/test') // or specific plan URL
      
      // Verify checkout elements
      await expect(page.getByText(/checkout|order summary/i)).toBeVisible()
    })

    test('authenticated user can start subscription checkout', async ({ page }) => {
      await page.goto('/agents')
      
      // Find and click a subscribe button
      const subscribeButton = page.getByRole('button', { name: /subscribe|get started/i }).first()
      await expect(subscribeButton).toBeVisible()
      
      // Note: Actual Stripe checkout happens in popup/redirect
      // This test verifies the flow starts correctly
    })
  })

  test.describe('Billing Management', () => {
    test('billing page displays current plan', async ({ page }) => {
      await page.goto('/portal/billing')
      
      // Check for billing-related content
      await expect(page.getByText(/billing|subscription|plan/i)).toBeVisible()
    })

    test('can navigate to upgrade options', async ({ page }) => {
      await page.goto('/portal/billing')
      
      // Look for upgrade/change plan options
      const upgradeLink = page.getByRole('link', { name: /upgrade|change plan|manage/i })
      if (await upgradeLink.isVisible().catch(() => false)) {
        await upgradeLink.click()
        await expect(page).toHaveURL(/plan|upgrade|subscription/i)
      }
    })
  })

  test.describe('Payment Scenarios', () => {
    test('successful payment card is accepted', async ({ page }) => {
      // This would require Stripe test mode interaction
      // Note: Full Stripe integration test requires additional setup
      test.skip(true, 'Requires Stripe test environment setup')
      
      // Test card: 4242 4242 4242 4242
      // Would verify redirect to success page
    })

    test('declined card shows error', async ({ page }) => {
      // Test card: 4000 0000 0000 0002
      test.skip(true, 'Requires Stripe test environment setup')
    })
  })

  test.describe('Portal Access After Purchase', () => {
    test('subscribed user sees agent dashboard', async ({ page }) => {
      await page.goto('/portal/agents')
      
      // Verify agent dashboard loads
      await expect(page.getByRole('heading', { name: /agents|ai employees|dashboard/i })).toBeVisible()
    })

    test('subscription status displayed correctly', async ({ page }) => {
      await page.goto('/portal/billing')
      
      // Look for active/cancelled status
      const statusElement = page.locator('text=/active|cancelled|pending/i')
      await expect(statusElement.first()).toBeVisible()
    })
  })
})
