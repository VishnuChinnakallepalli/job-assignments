Feature: ParaBank Sign Up
  As a new user
  I want to register and manage my account on ParaBank
  So that I can access banking services

  Background:
    Given the user is on the ParaBank home page
    And the user clicks on the Register link

  Scenario: TC01 - Verify user can click on Register and see the Sign Up form
    Then the Sign Up form should be visible with all required fields

  Scenario: TC02 - Verify user can fill all required fields and Register successfully
    When the user fills the registration form with random valid details
    And the user clicks the Register button
    Then a welcome message should be displayed for the registered user

  Scenario: TC03 - Verify required field errors are shown when Register is clicked with empty form
    When the user clicks the Register button
    Then all required field validation errors should be displayed

  Scenario: TC04 - Verify behavior when invalid details are entered and submitted
    When the user fills the registration form with invalid details
    And the user clicks the Register button
    Then any validation errors on the page should be logged

  Scenario: TC05 - Verify refreshing the page clears all entered registration details
    When the user fills the registration form with valid details
    And the user refreshes the page
    Then all registration form fields should be empty

  Scenario: TC06 - Verify password mismatch error is shown
    When the user fills the registration form with mismatched passwords
    And the user clicks the Register button
    Then a password mismatch error should be displayed

  Scenario: TC07 - Verify registration with an already registered username shows error
    When the user fills the registration form with valid details
    And the user clicks the Register button
    And the user logs out
    And the user navigates back to the Register page
    And the user fills the registration form with the same username
    And the user clicks the Register button
    Then a duplicate username error should be displayed

  Scenario: TC08 - Verify user can update duplicate username to register successfully
    When the user fills the registration form with valid details
    And the user clicks the Register button
    And the user logs out
    And the user navigates back to the Register page
    And the user fills the registration form with the same username
    And the user clicks the Register button
    Then a duplicate username error should be displayed
    When the user updates to a new unique username
    And the user re-enters the password fields
    And the user clicks the Register button
    Then a welcome message should be displayed for the new username

  Scenario: TC09 - Verify login with registered user credentials
    When the user fills the registration form with valid details
    And the user clicks the Register button
    And the user logs out
    And the user navigates to the home page
    And the user logs in with the registered credentials
    Then the Accounts Overview page should be visible
    And the account balances should be printed to the console
