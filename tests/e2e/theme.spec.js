import { test, expect } from '@playwright/test';
import { clearAppData } from '../helpers/test-utils.js';

/**
 * Theme and Dark Mode Tests
 *
 * Tests comprehensive theme functionality:
 * - Toggle between light and dark modes
 * - Verify theme persists across page reloads
 * - Verify theme stored in localStorage
 * - Default theme for new users (light mode)
 * - Theme toggle accessible in Settings
 * - All major screens render correctly in dark mode
 * - Theme change applies immediately without reload
 * - Theme applied to DOM (class on html element)
 */
test.describe('Theme and Dark Mode', () => {
  test.beforeEach(async ({ page }) => {
    await clearAppData(page);
  });

  test('should default to light mode for new users', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Wait for ThemeProvider to apply the class
    await page.waitForFunction(() => {
      return document.documentElement.className.includes('light') ||
             document.documentElement.className.includes('dark');
    }, { timeout: 3000 });

    // Check that html element has 'light' class
    const htmlClass = await page.evaluate(() => {
      return document.documentElement.className;
    });

    expect(htmlClass).toContain('light');
    expect(htmlClass).not.toContain('dark');

    // Verify localStorage has light theme
    const storage = await page.evaluate(() => {
      const prefs = localStorage.getItem('mindful-yoga-preferences');
      return prefs ? JSON.parse(prefs) : null;
    });

    expect(storage).toBeDefined();
    expect(storage.state?.theme).toBe('light');
  });

  test('should navigate to settings and show theme toggle', async ({ page }) => {
    await page.goto('/');

    // Navigate to settings
    await page.getByRole('button', { name: /profile|settings/i }).click();
    await page.waitForURL(/\/settings/);

    // Open Appearance section
    const appearanceSection = page.locator('text=/appearance/i').first();
    await appearanceSection.click();

    // Wait for section to expand and theme toggle to be visible
    await page.waitForTimeout(300);

    // Verify theme toggle is visible
    const lightModeButton = page.getByRole('button', { name: /light mode/i });
    const darkModeButton = page.getByRole('button', { name: /dark mode/i });

    await expect(lightModeButton).toBeVisible();
    await expect(darkModeButton).toBeVisible();

    // Light mode should be selected (pressed) by default
    await expect(lightModeButton).toHaveAttribute('aria-pressed', 'true');
    await expect(darkModeButton).toHaveAttribute('aria-pressed', 'false');
  });

  test('should toggle dark mode from settings', async ({ page }) => {
    await page.goto('/settings');

    // Open Appearance section
    const appearanceSection = page.locator('text=/appearance/i').first();
    await appearanceSection.click();
    await page.waitForTimeout(300);

    // Click dark mode button
    const darkModeButton = page.getByRole('button', { name: /dark mode/i });
    await darkModeButton.click();

    // Wait for theme to apply
    await page.waitForTimeout(200);

    // Verify html element has 'dark' class
    const htmlClass = await page.evaluate(() => {
      return document.documentElement.className;
    });

    expect(htmlClass).toContain('dark');
    expect(htmlClass).not.toContain('light');

    // Verify dark mode button is now pressed
    await expect(darkModeButton).toHaveAttribute('aria-pressed', 'true');

    // Verify localStorage has dark theme
    const storage = await page.evaluate(() => {
      const prefs = localStorage.getItem('mindful-yoga-preferences');
      return prefs ? JSON.parse(prefs) : null;
    });

    expect(storage.state.theme).toBe('dark');
  });

  test('should toggle back to light mode from dark mode', async ({ page }) => {
    await page.goto('/settings');

    // Open Appearance section
    const appearanceSection = page.locator('text=/appearance/i').first();
    await appearanceSection.click();
    await page.waitForTimeout(300);

    // Toggle to dark mode first
    const darkModeButton = page.getByRole('button', { name: /dark mode/i });
    await darkModeButton.click();
    await page.waitForTimeout(200);

    // Verify dark mode is active
    let htmlClass = await page.evaluate(() => document.documentElement.className);
    expect(htmlClass).toContain('dark');

    // Toggle back to light mode
    const lightModeButton = page.getByRole('button', { name: /light mode/i });
    await lightModeButton.click();
    await page.waitForTimeout(200);

    // Verify light mode is active
    htmlClass = await page.evaluate(() => document.documentElement.className);
    expect(htmlClass).toContain('light');
    expect(htmlClass).not.toContain('dark');

    // Verify localStorage updated
    const storage = await page.evaluate(() => {
      const prefs = localStorage.getItem('mindful-yoga-preferences');
      return prefs ? JSON.parse(prefs) : null;
    });

    expect(storage.state.theme).toBe('light');
  });

  test('should persist theme across page reloads', async ({ page }) => {
    await page.goto('/settings');

    // Open Appearance section and toggle to dark mode
    const appearanceSection = page.locator('text=/appearance/i').first();
    await appearanceSection.click();
    await page.waitForTimeout(300);

    const darkModeButton = page.getByRole('button', { name: /dark mode/i });
    await darkModeButton.click();
    await page.waitForTimeout(200);

    // Verify dark mode is active
    let htmlClass = await page.evaluate(() => document.documentElement.className);
    expect(htmlClass).toContain('dark');

    // Reload the page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Verify dark mode persists after reload
    htmlClass = await page.evaluate(() => document.documentElement.className);
    expect(htmlClass).toContain('dark');

    // Verify localStorage still has dark theme
    const storage = await page.evaluate(() => {
      const prefs = localStorage.getItem('mindful-yoga-preferences');
      return prefs ? JSON.parse(prefs) : null;
    });

    expect(storage.state.theme).toBe('dark');
  });

  test('should persist theme across navigation', async ({ page }) => {
    await page.goto('/settings');

    // Open Appearance section and toggle to dark mode
    const appearanceSection = page.locator('text=/appearance/i').first();
    await appearanceSection.click();
    await page.waitForTimeout(300);

    const darkModeButton = page.getByRole('button', { name: /dark mode/i });
    await darkModeButton.click();
    await page.waitForTimeout(200);

    // Navigate to different screens and verify dark mode persists
    const screens = [
      { route: '/', name: 'Home' },
      { route: '/sessions', name: 'Sessions' },
      { route: '/programs', name: 'Programs' },
      { route: '/insights', name: 'Insights' },
    ];

    for (const screen of screens) {
      await page.goto(screen.route);
      await page.waitForLoadState('networkidle');

      const htmlClass = await page.evaluate(() => document.documentElement.className);
      expect(htmlClass, `Dark mode should persist on ${screen.name} screen`).toContain('dark');
    }
  });

  test('should apply theme change immediately without reload', async ({ page }) => {
    await page.goto('/settings');

    // Open Appearance section
    const appearanceSection = page.locator('text=/appearance/i').first();
    await appearanceSection.click();
    await page.waitForTimeout(300);

    // Click dark mode
    const darkModeButton = page.getByRole('button', { name: /dark mode/i });
    await darkModeButton.click();

    // Verify theme applies immediately (within 500ms)
    await page.waitForTimeout(200);
    let htmlClass = await page.evaluate(() => document.documentElement.className);
    expect(htmlClass).toContain('dark');

    // Click light mode
    const lightModeButton = page.getByRole('button', { name: /light mode/i });
    await lightModeButton.click();

    // Verify theme applies immediately
    await page.waitForTimeout(200);
    htmlClass = await page.evaluate(() => document.documentElement.className);
    expect(htmlClass).toContain('light');

    // No page reload should have occurred (check navigation timing)
    const didReload = await page.evaluate(() => {
      return performance.navigation?.type === 1 || performance.getEntriesByType('navigation')[0]?.type === 'reload';
    });
    expect(didReload).toBeFalsy();
  });

  test('should render all major screens correctly in dark mode', async ({ page }) => {
    // Enable dark mode first
    await page.goto('/settings');
    const appearanceSection = page.locator('text=/appearance/i').first();
    await appearanceSection.click();
    await page.waitForTimeout(300);

    const darkModeButton = page.getByRole('button', { name: /dark mode/i });
    await darkModeButton.click();
    await page.waitForTimeout(200);

    // Test Welcome screen
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    let htmlClass = await page.evaluate(() => document.documentElement.className);
    expect(htmlClass).toContain('dark');
    // Welcome screen has time-based greeting (Good Morning, Good Afternoon, Good Evening)
    await expect(page.getByRole('heading', { name: /good (morning|afternoon|evening)/i }).first()).toBeVisible();

    // Test Sessions screen
    await page.goto('/sessions');
    await page.waitForLoadState('networkidle');
    htmlClass = await page.evaluate(() => document.documentElement.className);
    expect(htmlClass).toContain('dark');
    await expect(page.getByRole('heading', { name: /sessions|choose|browse/i }).first()).toBeVisible();

    // Test Programs screen
    await page.goto('/programs');
    await page.waitForLoadState('networkidle');
    htmlClass = await page.evaluate(() => document.documentElement.className);
    expect(htmlClass).toContain('dark');
    await expect(page.getByRole('heading', { name: /programs|structured/i }).first()).toBeVisible();

    // Test Insights screen
    await page.goto('/insights');
    await page.waitForLoadState('networkidle');
    htmlClass = await page.evaluate(() => document.documentElement.className);
    expect(htmlClass).toContain('dark');
    await expect(page.getByRole('heading', { name: /insights|progress|stats/i }).first()).toBeVisible();

    // Test Settings screen
    await page.goto('/settings');
    await page.waitForLoadState('networkidle');
    htmlClass = await page.evaluate(() => document.documentElement.className);
    expect(htmlClass).toContain('dark');
    await expect(page.getByRole('heading', { name: /^settings$/i }).first()).toBeVisible();
  });

  test('should show dark mode theme options when dark mode is active', async ({ page }) => {
    await page.goto('/settings');

    // Open Appearance section
    const appearanceSection = page.locator('text=/appearance/i').first();
    await appearanceSection.click();
    await page.waitForTimeout(300);

    // Toggle to dark mode
    const darkModeButton = page.getByRole('button', { name: /dark mode/i });
    await darkModeButton.click();
    await page.waitForTimeout(300);

    // Verify dark mode theme options are visible
    const darkModeColorHeading = page.locator('text=/dark mode color/i');
    await expect(darkModeColorHeading).toBeVisible();

    // Verify theme options (Soft Slate, Warm Taupe, Pure Gray, Muted Sage, Custom)
    await expect(page.locator('text=/soft slate/i')).toBeVisible();
    await expect(page.locator('text=/warm taupe/i')).toBeVisible();
    await expect(page.locator('text=/pure gray/i')).toBeVisible();
    await expect(page.locator('text=/muted sage/i')).toBeVisible();
  });

  test('should show light mode theme options when light mode is active', async ({ page }) => {
    await page.goto('/settings');

    // Open Appearance section
    const appearanceSection = page.locator('text=/appearance/i').first();
    await appearanceSection.click();
    await page.waitForTimeout(300);

    // Light mode should be active by default
    // Verify light mode theme options are visible
    const lightModeColorHeading = page.locator('text=/light mode color/i');
    await expect(lightModeColorHeading).toBeVisible();

    // Verify theme options (Warm Cream, Pure White, Sage Tint, Desert Sand, Custom)
    await expect(page.locator('text=/warm cream/i')).toBeVisible();
    await expect(page.locator('text=/pure white/i')).toBeVisible();
    await expect(page.locator('text=/sage tint/i')).toBeVisible();
    await expect(page.locator('text=/desert sand/i')).toBeVisible();
  });

  test('should update PWA theme-color meta tag when theme changes', async ({ page }) => {
    await page.goto('/settings');

    // Get initial theme-color (should be light)
    let themeColor = await page.evaluate(() => {
      const meta = document.querySelector('meta[name="theme-color"]');
      return meta ? meta.getAttribute('content') : null;
    });

    // Should be a light color (hex code)
    expect(themeColor).toBeTruthy();
    const initialThemeColor = themeColor;

    // Toggle to dark mode
    const appearanceSection = page.locator('text=/appearance/i').first();
    await appearanceSection.click();
    await page.waitForTimeout(300);

    const darkModeButton = page.getByRole('button', { name: /dark mode/i });
    await darkModeButton.click();
    await page.waitForTimeout(200);

    // Get updated theme-color (should be dark)
    themeColor = await page.evaluate(() => {
      const meta = document.querySelector('meta[name="theme-color"]');
      return meta ? meta.getAttribute('content') : null;
    });

    // Should be a different color than initial (theme changed)
    expect(themeColor).toBeTruthy();
    expect(themeColor).not.toBe(initialThemeColor);
  });

  test('should maintain theme preference in localStorage with correct structure', async ({ page }) => {
    await page.goto('/settings');

    // Toggle to dark mode
    const appearanceSection = page.locator('text=/appearance/i').first();
    await appearanceSection.click();
    await page.waitForTimeout(300);

    const darkModeButton = page.getByRole('button', { name: /dark mode/i });
    await darkModeButton.click();
    await page.waitForTimeout(200);

    // Check localStorage structure
    const storage = await page.evaluate(() => {
      const prefs = localStorage.getItem('mindful-yoga-preferences');
      return prefs ? JSON.parse(prefs) : null;
    });

    // Verify structure
    expect(storage).toBeDefined();
    expect(storage).toHaveProperty('state');
    expect(storage.state).toHaveProperty('theme', 'dark');
    expect(storage.state).toHaveProperty('darkModeTheme'); // Should have dark mode theme selection
    expect(storage.state).toHaveProperty('lightModeTheme'); // Should have light mode theme selection
    expect(storage).toHaveProperty('version'); // Should have version for migrations
  });
});
