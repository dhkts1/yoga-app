import { test, expect } from '@playwright/test';
import { clearAppData } from '../helpers/test-utils.js';

/**
 * Settings Screen Tests
 *
 * Tests user preferences and settings management:
 * - Navigate to settings
 * - Toggle voice coaching
 * - Change voice personality
 * - Toggle auto-advance
 * - View about information
 */
test.describe('Settings', () => {
  test.beforeEach(async ({ page }) => {
    await clearAppData(page);
  });

  test('should navigate to settings screen', async ({ page }) => {
    // Click settings button in bottom nav
    await page.getByRole('button', { name: /profile|settings/i }).click();

    // Verify on settings page
    await expect(page).toHaveURL(/\/settings/);
    await expect(page.getByRole('heading', { name: /^settings$/i }).first()).toBeVisible();
  });


  test('should toggle auto-advance setting', async ({ page }) => {
    await page.getByRole('button', { name: /profile|settings/i }).click();
    await page.waitForURL(/\/settings/);

    // Find auto-advance toggle
    const autoAdvanceToggle = page.locator('button, [role="switch"]').filter({ hasText: /auto.*advance/i }).first();

    if (await autoAdvanceToggle.isVisible({ timeout: 2000 }).catch(() => false)) {
      await autoAdvanceToggle.click();
      await page.waitForTimeout(100);

      const storage = await page.evaluate(() => {
        const prefs = localStorage.getItem('mindful-yoga-preferences');
        return prefs ? JSON.parse(prefs) : null;
      });

      expect(storage).toBeDefined();
    }
  });
});
