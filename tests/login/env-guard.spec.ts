import { test, expect } from '@playwright/test';

test.describe('Singapore Airlines - Env Var Guard', () => {
  test('.env.staging credentials are loaded and are not placeholders', { tag: ['@login', '@smoke'] }, async () => {
    expect(process.env.BASE_URL, 'BASE_URL must be defined').toBeTruthy();
    expect(process.env.TEST_USERNAME, 'TEST_USERNAME must be defined').toBeTruthy();
    expect(process.env.TEST_PASSWORD, 'TEST_PASSWORD must be defined').toBeTruthy();

    expect(process.env.TEST_USERNAME, 'TEST_USERNAME must not be the placeholder "abc"').not.toBe('abc');
    expect(process.env.TEST_PASSWORD, 'TEST_PASSWORD must not be the placeholder "password"').not.toBe('password');
  });
});
