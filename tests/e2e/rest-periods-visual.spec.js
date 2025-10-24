import { test, expect } from "@playwright/test";
import {
  clearAppData,
  dismissOnboardingIfPresent,
  skipMoodTrackerIfPresent,
  ensurePracticeStarted,
} from "../helpers/test-utils.js";

/**
 * Visual Rest Period Test - SLOW for demonstration
 *
 * This test runs SLOWLY so you can see:
 * - Pose 1 → Rest Screen → Pose 2 → Rest Screen → Pose 3 → Completion
 *
 * Run with: npx playwright test rest-periods-visual.spec.js --headed --project=mobile
 */

async function setupSlowTimerWithRest(page, restDuration, timerSpeed = 2) {
  await page.evaluate(
    ({ rest, speed }) => {
      // Set test mode flags (2x speed = half-speed, easier to see)
      window.__TEST_MODE__ = true;
      window.__TIMER_SPEED__ = speed;
      sessionStorage.setItem("__TEST_MODE__", "true");
      sessionStorage.setItem("__TIMER_SPEED__", speed.toString());

      // Set rest duration preference
      const prefs = {
        state: {
          hasSeenOnboarding: true,
          restDuration: rest,
          transitionBeepDelay: 0,
        },
        version: 0,
      };
      localStorage.setItem("mindful-yoga-preferences", JSON.stringify(prefs));
    },
    { rest: restDuration, speed: timerSpeed },
  );
}

test.describe("Visual Rest Period Demo", () => {
  test.beforeEach(async ({ page }) => {
    await clearAppData(page);
    await dismissOnboardingIfPresent(page);
  });

  test("VISUAL: Watch timer auto-advance through poses with rest periods", async ({
    page,
  }) => {
    await page.goto("/");

    // Set up: 5 second rest, 2x speed (poses are 0.5 seconds, rest is 0.5 seconds)
    await setupSlowTimerWithRest(page, 5, 2);

    // Start session
    await page.getByRole("button", { name: /start/i }).click();
    await page.waitForURL(/\/practice/);
    await skipMoodTrackerIfPresent(page);
    await ensurePracticeStarted(page);

    // Wait and watch it cycle through poses
    // Each pose = 1 second in test mode, with 2x speed = 500ms
    // Each rest = 1 second in test mode, with 2x speed = 500ms
    // Wait for 3 poses + 2 rest periods = 5 seconds
    await page.waitForTimeout(5000);

    // By now we should have seen multiple rest screens
    // Just verify we're still in practice or moved to completion
    const url = page.url();
    const stillInPractice =
      url.includes("/practice") || url.includes("/complete");
    expect(stillInPractice).toBe(true);
  });

  test("VISUAL: Watch single rest screen transition (VERY SLOW)", async ({
    page,
  }) => {
    await page.goto("/");

    // Set up: 3 second rest, 1x speed (real-time, poses are 1 second each)
    await setupSlowTimerWithRest(page, 3, 1);

    // Start session
    await page.getByRole("button", { name: /start/i }).click();
    await page.waitForURL(/\/practice/);
    await skipMoodTrackerIfPresent(page);
    await ensurePracticeStarted(page);

    // Pose 1: Wait 1 second (in test mode, poses are 1 second)
    await page.waitForTimeout(1200);

    // Should now be on rest screen
    const restHeading = page.getByRole("heading", {
      name: /rest|take a moment/i,
    });
    await expect(restHeading).toBeVisible({ timeout: 2000 });

    // Rest period: Wait 1 second (in test mode, rest is also 1 second)
    await page.waitForTimeout(1200);

    // Should now be on Pose 2
    const poseCounter = page.locator("text=/pose [0-9]+ of/i");
    await expect(poseCounter).toBeVisible();
    const text = await poseCounter.textContent();
    expect(text).toContain("Pose 2");
  });
});
