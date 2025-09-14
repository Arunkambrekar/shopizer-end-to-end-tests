describe('Shopizer Admin Login', () => {
  it('should login successfully with valid credentials', () => {
    cy.visit('http://localhost:8080/admin'); // Shopizer admin URL
    cy.get('input[name="username"]').type('admin'); // adjust selector if needed
    cy.get('input[name="password"]').type('password'); // replace with actual password
    cy.get('button[type="submit"]').click();

    // Assert dashboard loaded
    cy.url().should('include', '/admin/home.html');
    cy.contains('Dashboard'); 
  });
});
