import { test, expect } from '@playwright/test';

const HOME_URL = '/';
const DASHBOARD_URL = '/dashboard';
const ADMIN_PAGES = ['/dashboard', '/orders', '/products', '/categories'];

test.describe('Authentication Flow', () => {
  // Test 1: See login screen or sign in button on homepage
  test('should show sign in button on homepage for unauthenticated users', async ({ page }) => {
    await page.goto(HOME_URL);

    // Adjust selector based on your UI
    const signInButton = page.getByRole('button', { name: /sign in/i });
    await expect(signInButton).toBeVisible();
  });

  // Test 2: Unauthenticated users are redirected away from admin pages
  for (const pagePath of ADMIN_PAGES) {
    test(`should redirect unauthenticated users away from ${pagePath}`, async ({ page }) => {
      await page.goto(pagePath);

      // Adjust this to whatever your redirect destination is, e.g. login page or homepage
      await expect(page).toHaveURL('/auth/signin');
    });
  }

  // Test 3: User can sign in and land on dashboard
  test('should sign in and redirect to dashboard', async ({ page }) => {
    await page.goto(HOME_URL);

    const signInButton = page.getByRole('button', { name: /sign in/i });
    await signInButton.click();

    // Wait for the OAuth login flow or redirect
    // Option 1: If using mocked login, insert mock session before page.goto
    // Option 2: If real login, manually login once and use storageState (see earlier setup)

    // Wait for dashboard
    await page.waitForURL(DASHBOARD_URL);
    await expect(page).toHaveURL(DASHBOARD_URL);
    await expect(page.getByText('Dashbord')).toBeVisible();
  });

  // Test 4: User icon shows name of admin
  test('should show user avatar or name in top right corner after login', async ({ page }) => {
    await page.goto(DASHBOARD_URL);

    // Replace with actual selector logic
    const userIcon = page.locator('header >> [data-testid="user-menu"]'); // customize
    await expect(userIcon).toBeVisible();

    const userName = await userIcon.textContent();
    expect(userName).toMatch('Test Admin'); 
  });

  // Test 5: Can sign out
  test('should sign out and redirect to home or login', async ({ page }) => {
    await page.goto(DASHBOARD_URL);

    const userIcon = page.locator('header >> [data-testid="user-menu"]'); // adjust
    await userIcon.click();

    const signOutOption = page.getByRole('menuitem', { name: /sign out/i });
    await expect(signOutOption).toBeVisible();

    await signOutOption.click();

    // Redirected after sign out
    await expect(page).toHaveURL(/login|sign-in|home/i);

    // Ensure session is cleared
    const signInButton = page.getByRole('button', { name: /sign in/i });
    await expect(signInButton).toBeVisible();
  });
});