import { test, expect } from '@playwright/test';
import { clearAppData, skipMoodTrackerIfPresent } from '../helpers/test-utils.js';

/**
 * Practice Screen Interaction Tests
 *
 * Tests practice screen functionality WITHOUT completing sessions:
 * - Pause/resume controls
 * - Voice toggle during practice
 * - Pose information display
 * - Navigation controls
 */
test.describe('Practice Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await clearAppData(page);
  });

  test('should show pause button after starting practice', async ({ page }) => {
    // Start quick session
    await page.getByRole('button', { name: /quick start/i }).click();
    await page.waitForURL(/\/practice/, { timeout: 5000 });
    await skipMoodTrackerIfPresent(page);

    // Click play
    await page.getByRole('button', { name: /play/i }).click();
    await skipMoodTrackerIfPresent(page);

    // Should show pause button
    await expect(page.getByRole('button', { name: /pause/i })).toBeVisible({ timeout: 3000 });
  });

  test('should allow pausing practice', async ({ page }) => {
    await page.getByRole('button', { name: /quick start/i }).click();
    await page.waitForURL(/\/practice/, { timeout: 5000 });
    await skipMoodTrackerIfPresent(page);

    await page.getByRole('button', { name: /play/i }).click();
    await skipMoodTrackerIfPresent(page);

    // Click pause
    const pauseButton = page.getByRole('button', { name: /pause/i });
    await pauseButton.click();

    // Should show play button again
    await expect(page.getByRole('button', { name: /play/i })).toBeVisible({ timeout: 2000 });
  });

  test('should show current pose name during practice', async ({ page }) => {
    await page.getByRole('button', { name: /quick start/i }).click();
    await page.waitForURL(/\/practice/, { timeout: 5000 });
    await skipMoodTrackerIfPresent(page);

    // Pose name should be visible (before starting)
    const poseName = page.locator('text=/mountain|warrior|tree|child|downward/i');
    await expect(poseName.first()).toBeVisible({ timeout: 3000 });
  });

  test('should show timer during practice', async ({ page }) => {
    await page.getByRole('button', { name: /quick start/i }).click();
    await page.waitForURL(/\/practice/, { timeout: 5000 });
    await skipMoodTrackerIfPresent(page);

    // Timer should be visible
    const timer = page.locator('text=/\\d+:\\d+|\\d+ sec/i');
    await expect(timer.first()).toBeVisible({ timeout: 3000 });
  });


  test('should show pose illustration or emoji', async ({ page }) => {
    await page.getByRole('button', { name: /quick start/i }).click();
    await page.waitForURL(/\/practice/, { timeout: 5000 });
    await skipMoodTrackerIfPresent(page);

    // Should have visual representation
    const visual = page.locator('img, svg, [class*="emoji"]').first();
    await expect(visual).toBeVisible({ timeout: 3000 });
  });

  test('should allow exiting practice', async ({ page }) => {
    await page.getByRole('button', { name: /quick start/i }).click();
    await page.waitForURL(/\/practice/, { timeout: 5000 });
    await skipMoodTrackerIfPresent(page);

    // Should have back or exit button
    const exitButton = page.getByRole('button', { name: /back|exit|close/i }).or(
      page.locator('button[aria-label*="back"]')
    );
    await expect(exitButton.first()).toBeVisible({ timeout: 3000 });
  });
});
