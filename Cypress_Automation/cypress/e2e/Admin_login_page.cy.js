describe('Admin Login Page Tests', () => {

  // Prevent Cypress from failing due to uncaught exceptions
  Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
  });

  beforeEach(() => {
    // Visit the admin login page before each test
    cy.visit('http://localhost:8080/admin/logon.html');
  });

  // Placeholder test cases
  it('TC01 - should load the Admin Login page', () => {
    cy.get('#login-box').should('be.visible');
    cy.get('#username').should('be.visible');
    cy.get('#password').should('be.visible');
    cy.get('#formSubmitButton').should('be.visible');
  });

 it('TC02 - should show error with empty credentials', () => {
  // Click Logon without entering username/password
  cy.get('#formSubmitButton').click();

  // Verify that the required field indicators (*) are visible
  cy.get('#username_help')
    .should('be.visible')
    .and('contain.text', '*');

  cy.get('#password_help')
    .should('be.visible')
    .and('contain.text', '*');
});

it('TC03 - should login successfully with valid credentials', () => {
  cy.visit('http://localhost:8080/admin/logon.html');

  cy.get('#username').clear().type('admin@shopizer.com');
  cy.get('#password').clear().type('password');

  cy.get('#formSubmitButton').click();

  // Verify URL includes admin home
  cy.url({ timeout: 10000 }).should('include', '/admin/home.html');

  // Verify username dropdown is visible (login successful)
  cy.get('.nav.pull-right a.dropdown-toggle')
    .should('contain.text', 'admin@shopizer.com');
});

it('TC05 - should show error with invalid credentials', () => {
  cy.get('#username').clear().type('wrong@admin.com');
  cy.get('#password').clear().type('wrongpassword');
  cy.get('#formSubmitButton').click();

  // Check if the error alert is visible and contains correct text
  cy.get('.alert-error')
    .should('be.visible')
    .and('contain.text', 'Invalid username or password');
});

it('TC06 - should mask the password input', () => {
  cy.visit('http://localhost:8080/admin/logon.html');
  cy.get('#password').should('have.attr', 'type', 'password');
});

it('TC07 - should show error for special characters in credentials', () => {
  cy.visit('http://localhost:8080/admin/logon.html');
  cy.get('#username').clear().type('admin@!#$%');
  cy.get('#password').clear().type('pass@!#$%');
  cy.get('#formSubmitButton').click();

  cy.get('.alert-error')
    .should('be.visible')
    .and('contain.text', 'Invalid username or password');
});

it('TC08 - should login using login button (Enter key not applicable)', () => {
  cy.visit('http://localhost:8080/admin/logon.html');

  cy.get('#username').type('admin@shopizer.com');
  cy.get('#password').type('password');

  // Click login button explicitly
  cy.get('#formSubmitButton').click();

  cy.url().should('include', '/admin/home.html');
  cy.get('.nav.pull-right a.dropdown-toggle')
    .should('contain.text', 'admin@shopizer.com');
});

it('TC09 - should keep user logged in after page refresh', () => {
  cy.visit('http://localhost:8080/admin/logon.html');

  cy.get('#username').type('admin@shopizer.com');
  cy.get('#password').type('password');
  cy.get('#formSubmitButton').click();

  // Verify login successful
  cy.url().should('include', '/admin/home.html');

  // Refresh the page
  cy.reload();

  // Verify still logged in
  cy.get('.nav.pull-right a.dropdown-toggle')
    .should('contain.text', 'admin@shopizer.com');
});

it('TC11 - should not allow login with blank password', () => {
  cy.visit('http://localhost:8080/admin/logon.html');

  // Enter only username
  cy.get('#username').type('admin@shopizer.com');

  // Click login
  cy.get('#formSubmitButton').click();

  // Verify red * appears beside password field
  cy.get('#password_help')
    .should('be.visible')
    .and('contain.text', '*');
});







});
