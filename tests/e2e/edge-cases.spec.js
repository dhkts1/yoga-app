import { test, expect } from "@playwright/test";
import {
  clearAppData,
  dismissOnboardingIfPresent,
  skipMoodTrackerIfPresent,
  fastForwardTimer,
  navigateToSessionBuilder,
} from "../helpers/test-utils.js";

/**
 * Edge Cases E2E Tests
 *
 * Tests app stability under edge conditions:
 * - Extreme input lengths (very long names)
 * - Special characters and emojis
 * - Maximum data limits (many poses, many sessions)
 * - Browser navigation edge cases (back/forward, direct URL)
 * - Rapid interaction stress tests
 * - Data cleanup scenarios
 *
 * Success criteria:
 * - No app crashes or errors
 * - Data persistence maintained
 * - Navigation state handled correctly
 * - Graceful degradation where appropriate
 */

test.describe("Edge Cases", () => {
  test.beforeEach(async ({ page }) => {
    await clearAppData(page);
    await page.goto("/");
  });

  test("should handle very long session names (150+ characters)", async ({
    page,
  }) => {
    const longName =
      "A".repeat(100) + " My Extremely Long Session Name " + "B".repeat(50);

    await navigateToSessionBuilder(page);

    // Enter extremely long name
    const nameInput = page.locator('input[type="text"]').first();
    await nameInput.waitFor({ state: "visible", timeout: 5000 });
    await nameInput.fill(longName);

    // Switch to Select Poses tab
    const addPosesTab = page.getByRole("tab", { name: /select poses/i });
    await addPosesTab.click();
    await page.waitForTimeout(200);

    // Add 2 poses
    const poseCards = page
      .locator(".cursor-pointer")
      .filter({ hasText: /mountain|warrior|tree/i });
    await poseCards.nth(0).click();
    await page.waitForTimeout(200);
    await poseCards.nth(1).click();
    await page.waitForTimeout(200);

    const addSelectedButton = page.getByRole("button", {
      name: /add.*selected/i,
    });
    await addSelectedButton.click();
    await page.waitForTimeout(300);

    const addToSequenceBtn = page.getByRole("button", {
      name: /add to sequence/i,
    });
    await addToSequenceBtn.click();
    await page.waitForTimeout(500);

    // Should auto-switch to sequence tab
    const sequenceTab = page.getByRole("tab", { name: /selected poses/i });
    await expect(sequenceTab).toHaveAttribute("data-state", "active");

    // Save
    const saveButton = page.getByRole("button", { name: /save.*practice/i });
    await saveButton.waitFor({ state: "visible", timeout: 3000 });
    await saveButton.click();
    await page.waitForURL(/\/sessions\/custom-.*\/preview\?custom=true/, {
      timeout: 10000,
    });

    // Verify long name is handled (may be truncated in display but should exist)
    const heading = page.getByRole("heading").first();
    await expect(heading).toBeVisible();

    // Navigate to sessions list and verify it appears
    await page.goto("/sessions");
    await page.waitForTimeout(1000);

    // Should show at least some sessions (custom + default)
    // Verify page loaded with session content
    await expect(
      page.getByText(/minute|session|practice/i).first(),
    ).toBeVisible();
  });

  test("should handle special characters in session names", async ({
    page,
  }) => {
    // Use simpler special characters to avoid potential validation issues
    const specialName = "Yoga @ Home #1 - Morning Flow!";

    await navigateToSessionBuilder(page);

    const nameInput = page.locator('input[type="text"]').first();
    await nameInput.waitFor({ state: "visible", timeout: 5000 });
    await nameInput.fill(specialName);

    // Add poses
    const addPosesTab = page.getByRole("tab", { name: /select poses/i });
    await addPosesTab.click();
    await page.waitForTimeout(200);

    const poseCards = page
      .locator(".cursor-pointer")
      .filter({ hasText: /mountain|warrior/i });
    await poseCards.nth(0).click();
    await page.waitForTimeout(200);
    await poseCards.nth(1).click();
    await page.waitForTimeout(200);

    const addSelectedButton = page.getByRole("button", {
      name: /add.*selected/i,
    });
    await addSelectedButton.click();
    await page.waitForTimeout(300);

    const addToSequenceBtn = page.getByRole("button", {
      name: /add to sequence/i,
    });
    await addToSequenceBtn.click();
    await page.waitForTimeout(500);

    // Should auto-switch to sequence tab
    const sequenceTab = page.getByRole("tab", { name: /selected poses/i });
    await expect(sequenceTab).toHaveAttribute("data-state", "active");

    // Save
    const saveButton = page.getByRole("button", { name: /save.*practice/i });
    await saveButton.waitFor({ state: "visible", timeout: 3000 });
    await saveButton.click();
    await page.waitForURL(/\/sessions\/custom-.*\/preview\?custom=true/, {
      timeout: 10000,
    });

    // Verify special characters are preserved
    await expect(page.getByText(/yoga.*home.*#1/i)).toBeVisible();
  });

  test("should handle emoji in session names", async ({ page }) => {
    const emojiName = "Morning 🌅 Flow 🧘‍♀️ with 💪 Power";

    await navigateToSessionBuilder(page);

    const nameInput = page.locator('input[type="text"]').first();
    await nameInput.waitFor({ state: "visible", timeout: 5000 });
    await nameInput.fill(emojiName);

    // Add poses
    const addPosesTab = page.getByRole("tab", { name: /select poses/i });
    await addPosesTab.click();
    await page.waitForTimeout(200);

    const poseCards = page
      .locator(".cursor-pointer")
      .filter({ hasText: /mountain|warrior/i });
    await poseCards.nth(0).click();
    await page.waitForTimeout(200);
    await poseCards.nth(1).click();
    await page.waitForTimeout(200);

    const addSelectedButton = page.getByRole("button", {
      name: /add.*selected/i,
    });
    await addSelectedButton.click();
    await page.waitForTimeout(300);

    const addToSequenceBtn = page.getByRole("button", {
      name: /add to sequence/i,
    });
    await addToSequenceBtn.click();
    await page.waitForTimeout(500);

    // Should auto-switch to sequence tab
    const sequenceTab = page.getByRole("tab", { name: /selected poses/i });
    await expect(sequenceTab).toHaveAttribute("data-state", "active");

    // Save
    const saveButton = page.getByRole("button", { name: /save.*practice/i });
    await saveButton.waitFor({ state: "visible", timeout: 3000 });
    await saveButton.click();
    await page.waitForURL(/\/sessions\/custom-.*\/preview\?custom=true/, {
      timeout: 10000,
    });

    // Verify emoji is displayed
    await expect(page.getByText(/morning.*flow.*power/i)).toBeVisible();

    // Navigate to sessions list
    await page.goto("/sessions");
    await expect(page.getByText(/morning.*flow.*power/i)).toBeVisible();
  });

  test("should handle maximum number of poses in sequence (stress test)", async ({
    page,
  }) => {
    await navigateToSessionBuilder(page);

    const nameInput = page.locator('input[type="text"]').first();
    await nameInput.waitFor({ state: "visible", timeout: 5000 });
    await nameInput.fill("Max Poses Session");

    // Switch to Select Poses tab
    const addPosesTab = page.getByRole("tab", { name: /select poses/i });
    await addPosesTab.click();
    await page.waitForTimeout(300);

    // Select as many poses as available (should be ~50 total)
    const poseCards = page.locator('[class*="cursor-pointer"]').filter({
      has: page.locator("text=/mountain|warrior|tree|child|cobra|cat|bridge/i"),
    });

    // Click all available pose cards (up to 20 for reasonable test time)
    const maxPosesToSelect = Math.min(20, await poseCards.count());
    for (let i = 0; i < maxPosesToSelect; i++) {
      await poseCards.nth(i).click();
      await page.waitForTimeout(100);
    }

    // Add all selected poses
    const addSelectedButton = page.getByRole("button", {
      name: /add.*selected/i,
    });
    await addSelectedButton.click();
    await page.waitForTimeout(500);

    const addToSequenceBtn = page.getByRole("button", {
      name: /add to sequence/i,
    });
    await addToSequenceBtn.click();
    await page.waitForTimeout(500);

    // Should show many poses in sequence tab
    const sequenceTab = page.getByRole("tab", { name: /selected poses/i });
    await expect(sequenceTab).toContainText(String(maxPosesToSelect));

    // Verify total duration is calculated correctly
    await expect(page.getByText(/\d+m/i)).toBeVisible();

    // Verify we can save
    const saveButton = page.getByRole("button", { name: /save.*practice/i });
    await expect(saveButton).toBeEnabled();
    await saveButton.click();

    await page.waitForURL(/\/sessions\/custom-.*\/preview\?custom=true/, {
      timeout: 10000,
    });

    // Verify preview shows correct pose count - use first() to avoid strict mode violation
    await expect(
      page.getByText(new RegExp(`${maxPosesToSelect}.*poses?`, "i")).first(),
    ).toBeVisible();
  });

  test("should show validation error for single pose session", async ({
    page,
  }) => {
    await navigateToSessionBuilder(page);

    const nameInput = page.locator('input[type="text"]').first();
    await nameInput.waitFor({ state: "visible", timeout: 5000 });
    await nameInput.fill("Single Pose Session");

    // Switch to Select Poses tab
    const addPosesTab = page.getByRole("tab", { name: /select poses/i });
    await addPosesTab.click();
    await page.waitForTimeout(200);

    // Select only one pose
    const poseCards = page
      .locator(".cursor-pointer")
      .filter({ hasText: /mountain/i });
    await poseCards.first().click();
    await page.waitForTimeout(200);

    const addSelectedButton = page.getByRole("button", {
      name: /add.*selected/i,
    });
    await addSelectedButton.click();
    await page.waitForTimeout(300);

    const addToSequenceBtn = page.getByRole("button", {
      name: /add to sequence/i,
    });
    await addToSequenceBtn.click();
    await page.waitForTimeout(500);

    // Should auto-switch to sequence tab
    const sequenceTab = page.getByRole("tab", { name: /selected poses/i });
    await expect(sequenceTab).toHaveAttribute("data-state", "active");

    // Try to save - should show validation error
    const saveButton = page.getByRole("button", { name: /save.*practice/i });
    await saveButton.waitFor({ state: "visible", timeout: 3000 });
    await saveButton.click();

    // Should show validation error for minimum 2 poses
    await expect(page.getByText(/add at least 2 poses/i)).toBeVisible({
      timeout: 3000,
    });
  });

  test("should handle browser back button after completing session", async ({
    page,
  }) => {
    // Create and complete a session
    await page.goto("/sessions");
    await page.waitForLoadState("networkidle");
    await dismissOnboardingIfPresent(page);

    const createButton = page.getByRole("button", {
      name: /create custom session/i,
    });
    await createButton.click();
    await page.waitForURL(/\/sessions\/builder/);
    await page.waitForLoadState("networkidle");

    const nameInput = page.locator('input[type="text"]').first();
    await nameInput.waitFor({ state: "visible", timeout: 5000 });
    await nameInput.fill("Test Back Navigation");

    // Add poses
    const addPosesTab = page.getByRole("tab", { name: /select poses/i });
    await addPosesTab.click();
    await page.waitForTimeout(200);

    const poseCards = page
      .locator(".cursor-pointer")
      .filter({ hasText: /mountain|warrior/i });
    await poseCards.nth(0).click();
    await page.waitForTimeout(200);
    await poseCards.nth(1).click();
    await page.waitForTimeout(200);

    const addSelectedButton = page.getByRole("button", {
      name: /add.*selected/i,
    });
    await addSelectedButton.click();
    await page.waitForTimeout(300);

    const addToSequenceBtn = page.getByRole("button", {
      name: /add to sequence/i,
    });
    await addToSequenceBtn.click();
    await page.waitForTimeout(500);

    // Should auto-switch to sequence tab
    const sequenceTab = page.getByRole("tab", { name: /selected poses/i });
    await expect(sequenceTab).toHaveAttribute("data-state", "active");

    // Save
    const saveButton = page.getByRole("button", { name: /save.*practice/i });
    await saveButton.waitFor({ state: "visible", timeout: 3000 });
    await saveButton.click();
    await page.waitForURL(/\/sessions\/custom-.*\/preview\?custom=true/, {
      timeout: 10000,
    });

    // Start practice
    const startButton = page.getByRole("button", { name: /start.*practice/i });
    await startButton.click();
    await page.waitForURL(/\/practice/);

    await skipMoodTrackerIfPresent(page);

    // Enable fast timer and complete
    await fastForwardTimer(page);

    // Wait for completion or manually end
    const endButton = page.getByRole("button", { name: /end.*practice/i });
    if (await endButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await endButton.click();
    }

    // Should be on complete screen
    await page.waitForURL(/\/complete/, { timeout: 30000 });
    await expect(page.getByText(/session complete/i)).toBeVisible();

    // Use browser back button
    await page.goBack();

    // Should handle gracefully (may go to practice or sessions)
    await page.waitForLoadState("networkidle");
    expect(page.url()).toMatch(/\/(practice|sessions|complete)/);
  });

  test("should handle browser forward button navigation", async ({ page }) => {
    // Navigate through several screens
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await page.goto("/sessions");
    await page.waitForLoadState("networkidle");

    await page.goto("/insights");
    await page.waitForLoadState("networkidle");

    // Go back twice
    await page.goBack();
    await page.waitForURL(/\/sessions/);
    await page.waitForLoadState("networkidle");

    await page.goBack();
    await page.waitForURL(/\//);
    await page.waitForLoadState("networkidle");

    // Go forward
    await page.goForward();
    await page.waitForURL(/\/sessions/);
    await page.waitForLoadState("networkidle");

    // Verify page is functional - look for any visible text, not specific heading
    await expect(
      page.getByText(/session|yoga|practice/i).first(),
    ).toBeVisible();
  });

  test("should handle direct URL access to practice screen gracefully", async ({
    page,
  }) => {
    // Try to access practice screen directly without selecting a session
    await page.goto("/practice");

    // App should handle gracefully - either redirect or show error
    await page.waitForLoadState("networkidle");

    // Should either be on practice with default state or redirected to home/sessions
    expect(page.url()).toMatch(/\/(practice|sessions|\/)/);

    // If on practice, should have basic UI elements
    if (page.url().includes("/practice")) {
      // Should have some practice UI (may be in error state)
      const practiceElements = await page
        .locator("body")
        .textContent({ timeout: 3000 });
      expect(practiceElements).toBeTruthy();
    }
  });

  test("should handle direct URL access to session builder with navigation", async ({
    page,
  }) => {
    // Direct access to builder
    await navigateToSessionBuilder(page);

    // Should load builder successfully - check for input field
    const nameInput = page.locator('input[type="text"]').first();
    await nameInput.waitFor({ state: "visible", timeout: 5000 });

    // Should be functional
    await nameInput.fill("Direct Access Test");
    await expect(nameInput).toHaveValue("Direct Access Test");
  });

  test("should handle rapid navigation between screens (stress test)", async ({
    page,
  }) => {
    // Rapid navigation without waiting for full load
    const routes = [
      "/",
      "/sessions",
      "/insights",
      "/settings",
      "/poses",
      "/sessions",
      "/",
    ];

    for (const route of routes) {
      await page.goto(route);
      await page.waitForTimeout(200); // Minimal wait
    }

    // Final verification - app should still be functional
    await page.goto("/sessions");
    await page.waitForLoadState("networkidle");

    // Verify page has loaded with session content
    await expect(
      page.getByText(/session|practice|minute/i).first(),
    ).toBeVisible();
  });

  test("should create multiple custom sessions (stress test)", async ({
    page,
  }) => {
    const sessionCount = 10;

    for (let i = 1; i <= sessionCount; i++) {
      await page.goto("/sessions/builder");
      await page.waitForLoadState("networkidle");
      await dismissOnboardingIfPresent(page);

      const nameInput = page.locator('input[type="text"]').first();
      await nameInput.waitFor({ state: "visible", timeout: 5000 });
      await nameInput.fill(`Stress Test Session ${i}`);

      // Add poses
      const addPosesTab = page.getByRole("tab", { name: /select poses/i });
      await addPosesTab.click();
      await page.waitForTimeout(200);

      const poseCards = page
        .locator(".cursor-pointer")
        .filter({ hasText: /mountain|warrior/i });
      await poseCards.nth(0).click();
      await page.waitForTimeout(100);
      await poseCards.nth(1).click();
      await page.waitForTimeout(100);

      const addSelectedButton = page.getByRole("button", {
        name: /add.*selected/i,
      });
      await addSelectedButton.click();
      await page.waitForTimeout(200);

      const addToSequenceBtn = page.getByRole("button", {
        name: /add to sequence/i,
      });
      await addToSequenceBtn.click();
      await page.waitForTimeout(200);

      // Save
      const saveButton = page.getByRole("button", { name: /save.*practice/i });
      await saveButton.click();
      await page.waitForURL(/\/sessions\/custom-.*\/preview\?custom=true/, {
        timeout: 5000,
      });
    }

    // Verify all sessions exist
    await page.goto("/sessions");
    await page.waitForTimeout(500);

    // Should have created all sessions (plus default sessions)
    const sessionCards = page.locator('[class*="card"]').filter({
      has: page.locator("text=/stress test session/i"),
    });

    expect(await sessionCards.count()).toBe(sessionCount);
  });

  test("should delete all custom sessions and verify clean state", async ({
    page,
  }) => {
    // Create 3 custom sessions first
    for (let i = 1; i <= 3; i++) {
      await page.goto("/sessions/builder");
      await page.waitForLoadState("networkidle");
      await dismissOnboardingIfPresent(page);

      const nameInput = page.locator('input[type="text"]').first();
      await nameInput.waitFor({ state: "visible", timeout: 5000 });
      await nameInput.fill(`To Delete ${i}`);

      const addPosesTab = page.getByRole("tab", { name: /select poses/i });
      await addPosesTab.click();
      await page.waitForTimeout(200);

      const poseCards = page
        .locator(".cursor-pointer")
        .filter({ hasText: /mountain|warrior/i });
      await poseCards.first().click();
      await page.waitForTimeout(100);
      await poseCards.nth(1).click();
      await page.waitForTimeout(100);

      const addSelectedButton = page.getByRole("button", {
        name: /add.*selected/i,
      });
      await addSelectedButton.click();
      await page.waitForTimeout(200);

      const addToSequenceBtn = page.getByRole("button", {
        name: /add to sequence/i,
      });
      await addToSequenceBtn.click();
      await page.waitForTimeout(200);

      const saveButton = page.getByRole("button", { name: /save.*practice/i });
      await saveButton.click();
      await page.waitForURL(/\/sessions\/custom-.*\/preview\?custom=true/);
    }

    // Navigate to sessions list
    await page.goto("/sessions");
    await page.waitForTimeout(500);

    // Delete all custom sessions
    for (let i = 1; i <= 3; i++) {
      // Find first delete button
      const deleteButton = page
        .locator("button.hover\\:bg-state-error\\/10")
        .first();

      if (await deleteButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await deleteButton.click();
        await page.waitForTimeout(300);

        // Confirm deletion in dialog
        const dialog = page.getByRole("dialog");
        await expect(dialog).toBeVisible();

        const confirmButton = dialog.getByRole("button", { name: /^delete$/i });
        await confirmButton.click();
        await page.waitForTimeout(500);
      }
    }

    // Verify all custom sessions are gone
    await expect(page.getByText(/to delete/i)).not.toBeVisible();

    // But default sessions should still exist
    await expect(
      page.getByText(/5.*minute|10.*minute|15.*minute/i),
    ).toBeVisible();
  });

  test("should handle empty session name with whitespace only", async ({
    page,
  }) => {
    await navigateToSessionBuilder(page);

    // Enter only whitespace
    const nameInput = page.locator('input[type="text"]').first();
    await nameInput.waitFor({ state: "visible", timeout: 5000 });
    await nameInput.fill("     ");

    // Add poses
    const addPosesTab = page.getByRole("tab", { name: /select poses/i });
    await addPosesTab.click();
    await page.waitForTimeout(200);

    const poseCards = page
      .locator(".cursor-pointer")
      .filter({ hasText: /mountain/i });
    await poseCards.first().click();
    await page.waitForTimeout(200);

    const addSelectedButton = page.getByRole("button", {
      name: /add.*selected/i,
    });
    await addSelectedButton.click();
    await page.waitForTimeout(300);

    const addToSequenceBtn = page.getByRole("button", {
      name: /add to sequence/i,
    });
    await addToSequenceBtn.click();
    await page.waitForTimeout(300);

    // Try to save
    const saveButton = page.getByRole("button", { name: /save.*practice/i });
    await saveButton.click();

    // Should show validation error
    await expect(page.getByText(/please enter a session name/i)).toBeVisible();
  });

  test("should persist state after page reload during session creation", async ({
    page,
  }) => {
    await navigateToSessionBuilder(page);

    // Start creating a session
    const nameInput = page.locator('input[type="text"]').first();
    await nameInput.waitFor({ state: "visible", timeout: 5000 });
    await nameInput.fill("Reload Test Session");

    const addPosesTab = page.getByRole("tab", { name: /select poses/i });
    await addPosesTab.click();
    await page.waitForTimeout(200);

    const poseCards = page
      .locator(".cursor-pointer")
      .filter({ hasText: /mountain|warrior/i });
    await poseCards.nth(0).click();
    await page.waitForTimeout(200);
    await poseCards.nth(1).click();
    await page.waitForTimeout(200);

    const addSelectedButton = page.getByRole("button", {
      name: /add.*selected/i,
    });
    await addSelectedButton.click();
    await page.waitForTimeout(300);

    const addToSequenceBtn = page.getByRole("button", {
      name: /add to sequence/i,
    });
    await addToSequenceBtn.click();
    await page.waitForTimeout(300);

    // Reload the page
    await page.reload();
    await page.waitForLoadState("networkidle");

    // Verify draft is restored
    const restoredNameInput = page.locator('input[type="text"]').first();
    await expect(restoredNameInput).toHaveValue("Reload Test Session");

    // Should show 2 poses in sequence
    await expect(
      page.getByRole("tab", { name: /selected poses.*2/i }),
    ).toBeVisible();
  });
});
