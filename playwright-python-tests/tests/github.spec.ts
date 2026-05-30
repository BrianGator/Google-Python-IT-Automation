import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/LoginPage';
import { HomePage } from '../page-objects/HomePage';
import { IssuesPage } from '../page-objects/IssuesPage';

// Test 1: Successful Login (Standard passing)
test('Test 01 - Successful Login', async ({ page }) => {
  const login = new LoginPage(page);
  await login.navigate();
  await login.login('qa-test-user', 'SuperSecretPW123!');
  await expect(page).toHaveURL(/github\.com/);
});

// Test 2: Failed Login (Intentional failure - timeout)
test('Test 02 - Failed Login (Intentional Failure)', async ({ page }) => {
  // Forces a timeout because error message does not appear inside 5000ms
  test.setTimeout(5000);
  const login = new LoginPage(page);
  await login.navigate();
  await login.login('wrong-user', 'BadPassword!');
  
  // Custom assertion designed to fail on non-existent element
  await expect(page.locator('.non-existent-error-banner')).toBeVisible({ timeout: 4000 });
});

// Test 3: Password Reset Request Flow
test('Test 03 - Password Reset Request Flow', async ({ page }) => {
  const login = new LoginPage(page);
  await login.navigate();
  await login.forgotLink.click();
  await expect(page).toHaveURL(/password_reset/);
});

// Test 4: Profile Bio Update Workflow
test('Test 04 - Profile Bio Update Workflow', async ({ page }) => {
  await page.goto('https://github.com/settings/profile');
  await page.fill('#user_profile_bio', 'Automated QA Expert.');
  await page.click("button:has-text('Update profile')");
  await expect(page.locator('.flash-success')).toContainText(/profile updated/i);
});

// Test 5: Repository Search Functionality
test('Test 05 - Repository Search Functionality', async ({ page }) => {
  const home = new HomePage(page);
  await home.navigate();
  await home.searchRepo('playwright-python');
  await expect(page).toHaveURL(/results/);
});

// Test 6: Adding a Repository to a Stars List
test('Test 06 - Adding a Repository to a Stars List', async ({ page }) => {
  await page.goto('https://github.com/microsoft/playwright-python');
  await page.click("button:has-text('Star')");
  await expect(page.locator("button:has-text('Unstar')")).toBeVisible();
});

// Test 7: Removing a Repository from a Stars List
test('Test 07 - Removing a Repository from a Stars List', async ({ page }) => {
  await page.goto('https://github.com/microsoft/playwright-python');
  await page.click("button:has-text('Unstar')");
  await expect(page.locator("button:has-text('Star')")).toBeVisible();
});

// Test 8: Repository Creation Flow simulation
test('Test 08 - Repository Creation Flow simulation', async ({ page }) => {
  await page.goto('https://github.com/new');
  await page.fill('#repository_name', 'sandbox-auto-test');
  await page.click("button:has-text('Create repository')");
  await expect(page).toHaveURL(/sandbox-auto-test/);
});

// Test 9: Infinite Scroll on GitHub Explore page
test('Test 09 - Infinite Scroll on GitHub Explore page', async ({ page }) => {
  await page.goto('https://github.com/explore');
  const initialCount = await page.locator('article').count();
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(2000);
  const newCount = await page.locator('article').count();
  expect(newCount).toBeGreaterThanOrEqual(initialCount);
});

// Test 10: Repository Issues Form Validation (Intentional failure)
test('Test 10 - Repository Issues Form Validation', async ({ page }) => {
  const issues = new IssuesPage(page);
  await page.goto('https://github.com/qa-test-user/sandbox-auto-test/issues/new');
  await issues.submitIssue('', 'Missing issue title body descriptor.');
  
  // Custom assertion designed to fail due to mismatched validation labels
  const validationError = page.locator('.blank-validation-error');
  await expect(validationError).toHaveText("Title cannot be blank");
});

// Test 11: Profile Avatar File Upload Interaction
test('Test 11 - Profile Avatar File Upload Interaction', async ({ page }) => {
  await page.goto('https://github.com/settings/profile');
  const fileChooserPromise = page.waitForEvent('filechooser');
  await page.click('.avatar-upload-trigger');
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles('test-results/avatar.png');
  await expect(page.locator('.upload-state-success')).toBeVisible();
});

// Test 12: Delete Repository Confirmation Modal Handling
test('Test 12 - Delete Repository Confirmation Modal Handling', async ({ page }) => {
  await page.goto('https://github.com/qa-test-user/sandbox-auto-test/settings');
  await page.click("button:has-text('Delete this repository')");
  await expect(page.locator('#confirm-delete-dialog')).toBeVisible();
});

// Test 13: Multi-tab Navigation
test('Test 13 - Multi-tab Navigation', async ({ page, context }) => {
  await page.goto('https://github.com/features/actions');
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    page.click("a:has-text('View Docs')")
  ]);
  await newPage.waitForLoadState('networkidle');
  await expect(newPage).toHaveURL(/docs\.github\.com/);
});

// Test 14: API Network Mocking/Interception
test('Test 14 - API Network Mocking/Interception', async ({ page }) => {
  await page.route('**/api/v3/user', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ login: 'mocked-user', id: 99999, bio: 'Intercepted Profile Bio' })
    });
  });
  await page.goto('https://github.com/settings/profile');
  await expect(page.locator('#profile_login_id')).toHaveText('mocked-user');
});

// Test 15: Release Asset File Download Verification
test('Test 15 - Release Asset File Download Verification', async ({ page }) => {
  await page.goto('https://github.com/cli/cli/releases');
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.click("a[href*='gh_linux_amd64.tar.gz']")
  ]);
  expect(download.suggestedFilename()).not.toBeNull();
  expect(download.suggestedFilename().endsWith('.tar.gz')).toBeTruthy();
});

// Test 16: Appearance Settings UI Toggle
test('Test 16 - Appearance Settings UI Toggle', async ({ page }) => {
  await page.goto('https://github.com/settings/appearance');
  await page.click("[value='dark_dimmed']");
  await expect(page.locator('html')).toHaveClass(/theme-dark-dimmed/);
});

// Test 17: Repository Commit History Pagination Navigation
test('Test 17 - Repository Commit History Pagination Navigation', async ({ page }) => {
  await page.goto('https://github.com/microsoft/playwright-python/commits/main');
  const initialSha = await page.locator('.commit-sha').first().textContent();
  await page.click("a:has-text('Older')");
  await page.waitForLoadState('networkidle');
  const nextSha = await page.locator('.commit-sha').first().textContent();
  expect(initialSha).not.toEqual(nextSha);
});

// Test 18: Pull Request Table Column Sorting
test('Test 18 - Pull Request Table Column Sorting', async ({ page }) => {
  await page.goto('https://github.com/microsoft/playwright-python/pulls');
  await page.click("summary:has-text('Sort')");
  await page.click("a:has-text('Oldest')");
  await expect(page).toHaveURL(/sort:created-asc/);
});

// Test 19: Real-time Repository File Tree Filtering
test('Test 19 - Real-time Repository File Tree Filtering', async ({ page }) => {
  await page.goto('https://github.com/microsoft/playwright-python');
  await page.click("a:has-text('Go to file')");
  await page.fill('#tree-finder-field', 'playwright');
  await expect(page.locator('.tree-item-link').first()).toBeVisible();
});

// Test 20: Session State Persistence
test('Test 20 - Session State Persistence', async ({ page, context }) => {
  const cookies = [{ name: 'user_session', value: 'A1B2C3D4', domain: '.github.com', path: '/' }];
  await context.addCookies(cookies);
  await page.goto('https://github.com/');
  await expect(page.locator('img.avatar')).toBeVisible();
});
