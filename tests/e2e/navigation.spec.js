import { test, expect } from "@playwright/test";
import { clearAppData } from "../helpers/test-utils.js";

/**
 * Navigation Tests
 *
 * Tests app navigation and routing:
 * - Bottom navigation works
 * - Back button navigation
 * - Deep linking
 * - Tab switching
 */
test.describe("Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await clearAppData(page);
  });

  test("should navigate between all main tabs", async ({ page }) => {
    // Navigate to Sessions/Discover tab using bottom nav
    const discoverButton = page.getByRole("button", {
      name: "Sessions",
      exact: true,
    });
    if (await discoverButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await discoverButton.click();
      await expect(page).toHaveURL(/\/sessions/, { timeout: 5000 });
    }

    // Navigate to Progress/Insights tab using bottom nav
    const progressButton = page.getByRole("button", {
      name: /insights/i,
    });
    if (await progressButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await progressButton.click();
      await expect(page).toHaveURL(/\/insights|\/progress/, { timeout: 5000 });
    }
  });

  test("should maintain bottom nav visibility", async ({ page }) => {
    // Bottom nav should always be visible
    const bottomNav = page
      .locator("nav")
      .filter({ has: page.locator("button") });
    await expect(bottomNav.first()).toBeVisible();

    // Navigate to different screens using bottom nav (exact match to avoid "Discover Multi-Week Programs")
    await page.getByRole("button", { name: "Sessions", exact: true }).click();
    await expect(bottomNav.first()).toBeVisible();

    await page.getByRole("button", { name: /insights/i }).click();
    await expect(bottomNav.first()).toBeVisible();
  });

  test("should support direct URL navigation", async ({ page }) => {
    await page.goto("/sessions");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/\/sessions/);

    await page.goto("/settings");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/\/settings/);
  });

  test("should handle back button navigation", async ({ page }) => {
    // Start at home
    await expect(page).toHaveURL("/");

    // Navigate to sessions using bottom nav (exact match to avoid "Discover Multi-Week Programs")
    await page.getByRole("button", { name: "Sessions", exact: true }).click();
    await page.waitForURL(/\/sessions/);

    // Go back
    await page.goBack();
    await expect(page).toHaveURL("/");
  });

  test("should highlight active tab in bottom nav", async ({ page }) => {
    // Navigate to sessions using bottom nav (exact match to avoid "Discover Multi-Week Programs")
    await page.getByRole("button", { name: "Sessions", exact: true }).click();
    await page.waitForURL(/\/sessions/);

    // Active tab should have different styling (aria-current or class)
    const activeTab = page.locator(
      'button[aria-current], button[class*="active"]',
    );
    await expect(activeTab.first()).toBeVisible({ timeout: 2000 });
  });
});
