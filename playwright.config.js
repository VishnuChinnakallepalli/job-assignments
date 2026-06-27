// @ts-check
import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

const testDir = defineBddConfig({
  features: 'end-to-end/features/**/*.feature',
  steps: [
    'end-to-end/fixtures/fixtures.js',
    'end-to-end/step-definitions/**/*.js',
  ],
});

export default defineConfig({
  testDir,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
    launchOptions: {
      slowMo: 100,
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
