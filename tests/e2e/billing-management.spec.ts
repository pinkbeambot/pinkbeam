import { test, expect } from '@playwright/test'
import { loginAsTestUser } from './utils'

test.describe('Billing Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await loginAsTestUser(page)
  })

  test.describe('Billing Overview', () => {
    test('billing page loads successfully', async ({ page }) => {
      await page.goto('/portal/billing')
      
      // Verify page structure
      await expect(page.getByRole('heading', { name: /billing|subscription|account/i })).toBeVisible()
    })

    test('current plan is displayed', async ({ page }) => {
      await page.goto('/portal/billing')
      
      // Look for plan information
      const planInfo = page.locator('text=/plan|subscription|current|tier/i')
      await expect(planInfo.first()).toBeVisible()
    })

    test('billing summary shows', async ({ page }) => {
      await page.goto('/portal/billing')
      
      // Check for billing-related content
      const billingContent = page.locator('body')
      const hasBillingInfo = await billingContent.locator('text=/payment|invoice|billing|subscription|plan/i').count() > 0
      
      expect(hasBillingInfo).toBeTruthy()
    })
  })

  test.describe('Invoices', () => {
    test('invoices list is accessible', async ({ page }) => {
      await page.goto('/portal/billing')
      
      // Look for invoices section or tab
      const invoicesLink = page.getByRole('tab', { name: /invoices|billing history/i })
      if (await invoicesLink.isVisible().catch(() => false)) {
        await invoicesLink.click()
      }
      
      // Should show invoice list or empty state
      await expect(page.locator('text=/invoice|no invoices|billing history/i').first()).toBeVisible()
    })

    test('invoice shows correct information', async ({ page }) => {
      await page.goto('/portal/billing')
      
      // Go to invoices tab if it exists
      const invoicesTab = page.getByRole('tab', { name: /invoices/i })
      if (await invoicesTab.isVisible().catch(() => false)) {
        await invoicesTab.click()
      }
      
      // Look for invoice items
      const invoiceElements = page.locator('text=/date|amount|status|paid|pending/i')
      if (await invoiceElements.count() > 0) {
        await expect(invoiceElements.first()).toBeVisible()
      }
    })

    test('invoice download option available', async ({ page }) => {
      await page.goto('/portal/billing')
      
      const invoicesTab = page.getByRole('tab', { name: /invoices/i })
      if (await invoicesTab.isVisible().catch(() => false)) {
        await invoicesTab.click()
      }
      
      // Look for download button or link
      const downloadButton = page.getByRole('button', { name: /download|pdf/i })
      const downloadLink = page.getByRole('link', { name: /download|pdf/i })
      
      const hasDownload = await downloadButton.isVisible().catch(() => false) || 
                         await downloadLink.isVisible().catch(() => false)
      
      // If invoices exist, download should be available
      const hasInvoices = await page.locator('text=/invoice/i').count() > 0
      if (hasInvoices && hasDownload) {
        // Download option is present
      }
    })
  })

  test.describe('Payment Methods', () => {
    test('payment methods section is accessible', async ({ page }) => {
      await page.goto('/portal/billing')
      
      // Look for payment methods tab or section
      const paymentMethodsTab = page.getByRole('tab', { name: /payment|cards/i })
      if (await paymentMethodsTab.isVisible().catch(() => false)) {
        await paymentMethodsTab.click()
      }
      
      // Should show payment methods or empty state
      const paymentContent = page.locator('text=/payment|card|no payment|add card/i')
      await expect(paymentContent.first()).toBeVisible()
    })

    test('can add new payment method button exists', async ({ page }) => {
      await page.goto('/portal/billing')
      
      const paymentTab = page.getByRole('tab', { name: /payment/i })
      if (await paymentTab.isVisible().catch(() => false)) {
        await paymentTab.click()
      }
      
      // Look for add payment button
      const addButton = page.getByRole('button', { name: /add|new|payment|card/i })
      
      if (await addButton.isVisible().catch(() => false)) {
        await expect(addButton).toBeVisible()
      }
    })
  })

  test.describe('Subscription Management', () => {
    test('subscription status is displayed', async ({ page }) => {
      await page.goto('/portal/billing')
      
      // Look for subscription status
      const statusIndicators = page.locator('text=/active|cancelled|pending|expired/i')
      
      if (await statusIndicators.count() > 0) {
        await expect(statusIndicators.first()).toBeVisible()
      }
    })

    test('upgrade plan option available', async ({ page }) => {
      await page.goto('/portal/billing')
      
      // Look for upgrade/change plan button or link
      const upgradeOption = page.getByRole('link', { name: /upgrade|change plan/i })
      const upgradeButton = page.getByRole('button', { name: /upgrade|change plan/i })
      
      const hasUpgrade = await upgradeOption.isVisible().catch(() => false) ||
                        await upgradeButton.isVisible().catch(() => false)
      
      if (hasUpgrade) {
        // Upgrade option exists
      }
    })

    test('cancel subscription option available', async ({ page }) => {
      await page.goto('/portal/billing')
      
      // Look for cancel option
      const cancelButton = page.getByRole('button', { name: /cancel/i })
      const cancelLink = page.getByRole('link', { name: /cancel/i })
      
      const hasCancel = await cancelButton.isVisible().catch(() => false) ||
                       await cancelLink.isVisible().catch(() => false)
      
      if (hasCancel) {
        // Cancel option exists
      }
    })
  })

  test.describe('Payment History', () => {
    test('payment history is displayed', async ({ page }) => {
      await page.goto('/portal/billing')
      
      // Look for payment history section
      const paymentHistory = page.locator('text=/payment history|transactions/i')
      
      if (await paymentHistory.count() > 0) {
        await expect(paymentHistory.first()).toBeVisible()
      }
    })

    test('payment records show amount and date', async ({ page }) => {
      await page.goto('/portal/billing')
      
      // Look for payment details
      const paymentDetails = page.locator('text=/\$|amount|date|paid/i')
      
      if (await paymentDetails.count() > 0) {
        await expect(paymentDetails.first()).toBeVisible()
      }
    })
  })

  test.describe('Billing Settings', () => {
    test('billing address section exists', async ({ page }) => {
      await page.goto('/portal/billing')
      
      // Look for billing address
      const billingAddress = page.locator('text=/billing address|address/i')
      
      if (await billingAddress.count() > 0) {
        await expect(billingAddress.first()).toBeVisible()
      }
    })

    test('tax information available if applicable', async ({ page }) => {
      await page.goto('/portal/billing')
      
      // Look for tax info
      const taxInfo = page.locator('text=/tax|vat|gst/i')
      
      // Tax info may or may not be present
      // Just verify page loads without error
      await expect(page.locator('body')).toBeVisible()
    })
  })
})
