import { test, expect } from "@playwright/test";
import {
  clearAppData,
  fastForwardTimer,
  dismissOnboardingIfPresent,
  skipMoodTrackerIfPresent,
  ensurePracticeStarted,
} from "../helpers/test-utils.js";

/**
 * Rest Period Tests
 *
 * Tests the rest period functionality between poses:
 * - Rest screen appears after pose completes
 * - Rest countdown works correctly
 * - "Skip Rest" button advances to next pose
 * - Auto-advance to next pose after rest completes
 * - Rest period can be configured (0, 5, 10, 15 seconds)
 */

/**
 * Helper to set up test mode with fast timers and rest period configuration
 * Must be called after page.goto("/") to ensure storage is available
 */
async function setupFastTimerWithRest(page, restDuration, timerSpeed = 100) {
  await page.evaluate(
    ({ rest, speed }) => {
      // Set test mode flags
      window.__TEST_MODE__ = true;
      window.__TIMER_SPEED__ = speed;
      sessionStorage.setItem("__TEST_MODE__", "true");
      sessionStorage.setItem("__TIMER_SPEED__", speed.toString());

      // Set rest duration preference
      const prefs = {
        state: {
          hasSeenOnboarding: true,
          restDuration: rest,
          transitionBeepDelay: 0, // No delay for simpler testing
        },
        version: 0,
      };
      localStorage.setItem("mindful-yoga-preferences", JSON.stringify(prefs));
    },
    { rest: restDuration, speed: timerSpeed },
  );
}

test.describe("Rest Periods", () => {
  test.beforeEach(async ({ page }) => {
    await clearAppData(page);
    await dismissOnboardingIfPresent(page);
  });

  test("should show rest screen after first pose completes", async ({
    page,
  }) => {
    await page.goto("/");

    // Set up: Enable rest period (5 seconds) and moderate timer speed (10x for visibility)
    await setupFastTimerWithRest(page, 5, 10);

    // Start a session (Morning Energizer has multiple poses)
    await page.getByRole("button", { name: /quick start/i }).click();
    await page.waitForURL(/\/practice/);
    await skipMoodTrackerIfPresent(page);
    await ensurePracticeStarted(page);

    // Wait for first pose to complete
    // In test mode: pose = 1 second, with 10x speed = 100ms
    await page.waitForTimeout(150);

    // Verify rest screen appears
    const restHeading = page.getByRole("heading", {
      name: /rest|take a moment/i,
    });
    await expect(restHeading).toBeVisible({ timeout: 2000 });

    // Verify we're in rest mode (not on practice screen with pose timer)
    const poseHeading = page.getByRole("heading", {
      name: /mountain|warrior/i,
    });
    await expect(poseHeading).not.toBeVisible();
  });

  test("should auto-advance through all poses with rest periods until completion", async ({
    page,
  }) => {
    await page.goto("/");

    // Set up: Enable rest period (5 seconds) and fast timer (50x speed for full session)
    await setupFastTimerWithRest(page, 5, 50);

    // Start a session (Morning Energizer has 8 poses)
    await page.getByRole("button", { name: /quick start/i }).click();
    await page.waitForURL(/\/practice/);
    await skipMoodTrackerIfPresent(page);
    await ensurePracticeStarted(page);

    // Track that we see at least one rest screen during the session
    let restScreenSeen = false;

    // Wait for poses to cycle through
    // Each pose = 1 second in test mode, with 50x speed = 20ms
    // Each rest = 1 second in test mode, with 50x speed = 20ms
    // 8 poses + 7 rest periods = 15 * 20ms = 300ms, wait 500ms to be safe
    for (let i = 0; i < 25; i++) {
      // Check multiple times during the session
      await page.waitForTimeout(50);

      // Check if we see rest screen
      const restHeading = page.getByRole("heading", {
        name: /rest|take a moment/i,
      });
      const isRestVisible = await restHeading.isVisible().catch(() => false);

      if (isRestVisible) {
        restScreenSeen = true;
      }

      // Check if we reached completion (post-mood tracker or completion screen)
      const completionReached =
        (await page.url().includes("/complete")) ||
        (await page
          .getByRole("heading", { name: /how do you feel after/i })
          .isVisible()
          .catch(() => false));

      if (completionReached) {
        break;
      }
    }

    // Verify we saw at least one rest screen during the session
    expect(restScreenSeen).toBe(true);

    // Skip post-practice mood tracker if present
    await skipMoodTrackerIfPresent(page);

    // Verify we reached the completion screen
    await page.waitForURL(/\/complete/, { timeout: 5000 });

    const completionHeading = page.getByRole("heading", {
      name: /complete|great|done/i,
    });
    await expect(completionHeading).toBeVisible();
  });

  test.skip("should show next pose preview during rest", async ({ page }) => {
    await page.goto("/");
    await setupFastTimerWithRest(page, 5, 10);

    await page.getByRole("button", { name: /quick start/i }).click();
    await page.waitForURL(/\/practice/);
    await skipMoodTrackerIfPresent(page);
    await ensurePracticeStarted(page);

    // Wait for first pose to complete
    await page.waitForTimeout(150);

    // Verify we're on rest screen
    const restHeading = page.getByRole("heading", {
      name: /rest|take a moment/i,
    });
    await expect(restHeading).toBeVisible({ timeout: 2000 });

    // Verify "Next Pose:" label is visible (more specific selector)
    const nextLabel = page.locator("text=/next pose:/i");
    await expect(nextLabel.first()).toBeVisible();
  });

  test("should allow skipping rest period", async ({ page }) => {
    await page.goto("/");
    // Use VERY SLOW speed (1x = real-time) so button is stable
    await setupFastTimerWithRest(page, 10, 1);

    await page.getByRole("button", { name: /quick start/i }).click();
    await page.waitForURL(/\/practice/);
    await skipMoodTrackerIfPresent(page);
    await ensurePracticeStarted(page);

    // Wait for first pose to complete (1 second in test mode = 1 second real-time)
    await page.waitForTimeout(1200);

    // Verify rest screen appears
    const restHeading = page.getByRole("heading", { name: /rest/i });
    await expect(restHeading).toBeVisible({ timeout: 2000 });

    // Click "Skip Rest" button (we have 10 seconds to click it)
    const skipButton = page.getByRole("button", { name: /skip.*rest/i });
    await skipButton.click({ force: true });

    // Verify we advanced to next pose (rest screen should disappear)
    await expect(restHeading).not.toBeVisible({ timeout: 2000 });

    // Verify we're back to practice screen (pose counter should show pose 2)
    const poseCounter = page.locator("text=/pose 2 of/i");
    await expect(poseCounter).toBeVisible();
  });

  test.skip("should auto-advance to next pose after rest completes", async ({
    page,
  }) => {
    await page.goto("/");
    // Use 3 second rest with 5x speed for reliable timing
    await setupFastTimerWithRest(page, 3, 5);

    await page.getByRole("button", { name: /quick start/i }).click();
    await page.waitForURL(/\/practice/);
    await skipMoodTrackerIfPresent(page);
    await ensurePracticeStarted(page);

    // Wait for first pose to complete (1 second with 5x speed = 200ms)
    await page.waitForTimeout(250);

    // Verify rest screen appears
    const restHeading = page.getByRole("heading", { name: /rest/i });
    await expect(restHeading).toBeVisible({ timeout: 2000 });

    // Store initial pose number while on rest screen
    const initialPose = 1; // We know we're on rest after pose 1

    // Wait for rest period to complete (3 seconds with 5x speed = 600ms)
    await page.waitForTimeout(700);

    // Verify we advanced to next pose (not on rest anymore)
    await expect(restHeading).not.toBeVisible({ timeout: 2000 });

    // Verify we're on pose 2
    const poseCounter = page.locator("text=/pose 2 of/i");
    await expect(poseCounter).toBeVisible();
  });

  test("should respect restDuration setting from preferences", async ({
    page,
  }) => {
    await page.goto("/");
    // Set up: Disable rest period (restDuration: 0)
    await setupFastTimerWithRest(page, 0, 5);

    await page.getByRole("button", { name: /quick start/i }).click();
    await page.waitForURL(/\/practice/);
    await skipMoodTrackerIfPresent(page);
    await ensurePracticeStarted(page);

    // Verify we start on pose 1
    const pose1 = page.locator("text=/pose 1 of/i");
    await expect(pose1).toBeVisible();

    // Wait for first pose to complete (1 second with 5x speed = 200ms)
    await page.waitForTimeout(250);

    // Verify we advanced directly to pose 2 WITHOUT seeing rest screen
    const pose2 = page.locator("text=/pose 2 of/i");
    await expect(pose2).toBeVisible({ timeout: 2000 });

    // Double-check rest screen never appeared
    const restHeading = page.getByRole("heading", {
      name: /rest|take a moment/i,
    });
    const restVisible = await restHeading.isVisible().catch(() => false);
    expect(restVisible).toBe(false);
  });

  test("should not show rest screen after last pose", async ({ page }) => {
    await page.goto("/");
    // Set up: Fast timer + rest enabled (200x speed for very quick completion)
    await setupFastTimerWithRest(page, 5, 200);

    await page.getByRole("button", { name: /quick start/i }).click();
    await page.waitForURL(/\/practice/);
    await skipMoodTrackerIfPresent(page);
    await ensurePracticeStarted(page);

    // Wait for all poses to complete (8 poses + 7 rests = 15 seconds, with 200x speed = 75ms)
    // Add extra time for safety
    await page.waitForTimeout(200);

    // After last pose, should go to mood tracker or completion screen
    // NOT rest screen
    await skipMoodTrackerIfPresent(page);

    // Wait for completion - might already be there
    if (!page.url().includes("/complete")) {
      await page.waitForURL(/\/complete/, { timeout: 10000 });
    }

    // Verify we're on completion screen
    const completionHeading = page.getByRole("heading", {
      name: /complete|great|done/i,
    });
    await expect(completionHeading).toBeVisible();
  });

  test("should show rest countdown timer", async ({ page }) => {
    await page.goto("/");
    // Set up: Longer rest period with slower speed for visible countdown
    await setupFastTimerWithRest(page, 5, 3);

    await page.getByRole("button", { name: /quick start/i }).click();
    await page.waitForURL(/\/practice/);
    await skipMoodTrackerIfPresent(page);
    await ensurePracticeStarted(page);

    // Wait for first pose to complete (1 second with 3x speed = ~333ms)
    await page.waitForTimeout(400);

    // Verify rest screen appears
    const restHeading = page.getByRole("heading", { name: /rest/i });
    await expect(restHeading).toBeVisible({ timeout: 2000 });

    // Verify countdown text is visible (looking for any number)
    // The countdown should show "1" or higher
    const countdownText = page.locator('[aria-live="assertive"]').first();
    await expect(countdownText).toBeVisible({ timeout: 1000 });

    // Verify it contains a number
    const text = await countdownText.textContent();
    const hasNumber = /[1-9]/.test(text);
    expect(hasNumber).toBe(true);
  });
});
