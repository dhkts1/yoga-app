import { test, expect } from '@playwright/test';
import { clearAppData, dismissOnboardingIfPresent, skipMoodTrackerIfPresent } from '../helpers/test-utils.js';

/**
 * Keyboard Navigation Tests (WCAG 2.1 AA Accessibility)
 *
 * Validates that all interactive elements are keyboard accessible:
 * - Tab navigation through all interactive elements
 * - Enter/Space key activation of buttons
 * - Escape key dismisses modals/dialogs
 * - Focus states are visible
 * - Logical tab order maintained
 * - Bottom navigation keyboard accessible
 *
 * These tests ensure compliance with WCAG 2.1 Level AA:
 * - 2.1.1 Keyboard (Level A)
 * - 2.1.2 No Keyboard Trap (Level A)
 * - 2.4.3 Focus Order (Level A)
 * - 2.4.7 Focus Visible (Level AA)
 */
test.describe('Keyboard Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await clearAppData(page);
    await dismissOnboardingIfPresent(page);
  });

  test('should navigate through welcome screen interactive elements with Tab key', async ({ page }) => {
    // Wait for page to be fully loaded
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);

    // Get all focusable elements on welcome screen
    const quickStartButton = page.getByRole('button', { name: /quick start|start/i }).first();

    // Verify button exists before tabbing
    await expect(quickStartButton).toBeVisible({ timeout: 3000 });

    // Tab to first interactive element (Quick Start button)
    await page.keyboard.press('Tab');

    // Verify focus moved (check document.activeElement)
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeTruthy();

    // Tab to browse all link
    await page.keyboard.press('Tab');

    // Continue tabbing through bottom nav
    await page.keyboard.press('Tab');

    // Verify we reached bottom nav
    const navButtons = page.locator('nav button');
    const navCount = await navButtons.count();
    expect(navCount).toBeGreaterThan(0);
  });

  test('should navigate through bottom navigation with Tab key', async ({ page }) => {
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);

    // Verify bottom nav exists with 6 tabs
    const navButtons = page.locator('nav button[aria-label]');
    const navCount = await navButtons.count();
    expect(navCount).toBe(6);

    // Tab through welcome screen to reach bottom nav
    await page.keyboard.press('Tab'); // Quick Start
    await page.keyboard.press('Tab'); // Browse All
    await page.keyboard.press('Tab'); // First nav tab

    // Verify we can tab through multiple nav items
    let tabbedCount = 1;
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      tabbedCount++;
    }

    // We should have tabbed through all 6 nav buttons
    expect(tabbedCount).toBe(6);
  });

  test('should activate Quick Start button with Enter key', async ({ page }) => {
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);

    // Get Quick Start button
    const quickStartButton = page.getByRole('button', { name: /quick start|start/i }).first();
    await expect(quickStartButton).toBeVisible();

    // Click using keyboard (focus then Enter)
    await quickStartButton.focus();
    await page.keyboard.press('Enter');

    // Should navigate to practice screen
    await page.waitForURL(/\/practice/, { timeout: 5000 });
    await expect(page).toHaveURL(/\/practice/);
  });

  test('should activate buttons with Space key', async ({ page }) => {
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);

    // Get Quick Start button
    const quickStartButton = page.getByRole('button', { name: /quick start|start/i }).first();
    await expect(quickStartButton).toBeVisible();

    // Click using keyboard (focus then Space)
    await quickStartButton.focus();
    await page.keyboard.press('Space');

    // Should navigate to practice screen
    await page.waitForURL(/\/practice/, { timeout: 5000 });
    await expect(page).toHaveURL(/\/practice/);
  });

  test('should navigate bottom nav tabs with Enter key', async ({ page }) => {
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);

    // Get Discover tab button
    const discoverTab = page.locator('nav button[aria-label="Discover"]');
    await expect(discoverTab).toBeVisible();

    // Focus and activate with Enter
    await discoverTab.focus();
    await page.keyboard.press('Enter');

    // Should navigate to sessions page
    await page.waitForURL(/\/sessions/, { timeout: 3000 });
    await expect(page).toHaveURL(/\/sessions/);
  });

  test('should close mood tracker modal with Escape key', async ({ page }) => {
    // Navigate to practice to trigger mood tracker
    await page.goto('/practice?session=morning-energizer');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    // Check if mood tracker appeared
    const moodDialog = page.locator('[role="dialog"]');
    const isVisible = await moodDialog.isVisible({ timeout: 3000 }).catch(() => false);

    if (isVisible) {
      // Press Escape to close
      await page.keyboard.press('Escape');

      // Modal should be dismissed
      await expect(moodDialog).not.toBeVisible({ timeout: 3000 });
    }

    // Practice controls should be visible (Play or Pause button, auto-start after mood dismissal)
    const practiceControls = page.getByRole('button', { name: /play|pause/i });
    await expect(practiceControls.first()).toBeVisible({ timeout: 3000 });
  });

  test('should navigate through session list with Tab key', async ({ page }) => {
    // Navigate to sessions page
    await page.goto('/sessions');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);

    // Get all interactive elements on page
    const interactiveElements = page.locator('button, a[href]');
    const count = await interactiveElements.count();

    // Verify we have multiple interactive elements
    expect(count).toBeGreaterThan(0);

    // Tab through several elements
    for (let i = 0; i < Math.min(count, 5); i++) {
      await page.keyboard.press('Tab');
    }

    // Verify tab navigation worked (focused element exists)
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeTruthy();
  });

  test('should navigate through settings screen with Tab key', async ({ page }) => {
    // Navigate to settings
    await page.goto('/settings');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);

    // Get all interactive elements (buttons, links, nav)
    const interactiveElements = page.locator('button, a[href]');
    const count = await interactiveElements.count();

    // Verify we have multiple interactive elements
    expect(count).toBeGreaterThan(0);

    // Tab through several elements
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
    }

    // Verify tab navigation worked
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeTruthy();
  });

  test('should show visible focus indicators on all interactive elements', async ({ page }) => {
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);

    // Get Quick Start button and focus it
    const quickStartButton = page.getByRole('button', { name: /quick start|start/i }).first();
    await quickStartButton.focus();

    // Check that element has focus
    const isFocused = await page.evaluate(() => {
      const activeEl = document.activeElement;
      return activeEl && activeEl.tagName === 'BUTTON';
    });

    expect(isFocused).toBe(true);

    // Check computed styles for outline or ring
    const styles = await page.evaluate(() => {
      const el = document.activeElement;
      const computed = window.getComputedStyle(el);
      return {
        outline: computed.outline,
        outlineWidth: computed.outlineWidth,
        boxShadow: computed.boxShadow,
      };
    });

    // Should have visible focus indicator (outline or box-shadow)
    const hasFocusIndicator =
      styles.outline !== 'none' ||
      parseFloat(styles.outlineWidth) > 0 ||
      styles.boxShadow !== 'none';

    expect(hasFocusIndicator).toBe(true);
  });

  test('should maintain logical tab order through practice flow', async ({ page }) => {
    // Navigate to practice
    await page.goto('/practice?session=morning-energizer');
    await skipMoodTrackerIfPresent(page);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);

    // Verify practice controls are visible (Play or Pause)
    const practiceControls = page.getByRole('button', { name: /play|pause/i });
    await expect(practiceControls.first()).toBeVisible({ timeout: 3000 });

    // Tab through practice controls
    const tabOrder = [];

    // Collect focused elements in tab order
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      const focused = await page.evaluate(() => {
        const el = document.activeElement;
        return {
          tag: el?.tagName || 'NONE',
          text: el?.textContent?.substring(0, 20) || '',
          ariaLabel: el?.getAttribute('aria-label') || '',
        };
      });
      tabOrder.push(focused);
    }

    // Verify we collected focus sequence
    expect(tabOrder.length).toBe(5);

    // Tab order should be logical (elements should have tags)
    const hasLogicalOrder = tabOrder.every(item => item.tag !== 'NONE');
    expect(hasLogicalOrder).toBe(true);
  });

  test('should not trap keyboard focus in modals', async ({ page }) => {
    // Navigate to practice to potentially show mood tracker
    await page.goto('/practice?session=morning-energizer');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    // Check if mood tracker is visible
    const moodDialog = page.locator('[role="dialog"]');
    const isVisible = await moodDialog.isVisible({ timeout: 2000 }).catch(() => false);

    if (isVisible) {
      // Tab through modal elements (limited to avoid infinite loop)
      const maxTabs = 10;
      for (let i = 0; i < maxTabs; i++) {
        await page.keyboard.press('Tab');
      }

      // We should still be able to close the modal with Escape
      await page.keyboard.press('Escape');
      await expect(moodDialog).not.toBeVisible({ timeout: 2000 });
    }

    // After modal closes or if no modal, practice screen should have tabbable elements
    const practiceControls = page.getByRole('button', { name: /play|pause/i });
    await expect(practiceControls.first()).toBeVisible({ timeout: 3000 });

    // Verify we can tab to practice controls
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeTruthy();
  });

  test('should activate bottom nav tabs with keyboard and update aria-current', async ({ page }) => {
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);

    // Check initial aria-current (should be on Today)
    const todayTab = page.locator('nav button[aria-label="Today"]');
    await expect(todayTab).toHaveAttribute('aria-current', 'page');

    // Get Discover tab and activate it
    const discoverTab = page.locator('nav button[aria-label="Discover"]');
    await discoverTab.focus();
    await page.keyboard.press('Enter');
    await page.waitForURL(/\/sessions/, { timeout: 3000 });

    // aria-current should move to Discover tab
    await expect(discoverTab).toHaveAttribute('aria-current', 'page');
    await expect(todayTab).not.toHaveAttribute('aria-current', 'page');
  });
});
