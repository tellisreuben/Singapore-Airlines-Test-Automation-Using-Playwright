import { type Locator, type Page, expect } from '@playwright/test';

/**
 * Reusable Textbox element helper.
 *
 * Wraps a single input/textarea Locator with the common actions and
 * assertions you repeat across page objects (fill, clear, type, read value,
 * verify state). Every method waits for the control to be visible first and
 * honours the shared timeout convention: an explicit `timeout` arg wins,
 * otherwise `process.env.DEFAULT_TIMEOUT`, otherwise DEFAULT_TIMEOUT.
 *
 * Usage:
 *   const origin = Textbox.from(page, '#flightOrigin1', 'Origin city');
 *   await origin.fill('Sydney');
 *   await origin.verifyValue('Sydney');
 */

const DEFAULT_TIMEOUT = 5000;

function resolveTimeout(timeout?: number): number {
  if (typeof timeout === 'number') return timeout;
  const fromEnv = process.env.DEFAULT_TIMEOUT;
  return fromEnv ? parseInt(fromEnv, 10) : DEFAULT_TIMEOUT;
}

export class Textbox {
  private readonly locator: Locator;
  /** Human-readable name used in assertion messages. */
  readonly name: string;

  constructor(locator: Locator, name = 'textbox') {
    this.locator = locator;
    this.name = name;
  }

  /** Build a Textbox from a page + selector without touching the raw locator. */
  static from(page: Page, selector: string, name?: string): Textbox {
    return new Textbox(page.locator(selector), name ?? selector);
  }

  /** Escape hatch to the underlying Locator for anything not wrapped here. */
  get element(): Locator {
    return this.locator;
  }

  /** Replace the field's contents in one shot (clears, then sets). */
  async fill(value: string, timeout?: number): Promise<void> {
    const t = resolveTimeout(timeout);
    await this.locator.waitFor({ state: 'visible', timeout: t });
    await this.locator.fill(value, { timeout: t });
  }

  /** Empty the field. */
  async clear(timeout?: number): Promise<void> {
    const t = resolveTimeout(timeout);
    await this.locator.waitFor({ state: 'visible', timeout: t });
    await this.locator.clear({ timeout: t });
  }

  /** Type character-by-character (for fields with key-driven autocomplete). */
  async type(value: string, options?: { delay?: number; timeout?: number }): Promise<void> {
    const t = resolveTimeout(options?.timeout);
    await this.locator.waitFor({ state: 'visible', timeout: t });
    await this.locator.pressSequentially(value, { delay: options?.delay, timeout: t });
  }

  /** Current value of the field. */
  async getValue(timeout?: number): Promise<string> {
    const t = resolveTimeout(timeout);
    await this.locator.waitFor({ state: 'visible', timeout: t });
    return this.locator.inputValue({ timeout: t });
  }

  /** True when the field has no value. */
  async isEmpty(timeout?: number): Promise<boolean> {
    return (await this.getValue(timeout)) === '';
  }

  async verifyVisible(timeout?: number): Promise<void> {
    await expect(this.locator, `${this.name} should be visible`)
      .toBeVisible({ timeout: resolveTimeout(timeout) });
  }

  async verifyEditable(timeout?: number): Promise<void> {
    await expect(this.locator, `${this.name} should be editable`)
      .toBeEditable({ timeout: resolveTimeout(timeout) });
  }

  /** Assert the field's value (string for exact, RegExp for partial). */
  async verifyValue(expected: string | RegExp, timeout?: number): Promise<void> {
    await expect(this.locator, `${this.name} should have value "${expected}"`)
      .toHaveValue(expected, { timeout: resolveTimeout(timeout) });
  }
}
