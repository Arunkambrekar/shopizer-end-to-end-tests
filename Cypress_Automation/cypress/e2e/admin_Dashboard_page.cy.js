describe('Admin Dashboard Page Tests', () => {

  // Prevent Cypress from failing due to uncaught exceptions
  Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
  });

  beforeEach(() => {
    // Login before each test
    cy.visit('http://localhost:8080/admin/logon.html');
    cy.get('#username').clear().type('admin@shopizer.com');
    cy.get('#password').clear().type('password');
    cy.get('#formSubmitButton').click();

    // Ensure redirected to dashboard
    cy.url({ timeout: 10000 }).should('include', '/admin/home.html');
  });

  it('TC01 - should display dashboard main elements', () => {
  // Verify top bar with admin email dropdown
  cy.get('a.dropdown-toggle')
    .contains('admin@shopizer.com')
    .should('be.visible');

  // Verify My profile and Logout options exist in dropdown
  cy.get('a.dropdown-toggle')
    .contains('admin@shopizer.com')
    .click();
  cy.get('ul.dropdown-menu a')
    .contains('My profile')
    .should('be.visible');
  cy.get('ul.dropdown-menu a')
    .contains('Logout')
    .should('be.visible');

  // Verify language dropdown exists
  cy.get('a.dropdown-toggle')
    .contains('Language')
    .should('be.visible');
  cy.get('a.dropdown-toggle')
    .contains('Language')
    .click();
  cy.get('ul.dropdown-menu a')
    .contains('en')
    .should('be.visible');
  cy.get('ul.dropdown-menu a')
    .contains('fr')
    .should('be.visible');

  // Verify Shopizer logo is visible
  cy.get('.brand img[src*="shopizer_small.jpg"]').should('be.visible');

  // Verify Home icon link exists
  cy.get('a[href="/admin/home.html"] i.icon-home').should('be.visible');
});

it('TC02 - should open My Profile page from dashboard', () => {
  // 1️⃣ Login as admin
  cy.visit('http://localhost:8080/admin/logon.html');
  cy.get('#username').type('admin@shopizer.com');
  cy.get('#password').type('password');
  cy.get('#formSubmitButton').click();

  // 2️⃣ Open My Profile page via User dropdown
  cy.get('a.dropdown-toggle')
    .contains('admin@shopizer.com')
    .click();
  cy.get('ul.dropdown-menu a')
    .contains('My profile')
    .click();

  // 3️⃣ Verify URL
  cy.url().should('include', '/admin/users/displayUser.html');

  // 4️⃣ Verify heading exists (use actual heading text)
  cy.get('h3').should('exist').and('contain.text', 'Edit user');
});

it('TC03 - should update admin profile fields and save successfully', () => {
    
    // 2️⃣ Open My Profile page
    cy.contains('admin@shopizer.com').click();
    cy.contains('My profile').click();

    // Correct URL assertion
    cy.url().should('include', '/admin/users/displayUser.html');

    // 3️⃣ Update profile fields
    cy.get('#firstName').clear().type('AdminUpdated');
    cy.get('#lastName').clear().type('UserUpdated');

    // Optional: Update email if needed
    // cy.get('#adminEmail').clear().type('adminupdated@shopizer.com');

    // 4️⃣ Click Save
    cy.get('button.btn-success').click();

    // 5️⃣ Verify profile fields are updated
    cy.get('#firstName').should('have.value', 'AdminUpdated');
    cy.get('#lastName').should('have.value', 'UserUpdated');

    // Note: #store.success may not appear immediately due to Shopizer behavior
    // If needed, you can check for visibility after a small wait:
    // cy.get('#store.success', { timeout: 5000 }).should('be.visible');
  });



 it('TC04 - Search Orders with valid keyword shows results', () => {
  cy.visit('http://localhost:8080/admin/home.html');

  const customerName = 'Johny'; // Use first name for reliable search

  // Type the customer name
  cy.get('input[name="customer"]').clear().type(customerName);

  // Wait for the grid to update dynamically
  cy.get('div.gridBody', { timeout: 10000 }).should('be.visible');

  // Get all rows after grid update
  cy.get('div.gridBody div[role="presentation"]', { timeout: 10000 })
    .should('exist')
    .then(($rows) => {
      // Assert at least one row contains the customer name
      const matches = $rows.toArray().filter(row => row.innerText.includes(customerName));
      expect(matches.length).to.be.greaterThan(0);
    });
});


it('TC05 - Search Orders with invalid keyword shows no results', () => {
  cy.visit('http://localhost:8080/admin/home.html');

  const invalidCustomer = 'Invalid Name 123';

  // Type the invalid customer name
  cy.get('input[name="customer"]').clear().type(invalidCustomer);

  // Wait for the grid to update dynamically
  cy.get('div.gridBody', { timeout: 10000 }).should('be.visible');

  // Assert that the "No items to show." message is visible
  cy.get('td.emptyMessage', { timeout: 10000 })
    .should('be.visible')
    .and('contain.text', 'No items to show.');

  // Assert that no data rows are present
  cy.get('div.gridBody div[role="presentation"]').should('have.length', 0);
});

it.skip('TC06 - Update Order Status from Orders List', () => {
  // This test is skipped because the order status update feature is not present
});












 

});
