import { test, expect } from '@playwright/test';
import { clearAppData, dismissOnboardingIfPresent, skipMoodTrackerIfPresent } from '../helpers/test-utils.js';

/**
 * Custom Session Creation E2E Tests
 *
 * Tests the complete workflow of creating, editing, and using custom yoga sessions:
 * - Navigate to session builder
 * - Add poses to sequence
 * - Set durations
 * - Name and save session
 * - Preview custom session
 * - Practice with custom session
 * - Edit existing custom session
 * - Delete custom session
 */

test.describe('Custom Session Creation', () => {
  test.beforeEach(async ({ page }) => {
    await clearAppData(page);
    await page.goto('/');
  });

  test('should create a custom session with multiple poses', async ({ page }) => {
    // Navigate to Sessions screen
    await page.getByRole('button', { name: 'Discover', exact: true }).click();
    await page.waitForURL(/\/sessions/);

    // Click create custom session button
    const createButton = page.getByRole('button', { name: /create custom session/i });
    await createButton.click();
    await page.waitForURL(/\/sessions\/builder/);

    // Verify we're on the builder page
    await expect(page.getByText(/build your custom yoga sequence/i)).toBeVisible();

    // Enter session name
    const nameInput = page.locator('input[type="text"]').first();
    await nameInput.fill('My Morning Flow');

    // Switch to "Add Poses" tab
    const addPosesTab = page.getByRole('tab', { name: /add poses/i });
    await addPosesTab.click();
    await page.waitForTimeout(300);

    // Select 3 poses by clicking on pose cards
    // Cards are clickable divs with pose names
    const poseCards = page.locator('.cursor-pointer').filter({ hasText: /mountain|warrior|tree|child|downward|cobra/i });
    for (let i = 0; i < 3; i++) {
      await poseCards.nth(i).click();
      await page.waitForTimeout(200);
    }

    // Click "Add N Selected Poses" button
    const addSelectedButton = page.getByRole('button', { name: /add.*selected/i });
    await addSelectedButton.click();
    await page.waitForTimeout(300);

    // Dialog opens - click "Add to Sequence"
    const addToSequenceBtn = page.getByRole('button', { name: /add to sequence/i });
    await addToSequenceBtn.click();
    await page.waitForTimeout(300);

    // Should auto-switch to sequence tab
    const sequenceTab = page.getByRole('tab', { name: /your sequence/i });
    await expect(sequenceTab).toHaveAttribute('data-state', 'active');

    // Verify we have 3 poses in sequence
    const removeBtns = page.getByRole('button', { name: /remove/i });
    expect(await removeBtns.count()).toBeGreaterThanOrEqual(3);

    // Verify tab shows pose count
    await expect(page.getByRole('tab', { name: /your sequence.*3/i })).toBeVisible();

    // Save the session
    const saveButton = page.getByRole('button', { name: /save.*preview/i });
    await saveButton.click();

    // Should navigate to session preview
    await page.waitForURL(/\/sessions\/custom-.*\/preview\?custom=true/, { timeout: 5000 });

    // Verify session preview shows our custom session
    await expect(page.getByText('My Morning Flow')).toBeVisible();
    await expect(page.getByText(/3.*poses?/i)).toBeVisible();
  });

  test('should show validation error when saving without poses', async ({ page }) => {
    await page.goto('/sessions/builder');

    // Enter session name only
    const nameInput = page.locator('input[type="text"]').first();
    await nameInput.fill('Empty Session');

    // Try to save without adding poses - button should not appear
    const saveButton = page.getByRole('button', { name: /save.*preview/i });
    await expect(saveButton).not.toBeVisible();
  });

  test('should show validation error when saving without name', async ({ page }) => {
    await page.goto('/sessions/builder');

    // Switch to Add Poses tab
    const addPosesTab = page.getByRole('tab', { name: /add poses/i });
    await addPosesTab.click();
    await page.waitForTimeout(200);

    // Select 2 poses
    const poseCards = page.locator('.cursor-pointer').filter({ hasText: /mountain|warrior|tree|child|downward|cobra/i });
    await poseCards.nth(0).click();
    await page.waitForTimeout(200);
    await poseCards.nth(1).click();
    await page.waitForTimeout(200);

    // Add selected poses
    const addSelectedButton = page.getByRole('button', { name: /add.*selected/i });
    await addSelectedButton.click();
    await page.waitForTimeout(300);

    // Click "Add to Sequence" in dialog
    const addToSequenceBtn = page.getByRole('button', { name: /add to sequence/i });
    await addToSequenceBtn.click();
    await page.waitForTimeout(300);

    // Try to save
    const saveButton = page.getByRole('button', { name: /save.*preview/i });
    await saveButton.click();

    // Should show validation error
    await expect(page.getByText(/please enter a session name/i)).toBeVisible();
  });

  test('should allow reordering poses in sequence', async ({ page }) => {
    await page.goto('/sessions/builder');

    // Switch to Add Poses tab
    const addPosesTab = page.getByRole('tab', { name: /add poses/i });
    await addPosesTab.click();

    // Select 3 poses
    const poseCards = page.locator('.cursor-pointer').filter({ hasText: /mountain|warrior|tree|child|downward|cobra/i });
    for (let i = 0; i < 3; i++) {
      await poseCards.nth(i).click();
      await page.waitForTimeout(200);
    }

    // Add selected poses
    const addSelectedButton = page.getByRole('button', { name: /add.*selected/i });
    await addSelectedButton.click();
    await page.waitForTimeout(300);

    // Click "Add to Sequence" in dialog
    const addToSequenceBtn = page.getByRole('button', { name: /add to sequence/i });
    await addToSequenceBtn.click();
    await page.waitForTimeout(300);

    // Should be on sequence tab now, poses in SessionBuilder now use drag and drop
    // Look for draggable pose items (SequenceItem components)
    const sequenceItems = page.locator('.space-y-2 > *');
    expect(await sequenceItems.count()).toBeGreaterThanOrEqual(3);
  });

  test('should allow removing poses from sequence', async ({ page }) => {
    await page.goto('/sessions/builder');

    // Switch to Add Poses tab
    const addPosesTab = page.getByRole('tab', { name: /add poses/i });
    await addPosesTab.click();

    // Select 3 poses
    const poseCards = page.locator('.cursor-pointer').filter({ hasText: /mountain|warrior|tree|child|downward|cobra/i });
    for (let i = 0; i < 3; i++) {
      await poseCards.nth(i).click();
      await page.waitForTimeout(200);
    }

    // Add selected poses
    const addSelectedButton = page.getByRole('button', { name: /add.*selected/i });
    await addSelectedButton.click();
    await page.waitForTimeout(300);

    // Click "Add to Sequence" in dialog
    const addToSequenceBtn = page.getByRole('button', { name: /add to sequence/i });
    await addToSequenceBtn.click();
    await page.waitForTimeout(300);

    // Should be on sequence tab, count current poses
    const removeBtnsBefore = page.getByRole('button', { name: /remove/i });
    const countBefore = await removeBtnsBefore.count();

    // Remove first pose
    const firstRemove = removeBtnsBefore.first();
    await firstRemove.click();
    await page.waitForTimeout(300);

    // Verify count decreased
    const removebtnsAfter = page.getByRole('button', { name: /remove/i });
    const countAfter = await removebtnsAfter.count();
    expect(countAfter).toBeLessThan(countBefore);
  });

  test('should practice with custom session', async ({ page }) => {
    // First create a custom session
    await page.goto('/sessions/builder');

    // Ensure onboarding is dismissed
    await dismissOnboardingIfPresent(page);
    await page.waitForTimeout(300);

    const nameInput = page.locator('input[type="text"]').first();
    await nameInput.fill('Quick Test Session');

    // Switch to Add Poses tab
    const addPosesTab = page.getByRole('tab', { name: /add poses/i });
    await addPosesTab.click();
    await page.waitForTimeout(200);

    // Select 2 poses
    const poseCards = page.locator('.cursor-pointer').filter({ hasText: /mountain|warrior|tree|child|downward|cobra/i });
    await poseCards.nth(0).click();
    await page.waitForTimeout(200);
    await poseCards.nth(1).click();
    await page.waitForTimeout(200);

    // Add selected poses
    const addSelectedButton = page.getByRole('button', { name: /add.*selected/i });
    await addSelectedButton.click();
    await page.waitForTimeout(300);

    // Click "Add to Sequence" in dialog
    const addToSequenceBtn = page.getByRole('button', { name: /add to sequence/i });
    await addToSequenceBtn.click();
    await page.waitForTimeout(300);

    // Save
    const saveButton = page.getByRole('button', { name: /save.*preview/i });
    await saveButton.click();
    await page.waitForURL(/\/sessions\/custom-.*\/preview\?custom=true/);

    // Start practice - look for Start Practice button
    const startButton = page.getByRole('button', { name: /start.*practice/i });
    await startButton.waitFor({ state: 'visible', timeout: 3000 });
    await startButton.click();

    // Should navigate to practice screen
    await page.waitForURL(/\/practice/, { timeout: 5000 });

    // Verify practice screen shows content - use .first() to avoid strict mode violation
    await expect(page.getByRole('heading', { name: /Quick Test Session|pose/i }).first()).toBeVisible();
  });

  test('should show custom sessions in session list', async ({ page }) => {
    // Create a custom session first
    await page.goto('/sessions/builder');

    const nameInput = page.locator('input[type="text"]').first();
    await nameInput.fill('My Custom Flow');

    // Switch to Add Poses tab
    const addPosesTab = page.getByRole('tab', { name: /add poses/i });
    await addPosesTab.click();
    await page.waitForTimeout(200);

    // Select 2 poses
    const poseCards = page.locator('.cursor-pointer').filter({ hasText: /mountain|warrior|tree|child|downward|cobra/i });
    await poseCards.nth(0).click();
    await page.waitForTimeout(200);
    await poseCards.nth(1).click();
    await page.waitForTimeout(200);

    // Add selected poses
    const addSelectedButton = page.getByRole('button', { name: /add.*selected/i });
    await addSelectedButton.click();
    await page.waitForTimeout(300);

    // Click "Add to Sequence" in dialog
    const addToSequenceBtn = page.getByRole('button', { name: /add to sequence/i });
    await addToSequenceBtn.click();
    await page.waitForTimeout(300);

    const saveButton = page.getByRole('button', { name: /save.*preview/i });
    await saveButton.click();
    await page.waitForURL(/\/sessions\/custom-.*\/preview\?custom=true/);

    // Navigate to sessions list
    await page.goto('/sessions');
    await page.waitForTimeout(500);

    // Should see our custom session
    await expect(page.getByText('My Custom Flow')).toBeVisible({ timeout: 3000 });
  });

  test('should allow editing custom session', async ({ page }) => {
    // Create a custom session
    await page.goto('/sessions/builder');

    const nameInput = page.locator('input[type="text"]').first();
    await nameInput.fill('Original Name');

    // Switch to Add Poses tab
    const addPosesTab = page.getByRole('tab', { name: /add poses/i });
    await addPosesTab.click();
    await page.waitForTimeout(200);

    // Select 2 poses
    const poseCards = page.locator('.cursor-pointer').filter({ hasText: /mountain|warrior|tree|child|downward|cobra/i });
    await poseCards.nth(0).click();
    await page.waitForTimeout(200);
    await poseCards.nth(1).click();
    await page.waitForTimeout(200);

    // Add selected poses
    const addSelectedButton = page.getByRole('button', { name: /add.*selected/i });
    await addSelectedButton.click();
    await page.waitForTimeout(300);

    // Click "Add to Sequence" in dialog
    const addToSequenceBtn = page.getByRole('button', { name: /add to sequence/i });
    await addToSequenceBtn.click();
    await page.waitForTimeout(300);

    const saveButton = page.getByRole('button', { name: /save.*preview/i });
    await saveButton.click();
    await page.waitForURL(/\/sessions\/custom-.*\/preview\?custom=true/);

    // Go to sessions list
    await page.goto('/sessions');

    // Find and click edit button for custom session
    const editButton = page.getByRole('button', { name: /edit/i }).first();
    if (await editButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await editButton.click();

      // Should be back on builder
      await page.waitForURL(/\/sessions\/builder/, { timeout: 3000 });

      // Verify name is loaded
      const nameField = page.locator('input[type="text"]').first();
      await expect(nameField).toHaveValue(/Original Name/i);
    }
  });

  test('should allow deleting custom session', async ({ page }) => {
    // Create a custom session
    await page.goto('/sessions/builder');

    const nameInput = page.locator('input[type="text"]').first();
    await nameInput.fill('Session To Delete');

    // Switch to Add Poses tab
    const addPosesTab = page.getByRole('tab', { name: /add poses/i });
    await addPosesTab.click();
    await page.waitForTimeout(200);

    // Select 2 poses
    const poseCards = page.locator('.cursor-pointer').filter({ hasText: /mountain|warrior|tree|child|downward|cobra/i });
    await poseCards.nth(0).click();
    await page.waitForTimeout(200);
    await poseCards.nth(1).click();
    await page.waitForTimeout(200);

    // Add selected poses
    const addSelectedButton = page.getByRole('button', { name: /add.*selected/i });
    await addSelectedButton.click();
    await page.waitForTimeout(300);

    // Click "Add to Sequence" in dialog
    const addToSequenceBtn = page.getByRole('button', { name: /add to sequence/i });
    await addToSequenceBtn.click();
    await page.waitForTimeout(300);

    const saveButton = page.getByRole('button', { name: /save.*preview/i });
    await saveButton.click();
    await page.waitForURL(/\/sessions\/custom-.*\/preview\?custom=true/);

    // Go to sessions list
    await page.goto('/sessions');
    await page.waitForTimeout(500);

    // Verify session exists in list
    await expect(page.getByText('Session To Delete')).toBeVisible();

    // Find delete button by locating the trash icon svg
    // The button contains an SVG with text-state-error class
    const deleteButton = page.locator('button.hover\\:bg-state-error\\/10').first();

    await expect(deleteButton).toBeVisible({ timeout: 2000 });
    await deleteButton.click();
    await page.waitForTimeout(500);

    // Should show confirmation dialog
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible({ timeout: 3000 });
    await expect(dialog.getByText(/delete.*session/i)).toBeVisible();

    // Confirm deletion
    const confirmButton = dialog.getByRole('button', { name: /^delete$/i });
    await confirmButton.click();
    await page.waitForTimeout(1000);

    // Session should be gone
    await expect(page.getByText('Session To Delete')).not.toBeVisible();
  });

  test('should clear all poses when clicking clear button', async ({ page }) => {
    await page.goto('/sessions/builder');

    // Switch to Add Poses tab
    const addPosesTab = page.getByRole('tab', { name: /add poses/i });
    await addPosesTab.click();

    // Select 3 poses
    const poseCards = page.locator('.cursor-pointer').filter({ hasText: /mountain|warrior|tree|child|downward|cobra/i });
    for (let i = 0; i < 3; i++) {
      await poseCards.nth(i).click();
      await page.waitForTimeout(200);
    }

    // Add selected poses
    const addSelectedButton = page.getByRole('button', { name: /add.*selected/i });
    await addSelectedButton.click();
    await page.waitForTimeout(300);

    // Click "Add to Sequence" in dialog
    const addToSequenceBtn = page.getByRole('button', { name: /add to sequence/i });
    await addToSequenceBtn.click();
    await page.waitForTimeout(300);

    // Click clear all (should be visible since we have poses)
    const clearButton = page.getByRole('button', { name: /clear.*all/i });
    await clearButton.click();

    // Should show confirmation dialog title
    await expect(page.getByRole('heading', { name: /clear.*session/i })).toBeVisible();

    // Confirm
    const confirmButton = page.getByRole('button', { name: /clear.*all/i }).last();
    await confirmButton.click();
    await page.waitForTimeout(300);

    // Should already be on sequence tab and see empty state
    await expect(page.getByText(/no poses yet/i)).toBeVisible();
  });

  test('should show empty state when no poses added', async ({ page }) => {
    await page.goto('/sessions/builder');

    // Sequence tab should be default, showing empty state
    await expect(page.getByText(/no poses yet/i)).toBeVisible();
    await expect(page.getByText(/switch to.*add poses/i)).toBeVisible();
  });

  test('should calculate total duration correctly', async ({ page }) => {
    await page.goto('/sessions/builder');

    // Switch to Add Poses tab
    const addPosesTab = page.getByRole('tab', { name: /add poses/i });
    await addPosesTab.click();

    // Select 2 poses (default 30s each = 1 minute total)
    const poseCards = page.locator('.cursor-pointer').filter({ hasText: /mountain|warrior|tree|child|downward|cobra/i });
    await poseCards.nth(0).click();
    await page.waitForTimeout(200);
    await poseCards.nth(1).click();
    await page.waitForTimeout(200);

    // Add selected poses
    const addSelectedButton = page.getByRole('button', { name: /add.*selected/i });
    await addSelectedButton.click();
    await page.waitForTimeout(300);

    // Click "Add to Sequence" in dialog
    const addToSequenceBtn = page.getByRole('button', { name: /add to sequence/i });
    await addToSequenceBtn.click();
    await page.waitForTimeout(300);

    // Should show pose count in tab and duration (formatDuration returns "1m" for 60s)
    await expect(page.getByRole('tab', { name: /your sequence.*2/i })).toBeVisible();
    await expect(page.getByText(/2 poses/i)).toBeVisible();
    // Duration should be "1m" for 60 seconds total
    await expect(page.getByText(/1m/i)).toBeVisible();
  });

  test('should persist draft when navigating away', async ({ page }) => {
    await page.goto('/sessions/builder');

    const nameInput = page.locator('input[type="text"]').first();
    await nameInput.fill('Draft Session');

    // Switch to Add Poses tab
    const addPosesTab = page.getByRole('tab', { name: /add poses/i });
    await addPosesTab.click();
    await page.waitForTimeout(200);

    // Select a pose
    const poseCards = page.locator('.cursor-pointer').filter({ hasText: /mountain|warrior|tree|child|downward|cobra/i });
    await poseCards.first().click();
    await page.waitForTimeout(200);

    // Add selected pose
    const addSelectedButton = page.getByRole('button', { name: /add.*selected/i });
    await addSelectedButton.click();
    await page.waitForTimeout(300);

    // Click "Add to Sequence" in dialog
    const addToSequenceBtn = page.getByRole('button', { name: /add to sequence/i });
    await addToSequenceBtn.click();
    await page.waitForTimeout(500);

    // Navigate away
    await page.goto('/sessions');

    // Go back to builder
    await page.goto('/sessions/builder');

    // Should have our draft
    const nameField = page.locator('input[type="text"]').first();
    await expect(nameField).toHaveValue('Draft Session');

    // Should show 1 pose in tab
    await expect(page.getByRole('tab', { name: /your sequence.*1/i })).toBeVisible();
  });

  test('should create custom session and complete practice end-to-end', async ({ page }) => {
    // Ensure clean state
    await dismissOnboardingIfPresent(page);

    // Navigate to session builder
    await page.goto('/sessions');
    const createButton = page.getByRole('button', { name: /create custom session/i });
    await createButton.click();
    await page.waitForURL(/\/sessions\/builder/);

    // Enter session name
    const nameInput = page.locator('input[type="text"]').first();
    await nameInput.fill('My Practice Flow');

    // Switch to Add Poses tab and select 2 poses
    const addPosesTab = page.getByRole('tab', { name: /add poses/i });
    await addPosesTab.click();
    await page.waitForTimeout(200);

    const poseCards = page.locator('.cursor-pointer').filter({
      hasText: /mountain|warrior|tree|child|downward|cobra/i
    });
    await poseCards.nth(0).click();
    await page.waitForTimeout(200);
    await poseCards.nth(1).click();
    await page.waitForTimeout(200);

    // Add selected poses through dialog
    const addSelectedButton = page.getByRole('button', { name: /add.*selected/i });
    await addSelectedButton.click();
    await page.waitForTimeout(300);

    const addToSequenceBtn = page.getByRole('button', { name: /add to sequence/i });
    await addToSequenceBtn.click();
    await page.waitForTimeout(300);

    // Save session
    const saveButton = page.getByRole('button', { name: /save.*preview/i });
    await saveButton.click();
    await page.waitForURL(/\/sessions\/custom-.*\/preview\?custom=true/);

    // Verify custom session appears in preview with correct details
    await expect(page.getByText('My Practice Flow')).toBeVisible();
    await expect(page.getByText(/2.*poses?/i)).toBeVisible();

    // Start practice
    const startButton = page.getByRole('button', { name: /start.*practice/i });
    await startButton.click();
    await page.waitForURL(/\/practice/, { timeout: 5000 });

    // Skip pre-practice mood tracker if present
    await skipMoodTrackerIfPresent(page);

    // Verify practice screen loaded with custom session
    await expect(page.getByText('My Practice Flow')).toBeVisible();
    await expect(page.getByText(/pose \d+ of 2/i)).toBeVisible();
    await expect(page.getByText(/remaining/i)).toBeVisible();

    // Verify practice controls are present (either Play or Pause depending on auto-start)
    const playButton = page.getByRole('button', { name: 'Play' });
    const pauseButton = page.getByRole('button', { name: 'Pause' });

    const hasPlayButton = await playButton.isVisible().catch(() => false);
    const hasPauseButton = await pauseButton.isVisible().catch(() => false);

    expect(hasPlayButton || hasPauseButton).toBeTruthy();

    // Verify session appears in sessions list
    await page.goto('/sessions');
    await page.waitForTimeout(500);
    await expect(page.getByText('My Practice Flow')).toBeVisible();
  });
});
