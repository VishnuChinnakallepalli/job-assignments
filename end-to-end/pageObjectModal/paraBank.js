// @ts-check
import { expect } from '@playwright/test';

export class ParaBankPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;

        // ── Home Page ──────────────────────────────────────────────────────────
        this.registerLink = page.getByRole('link', { name: 'Register' });

        // ── Registration Page ──────────────────────────────────────────────────
        this.signingUpHeading = page.getByRole('heading', { name: 'Signing up is easy!' });

        // Personal Info
        this.firstNameInput = page.locator('#customer\\.firstName');
        this.lastNameInput = page.locator('#customer\\.lastName');

        // Address
        this.streetInput = page.locator('#customer\\.address\\.street');
        this.cityInput = page.locator('#customer\\.address\\.city');
        this.stateInput = page.locator('#customer\\.address\\.state');
        this.zipCodeInput = page.locator('#customer\\.address\\.zipCode');

        // Contact
        this.phoneInput = page.locator('#customer\\.phoneNumber');
        this.ssnInput = page.locator('#customer\\.ssn');

        // Login credentials
        this.usernameInput = page.locator('#customer\\.username');
        this.passwordInput = page.locator('#customer\\.password');
        this.confirmPassInput = page.locator('#repeatedPassword');

        // Submit button
        this.registerButton = page.locator('input.button[value="Register"]');

        // ── Post-Registration ──────────────────────────────────────────────────
        // The success page renders: <h1>Welcome <username></h1> inside #rightPanel
        this.welcomeMessage = page.locator('#rightPanel h1');

        // ── Login Form ─────────────────────────────────────────────────────────
        this.loginUsernameInput = page.locator('input[name="username"]');
        this.loginPasswordInput = page.locator('input[name="password"]');
        this.loginButton = page.locator('input[value="Log In"]');

        // ── Accounts Overview ──────────────────────────────────────────────────
        this.accountsOverviewHeader = page.getByRole('heading', { name: 'Accounts Overview' });
        this.logoutLink = page.getByRole('link', { name: 'Log Out' });
        this.accountTableRows = page.locator('#accountTable tbody tr');

        // ── Validation Error Messages ──────────────────────────────────────────
        // Using [id="..."] attribute selector instead of CSS # to avoid dot-escaping issues
        this.firstNameError = page.locator('[id="customer.firstName.errors"]');
        this.lastNameError = page.locator('[id="customer.lastName.errors"]');
        this.streetError = page.locator('[id="customer.address.street.errors"]');
        this.cityError = page.locator('[id="customer.address.city.errors"]');
        this.stateError = page.locator('[id="customer.address.state.errors"]');
        this.zipCodeError = page.locator('[id="customer.address.zipCode.errors"]');
        this.ssnError = page.locator('[id="customer.ssn.errors"]');
        this.usernameError = page.locator('[id="customer.username.errors"]');
        this.passwordError = page.locator('[id="customer.password.errors"]');
        this.confirmPassError = page.locator('[id="repeatedPassword.errors"]');
    }

    // ── Utilities ─────────────────────────────────────────────────────────────

    /**
     * Generates a unique random username on every call.
     * Format: "user_" + 8 random alphanumeric characters (e.g. user_a3fk92xz)
     * @returns {string}
     */
    static generateRandomUsername() {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        const randomPart = Array.from({ length: 6 }, () =>
            chars.charAt(Math.floor(Math.random() * chars.length))
        ).join('');
        const timestamp = Date.now().toString(36);
        return `user_${timestamp}_${randomPart}`;
    }

    /**
     * Returns all valid registration datasets.
     * @param {any[]} signUpData
     * @returns {any[]}
     */
    static getValidUsers(signUpData) {
        return signUpData.filter(user => !user.isInvalid);
    }

    /**
     * Returns one random valid registration dataset.
     * @param {any[]} signUpData
     * @returns {any}
     */
    static getRandomValidUser(signUpData) {
        const validUsers = signUpData.filter(user => !user.isInvalid);
        return validUsers[Math.floor(Math.random() * validUsers.length)];
    }

    /**
     * Returns the invalid registration dataset.
     * @param {any[]} signUpData
     * @returns {any}
     */
    static getInvalidUser(signUpData) {
        return signUpData.find(user => user.isInvalid);
    }
    // ── Navigation ────────────────────────────────────────────────────────────

    async goToHomePage() {
        await this.page.goto('https://parabank.parasoft.com/parabank/index.htm?ConnType=JDBC');
    }

    async clickRegister() {
        await this.registerLink.click();
    }

    // ── Form Actions ──────────────────────────────────────────────────────────

    /**
     * Fills all fields on the registration form.
     * @param {{ firstName: string, lastName: string, street: string, city: string,
     *           state: string, zipCode: string, phone: string, ssn: string,
     *           username: string, password: string, confirmPassword: string }} userData
     */
    async fillRegistrationForm(userData) {
        await this.firstNameInput.click();
        await this.firstNameInput.fill(userData.firstName);

        await this.lastNameInput.click();
        await this.lastNameInput.fill(userData.lastName);

        await this.streetInput.click();
        await this.streetInput.fill(userData.street);

        await this.cityInput.click();
        await this.cityInput.fill(userData.city);

        await this.stateInput.click();
        await this.stateInput.fill(userData.state);

        await this.zipCodeInput.click();
        await this.zipCodeInput.fill(userData.zipCode);

        await this.phoneInput.click();
        await this.phoneInput.fill(userData.phone);

        await this.ssnInput.click();
        await this.ssnInput.fill(userData.ssn);

        await this.usernameInput.click();
        await this.usernameInput.fill(userData.username);

        await this.passwordInput.click();
        await this.passwordInput.fill(userData.password);

        await this.confirmPassInput.click();
        await this.confirmPassInput.fill(userData.confirmPassword);
    }

    async clickRegisterButton() {
        await this.registerButton.click();
    }

    // ── Assertions ────────────────────────────────────────────────────────────

    async verifyRegistrationPageIsVisible() {
        await expect(this.signingUpHeading).toBeVisible();
        await expect(this.firstNameInput).toBeVisible();
        await expect(this.lastNameInput).toBeVisible();
        await expect(this.streetInput).toBeVisible();
        await expect(this.cityInput).toBeVisible();
        await expect(this.stateInput).toBeVisible();
        await expect(this.zipCodeInput).toBeVisible();
        await expect(this.phoneInput).toBeVisible();
        await expect(this.ssnInput).toBeVisible();
        await expect(this.usernameInput).toBeVisible();
        await expect(this.passwordInput).toBeVisible();
        await expect(this.confirmPassInput).toBeVisible();
        await expect(this.registerButton).toBeVisible();
    }

    /**
     * Verifies the welcome message shown after successful registration.
     * @param {string} username
     */
    async verifyWelcomeMessage(username) {
        await expect(this.welcomeMessage).toBeVisible();
        await expect(this.welcomeMessage).toContainText(`Welcome ${username}`);
    }

    /**
     * Verifies all required-field validation errors appear after submitting an empty form.
     */
    async verifyEmptyFormErrors() {
        await expect(this.firstNameError).toBeVisible();
        await expect(this.firstNameError).toHaveText('First name is required.');

        await expect(this.lastNameError).toBeVisible();
        await expect(this.lastNameError).toHaveText('Last name is required.');

        await expect(this.streetError).toBeVisible();
        await expect(this.streetError).toHaveText('Address is required.');

        await expect(this.cityError).toBeVisible();
        await expect(this.cityError).toHaveText('City is required.');

        await expect(this.stateError).toBeVisible();
        await expect(this.stateError).toHaveText('State is required.');

        await expect(this.zipCodeError).toBeVisible();
        await expect(this.zipCodeError).toHaveText('Zip Code is required.');

        await expect(this.ssnError).toBeVisible();
        await expect(this.ssnError).toHaveText('Social Security Number is required.');

        await expect(this.usernameError).toBeVisible();
        await expect(this.usernameError).toHaveText('Username is required.');

        await expect(this.passwordError).toBeVisible();
        await expect(this.passwordError).toHaveText('Password is required.');

        await expect(this.confirmPassError).toBeVisible();
        await expect(this.confirmPassError).toHaveText('Password confirmation is required.');
    }

    /**
     * Verifies that all input fields on the registration form are empty.
     */
    async verifyFormFieldsAreEmpty() {
        await expect(this.firstNameInput).toHaveValue('');
        await expect(this.lastNameInput).toHaveValue('');
        await expect(this.streetInput).toHaveValue('');
        await expect(this.cityInput).toHaveValue('');
        await expect(this.stateInput).toHaveValue('');
        await expect(this.zipCodeInput).toHaveValue('');
        await expect(this.phoneInput).toHaveValue('');
        await expect(this.ssnInput).toHaveValue('');
        await expect(this.usernameInput).toHaveValue('');
        await expect(this.passwordInput).toHaveValue('');
        await expect(this.confirmPassInput).toHaveValue('');
    }

    /**
     * Performs login on the home page.
     * @param {string} username
     * @param {string} password
     */
    async login(username, password) {
        await this.loginUsernameInput.click();
        await this.loginUsernameInput.fill(username);
        await this.loginPasswordInput.click();
        await this.loginPasswordInput.fill(password);
        await this.loginButton.click();
    }

    async verifyAccountsOverviewVisible() {
        await expect(this.accountsOverviewHeader).toBeVisible();
    }

    async logAccountBalances() {
        const rows = this.accountTableRows;
        const rowCount = await rows.count();
        for (let i = 0; i < rowCount; i++) {
            const cells = rows.nth(i).locator('td');
            const cellCount = await cells.count();
            if (cellCount >= 2) {
                const account = await cells.nth(0).textContent();
                const balance = await cells.nth(1).textContent();
                const available = cellCount >= 3 ? await cells.nth(2).textContent() : '';
                console.log(`Account: ${account?.trim()} | Balance: ${balance?.trim()} | Available: ${available?.trim()}`);
            }
        }
    }

    async clickLogout() {
        await this.logoutLink.click();
    }
}
