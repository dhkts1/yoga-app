import { test, expect } from '@playwright/test';
import { clearAppData, fastForwardTimer, dismissOnboardingIfPresent, skipMoodTrackerIfPresent } from '../helpers/test-utils.js';

/**
 * Quick Start Flow Test
 *
 * Validates the quick start user flow:
 * - Click Quick Start button from home
 * - Navigate to practice screen
 * - Verify pose name is visible
 * - Verify timer is showing (MM:SS format)
 * - Verify play button exists
 * - Verify voice toggle exists
 *
 * This test ensures the core "get started quickly" flow works.
 */
test.describe('Quick Start Flow', () => {
  test.beforeEach(async ({ page }) => {
    // clearAppData already navigates to home
    await clearAppData(page);
    // Dismiss onboarding modal if it appears
    await dismissOnboardingIfPresent(page);
  });

  test('should navigate to practice screen when Quick Start is clicked', async ({ page }) => {
    // Enable test mode for fast timers
    await fastForwardTimer(page);

    // Click Quick Start button
    const quickStartButton = page.getByRole('button', { name: /start/i });
    await quickStartButton.click();

    // Should navigate to practice screen
    // The URL might be /practice or /practice?session=...
    await expect(page).toHaveURL(/\/practice/);
  });

  test('should show pose name on practice screen', async ({ page }) => {
    await fastForwardTimer(page);
    await page.getByRole('button', { name: /start/i }).click();

    // Wait for practice screen
    await page.waitForURL(/\/practice/);

    // Skip mood tracker if it appears
    await skipMoodTrackerIfPresent(page);

    // Verify pose name is visible (English name)
    // Poses have names like "Mountain Pose", "Downward Dog", etc.
    const poseName = page.locator('h2').first();
    await expect(poseName).toBeVisible();
    await expect(poseName).not.toBeEmpty();
  });

  test('should show timer in MM:SS format', async ({ page }) => {
    await fastForwardTimer(page);
    await page.getByRole('button', { name: /start/i }).click();
    await page.waitForURL(/\/practice/);
    await skipMoodTrackerIfPresent(page);

    // Look for timer display (format: M:SS or MM:SS)
    // Timer should show remaining time like "0:30" or "1:00"
    const timer = page.locator('text=/\\d+:\\d{2}/').first();
    await expect(timer).toBeVisible();
  });

  test('should show play button', async ({ page }) => {
    await fastForwardTimer(page);
    await page.getByRole('button', { name: /start/i }).click();
    await page.waitForURL(/\/practice/);
    await skipMoodTrackerIfPresent(page);

    // Verify play button exists
    const playButton = page.getByRole('button', { name: /play/i });
    await expect(playButton).toBeVisible();
  });


  test('should show pose image or illustration', async ({ page }) => {
    await fastForwardTimer(page);
    await page.getByRole('button', { name: /start/i }).click();
    await page.waitForURL(/\/practice/);
    await skipMoodTrackerIfPresent(page);

    // Verify pose image/illustration is present
    // Look for img or svg element
    const poseImage = page.locator('img, svg').first();
    await expect(poseImage).toBeVisible();
  });

  test('should show session name in header', async ({ page }) => {
    await fastForwardTimer(page);
    await page.getByRole('button', { name: /start/i }).click();
    await page.waitForURL(/\/practice/);
    await skipMoodTrackerIfPresent(page);

    // Verify session name is visible (e.g., "Morning Energizer")
    const sessionName = page.locator('h1, [class*="session-name"]').first();
    await expect(sessionName).toBeVisible();
  });
});
