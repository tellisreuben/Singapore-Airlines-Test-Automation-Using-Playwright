import type { Locator, Page } from '@playwright/test';

const DEFAULT_TIMEOUT = 5000;

function resolveTimeout(timeout?: number): number {
  if (typeof timeout === 'number') return timeout;
  const fromEnv = process.env.DEFAULT_TIMEOUT;
  return fromEnv ? parseInt(fromEnv, 10) : DEFAULT_TIMEOUT;
}

async function clickElement(locator: Locator, timeout: number = DEFAULT_TIMEOUT): Promise<void> {
  await locator.waitFor({ state: 'visible', timeout });
  await locator.click({ timeout });
}

function waitForElementToBeVisible(locator: Locator, timeout: number = DEFAULT_TIMEOUT): Promise<void> {
  return locator.waitFor({ state: 'visible', timeout });
}

async function getElementWithText(page: Page, textToCompare: string, timeout?: number): Promise<Locator> {
  const resolved = resolveTimeout(timeout);
  const element = page.getByText(textToCompare, { exact: true }).first();
  await element.waitFor({ state: 'visible', timeout: resolved });
  return element;
}

export const objectActions = {
  clickElement,
  getElementWithText,
  waitForElementToBeVisible,
};
