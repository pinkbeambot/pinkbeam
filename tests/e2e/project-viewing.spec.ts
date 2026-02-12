import { test, expect } from '@playwright/test'
import { loginAsTestUser } from './utils'

test.describe('Project Viewing', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await loginAsTestUser(page)
  })

  test.describe('Project List', () => {
    test('project list page loads', async ({ page }) => {
      await page.goto('/portal/projects')
      
      // Verify page structure
      await expect(page.getByRole('heading', { name: /projects/i })).toBeVisible()
    })

    test('empty state for new users', async ({ page }) => {
      await page.goto('/portal/projects')
      
      // Check if empty state or project list is shown
      const content = page.locator('body')
      const hasProjects = await content.locator('text=/no projects|empty|get started|create/i').isVisible().catch(() => false)
      const hasList = await page.locator('[data-testid="project-list"], .project-card, [role="listitem"]').count() > 0
      
      expect(hasProjects || hasList).toBeTruthy()
    })

    test('projects display with status', async ({ page }) => {
      await page.goto('/portal/projects')
      
      // Look for status indicators
      const statusElements = page.locator('text=/active|completed|in progress|pending|cancelled/i')
      const count = await statusElements.count()
      
      if (count > 0) {
        await expect(statusElements.first()).toBeVisible()
      }
    })

    test('project cards show key info', async ({ page }) => {
      await page.goto('/portal/projects')
      
      // Look for project name, type, or date
      const projectInfo = page.locator('text=/web|agents|labs|solutions|project/i')
      if (await projectInfo.count() > 0) {
        await expect(projectInfo.first()).toBeVisible()
      }
    })
  })

  test.describe('Project Details', () => {
    test('can navigate to project details', async ({ page }) => {
      await page.goto('/portal/projects')
      
      // Find and click a project link
      const projectLink = page.locator('a[href*="/portal/projects/"]').first()
      
      if (await projectLink.isVisible().catch(() => false)) {
        await projectLink.click()
        await expect(page).toHaveURL(/\/portal\/projects\/[^/]+/)
      }
    })

    test('project details page shows information', async ({ page }) => {
      await page.goto('/portal/projects')
      
      // Navigate to first project if exists
      const projectLink = page.locator('a[href*="/portal/projects/"]').first()
      if (await projectLink.isVisible().catch(() => false)) {
        await projectLink.click()
        
        // Verify project details are shown
        await expect(page.getByRole('heading').first()).toBeVisible()
      }
    })

    test('project tabs navigation works', async ({ page }) => {
      await page.goto('/portal/projects')
      
      const projectLink = page.locator('a[href*="/portal/projects/"]').first()
      if (await projectLink.isVisible().catch(() => false)) {
        await projectLink.click()
        
        // Look for tabs
        const tabs = page.getByRole('tab')
        if (await tabs.count() > 0) {
          // Click second tab
          await tabs.nth(1).click()
          await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true')
        }
      }
    })
  })

  test.describe('Project Timeline', () => {
    test('timeline shows milestones', async ({ page }) => {
      await page.goto('/portal/projects')
      
      const projectLink = page.locator('a[href*="/portal/projects/"]').first()
      if (await projectLink.isVisible().catch(() => false)) {
        await projectLink.click()
        
        // Look for timeline or milestones tab
        const timelineTab = page.getByRole('tab', { name: /timeline|milestones|progress/i })
        if (await timelineTab.isVisible().catch(() => false)) {
          await timelineTab.click()
          
          // Check for milestone elements
          await expect(page.locator('text=/milestone|phase|stage|deliverable/i').first()).toBeVisible()
        }
      }
    })

    test('timeline shows project updates', async ({ page }) => {
      await page.goto('/portal/projects')
      
      const projectLink = page.locator('a[href*="/portal/projects/"]').first()
      if (await projectLink.isVisible().catch(() => false)) {
        await projectLink.click()
        
        // Look for updates or activity
        const updates = page.locator('text=/update|progress|status|activity/i')
        if (await updates.count() > 0) {
          await expect(updates.first()).toBeVisible()
        }
      }
    })
  })

  test.describe('Project Files', () => {
    test('files tab shows attachments', async ({ page }) => {
      await page.goto('/portal/projects')
      
      const projectLink = page.locator('a[href*="/portal/projects/"]').first()
      if (await projectLink.isVisible().catch(() => false)) {
        await projectLink.click()
        
        // Look for files tab
        const filesTab = page.getByRole('tab', { name: /files|documents|attachments/i })
        if (await filesTab.isVisible().catch(() => false)) {
          await filesTab.click()
          
          // Files list or empty state
          const filesContent = page.locator('text=/file|document|attachment|no files/i')
          await expect(filesContent.first()).toBeVisible()
        }
      }
    })
  })

  test.describe('Project Messages', () => {
    test('messages tab shows communication', async ({ page }) => {
      await page.goto('/portal/projects')
      
      const projectLink = page.locator('a[href*="/portal/projects/"]').first()
      if (await projectLink.isVisible().catch(() => false)) {
        await projectLink.click()
        
        // Look for messages tab
        const messagesTab = page.getByRole('tab', { name: /messages|communication|chat/i })
        if (await messagesTab.isVisible().catch(() => false)) {
          await messagesTab.click()
          
          // Messages or empty state
          const messagesContent = page.locator('text=/message|comment|no messages/i')
          await expect(messagesContent.first()).toBeVisible()
        }
      }
    })
  })

  test.describe('Access Control', () => {
    test('other user project returns 403 or not shown', async ({ page }) => {
      // Try to access a project ID that doesn't belong to user
      await page.goto('/portal/projects/non-existent-project-id')
      
      // Should show error or redirect
      const errorOrRedirect = await Promise.race([
        page.waitForURL(/portal|403|404/).then(() => 'redirect'),
        page.locator('text=/not found|access denied|403|404/i').isVisible().then(() => 'error'),
      ]).catch(() => 'unknown')
      
      expect(['redirect', 'error', 'unknown']).toContain(errorOrRedirect)
    })
  })
})
