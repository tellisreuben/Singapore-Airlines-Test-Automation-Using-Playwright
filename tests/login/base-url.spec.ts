import { test, expect } from '@playwright/test';

test.describe('Singapore Airlines - Base URL', () => {
  test('Base URL is reachable and renders the home page', { tag: ['@homePage', '@smoke'] }, async ({ page }) => {
    const baseUrl = process.env.BASE_URL;

    expect(baseUrl, 'BASE_URL must be defined in .env.staging').toBeTruthy();
    expect(baseUrl?.length ?? 0, 'BASE_URL must not be empty').toBeGreaterThan(0);

    const response = await page.goto(baseUrl!, { waitUntil: 'networkidle' });

    expect(response, 'page.goto should return a response').not.toBeNull();
    expect(response!.status(), 'home page should respond with HTTP 200').toBe(200);

    const normalize = (u: string) => u.replace(/\/$/, '').toLowerCase();
    expect(normalize(page.url())).toContain(normalize(new URL(baseUrl!).host));

    await expect(page).toHaveTitle('Singapore Airlines Official Website | Book International Flight Tickets');

    const loginButton = page.getByRole('button', { name: 'Log in to access your account' });
    await expect(loginButton).toBeVisible({ timeout: 60000 });
  });
});
