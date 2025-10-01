import { test, expect } from '@playwright/test';
import { clearAppData } from '../helpers/test-utils.js';

/**
 * First Time User Experience Test
 *
 * Validates the experience for a new user with no prior data:
 * - Welcome screen is visible
 * - Quick Start button is present
 * - No streak badge shown (no completed sessions yet)
 * - No recently practiced section
 *
 * This test ensures new users have a clean, welcoming experience.
 */
test.describe('First Time User', () => {
  test.beforeEach(async ({ page }) => {
    // Clear all data to simulate first-time user
    await clearAppData(page);
  });

  test('should show welcome screen with Quick Start button', async ({ page }) => {
    // clearAppData already navigates to home, so no need to goto again

    // Verify welcome screen is visible - shows time-based greeting
    await expect(page.getByRole('heading', { name: /good morning|good afternoon|good evening/i })).toBeVisible();

    // Verify Quick Start button is present and visible
    const quickStartButton = page.getByRole('button', { name: /start/i });
    await expect(quickStartButton).toBeVisible();
  });

  test('should not show streak badge for new user', async ({ page }) => {
    // clearAppData already navigated to home

    // Verify no streak badge is visible
    // Streak badges typically show "X day streak" or similar
    const streakBadge = page.locator('text=/\\d+.*day.*streak/i');
    await expect(streakBadge).not.toBeVisible();
  });

  test('should not show recently practiced section', async ({ page }) => {
    // clearAppData already navigated to home

    // Verify no recently practiced section
    // This section typically has a heading like "Recently Practiced" or "Continue"
    const recentlyPracticed = page.getByText(/recently practiced|continue/i);
    await expect(recentlyPracticed).not.toBeVisible();
  });

  test('should have empty localStorage for new user', async ({ page }) => {
    // clearAppData already navigated to home

    // Verify localStorage is empty or has default values
    const storage = await page.evaluate(() => {
      return {
        progress: localStorage.getItem('yoga-progress'),
        preferences: localStorage.getItem('mindful-yoga-preferences'),
      };
    });

    // Progress store should be null or have no practice history
    if (storage.progress) {
      const progressData = JSON.parse(storage.progress);
      expect(progressData.state?.practiceHistory || []).toHaveLength(0);
    }
  });
});
