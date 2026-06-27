// @ts-check
import { test as base } from 'playwright-bdd';
import { ParaBankPage } from '../pageObjectModal/paraBank.js';

export const test = base.extend({
  // Worker-scoped: one browser tab opened once, reused across all 9 scenarios
  sharedPage: [async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await use(page);
    await context.close();
  }, { scope: 'worker' }],

  // Auto-logout after any scenario that leaves the user signed in
  paraBank: async ({ sharedPage }, use) => {
    const pb = new ParaBankPage(sharedPage);
    await use(pb);
    try {
      const isLoggedIn = await sharedPage
        .getByRole('link', { name: 'Log Out' })
        .isVisible({ timeout: 1000 });
      if (isLoggedIn) await pb.clickLogout();
    } catch (_) {}
  },

  // Shared mutable context for passing data between steps within a scenario
  scenarioCtx: async ({}, use) => {
    await use({});
  },
});
