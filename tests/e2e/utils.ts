import { expect, type Page, type APIRequestContext } from '@playwright/test'

/**
 * Authentication Helpers
 */

export async function loginAsTestUser(page: Page) {
  const response = await page.request.post('/api/test/login')
  expect(response.ok()).toBeTruthy()
}

export async function logoutUser(page: Page) {
  const response = await page.request.post('/api/test/logout')
  expect(response.ok()).toBeTruthy()
}

/**
 * Test Data Helpers
 */

export async function createTestUser(
  request: APIRequestContext,
  email: string,
  password: string
) {
  const response = await request.post('/api/test/create-user', {
    data: { email, password }
  })
  expect(response.ok()).toBeTruthy()
  return response.json()
}

export async function cleanupTestUser(
  request: APIRequestContext,
  userId: string
) {
  const response = await request.post('/api/test/cleanup-user', {
    data: { userId }
  })
  expect(response.ok()).toBeTruthy()
}

/**
 * Stripe Checkout Helpers
 */

export async function fillStripeTestCard(
  page: Page,
  cardDetails: {
    cardNumber: string
    expiryDate?: string
    cvc?: string
    zipCode?: string
  }
) {
  const { 
    cardNumber, 
    expiryDate = '12/30', 
    cvc = '123', 
    zipCode = '12345' 
  } = cardDetails

  // Stripe test card fields (may vary based on integration type)
  // For Stripe Checkout redirect
  await page.fill('input[name="cardnumber"], [data-testid="card-number-input"]', cardNumber)
  await page.fill('input[name="exp-date"], [data-testid="expiry-date-input"]', expiryDate)
  await page.fill('input[name="cvc"], [data-testid="cvc-input"]', cvc)
  await page.fill('input[name="postal"], [data-testid="zip-code-input"]', zipCode)
}

export async function completeStripeCheckout(
  page: Page,
  cardNumber: string = '4242 4242 4242 4242'
) {
  // Wait for Stripe form to load
  await page.waitForSelector('input[name="cardnumber"], iframe[src*="stripe"]', { timeout: 10000 })
  
  // Check if using iframe-based Stripe Elements
  const stripeFrame = page.locator('iframe[src*="stripe"]').first()
  
  if (await stripeFrame.isVisible().catch(() => false)) {
    // Handle iframe-based Stripe Elements
    const frame = await stripeFrame.contentFrame()
    if (frame) {
      await frame.locator('[name="cardnumber"]').fill(cardNumber)
      await frame.locator('[name="exp-date"]').fill('12 / 30')
      await frame.locator('[name="cvc"]').fill('123')
      await frame.locator('[name="postal"]').fill('12345')
    }
  } else {
    // Handle direct form fields
    await fillStripeTestCard(page, { cardNumber })
  }
  
  // Submit payment
  await page.click('button[type="submit"], [data-testid="pay-button"]')
}

/**
 * Wait Helpers
 */

export async function waitForPageLoad(page: Page, urlPattern?: RegExp) {
  if (urlPattern) {
    await page.waitForURL(urlPattern, { timeout: 10000 })
  }
  await page.waitForLoadState('networkidle', { timeout: 10000 })
}

export async function waitForToast(page: Page, messagePattern?: RegExp) {
  const toastSelector = '[data-testid="toast"], .toast, [role="alert"]'
  await page.waitForSelector(toastSelector, { timeout: 5000 })
  
  if (messagePattern) {
    await expect(page.locator(toastSelector)).toContainText(messagePattern)
  }
}

/**
 * Navigation Helpers
 */

export async function navigateToPortal(page: Page) {
  await page.goto('/portal')
  await waitForPageLoad(page, /portal/)
}

export async function navigateToBilling(page: Page) {
  await page.goto('/portal/billing')
  await waitForPageLoad(page, /billing/)
}

export async function navigateToProjects(page: Page) {
  await page.goto('/portal/projects')
  await waitForPageLoad(page, /projects/)
}

/**
 * Assertion Helpers
 */

export async function expectToBeOnSignInPage(page: Page) {
  await expect(page).toHaveURL(/sign-in/)
  await expect(page.getByRole('heading', { name: /welcome back|sign in/i })).toBeVisible()
}

export async function expectToBeOnPortal(page: Page) {
  await expect(page).toHaveURL(/portal/)
  await expect(page.locator('body')).toContainText(/portal|dashboard/i)
}

export async function expectErrorMessage(page: Page, messagePattern: RegExp) {
  await expect(page.locator('body')).toContainText(messagePattern)
}

/**
 * Mobile Helpers
 */

export async function setMobileViewport(page: Page) {
  await page.setViewportSize({ width: 375, height: 667 })
}

export async function setTabletViewport(page: Page) {
  await page.setViewportSize({ width: 768, height: 1024 })
}

export async function setDesktopViewport(page: Page) {
  await page.setViewportSize({ width: 1440, height: 900 })
}

/**
 * Form Helpers
 */

export async function clearAndFill(page: Page, selector: string, value: string) {
  await page.fill(selector, '')
  await page.fill(selector, value)
}

export async function selectDropdownOption(
  page: Page, 
  label: string, 
  option: string
) {
  await page.getByLabel(label).click()
  await page.getByRole('option', { name: option }).click()
}
