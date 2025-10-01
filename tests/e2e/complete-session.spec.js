import { test, expect } from '@playwright/test';
import {
  clearAppData,
  fastForwardTimer,
  dismissOnboardingIfPresent,
  skipMoodTrackerIfPresent
} from '../helpers/test-utils.js';

/**
 * Complete Session Flow Test
 *
 * Validates the complete session experience:
 * - Start a session from home
 * - Click play button to begin
 * - Fast-forward through timer (using test mode)
 * - Verify navigation to completion screen
 * - Verify completion message visible
 * - Navigate back home
 * - Verify streak badge appears (1 day)
 * - Verify totalSessions incremented in localStorage
 *
 * This test ensures users can complete sessions and see progress.
 */
test.describe('Complete Session', () => {
  test.beforeEach(async ({ page }) => {
    await clearAppData(page);
    await dismissOnboardingIfPresent(page);
  });

  test('should complete a session and show completion screen', async ({ page }) => {
    await fastForwardTimer(page);
    await page.getByRole('button', { name: /start/i }).click();
    await page.waitForURL(/\/practice/);
    await skipMoodTrackerIfPresent(page);

    await page.getByRole('button', { name: /play/i }).click();
    await skipMoodTrackerIfPresent(page);
    await page.waitForURL(/\/complete/, { timeout: 15000 });

    await expect(page.getByRole('heading', { name: /complete|done|great/i })).toBeVisible();
  });

  test('should show completion message on complete screen', async ({ page }) => {
    await dismissOnboardingIfPresent(page);
    await fastForwardTimer(page);
    await page.getByRole('button', { name: /start/i }).click();
    await page.waitForURL(/\/practice/);
    await skipMoodTrackerIfPresent(page);

    await page.getByRole('button', { name: /play/i }).click();
    await skipMoodTrackerIfPresent(page);
    await page.waitForURL(/\/complete/, { timeout: 15000 });

    const completionText = page.locator('text=/great|nice|well done|completed/i').first();
    await expect(completionText).toBeVisible();
  });

  test('should increment totalSessions in localStorage after completion', async ({ page }) => {
    let storage = await page.evaluate(() => {
      const progressStore = localStorage.getItem('yoga-progress');
      if (!progressStore) return { totalSessions: 0 };
      const data = JSON.parse(progressStore);
      return { totalSessions: data.state?.totalSessions || 0 };
    });
    const initialSessions = storage.totalSessions;

    await fastForwardTimer(page);
    await page.getByRole('button', { name: /quick start/i }).click();
    await page.waitForURL(/\/practice/, { timeout: 10000 });
    await skipMoodTrackerIfPresent(page);

    await page.getByRole('button', { name: /play/i }).click();
    await skipMoodTrackerIfPresent(page);
    await page.waitForURL(/\/complete/, { timeout: 15000 });

    await page.waitForTimeout(1000);

    storage = await page.evaluate(() => {
      const progressStore = localStorage.getItem('yoga-progress');
      if (!progressStore) return { totalSessions: 0 };
      const data = JSON.parse(progressStore);
      return {
        totalSessions: data.state?.totalSessions || 0,
        practiceHistory: data.state?.practiceHistory || [],
      };
    });

    expect(storage.totalSessions).toBeGreaterThan(initialSessions);
    expect(storage.practiceHistory.length).toBeGreaterThan(0);
  });

  test('should show streak badge after completing first session', async ({ page }) => {
    await fastForwardTimer(page);
    await page.getByRole('button', { name: /start/i }).click();
    await page.waitForURL(/\/practice/);
    await skipMoodTrackerIfPresent(page);

    await page.getByRole('button', { name: /play/i }).click();
    await skipMoodTrackerIfPresent(page);
    await page.waitForURL(/\/complete/, { timeout: 15000 });

    const homeButton = page.getByRole('link', { name: /home/i }).or(
      page.getByRole('button', { name: /home|done/i })
    );
    await homeButton.click();
    await page.waitForURL('/');

    const streakBadge = page.locator('text=/1.*day.*streak|streak.*1/i');
    await expect(streakBadge).toBeVisible({ timeout: 5000 });
  });

  test('should allow returning home after completion', async ({ page }) => {
    await fastForwardTimer(page);
    await page.getByRole('button', { name: /start/i }).click();
    await page.waitForURL(/\/practice/);
    await skipMoodTrackerIfPresent(page);

    await page.getByRole('button', { name: /play/i }).click();
    await skipMoodTrackerIfPresent(page);
    await page.waitForURL(/\/complete/, { timeout: 15000 });

    const homeButton = page.getByRole('link', { name: /home/i }).or(
      page.getByRole('button', { name: /home|done/i })
    );
    await homeButton.click();

    await expect(page).toHaveURL('/');
  });
});
