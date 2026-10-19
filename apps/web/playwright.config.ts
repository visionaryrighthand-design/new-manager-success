import { defineConfig, devices } from '@playwright/test';
import { existsSync } from 'node:fs';

/**
 * End-to-end tests for the web app.
 *
 * These exist because the unit tests cannot see the thing that actually
 * breaks. Every bug this suite has caught was invisible to `npm test`: a
 * transcript that would not collapse because an author stylesheet outranked
 * the `hidden` attribute, a swipe cue that silently swallowed taps on the
 * last answer, a lesson that exited to the next section two cards before the
 * end so two whole stages were never seen. None of those are logic errors.
 * They are what the browser did with correct logic.
 *
 * Phone-sized by default. The product is phone-first and the one time these
 * ran only at 390px wide, a desktop regression shipped.
 */

/**
 * This machine keeps a browser at a fixed path and blocks the download that
 * would otherwise fetch one. CI installs its own, so the path is used only
 * when it is actually there.
 */
const localChromium = '/opt/pw-browsers/chromium';
const executablePath = existsSync(localChromium) ? localChromium : undefined;

export default defineConfig({
  testDir: './e2e',
  // The lesson feed is stateful and localStorage-backed; tests within a file
  // are ordered and share a page. Files still run in parallel.
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['list']] : [['list']],
  timeout: 60_000,
  expect: { timeout: 10_000 },

  use: {
    baseURL: 'http://localhost:3000',
    viewport: { width: 390, height: 844 },
    launchOptions: { executablePath },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  projects: [{ name: 'phone', use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 } } }],

  /*
   * Serves the production build rather than the dev server. Dev-mode React
   * double-invokes effects and recompiles on navigation, which makes timing
   * assertions flaky for reasons that have nothing to do with the product.
   */
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000/learn/m1-s1',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});
