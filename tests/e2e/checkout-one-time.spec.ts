import { test, expect } from '@playwright/test'
import { loginAsTestUser } from './utils'

test.describe('One-Time Checkout Flow', () => {
  test('redirects unauthenticated user to sign-in', async ({ page }) => {
    // Try to access checkout test page without authentication
    await page.goto('/checkout/test')

    // Click the one-time purchase button
    const buyButton = page.getByRole('button', { name: /buy one-time/i })
    await expect(buyButton).toBeVisible()
    await buyButton.click()

    // Should redirect to sign-in
    await expect(page).toHaveURL(/sign-in/)
  })

  test('successfully initiates one-time purchase for Web Starter', async ({ page }) => {
    // Login as test user
    await loginAsTestUser(page)

    // Navigate to checkout test page
    await page.goto('/checkout/test')
    await expect(page.getByRole('heading', { name: /checkout test page/i })).toBeVisible()

    // Intercept the checkout API call
    const checkoutPromise = page.waitForResponse((response) =>
      response.url().includes('/api/checkout/one-time')
    )

    // Click the one-time purchase button for Web Starter
    const buyButton = page.getByRole('button', { name: /buy one-time/i }).first()
    await expect(buyButton).toBeVisible()
    await buyButton.click()

    // Wait for API response
    const checkoutResponse = await checkoutPromise

    // Verify API returns success
    expect(checkoutResponse.status()).toBe(200)
    const responseData = await checkoutResponse.json()
    expect(responseData.success).toBe(true)
    expect(responseData.sessionId).toBeDefined()
    expect(responseData.url).toContain('stripe.com')

    // Verify redirect to Stripe Checkout
    // Note: In test mode, we don't actually redirect to Stripe
    // Instead we verify the URL would redirect to Stripe
    expect(responseData.url).toMatch(/^https:\/\/checkout\.stripe\.com/)
  })

  test('successfully initiates one-time purchase for Solutions Workshop', async ({ page }) => {
    // Login as test user
    await loginAsTestUser(page)

    // Navigate to checkout test page
    await page.goto('/checkout/test')

    // Intercept the checkout API call
    const checkoutPromise = page.waitForResponse((response) =>
      response.url().includes('/api/checkout/one-time')
    )

    // Click the workshop purchase button
    const workshopButton = page.getByRole('button', { name: /book workshop/i })
    await expect(workshopButton).toBeVisible()
    await workshopButton.click()

    // Wait for API response
    const checkoutResponse = await checkoutPromise

    // Verify API returns success
    expect(checkoutResponse.status()).toBe(200)
    const responseData = await checkoutResponse.json()
    expect(responseData.success).toBe(true)
    expect(responseData.sessionId).toBeDefined()
  })

  test('returns 404 for non-existent plan', async ({ page }) => {
    // Login as test user
    await loginAsTestUser(page)

    // Make direct API call with invalid plan
    const response = await page.request.post('/api/checkout/one-time', {
      data: {
        planSlug: 'non-existent-plan-12345',
      },
    })

    expect(response.status()).toBe(404)
    const data = await response.json()
    expect(data.error).toBe('Plan not found')
  })

  test('returns 400 for plan without one-time price', async ({ page }) => {
    // Login as test user
    await loginAsTestUser(page)

    // Make direct API call with a subscription-only plan
    const response = await page.request.post('/api/checkout/one-time', {
      data: {
        planSlug: 'agents-sarah-starter', // Subscription-only plan
      },
    })

    expect(response.status()).toBe(400)
    const data = await response.json()
    expect(data.error).toContain('does not support one-time purchases')
  })

  test('accepts billingCycle field without error', async ({ page }) => {
    // Login as test user
    await loginAsTestUser(page)

    // Make direct API call with billingCycle (sent by PurchaseButton)
    const response = await page.request.post('/api/checkout/one-time', {
      data: {
        planSlug: 'web-starter-one-time',
        billingCycle: 'monthly', // Should be accepted but ignored
      },
    })

    // Should succeed despite billingCycle being present
    expect(response.status()).toBe(200)
    const data = await response.json()
    expect(data.success).toBe(true)
  })

  test('validates custom amount requires description and serviceType', async ({ page }) => {
    // Login as test user
    await loginAsTestUser(page)

    // Make direct API call with custom amount but missing required fields
    const response = await page.request.post('/api/checkout/one-time', {
      data: {
        amount: 5000,
        // Missing description and serviceType
      },
    })

    expect(response.status()).toBe(400)
    const data = await response.json()
    expect(data.error).toContain('description and serviceType are required')
  })

  test('successfully creates checkout with custom amount', async ({ page }) => {
    // Login as test user
    await loginAsTestUser(page)

    // Make direct API call with custom amount
    const response = await page.request.post('/api/checkout/one-time', {
      data: {
        amount: 5000,
        description: 'Custom Project',
        serviceType: 'LABS',
      },
    })

    expect(response.status()).toBe(200)
    const data = await response.json()
    expect(data.success).toBe(true)
    expect(data.sessionId).toBeDefined()
    expect(data.url).toContain('stripe.com')
  })
})
