import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright E2E Testing Configuration
 *
 * Tests critical user paths:
 * - First time user experience
 * - Quick start flow
 * - Session completion
 * - Data persistence
 * - Session browsing
 *
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./tests",

  // Only run E2E and accessibility tests, exclude Vitest integration tests
  testMatch: ["**/e2e/**/*.spec.js", "**/a11y/**/*.spec.js"],

  // Run tests in parallel for speed
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Use all available cores for maximum speed
  workers: process.env.CI ? 1 : "75%",

  // Test timeout - reduced for faster feedback
  timeout: 20 * 1000, // 20 seconds per test

  // HTML reporter for detailed results
  reporter: "html",

  // Shared settings for all tests
  use: {
    // Base URL to use in actions like `await page.goto('/')`
    baseURL: "http://localhost:5173",

    // Collect trace on first retry for debugging
    trace: "on-first-retry",

    // Screenshots only on failure to keep size manageable
    screenshot: "only-on-failure",

    // Force light mode for accessibility tests (WCAG compliance checked in light mode)
    colorScheme: "light",

    // Viewport size matches mobile-first design
    viewport: { width: 375, height: 667 },

    // Faster timeouts for snappier tests
    actionTimeout: 10000, // 10 seconds for actions
    navigationTimeout: 10000, // 10 seconds for navigation

    // Disable video to save time and space
    video: "off",
  },

  // Configure projects for major browsers and devices
  projects: [
    {
      name: "mobile",
      use: { ...devices["iPhone 13"] },
    },
  ],

  // Run dev server before starting tests
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // 2 minutes for server to start
  },
});
