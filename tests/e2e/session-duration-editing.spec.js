import { test, expect } from "@playwright/test";
import {
  clearAppData,
  skipMoodTrackerIfPresent,
} from "../helpers/test-utils.js";

/**
 * Session Duration Editing Tests
 *
 * Validates the ability to customize pose durations in sessions:
 * - Opening the duration editor dialog
 * - Modifying durations with +/- buttons
 * - Verifying changes are displayed
 * - Closing the dialog with Done button
 * - Verifying changes persist in localStorage
 * - Verifying changes are applied during practice
 */
test.describe("Session Duration Editing", () => {
  test.beforeEach(async ({ page }) => {
    await clearAppData(page);
  });

  test("should open duration editor dialog from session preview", async ({
    page,
  }) => {
    // Navigate to Discover tab
    const discoverTab = page.getByRole("button", {
      name: "Discover",
      exact: true,
    });
    await discoverTab.click();
    await page.waitForURL(/\/sessions/);

    // Click on Morning Energizer session
    const sessionCard = page
      .getByRole("button", { name: /morning energizer/i })
      .first();
    await sessionCard.click();
    await expect(page).toHaveURL(/\/sessions\/morning-energizer\/preview/);

    // Click Edit button in poses section
    const editButton = page.getByRole("button", { name: /edit/i });
    await editButton.click();

    // Verify dialog is open
    const dialogTitle = page.getByRole("heading", { name: /edit durations/i });
    await expect(dialogTitle).toBeVisible();
  });

  test("should show poses with durations in editor dialog", async ({
    page,
  }) => {
    // Navigate to session preview
    await page.goto("/sessions/morning-energizer/preview");

    // Open duration editor
    const editButton = page.getByRole("button", { name: /edit/i });
    await editButton.click();

    // Verify dialog shows poses
    const dialogContent = page.locator('[role="dialog"]');
    await expect(dialogContent).toBeVisible();

    // Should show at least one pose (Mountain Pose is first in Morning Energizer)
    const poseName = dialogContent.getByText(/mountain pose/i);
    await expect(poseName).toBeVisible();

    // Should show duration controls (minus and plus buttons)
    const decreaseButtons = dialogContent.getByRole("button", {
      name: /decrease duration/i,
    });
    await expect(decreaseButtons.first()).toBeVisible();

    const increaseButtons = dialogContent.getByRole("button", {
      name: /increase duration/i,
    });
    await expect(increaseButtons.first()).toBeVisible();
  });

  test("should increase pose duration when plus button is clicked", async ({
    page,
  }) => {
    // Navigate to session preview
    await page.goto("/sessions/morning-energizer/preview");

    // Open duration editor
    const editButton = page.getByRole("button", { name: /edit/i });
    await editButton.click();

    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();

    // Get the first pose's increase button
    const increaseButton = dialog
      .getByRole("button", { name: /increase duration/i })
      .first();

    // Click to increase duration (default is 30s, should become 45s)
    await increaseButton.click();

    // Verify duration changed - look for 45s or 0:45
    const durationText = dialog.locator("text=/45s|0:45/");
    await expect(durationText.first()).toBeVisible();
  });

  test("should decrease pose duration when minus button is clicked", async ({
    page,
  }) => {
    // Navigate to session preview
    await page.goto("/sessions/morning-energizer/preview");

    // Open duration editor
    const editButton = page.getByRole("button", { name: /edit/i });
    await editButton.click();

    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();

    // Get the first pose's decrease button
    const decreaseButton = dialog
      .getByRole("button", { name: /decrease duration/i })
      .first();

    // Click to decrease duration (default is 30s, should become 15s)
    await decreaseButton.click();

    // Verify duration changed - look for 15s or 0:15
    const durationText = dialog.locator("text=/15s|0:15/");
    await expect(durationText.first()).toBeVisible();
  });

  test("should close dialog when Done button is clicked", async ({ page }) => {
    // Navigate to session preview
    await page.goto("/sessions/morning-energizer/preview");

    // Open duration editor
    const editButton = page.getByRole("button", { name: /edit/i });
    await editButton.click();

    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();

    // Click Done button
    const doneButton = dialog.getByRole("button", { name: /done/i });
    await doneButton.click();

    // Dialog should close
    await expect(dialog).not.toBeVisible();
  });

  test("should persist duration changes after closing dialog", async ({
    page,
  }) => {
    // Navigate to session preview
    await page.goto("/sessions/morning-energizer/preview");

    // Open duration editor
    const editButton = page.getByRole("button", { name: /edit/i });
    await editButton.click();

    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();

    // Increase first pose duration (30s -> 45s)
    const increaseButton = dialog
      .getByRole("button", { name: /increase duration/i })
      .first();
    await increaseButton.click();

    // Close dialog
    const doneButton = dialog.getByRole("button", { name: /done/i });
    await doneButton.click();
    await expect(dialog).not.toBeVisible();

    // Verify the session preview page shows the updated duration
    // The first pose should now show 45s
    const posesList = page.locator("text=/45s/");
    await expect(posesList.first()).toBeVisible();
  });

  test("should save customizations to localStorage", async ({ page }) => {
    // Navigate to session preview
    await page.goto("/sessions/morning-energizer/preview");

    // Open duration editor and change duration
    const editButton = page.getByRole("button", { name: /edit/i });
    await editButton.click();

    const dialog = page.locator('[role="dialog"]');
    const increaseButton = dialog
      .getByRole("button", { name: /increase duration/i })
      .first();
    await increaseButton.click();

    // Close dialog
    const doneButton = dialog.getByRole("button", { name: /done/i });
    await doneButton.click();

    // Wait for localStorage to be updated
    await page.waitForTimeout(100);

    // Check localStorage
    const storage = await page.evaluate(() => {
      const customizations = localStorage.getItem(
        "yoga-session-customizations",
      );
      return customizations ? JSON.parse(customizations) : null;
    });

    expect(storage).not.toBeNull();
    expect(storage.state?.durationOverrides).toBeDefined();
    expect(storage.state.durationOverrides["morning-energizer"]).toBeDefined();
  });

  test("should persist customizations after page reload", async ({ page }) => {
    // Navigate to session preview
    await page.goto("/sessions/morning-energizer/preview");

    // Open duration editor and change duration
    const editButton = page.getByRole("button", { name: /edit/i });
    await editButton.click();

    const dialog = page.locator('[role="dialog"]');
    const increaseButton = dialog
      .getByRole("button", { name: /increase duration/i })
      .first();
    await increaseButton.click();

    // Close dialog
    const doneButton = dialog.getByRole("button", { name: /done/i });
    await doneButton.click();
    await expect(dialog).not.toBeVisible();

    // Reload page
    await page.reload();

    // Verify the customization persists - should show 45s
    const posesList = page.locator("text=/45s/");
    await expect(posesList.first()).toBeVisible();
  });

  test("should not allow duration below minimum (15s)", async ({ page }) => {
    // Navigate to session preview
    await page.goto("/sessions/morning-energizer/preview");

    // Open duration editor
    const editButton = page.getByRole("button", { name: /edit/i });
    await editButton.click();

    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();

    // Get decrease button for first pose
    const decreaseButton = dialog
      .getByRole("button", { name: /decrease duration/i })
      .first();

    // Click once to decrease (30 -> 15)
    await decreaseButton.click();

    // Should show 15s (minimum)
    const durationText = dialog.locator("text=/15s|0:15/");
    await expect(durationText.first()).toBeVisible();

    // Button should be disabled at minimum (can't click again)
    await expect(decreaseButton).toBeDisabled();
  });

  test("should show Reset All button when customizations exist", async ({
    page,
  }) => {
    // Navigate to session preview
    await page.goto("/sessions/morning-energizer/preview");

    // Open duration editor
    const editButton = page.getByRole("button", { name: /edit/i });
    await editButton.click();

    const dialog = page.locator('[role="dialog"]');

    // Initially, Reset All should not be visible (no customizations)
    const resetButton = dialog.getByRole("button", { name: /reset all/i });
    await expect(resetButton).not.toBeVisible();

    // Make a change
    const increaseButton = dialog
      .getByRole("button", { name: /increase duration/i })
      .first();
    await increaseButton.click();

    // Close and reopen dialog to see Reset button
    const doneButton = dialog.getByRole("button", { name: /done/i });
    await doneButton.click();
    await expect(dialog).not.toBeVisible();

    // Reopen dialog
    await editButton.click();
    await expect(dialog).toBeVisible();

    // Now Reset All should be visible
    await expect(
      dialog.getByRole("button", { name: /reset all/i }),
    ).toBeVisible();
  });

  test("should reset all customizations when Reset All is clicked", async ({
    page,
  }) => {
    // Navigate to session preview
    await page.goto("/sessions/morning-energizer/preview");

    // Open duration editor and make changes
    const editButton = page.getByRole("button", { name: /edit/i });
    await editButton.click();

    const dialog = page.locator('[role="dialog"]');
    const increaseButton = dialog
      .getByRole("button", { name: /increase duration/i })
      .first();
    await increaseButton.click();

    // Close and reopen to see Reset button
    const doneButton = dialog.getByRole("button", { name: /done/i });
    await doneButton.click();
    await editButton.click();

    // Click Reset All
    const resetButton = dialog.getByRole("button", { name: /reset all/i });
    await resetButton.click();

    // Duration should be back to original (30s)
    const durationText = dialog.locator("text=/30s|0:30/");
    await expect(durationText.first()).toBeVisible();
  });

  test("should apply customized duration to timer during practice", async ({
    page,
  }) => {
    // Navigate to session preview
    await page.goto("/sessions/morning-energizer/preview");

    // Open duration editor and increase first pose duration (30s -> 45s)
    const editButton = page.getByRole("button", { name: /edit/i });
    await editButton.click();

    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();

    const increaseButton = dialog
      .getByRole("button", { name: /increase duration/i })
      .first();
    await increaseButton.click();

    // Close dialog
    const doneButton = dialog.getByRole("button", { name: /done/i });
    await doneButton.click();
    await expect(dialog).not.toBeVisible();

    // Start practice
    const startButton = page.getByRole("button", { name: /start practice/i });
    await startButton.click();

    // Wait for practice page and skip mood tracker if present
    await page.waitForURL(/\/practice/, { timeout: 5000 });
    await skipMoodTrackerIfPresent(page);

    // Wait for timer to appear
    await page.waitForTimeout(500);

    // The timer should show 0:45 (customized duration), NOT 0:30 (original)
    // Timer format is "0:XX" where XX is seconds
    const timer = page.locator("text=/0:4[0-5]/"); // 0:45, 0:44, 0:43, etc.
    await expect(timer.first()).toBeVisible({ timeout: 5000 });

    // Also verify we DON'T see the original duration at start
    // (If we see 0:30 or lower at the very beginning, customization failed)
    const wrongTimer = page.locator("text=/^0:30$/");
    await expect(wrongTimer).not.toBeVisible();
  });
});
