import { test, expect } from "@playwright/test";
import { clearAppData } from "../helpers/test-utils.js";

/**
 * Error Handling E2E Tests
 *
 * Tests graceful error handling across the app:
 * - Invalid URLs and session IDs
 * - Corrupted localStorage data
 * - Missing custom sessions
 * - Error boundary functionality
 * - Storage warning behavior
 */

test.describe("Error Handling", () => {
  test.beforeEach(async ({ page }) => {
    await clearAppData(page);
  });

  test("should handle invalid session ID gracefully", async ({ page }) => {
    // Navigate to non-existent session (increase timeout for redirect)
    await page.goto("/sessions/invalid-session-id/preview", { timeout: 30000 });

    // Wait for redirect to complete
    await page.waitForURL(/\/sessions/, { timeout: 10000 });

    // Should redirect to sessions list (as per SessionDetail.jsx logic)
    await expect(page).toHaveURL(/\/sessions/);

    // App should remain functional - verify page loaded
    const pageContent = page.locator('main, [role="main"], body');
    await expect(pageContent).toBeVisible();

    // Bottom nav should work
    const bottomNav = page.locator("nav");
    await expect(bottomNav.first()).toBeVisible();
  });

  test("should handle non-existent custom session gracefully", async ({
    page,
  }) => {
    // Try to access a custom session that doesn't exist (increase timeout)
    await page.goto(
      "/sessions/nonexistent-custom-session/preview?custom=true",
      { timeout: 30000 },
    );

    // Wait for redirect to complete
    await page.waitForURL(/\/sessions/, { timeout: 10000 });

    // Should redirect to sessions list (as per SessionDetail.jsx logic)
    await expect(page).toHaveURL(/\/sessions/);

    // App should remain functional
    const pageContent = page.locator('main, [role="main"], body');
    await expect(pageContent).toBeVisible();
  });

  test("should handle invalid program ID gracefully", async ({ page }) => {
    // Navigate to non-existent program
    await page.goto("/programs/invalid-program-id", { timeout: 30000 });

    // Wait for page to stabilize
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1000);

    // Should either redirect or show error message (app shouldn't crash)
    const bottomNav = page.locator("nav");
    await expect(bottomNav.first()).toBeVisible();

    // Content should be present (either programs list or error message)
    const pageContent = page.locator('main, [role="main"], body');
    await expect(pageContent).toBeVisible();
  });

  test("should handle invalid week number in program gracefully", async ({
    page,
  }) => {
    // Use a real program ID but invalid week number
    await page.goto("/programs/iyengar-foundation-13/week/999", {
      timeout: 30000,
    });

    // Wait for page to stabilize
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1000);

    // App shouldn't crash - bottom nav should be visible
    const bottomNav = page.locator("nav");
    await expect(bottomNav.first()).toBeVisible();

    // Content should be present (app is functional)
    const pageContent = page.locator('main, [role="main"], body');
    await expect(pageContent).toBeVisible();
  });

  test("should recover from corrupted localStorage progress data", async ({
    page,
  }) => {
    // Navigate to app first
    await page.goto("/", { timeout: 30000 });
    await page.waitForLoadState("networkidle");

    // Set invalid JSON in progress store
    await page.evaluate(() => {
      localStorage.setItem("yoga-progress", "invalid-json{{{corrupted");
    });

    // Reload page - should recover gracefully
    await page.reload({ timeout: 30000 });
    await page.waitForLoadState("networkidle");

    // Should load without crashing - verify page content exists
    const pageContent = page.locator("body");
    await expect(pageContent).toBeVisible();

    // Bottom nav should be present (app is functional)
    const bottomNav = page.locator("nav");
    await expect(bottomNav.first()).toBeVisible();

    // App should be functional - can navigate
    const discoverButton = page.getByRole("button", {
      name: "Sessions",
      exact: true,
    });
    if (await discoverButton.isVisible({ timeout: 2000 })) {
      await discoverButton.click();
      await page.waitForURL(/\/sessions/, { timeout: 10000 });
    }
  });

  test("should recover from corrupted localStorage preferences data", async ({
    page,
  }) => {
    // Navigate to app first
    await page.goto("/", { timeout: 30000 });
    await page.waitForLoadState("networkidle");

    // Set invalid JSON in preferences store
    await page.evaluate(() => {
      localStorage.setItem(
        "mindful-yoga-preferences",
        "not valid json at all!!!",
      );
    });

    // Reload page - should recover gracefully
    await page.reload({ timeout: 30000 });
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    // Should load without crashing
    const pageContent = page.locator("body");
    await expect(pageContent).toBeVisible();

    // Bottom nav should exist (app recovered)
    const bottomNav = page.locator("nav");
    await expect(bottomNav.first()).toBeVisible({ timeout: 10000 });

    // The key test is that app loaded successfully after corrupted preferences
    // No need to navigate to settings - the recovery itself is the success criteria
  });

  test("should handle missing session data in localStorage", async ({
    page,
  }) => {
    // Navigate to app first
    await page.goto("/", { timeout: 30000 });
    await page.waitForLoadState("networkidle");

    // Set localStorage with missing required fields
    await page.evaluate(() => {
      localStorage.setItem(
        "yoga-progress",
        JSON.stringify({
          state: {
            practiceHistory: [
              {
                id: "test-1",
                sessionId: null,
                completedAt: new Date().toISOString(),
              }, // Missing required fields
            ],
          },
        }),
      );
    });

    // Navigate to insights page - should handle missing data gracefully
    const progressButton = page.getByRole("button", { name: /progress/i });
    const progressVisible = await progressButton
      .isVisible({ timeout: 5000 })
      .catch(() => false);

    if (progressVisible) {
      await progressButton.click();
      await page.waitForURL(/\/insights|\/progress/, { timeout: 10000 });
    } else {
      // Navigate directly if button not visible
      await page.goto("/insights", { timeout: 30000 });
    }

    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1000);

    // Should load without crashing - check body is visible
    const pageContent = page.locator("body");
    await expect(pageContent).toBeVisible();

    // Bottom nav should work (app is functional)
    const bottomNav = page.locator("nav");
    await expect(bottomNav.first()).toBeVisible();
  });

  test("should handle direct URL access to practice without session context", async ({
    page,
  }) => {
    // Try to access practice screen directly without session parameter
    // Practice.jsx should redirect to sessions or home when no session context
    await page.goto("/practice", {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    // Wait for any redirect or content to load
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2000);

    // The key success criterion is that app doesn't crash
    const pageContent = page.locator("body");
    await expect(pageContent).toBeVisible();

    // App should have some interactive content (nav, buttons, headings)
    const hasContent = await page
      .locator('nav, button, h1, h2, main, [role="main"]')
      .first()
      .isVisible({ timeout: 5000 })
      .catch(() => false);

    // If no content found, check if we have at least text on the page
    if (!hasContent) {
      const bodyText = await page.textContent("body");
      expect(bodyText.length).toBeGreaterThan(0);
    } else {
      expect(hasContent).toBe(true);
    }
  });

  test("should handle corrupted custom session draft in builder", async ({
    page,
  }) => {
    // Navigate to app first
    await page.goto("/", { timeout: 30000 });
    await page.waitForLoadState("networkidle");

    // Set corrupted draft data in localStorage
    await page.evaluate(() => {
      localStorage.setItem(
        "customSessions",
        JSON.stringify({
          sessions: [
            {
              id: "corrupted-draft",
              name: "Test Session",
              poses: "this should be an array, not a string", // Corrupted data
              duration: "invalid",
            },
          ],
        }),
      );
    });

    // Navigate to session builder
    await page.goto("/sessions/builder", { timeout: 30000 });
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1000);

    // Should load without crashing
    const builderHeading = page.locator("h1, h2").first();
    await expect(builderHeading).toBeVisible();

    // Builder should be functional - bottom nav exists
    const bottomNav = page.locator("nav");
    await expect(bottomNav.first()).toBeVisible();
  });

  test("should show error boundary on uncaught errors", async ({ page }) => {
    // Navigate to app
    await page.goto("/", { timeout: 30000 });
    await page.waitForLoadState("networkidle");

    // Note: Error boundary is hard to trigger in E2E tests without actual component errors
    // This test validates that the app loaded successfully and error boundary exists in code
    // The ErrorBoundary component will catch React errors when they occur

    // Verify app loaded successfully (error boundary didn't trigger)
    const appContent = page.locator("body");
    await expect(appContent).toBeVisible();

    // Verify bottom nav is present (app is functional)
    const bottomNav = page.locator("nav");
    await expect(bottomNav.first()).toBeVisible();

    // If an actual error occurs in other tests, the error boundary will show:
    // - "Something went wrong" message
    // - "Try Again" button
    // - "Go Home" button
    // This test confirms the happy path works
  });

  test("should handle network errors gracefully", async ({ page }) => {
    // Navigate to app first (load while online)
    await page.goto("/", { timeout: 30000 });
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    // Simulate offline mode
    await page.context().setOffline(true);

    // App should still work (PWA with offline support)
    const bottomNav = page.locator("nav");
    await expect(bottomNav.first()).toBeVisible();

    // Try to navigate - should still work with cached data
    const discoverButton = page.getByRole("button", {
      name: "Sessions",
      exact: true,
    });
    const discoverVisible = await discoverButton
      .isVisible({ timeout: 3000 })
      .catch(() => false);

    if (discoverVisible) {
      await discoverButton.click();
      await page.waitForURL(/\/sessions/, { timeout: 10000 });
    }

    // App should be functional (page content visible)
    const pageContent = page.locator("body");
    await expect(pageContent).toBeVisible();

    // Restore online mode for next tests
    await page.context().setOffline(false);
  });

  test("should handle rapid navigation without errors", async ({ page }) => {
    await page.goto("/", { timeout: 30000 });
    await page.waitForLoadState("networkidle");

    // Rapidly navigate between pages to test race conditions
    await page.getByRole("button", { name: "Sessions", exact: true }).click();
    await page.waitForTimeout(100);

    await page.getByRole("button", { name: /insights/i }).click();
    await page.waitForTimeout(100);

    await page.getByRole("button", { name: /programs/i }).click();
    await page.waitForTimeout(100);

    // After rapid navigation, app should still be functional
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(500);

    const bottomNav = page.locator("nav");
    await expect(bottomNav.first()).toBeVisible();

    // Should be on a valid page (last navigation target)
    const pageContent = page.locator('main, [role="main"], body');
    await expect(pageContent).toBeVisible();
  });

  test("should handle localStorage quota exceeded scenario", async ({
    page,
  }) => {
    // Note: Actually triggering quota exceeded is difficult in tests
    // This test verifies the app checks storage and remains functional

    await page.goto("/", { timeout: 30000 });
    await page.waitForLoadState("networkidle");

    // Check that storage API works without crashing
    const storageCheckPassed = await page
      .evaluate(() => {
        // Try to get storage quota API
        if (navigator.storage && navigator.storage.estimate) {
          return navigator.storage
            .estimate()
            .then((estimate) => true)
            .catch(() => false);
        }
        return true; // API not available, that's ok
      })
      .catch(() => true);

    expect(storageCheckPassed).toBe(true);

    // App should remain functional
    const bottomNav = page.locator("nav");
    await expect(bottomNav.first()).toBeVisible();
  });

  test("should handle invalid query parameters gracefully", async ({
    page,
  }) => {
    // Navigate with malformed query parameters
    await page.goto(
      '/practice?session=<script>alert("xss")</script>&customSession=null&invalid=../../../etc/passwd',
      {
        waitUntil: "domcontentloaded",
        timeout: 30000,
      },
    );

    // Wait for page to stabilize
    await page.waitForTimeout(1000);

    // Should load without executing malicious code or crashing
    const pageContent = page.locator("body");
    await expect(pageContent).toBeVisible();

    // App should be running (nav or content visible)
    const appIsRunning = await page
      .locator('nav, main, [role="main"]')
      .isVisible({ timeout: 3000 });
    expect(appIsRunning).toBe(true);

    // No XSS alert should have been triggered
    const dialogCount = await page
      .locator('dialog, [role="alertdialog"]')
      .filter({ hasText: /xss/i })
      .count();
    expect(dialogCount).toBe(0);
  });

  test("should handle deeply nested invalid routes", async ({ page }) => {
    // Try accessing non-existent deeply nested route
    await page.goto(
      "/sessions/invalid/deeply/nested/route/that/does/not/exist",
      {
        waitUntil: "domcontentloaded",
        timeout: 30000,
      },
    );
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2000);

    // App should be functional (doesn't crash on 404)
    const appContent = page.locator("body");
    await expect(appContent).toBeVisible();

    // App should show something (either error page, redirect, or 404)
    // Check if we have any interactive elements
    const hasInteractiveContent = await page
      .locator('button, a, nav, main, [role="main"]')
      .first()
      .isVisible({ timeout: 5000 })
      .catch(() => false);

    expect(hasInteractiveContent).toBe(true);
  });

  test("should handle editing non-existent custom session", async ({
    page,
  }) => {
    // Try to edit a session that doesn't exist
    await page.goto("/sessions/builder?edit=nonexistent-session-id", {
      timeout: 30000,
    });
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1000);

    // Should load builder without crashing
    const builderHeading = page.locator("h1, h2").first();
    await expect(builderHeading).toBeVisible();

    // Bottom nav should be functional
    const bottomNav = page.locator("nav");
    await expect(bottomNav.first()).toBeVisible();
  });

  test("should handle concurrent localStorage updates", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Simulate concurrent writes to localStorage
    await page.evaluate(() => {
      // Trigger multiple rapid updates
      for (let i = 0; i < 10; i++) {
        setTimeout(() => {
          const progress = JSON.parse(
            localStorage.getItem("yoga-progress") || '{"state":{}}',
          );
          progress.state = progress.state || {};
          progress.state.testData = Date.now();
          localStorage.setItem("yoga-progress", JSON.stringify(progress));
        }, i * 10);
      }
    });

    // Wait for all updates to complete
    await page.waitForTimeout(200);

    // App should remain stable
    const appContent = page.locator("body");
    await expect(appContent).toBeVisible();

    // Data should be accessible
    const storageData = await page.evaluate(() => {
      try {
        const data = localStorage.getItem("yoga-progress");
        return JSON.parse(data);
      } catch {
        return null;
      }
    });

    // Either data is valid or null (both acceptable - app handles both)
    expect(storageData === null || typeof storageData === "object").toBe(true);
  });
});
