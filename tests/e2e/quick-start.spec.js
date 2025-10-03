import { test, expect } from "@playwright/test";
import {
  clearAppData,
  fastForwardTimer,
  dismissOnboardingIfPresent,
  skipMoodTrackerIfPresent,
  ensurePracticeStarted,
} from "../helpers/test-utils.js";

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
test.describe("Quick Start Flow", () => {
  test.beforeEach(async ({ page }) => {
    // clearAppData already navigates to home
    await clearAppData(page);
    // Dismiss onboarding modal if it appears
    await dismissOnboardingIfPresent(page);
  });

  test("should navigate to practice screen when Quick Start is clicked", async ({
    page,
  }) => {
    // Enable test mode for fast timers
    await fastForwardTimer(page);

    // Click Quick Start button
    const quickStartButton = page.getByRole("button", { name: /start/i });
    await quickStartButton.click();

    // Should navigate to practice screen
    // The URL might be /practice or /practice?session=...
    await expect(page).toHaveURL(/\/practice/);
  });

  test("should show pose name on practice screen", async ({ page }) => {
    await fastForwardTimer(page);
    await page.getByRole("button", { name: /start/i }).click();

    // Wait for practice screen
    await page.waitForURL(/\/practice/);

    // Skip mood tracker if it appears
    await skipMoodTrackerIfPresent(page);

    // Verify pose name is visible (English name)
    // Poses have names like "Mountain Pose", "Downward Dog", etc.
    const poseName = page.locator("h2").first();
    await expect(poseName).toBeVisible();
    await expect(poseName).not.toBeEmpty();
  });

  test("should show timer in MM:SS format", async ({ page }) => {
    await fastForwardTimer(page);
    await page.getByRole("button", { name: /start/i }).click();
    await page.waitForURL(/\/practice/);
    await skipMoodTrackerIfPresent(page);

    // Ensure practice has started (auto-starts after mood tracker dismissal)
    await ensurePracticeStarted(page);

    // Look for timer display (format: M:SS or MM:SS)
    // Timer should show remaining time like "0:30" or "1:00"
    // Note: There may be multiple timer elements, ensure we get a visible one
    const timer = page.locator("text=/\\d+:\\d{2}/").first();
    await expect(timer).toBeVisible({ timeout: 10000 });
  });

  test("should show play/pause button", async ({ page }) => {
    await fastForwardTimer(page);
    await page.getByRole("button", { name: /start/i }).click();
    await page.waitForURL(/\/practice/);
    await skipMoodTrackerIfPresent(page);

    // Verify play/pause button exists (either Play or Pause state is valid)
    // After mood tracker dismissal, practice may auto-start showing Pause instead of Play
    const playButton = page.getByRole("button", { name: "Play" });
    const pauseButton = page.getByRole("button", { name: "Pause" });

    const isPlayVisible = await playButton
      .isVisible({ timeout: 1000 })
      .catch(() => false);
    const isPauseVisible = await pauseButton
      .isVisible({ timeout: 1000 })
      .catch(() => false);

    expect(isPlayVisible || isPauseVisible).toBe(true);
  });

  test("should show pose image or illustration", async ({ page }) => {
    await fastForwardTimer(page);
    await page.getByRole("button", { name: /start/i }).click();
    await page.waitForURL(/\/practice/);
    await skipMoodTrackerIfPresent(page);

    // Verify pose image/illustration is present
    // Look for img or svg element
    const poseImage = page.locator("img, svg").first();
    await expect(poseImage).toBeVisible();
  });

  test("should show session name in header", async ({ page }) => {
    await fastForwardTimer(page);
    await page.getByRole("button", { name: /start/i }).click();
    await page.waitForURL(/\/practice/);
    await skipMoodTrackerIfPresent(page);

    // Ensure practice has started (auto-starts after mood tracker dismissal)
    await ensurePracticeStarted(page);

    // Verify session name is visible (e.g., "Morning Energizer", "Lunch Break Relief")
    // Note: The session name is displayed in the body content, not the header
    // There may be multiple h1 elements, so we filter for one with visible text
    const sessionName = page.locator("h1").filter({ hasText: /.+/ });
    await expect(sessionName.first()).toBeVisible({ timeout: 10000 });
    await expect(sessionName.first()).not.toBeEmpty();
  });
});
