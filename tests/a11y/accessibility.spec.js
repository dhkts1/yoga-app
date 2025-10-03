import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Accessibility Test Suite
 *
 * Runs axe-core automated accessibility tests on all major screens
 * to verify WCAG 2.1 AA compliance.
 *
 * Tests for:
 * - Color contrast (4.5:1 for normal text, 3:1 for large text)
 * - ARIA attributes correctness
 * - Keyboard navigation
 * - Focus indicators
 * - Heading hierarchy
 * - Form labels
 * - Image alt text
 */

test.describe('Accessibility Tests (WCAG 2.1 AA)', () => {

  test('Welcome screen should have no accessibility violations', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Sessions screen should have no accessibility violations', async ({ page }) => {
    await page.goto('/sessions');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Practice screen should have no accessibility violations', async ({ page }) => {
    await page.goto('/practice?session=morning-energizer');

    // Wait for practice screen to load (either Play button or practice controls)
    await page.waitForSelector('main', { timeout: 5000 });

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Insights screen should have no accessibility violations', async ({ page }) => {
    await page.goto('/insights');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Settings screen should have no accessibility violations', async ({ page }) => {
    await page.goto('/settings');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Programs screen should have no accessibility violations', async ({ page }) => {
    await page.goto('/programs');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Breathing exercises screen should have no accessibility violations', async ({ page }) => {
    await page.goto('/breathing');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Session builder should have no accessibility violations', async ({ page }) => {
    await page.goto('/sessions/builder');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Pose library should have no accessibility violations', async ({ page }) => {
    await page.goto('/poses');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
