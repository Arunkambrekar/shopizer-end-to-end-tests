describe('Home Page Tests', () => {

  Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});
// TC14 - Proceed to Checkout navigates correctly
it('TC14 - Proceed to Checkout navigates correctly', () => {
  cy.visit('http://localhost:8080/shop/');

  // Remove cookie banner if present
  cy.get('div.cc-window').then($banner => {
    if ($banner.length) cy.wrap($banner).invoke('remove');
  });

  // Add first featured product to cart
  cy.get('#featuredItemsContainer .product')
    .first()
    .find('.addToCart')
    .click();

  // Wait for mini-cart to update
  cy.get('#miniCartSummary', { timeout: 10000 }).should($span => {
    const count = parseInt($span.text()) || 0;
    expect(count).to.be.greaterThan(0);
  });

  // Visit cart page
  cy.visit('http://localhost:8080/shop/cart/shoppingCart.html');

  // Remove cookie banner again
  cy.get('div.cc-window').then($banner => {
    if ($banner.length) cy.wrap($banner).invoke('remove');
  });

  // Click Proceed to Checkout (link or button)
  cy.get('.wc-proceed-to-checkout a, .wc-proceed-to-checkout button', { timeout: 10000 })
    .should('be.visible')
    .first()
    .click();

  // Verify checkout URL
  cy.url().should('include', '/shop/order/checkout.html');
});

// TC15 - Billing information form should accept valid inputs
it('TC15 - Billing information form should accept valid inputs', () => {
  cy.visit('http://localhost:8080/shop/');

  // Remove cookie banner
  cy.get('div.cc-window').then($banner => {
    if ($banner.length) cy.wrap($banner).invoke('remove');
  });

  // Add first product to cart
  cy.get('#featuredItemsContainer .product')
    .first()
    .find('.addToCart')
    .click();

  // Wait for mini-cart
  cy.get('#miniCartSummary', { timeout: 10000 }).should($span => {
    const count = parseInt($span.text()) || 0;
    expect(count).to.be.greaterThan(0);
  });

  // Visit cart page
  cy.visit('http://localhost:8080/shop/cart/shoppingCart.html');

  // Remove cookie banner again
  cy.get('div.cc-window').then($banner => {
    if ($banner.length) cy.wrap($banner).invoke('remove');
  });

  // Proceed to checkout
  cy.get('.wc-proceed-to-checkout a, .wc-proceed-to-checkout button', { timeout: 10000 })
    .should('be.visible')
    .first()
    .click();

  // Fill billing info
  cy.get('#customer\\.firstName').clear().type('Arun'); 
  cy.get('#customer\\.lastName').clear().type('Kambrekar'); 
  cy.get('#customer\\.billing\\.address').clear().type('123 Test Street'); 
  cy.get('#customer\\.billing\\.city').clear().type('Quebec'); 
  cy.get('#customer\\.billing\\.country').select('Canada'); 
  cy.get('#billingStateList').select('QC'); 
  cy.get('#billingPostalCode').clear().type('H2H2H2'); 
  cy.get('#customer\\.emailAddress').clear().type('arun.test@example.com'); 
  cy.get('#customer\\.billing\\.phone').clear().type('8888888888');

  // Assert no error
  cy.get('#checkoutError').should('not.exist');
});

// TC16 - Shipping information form should accept valid inputs and submit order
it('TC16 - Shipping information form should accept valid inputs and submit order', () => {
  cy.visit('http://localhost:8080/shop/');

  // Remove cookie banner
  cy.get('div.cc-window').then($banner => {
    if ($banner.length) cy.wrap($banner).invoke('remove');
  });

  // Add first product to cart
  cy.get('#featuredItemsContainer .product')
    .first()
    .find('.addToCart')
    .click();

  // Wait for mini-cart
  cy.get('#miniCartSummary', { timeout: 10000 }).should($span => {
    const count = parseInt($span.text()) || 0;
    expect(count).to.be.greaterThan(0);
  });

  // Visit cart page
  cy.visit('http://localhost:8080/shop/cart/shoppingCart.html');

  // Remove cookie banner again
  cy.get('div.cc-window').then($banner => {
    if ($banner.length) cy.wrap($banner).invoke('remove');
  });

  // Proceed to checkout
  cy.get('.wc-proceed-to-checkout a, .wc-proceed-to-checkout button', { timeout: 10000 })
    .should('be.visible')
    .first()
    .click();

  // Fill billing info
  cy.get('#customer\\.firstName').clear().type('Arun'); 
  cy.get('#customer\\.lastName').clear().type('Kambrekar'); 
  cy.get('#customer\\.billing\\.address').clear().type('123 Test Street'); 
  cy.get('#customer\\.billing\\.city').clear().type('Quebec'); 
  cy.get('#customer\\.billing\\.country').select('Canada'); 
  cy.get('#billingStateList').select('QC'); 
  cy.get('#billingPostalCode').clear().type('H2H2H2'); 
  cy.get('#customer\\.emailAddress').clear().type('arun.test@example.com'); 
  cy.get('#customer\\.billing\\.phone').clear().type('8888888888');

  // Ship to different address
  cy.get('#shipToDeliveryAddress').check({ force: true });

  // Fill shipping info
  cy.get('input[name="customer.delivery.firstName"]').clear().type('Arun');
  cy.get('input[name="customer.delivery.lastName"]').clear().type('Kambrekar');
  cy.get('#customer\\.delivery\\.address').clear().type('456 Delivery Street');
  cy.get('#customer\\.delivery\\.city').clear().type('Montreal');
  cy.get('#customer\\.delivery\\.country').select('Canada');
  cy.get('#deliveryStateList').select('QC');
  cy.get('#deliveryPostalCode').clear().type('H3H3H3');

  // Order notes
  cy.get('#comments').clear().type('Please deliver between 9 AM and 5 PM.');

  // Submit order
  cy.get('#submitOrder', { timeout: 10000 }).should('not.be.disabled').click();

  // Verify order confirmation page
  cy.url().should('include', '/shop/order/commitOrder.html');
  cy.contains('Order Confirmation', { timeout: 10000 }).should('be.visible');
});

});