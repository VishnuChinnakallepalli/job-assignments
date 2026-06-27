// @ts-check
import { test as base } from 'playwright-bdd';
import { ParaBankPage } from '../pageObjectModal/paraBank.js';

export const test = base.extend({
  paraBank: async ({ page }, use) => {
    await use(new ParaBankPage(page));
  },

  // Shared mutable context for passing data between steps within a scenario
  scenarioCtx: async ({}, use) => {
    await use({});
  },
});
