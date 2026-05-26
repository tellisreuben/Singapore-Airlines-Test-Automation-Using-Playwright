import { test, expect } from '@playwright/test';

test.describe('Singapore Airlines - KrisFlyer Login', () => {
  test.beforeEach(async () => {
    expect(process.env.BASE_URL, 'BASE_URL must be set').toBeTruthy();
    expect(process.env.TEST_USERNAME, 'TEST_USERNAME must be set').toBeTruthy();
    expect(process.env.TEST_PASSWORD, 'TEST_PASSWORD must be set').toBeTruthy();
  });

  test('KrisFlyer/PPS Club member can log in and reach a logged-in state', { tag: ['@login', '@smoke'] }, async ({ page, context }) => {
    const baseUrl = process.env.BASE_URL!;
    const username = process.env.TEST_USERNAME!;
    const password = process.env.TEST_PASSWORD!;

    await page.goto(baseUrl, { waitUntil: 'networkidle' });

    const loginButton = page.getByRole('button', { name: 'Log in to access your account' });
    await loginButton.waitFor({ state: 'visible', timeout: 60000 });
    await loginButton.click();

    await page.getByRole('radio', { name: 'KrisFlyer/PPS Club' }).click();
    await page.getByLabel('krisflyernumber').fill(username);
    await page.getByLabel('password').fill(password);

    const submit = page.locator('#loginDetailsSection').getByRole('button', { name: 'Log in' });
    await submit.click();

    await page.waitForLoadState('networkidle');

    await expect(page.locator('#loginDetailsSection'), 'login dialog should close after successful submission')
      .toBeHidden({ timeout: 60000 });

    await expect(loginButton, 'top-right Log in button should disappear once logged in')
      .toBeHidden({ timeout: 60000 });

    const logoutControl = page.getByRole('button', { name: /log\s*out/i })
      .or(page.getByRole('link', { name: /log\s*out/i }))
      .or(page.getByText(/log\s*out/i));
    await expect(logoutControl.first(), 'a Log out control should be available once authenticated')
      .toBeVisible({ timeout: 60000 });

    const errorBanner = page.getByText(/invalid|incorrect|try again/i);
    await expect(errorBanner, 'no login error banner should be present').toHaveCount(0);

    const cookies = await context.cookies();
    const sessionCookie = cookies.find(c =>
      /singaporeair\.com$/i.test(c.domain.replace(/^\./, '')) &&
      /session|jsessionid|auth/i.test(c.name)
    );
    expect(sessionCookie, 'an authenticated session cookie should be set on singaporeair.com').toBeDefined();
    expect(sessionCookie!.value.length, 'session cookie value should be non-empty').toBeGreaterThan(0);
  });
});
