import { test, expect } from '@playwright/test'

test('quote request submission flow', async ({ page }) => {
  await page.route('**/api/quotes', async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: { id: 'quote-e2e' } }),
      })
      return
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, data: [] }),
    })
  })

  await page.goto('/web/quote')
  await expect(page.getByRole('heading', { name: /contact information/i })).toBeVisible()
  await expect(page.getByText(/auto-saved at/i)).toBeVisible()

  const fullNameInput = page.locator('#fullName')
  await fullNameInput.fill('Test User')
  await expect(fullNameInput).toHaveValue('Test User')

  const emailInput = page.locator('#email')
  await emailInput.fill('test@example.com')
  await expect(emailInput).toHaveValue('test@example.com')

  await page.locator('main').getByRole('button', { name: 'Next', exact: true }).click()
  await expect(page.getByRole('heading', { name: /project details/i })).toBeVisible({ timeout: 15000 })

  await page.locator('[data-slot="select-trigger"]', { hasText: 'Select project type' }).click()
  await page.getByRole('option', { name: 'New Website' }).click()

  await page.getByLabel('Web Design').check()
  await page.getByLabel('Development').check()

  await page.locator('[data-slot="select-trigger"]', { hasText: 'Select budget range' }).click()
  await page.getByRole('option', { name: '$10,000 - $25,000' }).click()

  await page.locator('[data-slot="select-trigger"]', { hasText: 'Select timeline' }).click()
  await page.getByRole('option', { name: '1-3 months' }).click()

  await page.locator('main').getByRole('button', { name: 'Next', exact: true }).click()
  await expect(page.getByRole('heading', { name: /additional information/i })).toBeVisible()

  await page.getByLabel(/project description/i).fill('We need a marketing site with a CMS and SEO support.')
  await page.getByLabel(/agree to be contacted/i).check()

  await page.getByRole('button', { name: 'Submit Request' }).click()

  await expect(page.getByRole('heading', { name: /quote request submitted/i })).toBeVisible()
})
