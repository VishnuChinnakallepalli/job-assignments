import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import { test } from '../fixtures/fixtures.js';
import { ParaBankPage } from '../pageObjectModal/paraBank.js';
import signUpData from '../pageObjectModal/tests/data/signUpData.json' assert { type: 'json' };

const { Given, When, Then } = createBdd(test);

const validData = signUpData.filter(d => !d.isInvalid);
const invalidData = signUpData.find(d => d.isInvalid);

// ── Background ─────────────────────────────────────────────────────────────────

Given('the user is on the ParaBank home page', async ({ paraBank }) => {
  await paraBank.goToHomePage();
});

Given('the user clicks on the Register link', async ({ paraBank }) => {
  await paraBank.clickRegister();
});

// ── TC01 ───────────────────────────────────────────────────────────────────────

Then('the Sign Up form should be visible with all required fields', async ({ paraBank }) => {
  await paraBank.verifyRegistrationPageIsVisible();
});

// ── TC02 ───────────────────────────────────────────────────────────────────────

When('the user fills the registration form with random valid details', async ({ paraBank, scenarioCtx }) => {
  const randomIndex = Math.floor(Math.random() * validData.length);
  const userData = validData[randomIndex];
  const username = ParaBankPage.generateRandomUsername();
  scenarioCtx.username = username;
  scenarioCtx.password = userData.password;
  console.log(`Using dataset: "${userData.testCase}" | username: ${username}`);
  await paraBank.fillRegistrationForm({ ...userData, username });
});

When('the user clicks the Register button', async ({ paraBank }) => {
  await paraBank.clickRegisterButton();
});

Then('a welcome message should be displayed for the registered user', async ({ paraBank, scenarioCtx }) => {
  await paraBank.verifyWelcomeMessage(scenarioCtx.username);
});

// ── TC03 ───────────────────────────────────────────────────────────────────────

Then('all required field validation errors should be displayed', async ({ paraBank }) => {
  await paraBank.verifyEmptyFormErrors();
});

// ── TC04 ───────────────────────────────────────────────────────────────────────

When('the user fills the registration form with invalid details', async ({ paraBank, scenarioCtx }) => {
  const username = ParaBankPage.generateRandomUsername();
  scenarioCtx.username = username;
  await paraBank.fillRegistrationForm({ ...invalidData, username });
});

Then('any validation errors on the page should be logged', async ({ page }) => {
  const errorCount = await page.locator('span.error').count();
  if (errorCount === 0) {
    console.log('Observation: No validation errors shown even after submitting invalid details.');
  } else {
    console.log(`Found ${errorCount} error messages on the page.`);
    for (let i = 0; i < errorCount; i++) {
      const errorText = await page.locator('span.error').nth(i).textContent();
      console.log(`Error ${i + 1}: ${errorText}`);
    }
  }
});

// ── TC05 ───────────────────────────────────────────────────────────────────────

When('the user fills the registration form with valid details', async ({ paraBank, scenarioCtx }) => {
  const userData = validData[0];
  const username = ParaBankPage.generateRandomUsername();
  scenarioCtx.username = username;
  scenarioCtx.password = userData.password;
  await paraBank.fillRegistrationForm({ ...userData, username });
});

When('the user refreshes the page', async ({ page }) => {
  await page.reload();
});

Then('all registration form fields should be empty', async ({ paraBank }) => {
  await paraBank.verifyFormFieldsAreEmpty();
});

// ── TC06 ───────────────────────────────────────────────────────────────────────

When('the user fills the registration form with mismatched passwords', async ({ paraBank, scenarioCtx }) => {
  const userData = validData[0];
  const username = ParaBankPage.generateRandomUsername();
  scenarioCtx.username = username;
  await paraBank.fillRegistrationForm({
    ...userData,
    username,
    password: 'VishnuCh@12',
    confirmPassword: 'VishnuChh@12',
  });
});

Then('a password mismatch error should be displayed', async ({ paraBank }) => {
  await expect(paraBank.confirmPassError).toBeVisible();
  await expect(paraBank.confirmPassError).toHaveText('Passwords did not match.');
});

// ── TC07 & TC08 ────────────────────────────────────────────────────────────────

When('the user fills the registration form with the same username', async ({ paraBank, scenarioCtx }) => {
  const userData = validData[0];
  await paraBank.fillRegistrationForm({ ...userData, username: scenarioCtx.username });
});

When('the user logs out', async ({ paraBank }) => {
  await paraBank.clickLogout();
});

When('the user navigates back to the Register page', async ({ paraBank }) => {
  await paraBank.goToHomePage();
  await paraBank.clickRegister();
});

Then('a duplicate username error should be displayed', async ({ paraBank }) => {
  await expect(paraBank.usernameError).toBeVisible();
  await expect(paraBank.usernameError).toHaveText('This username already exists.');
});

// ── TC08 ───────────────────────────────────────────────────────────────────────

When('the user updates to a new unique username', async ({ paraBank, scenarioCtx }) => {
  const newUsername = ParaBankPage.generateRandomUsername();
  scenarioCtx.newUsername = newUsername;
  await paraBank.usernameInput.click();
  await paraBank.usernameInput.fill(newUsername);
});

When('the user re-enters the password fields', async ({ paraBank }) => {
  const userData = validData[0];
  await paraBank.passwordInput.click();
  await paraBank.passwordInput.fill(userData.password);
  await paraBank.confirmPassInput.click();
  await paraBank.confirmPassInput.fill(userData.confirmPassword);
});

Then('a welcome message should be displayed for the new username', async ({ paraBank, scenarioCtx }) => {
  await paraBank.verifyWelcomeMessage(scenarioCtx.newUsername);
});

// ── TC09 ───────────────────────────────────────────────────────────────────────

When('the user navigates to the home page', async ({ paraBank }) => {
  await paraBank.goToHomePage();
});

When('the user logs in with the registered credentials', async ({ paraBank, scenarioCtx }) => {
  await paraBank.login(scenarioCtx.username, scenarioCtx.password);
});

Then('the Accounts Overview page should be visible', async ({ paraBank }) => {
  await paraBank.verifyAccountsOverviewVisible();
});

Then('the account balances should be printed to the console', async ({ paraBank }) => {
  await paraBank.logAccountBalances();
});
