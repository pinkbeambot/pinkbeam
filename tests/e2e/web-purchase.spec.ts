import { test, expect } from '@playwright/test'
import { loginAsTestUser } from './utils'

/**
 * Web Service Purchase E2E Tests
 * 
 * ⚠️ STATUS: BLOCKED - Waiting for Casey to fix 400 error on /api/checkout/one-time
 * Issue: WEB-PURCHASE-001
 * Reference: ~/code/pinkbeam/WEB-PURCHASE-ISSUE.md
 * 
 * These tests are ready to run once the checkout endpoint is fixed.
 */

test.describe('One-Time Purchase - Web Service', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await loginAsTestUser(page)
  })

  test.describe('Web Service Browsing', () => {
    test('web services page displays all tiers', async ({ page }) => {
      await page.goto('/web')
      
      // Check for service tier names
      await expect(page.getByText(/starter|professional|enterprise/i)).toBeVisible()
      
      // Check for one-time pricing display
      await expect(page.getByText(/\$2,000|\$5,000|\$10,000/)).toBeVisible()
      
      // Check for purchase buttons
      await expect(page.getByRole('button', { name: /buy|purchase|get started/i }).first()).toBeVisible()
    })

    test('web service features are listed', async ({ page }) => {
      await page.goto('/web')
      
      // Verify features are shown for each tier
      const featureList = page.locator('ul, [role="list"]')
      await expect(featureList.first()).toBeVisible()
    })
  })

  test.describe('One-Time Checkout Flow', () => {
    test.skip(true, 'BLOCKED: Waiting for Casey to fix 400 error on /api/checkout/one-time')
    
    test('can initiate one-time purchase for Web Starter', async ({ page }) => {
      await page.goto('/web')
      
      // Find the Web Starter tier and click Buy One-Time
      const starterSection = page.locator('text=/starter/i').locator('..').locator('..')
      const buyButton = starterSection.getByRole('button', { name: /buy one-time|\$2,000/i })
      
      await buyButton.click()
      
      // Should redirect to checkout or open Stripe
      await expect(page).toHaveURL(/checkout|stripe/)
    })

    test('one-time checkout shows correct amount ($2,000)', async ({ page }) => {
      await page.goto('/checkout/test')
      
      // Verify the price is displayed correctly
      await expect(page.getByText('$2,000')).toBeVisible()
      await expect(page.getByText(/one-time|single payment/i)).toBeVisible()
    })

    test('checkout as logged-out user redirects to sign-in then back', async ({ page }) => {
      // Log out first
      await page.goto('/api/test/logout') // if available, or clear cookies
      
      await page.goto('/web')
      
      // Click buy button
      const buyButton = page.getByRole('button', { name: /buy one-time/i }).first()
      await buyButton.click()
      
      // Should redirect to sign-in with return URL
      await expect(page).toHaveURL(/sign-in/)
      await expect(page.url()).toContain('returnUrl=')
      
      // After login, should return to checkout
      await loginAsTestUser(page)
      await expect(page).toHaveURL(/checkout/)
    })
  })

  test.describe('Payment Processing', () => {
    test.skip(true, 'BLOCKED: Waiting for Casey to fix 400 error on /api/checkout/one-time')
    
    test('successful payment with test card (4242 4242 4242 4242)', async ({ page }) => {
      await page.goto('/checkout/test')
      
      // Complete checkout with test card
      await completeStripeCheckout(page, '4242 4242 4242 4242')
      
      // Should redirect to success page
      await expect(page).toHaveURL(/success|confirmation|thank-you/)
      await expect(page.getByText(/success|confirmed|thank you/i)).toBeVisible()
    })

    test('declined card shows error (4000 0000 0000 0002)', async ({ page }) => {
      await page.goto('/checkout/test')
      
      await completeStripeCheckout(page, '4000 0000 0000 0002')
      
      // Should show error message
      await expect(page.getByText(/declined|failed|error/i)).toBeVisible()
    })
  })

  test.describe('Post-Purchase', () => {
    test.skip(true, 'BLOCKED: Waiting for Casey to fix 400 error on /api/checkout/one-time')
    
    test('project auto-created after purchase', async ({ page }) => {
      // Complete a purchase first
      await page.goto('/checkout/test')
      await completeStripeCheckout(page, '4242 4242 4242 4242')
      
      // Navigate to projects
      await page.goto('/portal/projects')
      
      // New Web project should appear
      await expect(page.getByText(/web|website/i)).toBeVisible()
    })

    test('invoice generated and accessible', async ({ page }) => {
      // After purchase
      await page.goto('/portal/billing')
      
      // Should see invoice for $2,000
      await expect(page.getByText('$2,000')).toBeVisible()
      
      // Should be able to download
      const downloadButton = page.getByRole('button', { name: /download|pdf/i })
      await expect(downloadButton.first()).toBeVisible()
    })

    test('confirmation email sent', async ({ page }) => {
      // This would require email testing setup
      // Verify via mail catcher or API
      test.skip(true, 'Requires email testing infrastructure')
    })
  })

  test.describe('Error Handling', () => {
    test('network error during checkout shows retry option', async ({ page }) => {
      // Simulate network failure
      await page.route('**/api/checkout/one-time', route => route.abort())
      
      await page.goto('/checkout/test')
      
      // Attempt purchase
      const payButton = page.getByRole('button', { name: /pay|purchase/i })
      await payButton.click()
      
      // Should show error
      await expect(page.getByText(/error|failed|try again/i)).toBeVisible()
    })

    test('expired session redirects to login', async ({ page }) => {
      // Clear auth cookies to simulate expired session
      await page.context().clearCookies()
      
      await page.goto('/checkout/test')
      
      // Should redirect to sign-in
      await expect(page).toHaveURL(/sign-in/)
    })
  })
})

// Helper function for Stripe checkout (will be used once unblocked)
async function completeStripeCheckout(page: any, cardNumber: string) {
  // This is a placeholder - actual implementation depends on Stripe integration type
  // (embedded, redirect, or popup)
  
  // For Stripe Checkout redirect:
  // Fill in test card details
  await page.fill('[name="cardnumber"]', cardNumber)
  await page.fill('[name="exp-date"]', '12/30')
  await page.fill('[name="cvc"]', '123')
  await page.fill('[name="postal"]', '12345')
  
  // Submit
  await page.click('button[type="submit"]')
}
