describe('Shopizer Admin Login', () => {
  it('should login successfully and load dashboard', () => {
    // Visit Shopizer Admin page
    cy.visit('http://localhost:8080/admin/');

    // Enter login credentials
    cy.get("#username").type('admin@shopizer.com');
    cy.get("#password").type('password');

    // Click Login
    cy.get("#formSubmitButton").click();

    // Assert Dashboard loaded (check for some text on dashboard)
     cy.url().should('include', '/admin/home.html');
  });
});
