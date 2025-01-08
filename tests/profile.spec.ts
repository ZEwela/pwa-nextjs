import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

test.describe('Profile Page', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the sign-in page before each test
    await page.goto('/sign-in');
  });

  test('redirects to sign-in when not authenticated', async ({ page }) => {
    await page.goto('/profile');
    await expect(page).toHaveURL('/sign-in');
  });

  test('shows profile page for authenticated regular user', async ({
    page,
  }) => {
    await page.goto('/sign-in');

    // Fill in credentials
    const email = process.env.NEXT_PUBLIC_USER_EMAIL || '';
    const password = process.env.NEXT_PUBLIC_USER_PASSWORD || '';

    if (!email || !password) {
      throw new Error(
        'USER_EMAIL or USER_PASSWORD is not set in environment variables.',
      );
    }

    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');

    // Wait for navigation and verify
    await page.waitForURL('/profile', { timeout: 10000 }); // Increase timeout if needed
    await expect(page).toHaveURL('/profile');

    // Check user details section
    await expect(page.locator('h2')).toContainText('Your user details');

    // Verify Add Event button is not visible
    await expect(page.getByText('Add Event')).not.toBeVisible();
  });

  test('shows admin features for admin user', async ({ page }) => {
    // Fill in credentials
    const email = process.env.NEXT_PUBLIC_ADMIN_EMAIL || '';
    const password = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || '';

    if (!email || !password) {
      console.log('read::: ', email, password);
      throw new Error(
        'ADMIN_EMAIL or ADMIN_PASSWORD is not set in environment variables.',
      );
    }

    // Sign in as admin user using environment variables
    await page.fill(
      'input[name="email"]',
      process.env.NEXT_PUBLIC_ADMIN_EMAIL || '',
    );
    await page.fill(
      'input[name="password"]',
      process.env.NEXT_PUBLIC_ADMIN_PASSWORD || '',
    );
    await page.click('button[type="submit"]');

    // Wait for navigation to profile page
    await expect(page).toHaveURL('/profile');

    // Verify user details section exists
    await expect(page.locator('h2')).toContainText('Your user details');

    // Verify the Add Event button is visible for admin users
    await expect(page.getByText('Add Event')).toBeVisible();

    // Test navigation to add event page
    await page.click('text=Add Event');
    await expect(page).toHaveURL('/profile/add-event');
  });

  test('sign out functionality', async ({ page }) => {
    // Sign in first
    await page.fill(
      'input[name="email"]',
      process.env.NEXT_PUBLIC_ADMIN_EMAIL || '',
    );
    await page.fill(
      'input[name="password"]',
      process.env.NEXT_PUBLIC_ADMIN_PASSWORD || '',
    );
    await page.click('button[type="submit"]');

    // Find and click the sign out button (you'll need to add this to your UI)
    await page.click('button:has-text("Sign Out")');

    // Verify redirect to sign-in page
    await expect(page).toHaveURL('/sign-in');
  });
});
