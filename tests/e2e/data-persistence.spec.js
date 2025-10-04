import { test, expect } from "@playwright/test";
import {
  clearAppData,
  fastForwardTimer,
  getStorageState,
  skipMoodTrackerIfPresent,
  ensurePracticeStarted,
} from "../helpers/test-utils.js";

/**
 * Data Persistence Test
 *
 * Validates that user data persists across page reloads:
 * - Complete a session (creates data)
 * - Verify localStorage has data
 * - Close and reopen page (simulate app restart)
 * - Verify streak still visible
 * - Verify localStorage data persisted
 *
 * This test ensures progress tracking survives app restarts.
 */
test.describe("Data Persistence", () => {
  test.beforeEach(async ({ page }) => {
    await clearAppData(page);
  });

  test("should persist session data in localStorage", async ({ page }) => {
    // clearAppData already navigated to home

    // Complete a session to create data
    await page.getByRole("button", { name: /quick start/i }).click();
    await page.waitForURL(/\/practice/, { timeout: 10000 });
    await skipMoodTrackerIfPresent(page);

    await fastForwardTimer(page);
    await ensurePracticeStarted(page);
    await skipMoodTrackerIfPresent(page);
    await page.waitForURL(/\/complete/, { timeout: 15000 });

    // Wait for state to persist
    await page.waitForTimeout(500);

    // Get storage state after completion
    const storage = await getStorageState(page);

    // Verify progress data exists
    expect(storage.progress).toBeDefined();
    expect(storage.progress.state).toBeDefined();
    expect(storage.progress.state.totalSessions).toBeGreaterThan(0);
  });

  test("should maintain streak after page reload", async ({ page }) => {
    // clearAppData already navigated to home

    // Complete a session
    await page.getByRole("button", { name: /quick start/i }).click();
    await page.waitForURL(/\/practice/, { timeout: 10000 });
    await skipMoodTrackerIfPresent(page);

    await fastForwardTimer(page);
    await ensurePracticeStarted(page);
    await skipMoodTrackerIfPresent(page);
    await page.waitForURL(/\/complete/, { timeout: 15000 });

    // Navigate home
    const homeButton = page
      .getByRole("link", { name: /home/i })
      .or(page.getByRole("button", { name: /home|done/i }));
    await homeButton.click();
    await page.waitForURL("/");

    // Verify streak is visible
    await expect(
      page.locator("text=/1.*day.*streak|streak.*1/i"),
    ).toBeVisible();

    // Reload the page (simulate closing and reopening app)
    await page.reload();

    // Wait for page to load
    await page.waitForLoadState("networkidle");

    // Verify streak is still visible after reload
    await expect(
      page.locator("text=/1.*day.*streak|streak.*1/i"),
    ).toBeVisible();
  });

  test("should preserve totalSessions count across page reloads", async ({
    page,
  }) => {
    // clearAppData already navigated to home

    // Complete a session
    await page.getByRole("button", { name: /quick start/i }).click();
    await page.waitForURL(/\/practice/, { timeout: 10000 });
    await skipMoodTrackerIfPresent(page);

    await fastForwardTimer(page);
    await ensurePracticeStarted(page);
    await skipMoodTrackerIfPresent(page);
    await page.waitForURL(/\/complete/, { timeout: 15000 });

    // Wait for state to persist
    await page.waitForTimeout(500);

    // Get session count before reload
    const beforeReload = await getStorageState(page);
    const sessionCountBefore = beforeReload.progress?.state?.totalSessions || 0;

    expect(sessionCountBefore).toBeGreaterThan(0);

    // Navigate to home first to avoid auto-completing another session on reload
    const homeButton = page
      .getByRole("link", { name: /home/i })
      .or(page.getByRole("button", { name: /home|done/i }));
    await homeButton.click();
    await page.waitForURL("/");

    // Reload page
    await page.reload();
    await page.waitForLoadState("networkidle");

    // Get session count after reload
    const afterReload = await getStorageState(page);
    const sessionCountAfter = afterReload.progress?.state?.totalSessions || 0;

    // Should be the same
    expect(sessionCountAfter).toBe(sessionCountBefore);
  });

  test("should preserve sessions array across page reloads", async ({
    page,
  }) => {
    // clearAppData already navigated to home

    // Complete a session
    await page.getByRole("button", { name: /quick start/i }).click();
    await page.waitForURL(/\/practice/, { timeout: 10000 });
    await skipMoodTrackerIfPresent(page);

    await fastForwardTimer(page);
    await ensurePracticeStarted(page);
    await skipMoodTrackerIfPresent(page);
    await page.waitForURL(/\/complete/, { timeout: 15000 });

    // Wait for state to persist
    await page.waitForTimeout(500);

    // Get practice history before reload
    const beforeReload = await getStorageState(page);
    const sessionsBefore = beforeReload.progress?.state?.practiceHistory || [];

    expect(sessionsBefore.length).toBeGreaterThan(0);

    // Verify session has required properties
    const firstSession = sessionsBefore[0];
    expect(firstSession).toHaveProperty("sessionId");
    expect(firstSession).toHaveProperty("date");
    expect(firstSession).toHaveProperty("duration");

    // Navigate to home first to avoid auto-completing another session on reload
    const homeButton = page
      .getByRole("link", { name: /home/i })
      .or(page.getByRole("button", { name: /home|done/i }));
    await homeButton.click();
    await page.waitForURL("/");

    // Reload page
    await page.reload();
    await page.waitForLoadState("networkidle");

    // Get practice history after reload
    const afterReload = await getStorageState(page);
    const sessionsAfter = afterReload.progress?.state?.practiceHistory || [];

    // Should have same length
    expect(sessionsAfter.length).toBe(sessionsBefore.length);

    // First session should match
    expect(sessionsAfter[0].sessionId).toBe(firstSession.sessionId);
    expect(sessionsAfter[0].date).toBe(firstSession.date);
  });

  test("should handle multiple page reloads without data loss", async ({
    page,
  }) => {
    // clearAppData already navigated to home

    // Complete a session
    await page.getByRole("button", { name: /quick start/i }).click();
    await page.waitForURL(/\/practice/, { timeout: 10000 });
    await skipMoodTrackerIfPresent(page);

    await fastForwardTimer(page);
    await ensurePracticeStarted(page);
    await skipMoodTrackerIfPresent(page);
    await page.waitForURL(/\/complete/, { timeout: 15000 });

    // Wait for state to persist
    await page.waitForTimeout(500);

    // Get initial storage state
    const initialStorage = await getStorageState(page);
    const initialSessionCount =
      initialStorage.progress?.state?.totalSessions || 0;

    // Navigate to home first to avoid auto-completing more sessions on reload
    const homeButton = page
      .getByRole("link", { name: /home/i })
      .or(page.getByRole("button", { name: /home|done/i }));
    await homeButton.click();
    await page.waitForURL("/");

    // Reload multiple times
    for (let i = 0; i < 3; i++) {
      await page.reload();
      await page.waitForLoadState("networkidle");
    }

    // Get final storage state
    const finalStorage = await getStorageState(page);
    const finalSessionCount = finalStorage.progress?.state?.totalSessions || 0;

    // Session count should remain the same
    expect(finalSessionCount).toBe(initialSessionCount);
  });
});
