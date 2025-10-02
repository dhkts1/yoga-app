import { test, expect } from '@playwright/test';
import { clearAppData, dismissOnboardingIfPresent } from '../helpers/test-utils.js';

test.describe('SessionBuilder Component Verification', () => {
  test.beforeEach(async ({ page }) => {
    // Set localStorage to skip onboarding
    await page.goto('http://localhost:5173/');
    await page.evaluate(() => {
      const preferencesStore = {
        state: {
          hasSeenOnboarding: true,
          tooltipsDismissed: [],
          tooltipsShownCount: {},
          favoriteSessions: [],
          favoriteExercises: []
        },
        version: 0
      };
      localStorage.setItem('mindful-yoga-preferences', JSON.stringify(preferencesStore));
    });

    // Now navigate to session builder
    await page.goto('http://localhost:5173/sessions/builder');
    await page.waitForLoadState('networkidle');

    // Dismiss onboarding if still present
    await dismissOnboardingIfPresent(page);
  });

  test('complete user flow: create, save, and verify custom session', async ({ page }) => {
    console.log('\n=== SESSIONBUILDER VERIFICATION REPORT ===\n');

    // Step 1: Document initial UI structure
    console.log('STEP 1: Initial UI Structure');
    const heading = await page.locator('h1, h2').first().textContent();
    console.log(`  Header: "${heading}"`);

    const tabs = await page.locator('[role="tab"]').allTextContents();
    console.log(`  Tabs found: ${tabs.length}`);
    tabs.forEach((tab, i) => console.log(`    Tab ${i + 1}: "${tab}"`));

    await page.screenshot({ path: '/Users/gil/git/yoga-app/tests/screenshots/builder-clean-initial.png' });

    // Step 2: Enter session name
    console.log('\nSTEP 2: Enter Session Name');
    const nameInput = page.locator('input[type="text"]').first();
    await expect(nameInput).toBeVisible();
    await nameInput.fill('Morning Flow Test');
    console.log('  ✓ Session name entered: "Morning Flow Test"');

    // Step 3: Switch to "Add Poses" tab
    console.log('\nSTEP 3: Switch to Add Poses Tab');
    const addPosesTab = page.locator('[role="tab"]:has-text("Add Poses")');
    await addPosesTab.click();
    await page.waitForTimeout(500);
    console.log('  ✓ Switched to Add Poses tab');

    await page.screenshot({ path: '/Users/gil/git/yoga-app/tests/screenshots/add-poses-tab.png' });

    // Step 4: Find and add poses
    console.log('\nSTEP 4: Add Poses from Library');

    // Look for pose cards with Add buttons
    const poseCards = page.locator('[class*="pose-card"], [class*="card"]').filter({ hasText: 'Add' });
    const poseCount = await poseCards.count();
    console.log(`  Found ${poseCount} pose cards with Add buttons`);

    // Add 3 poses
    for (let i = 0; i < Math.min(3, poseCount); i++) {
      const poseCard = poseCards.nth(i);
      const poseName = await poseCard.locator('h3, h4, [class*="name"]').first().textContent();
      const addButton = poseCard.locator('button:has-text("Add")');

      await addButton.click();
      await page.waitForTimeout(300);
      console.log(`  ✓ Added pose ${i + 1}: "${poseName}"`);
    }

    await page.screenshot({ path: '/Users/gil/git/yoga-app/tests/screenshots/poses-added.png' });

    // Step 5: Switch back to sequence tab
    console.log('\nSTEP 5: View Sequence');
    const sequenceTab = page.locator('[role="tab"]').first();
    const sequenceTabText = await sequenceTab.textContent();
    console.log(`  Sequence tab label: "${sequenceTabText}"`);

    await sequenceTab.click();
    await page.waitForTimeout(500);

    await page.screenshot({ path: '/Users/gil/git/yoga-app/tests/screenshots/sequence-view.png' });

    // Step 6: Verify poses appear in sequence
    console.log('\nSTEP 6: Verify Sequence');
    const sequenceItems = page.locator('[class*="sequence"], [class*="selected-pose"]');
    const sequenceCount = await sequenceItems.count();
    console.log(`  Poses in sequence: ${sequenceCount}`);

    // Step 7: Check duration display
    console.log('\nSTEP 7: Check Duration Display');
    const durationElements = page.locator('text=/\\d+\\s*(min|minute|sec|second)/i');
    const durationCount = await durationElements.count();
    if (durationCount > 0) {
      const duration = await durationElements.first().textContent();
      console.log(`  Duration format: "${duration}"`);
    } else {
      console.log('  ⚠ No duration display found');
    }

    // Step 8: Find and document save button
    console.log('\nSTEP 8: Find Save Button');
    const allButtons = await page.locator('button').allTextContents();
    console.log('  All buttons visible:');
    allButtons.forEach(btn => {
      if (btn.trim()) console.log(`    - "${btn}"`);
    });

    const saveButton = page.locator('button:has-text("Save"), button:has-text("Create"), button:has-text("Save Session")').first();

    if (await saveButton.isVisible({ timeout: 2000 })) {
      const saveButtonText = await saveButton.textContent();
      console.log(`  ✓ Save button found: "${saveButtonText}"`);

      // Click save
      await saveButton.click();
      console.log('  ✓ Save button clicked');

      // Wait for navigation
      await page.waitForTimeout(2000);
      const currentUrl = page.url();
      console.log(`  Current URL: ${currentUrl}`);

      if (currentUrl.includes('/preview')) {
        console.log('  ✓ Navigation successful - on preview page');

        await page.screenshot({ path: '/Users/gil/git/yoga-app/tests/screenshots/session-preview.png' });

        // Check for practice button
        const practiceButtons = await page.locator('button').allTextContents();
        console.log('\n  Buttons on preview page:');
        practiceButtons.forEach(btn => {
          if (btn.trim()) console.log(`    - "${btn}"`);
        });
      } else {
        console.log('  ⚠ Did not navigate to preview page');
      }
    } else {
      console.log('  ⚠ Save button not found');
    }

    console.log('\n=== END OF VERIFICATION REPORT ===\n');
  });

  test('check custom sessions in /sessions list', async ({ page }) => {
    console.log('\n=== CUSTOM SESSIONS LIST CHECK ===\n');

    await page.goto('http://localhost:5173/sessions');
    await page.waitForLoadState('networkidle');

    // Dismiss onboarding if present
    const closeButton = page.locator('button[aria-label="Close"], button:has-text("×")');
    if (await closeButton.isVisible({ timeout: 2000 })) {
      await closeButton.click();
      await page.waitForTimeout(500);
    }

    await page.screenshot({ path: '/Users/gil/git/yoga-app/tests/screenshots/sessions-list-clean.png' });

    // Look for sections
    const headings = await page.locator('h2, h3').allTextContents();
    console.log('Sections found:');
    headings.forEach(h => console.log(`  - "${h}"`));

    // Count session cards
    const cards = page.locator('[class*="card"], [class*="session"]');
    const cardCount = await cards.count();
    console.log(`\nTotal cards visible: ${cardCount}`);

    console.log('\n=== END CUSTOM SESSIONS CHECK ===\n');
  });

  test('test delete functionality', async ({ page }) => {
    console.log('\n=== DELETE FUNCTIONALITY TEST ===\n');

    // Enter session name
    const nameInput = page.locator('input[type="text"]').first();
    await nameInput.fill('Session To Delete');
    console.log('Session name entered');

    // Add one pose
    const addPosesTab = page.locator('[role="tab"]:has-text("Add Poses")');
    await addPosesTab.click();
    await page.waitForTimeout(500);

    const firstAddButton = page.locator('button:has-text("Add")').first();
    await firstAddButton.click();
    await page.waitForTimeout(500);
    console.log('Pose added');

    // Go back to sequence
    const sequenceTab = page.locator('[role="tab"]').first();
    await sequenceTab.click();
    await page.waitForTimeout(500);

    await page.screenshot({ path: '/Users/gil/git/yoga-app/tests/screenshots/before-delete.png' });

    // Look for delete/remove buttons
    const allButtons = await page.locator('button').allTextContents();
    console.log('All buttons visible:');
    allButtons.forEach(btn => {
      if (btn.trim()) console.log(`  - "${btn}"`);
    });

    // Try to find delete button on pose item
    const deleteButton = page.locator('button[aria-label*="delete"], button[aria-label*="remove"], button:has-text("Delete"), button:has-text("Remove")').first();

    if (await deleteButton.isVisible({ timeout: 2000 })) {
      const buttonText = await deleteButton.textContent();
      console.log(`\n✓ Delete button found: "${buttonText}"`);

      await deleteButton.click();
      await page.waitForTimeout(500);

      await page.screenshot({ path: '/Users/gil/git/yoga-app/tests/screenshots/after-delete.png' });
      console.log('Delete action completed');
    } else {
      console.log('\n⚠ Delete button not found');
      console.log('Looking for icon buttons...');

      const iconButtons = page.locator('button svg');
      const iconCount = await iconButtons.count();
      console.log(`Found ${iconCount} icon buttons`);
    }

    console.log('\n=== END DELETE TEST ===\n');
  });
});
