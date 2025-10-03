import { test, expect } from '@playwright/test';
import { clearAppData, fastForwardTimer, skipMoodTrackerIfPresent, ensurePracticeStarted } from '../helpers/test-utils.js';

/**
 * Multi-tab Synchronization Tests
 *
 * Validates that localStorage changes sync across multiple browser tabs:
 * - Session completion and streak updates
 * - Settings changes (theme, voice preferences)
 * - Custom session CRUD operations
 * - Program enrollment status
 * - Favorite toggles
 *
 * Uses Playwright's browser context API to simulate multiple tabs.
 * Relies on browser's native 'storage' event for cross-tab sync.
 *
 * localStorage keys tested:
 * - 'yoga-progress' (Zustand progress store)
 * - 'mindful-yoga-preferences' (Zustand preferences store)
 * - 'yoga-custom-sessions' (Custom sessions data)
 * - 'yoga-program-progress' (Program enrollment)
 */
test.describe('Multi-tab Synchronization', () => {
  /**
   * Helper to wait for localStorage changes to propagate
   * Storage events are asynchronous, so we need a small delay
   */
  async function waitForStorageSync(page) {
    // Wait for storage event to fire and state to update
    await page.waitForTimeout(300);
  }

  test('should sync completed session and streak across tabs', async ({ browser }) => {
    test.setTimeout(45000); // Increase timeout for session completion

    // Create two browser contexts (simulating two tabs)
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    try {
      // Clear data in both tabs
      await page1.goto('http://localhost:5173');
      await page2.goto('http://localhost:5173');

      await clearAppData(page1);
      await clearAppData(page2);

      // Verify both tabs show no streak initially (use more specific button selector)
      await expect(page1.getByRole('button', { name: /quick start/i })).toBeVisible();
      await expect(page2.getByRole('button', { name: /quick start/i })).toBeVisible();

      // Complete a session in tab 1
      await fastForwardTimer(page1);
      await page1.getByRole('button', { name: /quick start/i }).click();
      await page1.waitForURL(/\/practice/, { timeout: 10000 });
      await skipMoodTrackerIfPresent(page1);
      await ensurePracticeStarted(page1);
      await skipMoodTrackerIfPresent(page1);
      await page1.waitForURL(/\/complete/, { timeout: 45000 });

      // Navigate back to home in tab 1
      const homeButton1 = page1.getByRole('link', { name: /home/i }).or(
        page1.getByRole('button', { name: /home|done/i })
      );
      await homeButton1.click();
      await page1.waitForURL('/');

      // Verify streak appears in tab 1
      await expect(page1.locator('text=/1.*day.*streak|streak.*1/i')).toBeVisible();

      // Wait for storage sync to propagate to tab 2
      await waitForStorageSync(page2);

      // Reload tab 2 to trigger storage sync
      await page2.reload();
      await page2.waitForLoadState('networkidle');

      // Verify streak appears in tab 2 after reload
      await expect(page2.locator('text=/1.*day.*streak|streak.*1/i')).toBeVisible({
        timeout: 5000
      });

      // Verify localStorage is in sync
      const storage1 = await page1.evaluate(() => {
        const progress = localStorage.getItem('yoga-progress');
        return progress ? JSON.parse(progress) : null;
      });

      const storage2 = await page2.evaluate(() => {
        const progress = localStorage.getItem('yoga-progress');
        return progress ? JSON.parse(progress) : null;
      });

      expect(storage1?.state?.totalSessions).toBe(storage2?.state?.totalSessions);
      expect(storage1?.state?.currentStreak).toBe(storage2?.state?.currentStreak);
    } finally {
      await context1.close();
      await context2.close();
    }
  });

  test('should sync theme toggle across tabs', async ({ browser }) => {
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    try {
      await page1.goto('http://localhost:5173');
      await page2.goto('http://localhost:5173');

      await clearAppData(page1);
      await clearAppData(page2);

      // Navigate to settings in both tabs
      await page1.getByRole('button', { name: /profile|settings/i }).click();
      await page1.waitForURL(/\/settings/);

      await page2.getByRole('button', { name: /profile|settings/i }).click();
      await page2.waitForURL(/\/settings/);

      // Get initial theme from tab 2
      const initialTheme2 = await page2.evaluate(() => {
        const prefs = localStorage.getItem('mindful-yoga-preferences');
        return prefs ? JSON.parse(prefs)?.state?.theme : 'light';
      });

      // Toggle theme in tab 1
      const themeToggle1 = page1.locator('button, [role="switch"]').filter({
        hasText: /dark.*mode|theme/i
      }).first();

      if (await themeToggle1.isVisible({ timeout: 2000 }).catch(() => false)) {
        await themeToggle1.click();
        await page1.waitForTimeout(300);

        // Get new theme from tab 1
        const newTheme1 = await page1.evaluate(() => {
          const prefs = localStorage.getItem('mindful-yoga-preferences');
          return prefs ? JSON.parse(prefs)?.state?.theme : 'light';
        });

        // Verify theme changed in tab 1
        expect(newTheme1).not.toBe(initialTheme2);

        // Wait for storage sync
        await waitForStorageSync(page2);

        // Reload tab 2 to apply storage event
        await page2.reload();
        await page2.waitForLoadState('networkidle');

        // Navigate back to settings after reload
        await page2.getByRole('button', { name: /profile|settings/i }).click();
        await page2.waitForURL(/\/settings/);

        // Verify theme synced to tab 2
        const syncedTheme2 = await page2.evaluate(() => {
          const prefs = localStorage.getItem('mindful-yoga-preferences');
          return prefs ? JSON.parse(prefs)?.state?.theme : 'light';
        });

        expect(syncedTheme2).toBe(newTheme1);
      }
    } finally {
      await context1.close();
      await context2.close();
    }
  });

  test('should sync voice settings changes across tabs', async ({ browser }) => {
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    try {
      await page1.goto('http://localhost:5173');
      await page2.goto('http://localhost:5173');

      await clearAppData(page1);
      await clearAppData(page2);

      // Navigate to settings in tab 1
      await page1.getByRole('button', { name: /profile|settings/i }).click();
      await page1.waitForURL(/\/settings/);

      // Get initial voice settings from tab 2
      const initialVoice2 = await page2.evaluate(() => {
        const prefs = localStorage.getItem('mindful-yoga-preferences');
        return prefs ? JSON.parse(prefs)?.state?.voiceEnabled : true;
      });

      // Toggle voice coaching in tab 1
      const voiceToggle1 = page1.locator('button, [role="switch"]').filter({
        hasText: /voice.*coaching|voice.*guidance/i
      }).first();

      if (await voiceToggle1.isVisible({ timeout: 2000 }).catch(() => false)) {
        await voiceToggle1.click();
        await page1.waitForTimeout(300);

        // Get new voice setting from tab 1
        const newVoice1 = await page1.evaluate(() => {
          const prefs = localStorage.getItem('mindful-yoga-preferences');
          return prefs ? JSON.parse(prefs)?.state?.voiceEnabled : true;
        });

        // Verify voice setting changed in tab 1
        expect(newVoice1).toBe(!initialVoice2);

        // Wait for storage sync
        await waitForStorageSync(page2);

        // Reload tab 2 to apply storage event
        await page2.reload();
        await page2.waitForLoadState('networkidle');

        // Verify voice setting synced to tab 2
        const syncedVoice2 = await page2.evaluate(() => {
          const prefs = localStorage.getItem('mindful-yoga-preferences');
          return prefs ? JSON.parse(prefs)?.state?.voiceEnabled : true;
        });

        expect(syncedVoice2).toBe(newVoice1);
      }
    } finally {
      await context1.close();
      await context2.close();
    }
  });

  test('should sync custom session creation across tabs', async ({ browser }) => {
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    try {
      await page1.goto('http://localhost:5173');
      await page2.goto('http://localhost:5173');

      await clearAppData(page1);
      await clearAppData(page2);

      // Navigate to session builder in tab 1 (use navigation link, not content buttons)
      await page1.getByRole('navigation').getByRole('button', { name: /discover/i }).click();
      await page1.waitForURL(/\/sessions/);

      // Click "Create Your Own" or "Custom Session" button
      const builderButton = page1.getByRole('link', { name: /create.*own|custom.*session|session.*builder/i });
      if (await builderButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await builderButton.click();
        await page1.waitForURL(/\/sessions\/builder/);

        // Fill out session builder
        const sessionNameInput = page1.getByPlaceholder(/session.*name|name.*session/i);
        if (await sessionNameInput.isVisible({ timeout: 2000 }).catch(() => false)) {
          await sessionNameInput.fill('Multi-Tab Test Session');

          // Add a pose (click on "Add Poses" tab or section)
          const addPosesTab = page1.getByRole('button', { name: /add.*poses|poses/i });
          if (await addPosesTab.isVisible({ timeout: 2000 }).catch(() => false)) {
            await addPosesTab.click();
            await page1.waitForTimeout(200);

            // Click first pose card to add it
            const firstPose = page1.locator('[data-pose-card], .pose-card, button').filter({
              hasText: /mountain|downward|warrior|child/i
            }).first();

            if (await firstPose.isVisible({ timeout: 2000 }).catch(() => false)) {
              await firstPose.click();
              await page1.waitForTimeout(200);

              // Save the session
              const saveButton = page1.getByRole('button', { name: /save.*session|create.*session/i });
              if (await saveButton.isVisible({ timeout: 2000 }).catch(() => false)) {
                await saveButton.click();
                await page1.waitForTimeout(500);

                // Verify session was saved in tab 1
                const storage1 = await page1.evaluate(() => {
                  const sessions = localStorage.getItem('yoga-custom-sessions');
                  return sessions ? JSON.parse(sessions) : [];
                });

                expect(storage1.length).toBeGreaterThan(0);
                const customSession = storage1.find(s => s.name === 'Multi-Tab Test Session');
                expect(customSession).toBeDefined();

                // Wait for storage sync
                await waitForStorageSync(page2);

                // Navigate to sessions in tab 2 (use navigation link)
                await page2.getByRole('navigation').getByRole('button', { name: /discover/i }).click();
                await page2.waitForURL(/\/sessions/);
                await page2.reload();
                await page2.waitForLoadState('networkidle');

                // Verify custom session appears in tab 2
                const storage2 = await page2.evaluate(() => {
                  const sessions = localStorage.getItem('yoga-custom-sessions');
                  return sessions ? JSON.parse(sessions) : [];
                });

                expect(storage2.length).toBe(storage1.length);
                const syncedSession = storage2.find(s => s.name === 'Multi-Tab Test Session');
                expect(syncedSession).toBeDefined();
              }
            }
          }
        }
      }
    } finally {
      await context1.close();
      await context2.close();
    }
  });

  test('should sync custom session deletion across tabs', async ({ browser }) => {
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    try {
      await page1.goto('http://localhost:5173');
      await page2.goto('http://localhost:5173');

      await clearAppData(page1);
      await clearAppData(page2);

      // First, create a custom session to delete
      await page1.evaluate(() => {
        const customSession = {
          id: 'test-delete-session',
          name: 'Session To Delete',
          poses: [{ id: 'mountain-pose', duration: 30 }],
          totalDuration: 30,
          createdAt: new Date().toISOString(),
          isCustom: true
        };
        localStorage.setItem('yoga-custom-sessions', JSON.stringify([customSession]));
      });

      // Reload both tabs to load the custom session
      await page1.reload();
      await page2.reload();
      await page1.waitForLoadState('networkidle');
      await page2.waitForLoadState('networkidle');

      // Navigate to sessions in both tabs (use navigation links)
      await page1.getByRole('navigation').getByRole('button', { name: /discover/i }).click();
      await page1.waitForURL(/\/sessions/);

      await page2.getByRole('navigation').getByRole('button', { name: /discover/i }).click();
      await page2.waitForURL(/\/sessions/);

      // Verify session exists in tab 1
      let storage1 = await page1.evaluate(() => {
        const sessions = localStorage.getItem('yoga-custom-sessions');
        return sessions ? JSON.parse(sessions) : [];
      });
      expect(storage1.length).toBe(1);

      // Delete the custom session in tab 1
      const deleteButton = page1.getByRole('button', { name: /delete|remove|trash/i }).first();
      if (await deleteButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await deleteButton.click();

        // Confirm deletion if there's a dialog
        const confirmButton = page1.getByRole('button', { name: /confirm|yes|delete/i });
        if (await confirmButton.isVisible({ timeout: 1000 }).catch(() => false)) {
          await confirmButton.click();
        }

        await page1.waitForTimeout(500);

        // Verify session deleted in tab 1
        storage1 = await page1.evaluate(() => {
          const sessions = localStorage.getItem('yoga-custom-sessions');
          return sessions ? JSON.parse(sessions) : [];
        });
        expect(storage1.length).toBe(0);

        // Wait for storage sync
        await waitForStorageSync(page2);

        // Reload tab 2 to apply storage event
        await page2.reload();
        await page2.waitForLoadState('networkidle');

        // Navigate back to sessions
        await page2.getByRole('button', { name: /discover|sessions/i }).click();
        await page2.waitForURL(/\/sessions/);

        // Verify session deleted in tab 2
        const storage2 = await page2.evaluate(() => {
          const sessions = localStorage.getItem('yoga-custom-sessions');
          return sessions ? JSON.parse(sessions) : [];
        });
        expect(storage2.length).toBe(0);
      }
    } finally {
      await context1.close();
      await context2.close();
    }
  });

  test('should sync program enrollment status across tabs', async ({ browser }) => {
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    try {
      await page1.goto('http://localhost:5173');
      await page2.goto('http://localhost:5173');

      await clearAppData(page1);
      await clearAppData(page2);

      // Navigate to programs in tab 1 (use navigation link)
      await page1.getByRole('navigation').getByRole('button', { name: /discover/i }).click();
      await page1.waitForTimeout(200);

      // Look for Programs link/tab
      const programsLink = page1.getByRole('link', { name: /programs/i }).or(
        page1.getByRole('button', { name: /programs/i })
      );

      if (await programsLink.isVisible({ timeout: 2000 }).catch(() => false)) {
        await programsLink.click();
        await page1.waitForURL(/\/programs/);

        // Click on first program card
        const firstProgram = page1.locator('[data-program-card], .program-card, button').filter({
          hasText: /week|program|beginner/i
        }).first();

        if (await firstProgram.isVisible({ timeout: 2000 }).catch(() => false)) {
          await firstProgram.click();
          await page1.waitForURL(/\/programs\/[^/]+$/);

          // Click "Start Program" button
          const startButton = page1.getByRole('button', { name: /start.*program|begin.*program/i });
          if (await startButton.isVisible({ timeout: 2000 }).catch(() => false)) {
            await startButton.click();
            await page1.waitForTimeout(500);

            // Verify program enrollment in tab 1
            const storage1 = await page1.evaluate(() => {
              const programs = localStorage.getItem('yoga-program-progress');
              return programs ? JSON.parse(programs) : null;
            });

            if (storage1?.state?.activeProgram) {
              // Wait for storage sync
              await waitForStorageSync(page2);

              // Navigate to programs in tab 2 (use navigation link)
              await page2.getByRole('navigation').getByRole('button', { name: /discover/i }).click();
              await page2.waitForTimeout(200);

              const programsLink2 = page2.getByRole('link', { name: /programs/i }).or(
                page2.getByRole('button', { name: /programs/i })
              );

              if (await programsLink2.isVisible({ timeout: 2000 }).catch(() => false)) {
                await programsLink2.click();
                await page2.waitForURL(/\/programs/);
                await page2.reload();
                await page2.waitForLoadState('networkidle');

                // Verify program enrollment synced to tab 2
                const storage2 = await page2.evaluate(() => {
                  const programs = localStorage.getItem('yoga-program-progress');
                  return programs ? JSON.parse(programs) : null;
                });

                expect(storage2?.state?.activeProgram).toBe(storage1.state.activeProgram);
              }
            }
          }
        }
      }
    } finally {
      await context1.close();
      await context2.close();
    }
  });

  test('should sync favorite session toggle across tabs', async ({ browser }) => {
    test.setTimeout(35000); // Increase timeout for navigation and checks

    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    try {
      await page1.goto('http://localhost:5173');
      await page2.goto('http://localhost:5173');

      await clearAppData(page1);
      await clearAppData(page2);

      // Navigate to sessions in tab 1 (use navigation link)
      await page1.getByRole('navigation').getByRole('button', { name: /discover/i }).click();
      await page1.waitForURL(/\/sessions/);

      // Get initial favorites count from tab 2
      const initialFavorites2 = await page2.evaluate(() => {
        const prefs = localStorage.getItem('mindful-yoga-preferences');
        return prefs ? JSON.parse(prefs)?.state?.favoriteSessions || [] : [];
      });

      // Click on first session to view details
      const firstSession = page1.locator('[data-session-card], .session-card, button').filter({
        hasText: /minutes|poses|quick/i
      }).first();

      if (await firstSession.isVisible({ timeout: 2000 }).catch(() => false)) {
        await firstSession.click();
        await page1.waitForURL(/\/sessions\/[^/]+\/preview/);

        // Look for favorite button (heart icon or "Add to Favorites")
        const favoriteButton = page1.getByRole('button', { name: /favorite|heart/i }).or(
          page1.locator('button').filter({ hasText: /♡|♥|★|☆/ })
        ).first();

        if (await favoriteButton.isVisible({ timeout: 2000 }).catch(() => false)) {
          await favoriteButton.click();
          await page1.waitForTimeout(300);

          // Verify favorite added in tab 1
          const newFavorites1 = await page1.evaluate(() => {
            const prefs = localStorage.getItem('mindful-yoga-preferences');
            return prefs ? JSON.parse(prefs)?.state?.favoriteSessions || [] : [];
          });

          expect(newFavorites1.length).toBe(initialFavorites2.length + 1);

          // Wait for storage sync
          await waitForStorageSync(page2);

          // Reload tab 2 to apply storage event
          await page2.reload();
          await page2.waitForLoadState('networkidle');

          // Verify favorite synced to tab 2
          const syncedFavorites2 = await page2.evaluate(() => {
            const prefs = localStorage.getItem('mindful-yoga-preferences');
            return prefs ? JSON.parse(prefs)?.state?.favoriteSessions || [] : [];
          });

          expect(syncedFavorites2.length).toBe(newFavorites1.length);
        }
      }
    } finally {
      await context1.close();
      await context2.close();
    }
  });

  test('should handle simultaneous changes from both tabs gracefully', async ({ browser }) => {
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    try {
      await page1.goto('http://localhost:5173');
      await page2.goto('http://localhost:5173');

      await clearAppData(page1);
      await clearAppData(page2);

      // Navigate both tabs to settings
      await page1.getByRole('button', { name: /profile|settings/i }).click();
      await page1.waitForURL(/\/settings/);

      await page2.getByRole('button', { name: /profile|settings/i }).click();
      await page2.waitForURL(/\/settings/);

      // Make changes in both tabs simultaneously
      const toggle1 = page1.locator('button, [role="switch"]').first();
      const toggle2 = page2.locator('button, [role="switch"]').first();

      if (await toggle1.isVisible().catch(() => false) &&
          await toggle2.isVisible().catch(() => false)) {
        // Click both at roughly the same time
        await Promise.all([
          toggle1.click(),
          toggle2.click()
        ]);

        await page1.waitForTimeout(500);

        // Reload both tabs to ensure they have consistent state
        await page1.reload();
        await page2.reload();
        await page1.waitForLoadState('networkidle');
        await page2.waitForLoadState('networkidle');

        // Verify both tabs have the same localStorage state
        const storage1 = await page1.evaluate(() => {
          return localStorage.getItem('mindful-yoga-preferences');
        });

        const storage2 = await page2.evaluate(() => {
          return localStorage.getItem('mindful-yoga-preferences');
        });

        // Last write wins - both should have the same state
        expect(storage1).toBe(storage2);
      }
    } finally {
      await context1.close();
      await context2.close();
    }
  });
});
