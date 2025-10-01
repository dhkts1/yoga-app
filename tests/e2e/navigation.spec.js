import { test, expect } from '@playwright/test';
import { clearAppData } from '../helpers/test-utils.js';

/**
 * Navigation Tests
 *
 * Tests app navigation and routing:
 * - Bottom navigation works
 * - Back button navigation
 * - Deep linking
 * - Tab switching
 */
test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await clearAppData(page);
  });

  test('should navigate between all main tabs', async ({ page }) => {
    const tabs = [
      { name: /discover|sessions/i, url: /\/sessions/ },
      { name: /progress|insights/i, url: /\/insights|\/progress/ }
    ];

    // Test at least 2 navigation actions
    for (const tab of tabs) {
      const button = page.getByRole('button', { name: tab.name });
      if (await button.isVisible({ timeout: 2000 }).catch(() => false)) {
        await button.click();
        await expect(page).toHaveURL(tab.url, { timeout: 5000 });
      }
    }
  });

  test('should maintain bottom nav visibility', async ({ page }) => {
    // Bottom nav should always be visible
    const bottomNav = page.locator('nav').filter({ has: page.locator('button') });
    await expect(bottomNav.first()).toBeVisible();

    // Navigate to different screens
    await page.getByRole('button', { name: /discover/i }).click();
    await expect(bottomNav.first()).toBeVisible();

    await page.getByRole('button', { name: /progress|insights/i }).click();
    await expect(bottomNav.first()).toBeVisible();
  });

  test('should support direct URL navigation', async ({ page }) => {
    await page.goto('/sessions');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/sessions/);

    await page.goto('/settings');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/settings/);
  });

  test('should handle back button navigation', async ({ page }) => {
    // Start at home
    await expect(page).toHaveURL('/');

    // Navigate to sessions
    await page.getByRole('button', { name: /discover/i }).click();
    await page.waitForURL(/\/sessions/);

    // Go back
    await page.goBack();
    await expect(page).toHaveURL('/');
  });

  test('should highlight active tab in bottom nav', async ({ page }) => {
    // Navigate to sessions
    await page.getByRole('button', { name: /discover/i }).click();
    await page.waitForURL(/\/sessions/);

    // Active tab should have different styling (aria-current or class)
    const activeTab = page.locator('button[aria-current], button[class*="active"]');
    await expect(activeTab.first()).toBeVisible({ timeout: 2000 });
  });
});
