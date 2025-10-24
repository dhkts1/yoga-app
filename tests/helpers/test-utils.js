/**
 * Test Helper Utilities
 *
 * Provides reusable functions for E2E tests:
 * - State cleanup and management
 * - Timer control for fast testing
 * - Common user flows
 * - Storage inspection
 */

/**
 * Clear all application data (localStorage and sessionStorage)
 * Use before each test to ensure clean state
 *
 * @param {import('@playwright/test').Page} page - Playwright page object
 */
export async function clearAppData(page) {
  // Use context API for more reliable storage clearing
  await page.context().clearCookies();

  // Navigate to the app first to have proper context
  await page.goto("/");

  // Now clear storage and set onboarding as completed to skip it
  await page.evaluate(() => {
    try {
      localStorage.clear();
      sessionStorage.clear();

      // Set onboarding as completed to skip the welcome dialog
      const preferencesStore = {
        state: {
          hasSeenOnboarding: true,
          tooltipsDismissed: [],
          tooltipsShownCount: {},
          favoriteSessions: [],
          favoriteExercises: [],
          theme: "light", // Explicitly set default theme for tests
        },
        version: 0,
      };
      localStorage.setItem(
        "mindful-yoga-preferences",
        JSON.stringify(preferencesStore),
      );
    } catch (e) {
      // Ignore errors if storage is not available
      console.warn("Could not clear storage:", e.message);
    }
  });

  // Reload to apply the new state
  await page.reload();
  await page.waitForLoadState("networkidle");

  // Dismiss onboarding if it still appears
  await dismissOnboardingIfPresent(page);
}

/**
 * Dismiss onboarding modal if it's present
 * The app shows a welcome dialog to first-time users
 *
 * @param {import('@playwright/test').Page} page - Playwright page object
 */
export async function dismissOnboardingIfPresent(page) {
  try {
    // Wait for network to be idle to ensure onboarding has time to render
    await page.waitForLoadState("networkidle");

    // Look for onboarding dialog with timeout
    const onboardingDialog = page
      .locator('[role="dialog"]')
      .filter({ hasText: /welcome to mindful yoga|onboarding/i });

    // Wait for dialog to be visible (gives animation time to complete)
    await onboardingDialog.waitFor({ state: "visible", timeout: 1000 });

    // Try to find Skip button first (fastest way)
    const skipButton = page.getByRole("button", { name: /skip/i });

    await skipButton.waitFor({ state: "visible", timeout: 500 });
    await skipButton.click();

    // Wait for onboarding to disappear
    await onboardingDialog.waitFor({ state: "hidden", timeout: 1000 });
  } catch (error) {
    // Onboarding not present or already dismissed, that's fine
    console.log("No onboarding to dismiss or already dismissed");
  }
}

/**
 * Dismiss mood tracker if it appears
 * The app shows mood tracking before and after practice
 *
 * @param {import('@playwright/test').Page} page - Playwright page object
 */
export async function skipMoodTrackerIfPresent(page) {
  try {
    // Look for mood tracker with "Skip this step" button
    const skipButton = page.getByRole("button", { name: /skip.*step/i });

    // Wait for the button to be visible with a longer timeout
    await skipButton.waitFor({ state: "visible", timeout: 5000 });
    await skipButton.click();

    // Wait for mood tracker to disappear completely
    await skipButton.waitFor({ state: "hidden", timeout: 3000 });
  } catch {
    // Mood tracker not present or already dismissed, that's fine
  }
}

/**
 * Start practice timer if not already playing
 * After mood tracker dismissal, practice may auto-start, so check current state
 *
 * @param {import('@playwright/test').Page} page - Playwright page object
 */
export async function ensurePracticeStarted(page) {
  try {
    // Wait for either Play or Pause button to appear
    const playButton = page.getByRole("button", { name: "Play" });
    const pauseButton = page.getByRole("button", { name: "Pause" });

    // Try to find Play button first (timer not started)
    const isPlayVisible = await playButton
      .isVisible({ timeout: 2000 })
      .catch(() => false);

    if (isPlayVisible) {
      // Timer not started yet, click Play to start
      await playButton.click();
      // Wait for button to change to Pause (confirming it started)
      await pauseButton.waitFor({ state: "visible", timeout: 2000 });
    } else {
      // Timer already playing (auto-started), just verify Pause button exists
      await pauseButton.waitFor({ state: "visible", timeout: 2000 });
    }
  } catch (error) {
    // If neither button found, practice might have already completed or there's an error
    console.warn("Could not find Play/Pause button:", error.message);
  }
}

/**
 * Enable test mode to speed up timers
 * Sets window.__TEST_MODE__ flag that Practice component checks
 * Also stores in sessionStorage so it persists across navigation
 * Sets preferences to disable rest periods and transition delays for fast testing
 *
 * @param {import('@playwright/test').Page} page - Playwright page object
 */
export async function fastForwardTimer(page) {
  await page.evaluate(() => {
    window.__TEST_MODE__ = true;
    window.__TIMER_SPEED__ = 500; // 500x speed for faster tests
    // Store in sessionStorage so it persists across navigation
    sessionStorage.setItem("__TEST_MODE__", "true");
    sessionStorage.setItem("__TIMER_SPEED__", "500");

    // Set preferences to disable rest periods and transition delays
    // Using same pattern as setupFastTimerWithRest from rest-periods.spec.js
    const prefs = {
      state: {
        hasSeenOnboarding: true,
        restDuration: 0, // No rest periods for fast testing
        transitionBeepDelay: 0, // No transition delay
      },
      version: 0,
    };
    localStorage.setItem("mindful-yoga-preferences", JSON.stringify(prefs));
  });

  // Small wait to ensure settings are applied before navigation
  await page.waitForTimeout(100);
}

/**
 * Complete a quick practice session (full flow)
 * Useful for setting up test state with completed sessions
 *
 * Flow: Home -> Start -> Practice (fast) -> Complete
 *
 * @param {import('@playwright/test').Page} page - Playwright page object
 */
export async function completeQuickSession(page) {
  // Navigate to home
  await page.goto("/");

  // Enable test mode for fast timers
  await fastForwardTimer(page);

  // Click Quick Start button
  await page.getByRole("button", { name: /start/i }).click();

  // Wait for practice screen
  await page.waitForURL(/\/practice/);

  // Click play button to start
  await page.getByRole("button", { name: /play/i }).click();

  // Wait for completion screen
  await page.waitForURL(/\/complete/, { timeout: 30000 });
}

/**
 * Get current localStorage state
 * Useful for verifying data persistence
 *
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @returns {Promise<{progress: Object, preferences: Object}>} Storage state
 */
export async function getStorageState(page) {
  return await page.evaluate(() => ({
    progress: JSON.parse(localStorage.getItem("yoga-progress") || "{}"),
    preferences: JSON.parse(
      localStorage.getItem("mindful-yoga-preferences") || "{}",
    ),
  }));
}

/**
 * Wait for navigation to complete and content to be visible
 * More reliable than just waitForURL
 *
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} urlPattern - URL pattern to match (regex string or exact)
 */
export async function waitForNavigation(page, urlPattern) {
  await page.waitForURL(urlPattern);
  // Wait for any loading states to complete
  await page.waitForLoadState("networkidle");
}

/**
 * Navigate to a specific tab in the app
 * Handles bottom navigation interaction
 *
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} tabName - Tab name (Home, Discover, Insights, Settings)
 */
export async function navigateToTab(page, tabName) {
  await page
    .getByRole("navigation")
    .getByRole("link", { name: tabName })
    .click();
}

/**
 * Check if a streak badge is visible with specific count
 *
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {number} expectedCount - Expected streak count
 * @returns {Promise<boolean>} Whether streak badge with count is visible
 */
export async function hasStreakBadge(page, expectedCount) {
  try {
    const badge = page.locator(`text=/streak.*${expectedCount}/i`);
    return await badge.isVisible({ timeout: 5000 });
  } catch {
    return false;
  }
}

/**
 * Navigate to session builder via UI (not direct URL)
 * This ensures proper state initialization
 *
 * @param {import('@playwright/test').Page} page - Playwright page object
 */
export async function navigateToSessionBuilder(page) {
  // Go to sessions page first
  await page.goto("/sessions");
  await page.waitForLoadState("networkidle");

  // Click create custom session button
  const createButton = page.getByRole("button", {
    name: /create custom session/i,
  });
  await createButton.waitFor({ state: "visible", timeout: 5000 });
  await createButton.click();

  // Wait for navigation to builder
  await page.waitForURL(/\/sessions\/builder/);
  await page.waitForLoadState("networkidle");
}

/**
 * Start dev server and wait for it to be ready
 * Useful for debugging tests locally
 */
export async function ensureDevServerRunning() {
  // This is handled by webServer config in playwright.config.js
  // Just a placeholder for documentation
  return true;
}
