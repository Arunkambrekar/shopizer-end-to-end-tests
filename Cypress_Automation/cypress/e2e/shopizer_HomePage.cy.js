// cypress/e2e/homepage.cy.js

describe('Home Page Tests', () => {

  Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});
  
  it('TC01 - Verify Home Page Loads Successfully', () => {
    // Step 1: Visit Home Page
    cy.visit('http://localhost:8080/shop/');

    // Step 2: Assert Page Title
    cy.title().should('include', 'Vintage');

    // Step 3: Verify Banner is Visible
    cy.get('.logoImage').should('be.visible');

    // Step 4: Verify Featured Items Section Exists
    cy.contains('Featured').should('be.visible');
  });

  it('TC02 - Verify Navigation Menu Items are visible', () => {
  cy.visit('http://localhost:8080'); 

  // Example menu items - adjust selectors/text as per your app
  cy.get('nav').should('be.visible');
  cy.contains('Shop').should('be.visible');
  cy.contains('Contact').should('be.visible');
});

it('TC03 - Verify Search Bar is visible on Homepage', () => {
  cy.visit('http://localhost:8080'); // replace with your Shopizer URL

  cy.get('input[type="text"][name="q"]')  // adjust selector if needed
    .should('be.visible')
    .and('have.attr', 'placeholder', 'Search'); // optional check for placeholder text
});

it('TC04 - Search with valid keyword shows results', () => {
  cy.visit('http://localhost:8080/shop/');

  cy.get('#searchField')
    .should('be.visible')
    .clear()
    .type('vintage{enter}');

  // Expect product list to have items
  cy.get('.list-group-item')
    .should('have.length.greaterThan', 0); // fails if 0
});

// TC05 - Search with invalid keyword should show "No results"
it('TC05 - Search with invalid keyword shows no results', () => {
  cy.visit('http://localhost:8080/shop/');

  // Ensure search bar is visible
  cy.get('#searchField').should('be.visible');

  // Type invalid keyword and press Enter
  cy.get('#searchField').clear().type('qwertyxyz{enter}');

  // Wait for page load
  cy.url().should('include', '/search/search.html');

  // Verify "0 item(s) found" or "No results" message is visible
  cy.contains(/0 item\(s\) found|No results/i).should('be.visible');

  // Ensure no product items are listed
  cy.get('.list-group-item').should('have.length', 0);
});

// TC06 - Verify featured products are displayed on Home Page
// TC06 - Verify featured products are displayed on Home Page
it('TC06 - Featured products should display with name, price, and Add to Cart button', () => {
  cy.visit('http://localhost:8080/shop/');

  // Verify the Featured Items section exists
  cy.get('#featuredItemsContainer').should('be.visible');

  // Verify at least 1 product is displayed
  cy.get('#featuredItemsContainer .product').should('have.length.greaterThan', 0).each(($el) => {
    
    // Product name should be visible
    cy.wrap($el).find('.listing-product-name h3').should('be.visible');

    // Product price should be visible
    cy.wrap($el).find('[itemprop="price"]').should('be.visible');

    // Add to Cart button should be visible
    cy.wrap($el).find('.addToCart').should('be.visible');
  });
});

// TC07 - Verify discounted price is shown correctly
it('TC07 - Discounted products should show old price and special (discounted) price', () => {
  cy.visit('http://localhost:8080/shop/');

  // Find products that have discounted prices
  cy.get('#featuredItemsContainer .product').each(($el) => {
    if ($el.find('del').length > 0) {
      // Old price should be visible
      cy.wrap($el).find('del').should('be.visible');

      // New special price should be visible
      cy.wrap($el).find('.specialPrice').should('be.visible');
    }
  });
});


// TC08 - Verify Add to Cart increases cart count
it('TC08 - Add to Cart increases cart count', () => {
  cy.visit('http://localhost:8080/shop/');

  // Get initial cart count
  cy.get('#miniCartSummary')
    .invoke('text')
    .then((initialCount) => {
      const initial = parseInt(initialCount.trim()) || 0;

      // Click first Add to Cart button
      cy.get('#featuredItemsContainer .product')
        .first()
        .find('.addToCart')
        .click();

      // Verify cart count increased by 1
      cy.get('#miniCartSummary')
        .invoke('text')
        .should((newCount) => {
          const updated = parseInt(newCount.trim()) || 0;
          expect(updated).to.eq(initial + 1);
        });
    });
});

// TC09 - Verify Cart Dropdown shows product details
it('TC09 - Cart dropdown displays product details correctly', () => {
  cy.visit('http://localhost:8080/shop/');

  // Add first featured product to cart
  cy.get('#featuredItemsContainer .product')
    .first()
    .find('.addToCart')
    .click();

  // Handle cookie consent if visible
  cy.get('div.cc-window').then(($banner) => {
    if ($banner.is(':visible')) {
      cy.log('Closing cookie consent banner');
      cy.get('div.cc-window').invoke('remove');
    }
  });

  // Open cart dropdown
  cy.get('.dropdown-toggle').contains('Shopping cart').click({ force: true });

  // Verify product name, price, and quantity inside dropdown
  cy.get('#miniCartDetails').within(() => {
    cy.get('.product-name').should('be.visible');
    cy.get('.price').should('contain', 'USD');
    cy.get('strong').first().should('contain', '1'); // quantity
  });
});


// TC10 - Remove item from cart updates cart correctly
it('TC10 - Remove item from cart updates cart correctly', () => {
  // Prevent Cypress from failing on uncaught JS errors from Shopizer
  Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
  });

  cy.visit('http://localhost:8080/shop/');

  // Close cookie banner if visible
  cy.get('div.cc-window').then(($banner) => {
    if ($banner.is(':visible')) cy.get('div.cc-window').invoke('remove');
  });

  // Add first featured product to cart
  cy.get('#featuredItemsContainer .product')
    .first()
    .find('.addToCart')
    .click();

  // Wait until mini cart updates (AJAX may take time)
  cy.get('#miniCartSummary', { timeout: 10000 }).should(($span) => {
    const count = parseInt($span.text()) || 0;
    expect(count).to.be.greaterThan(0);
  });

  // Visit cart page
  cy.visit('http://localhost:8080/shop/cart/shoppingCart.html');

  // Wait until cart table loads
  cy.get('#mainCartTable tbody tr', { timeout: 10000 }).should('have.length.greaterThan', 0);

  // Capture initial cart row count
  cy.get('#mainCartTable tbody tr').then(($rows) => {
    const initialCount = $rows.length;

    // Click remove on first item
    cy.get('.removeProductIcon').first().click({ force: true });

    // Verify cart row decreased by 1
    cy.get('#mainCartTable tbody tr').should('have.length', initialCount - 1);

    // Verify mini cart summary updated
    cy.get('#miniCartSummary').invoke('text').then((text) => {
      const count = parseInt(text) || 0;
      expect(count).to.eq(Math.max(initialCount - 1, 0));
    });
  });
});

// TC11 - Footer links should be visible (updated)
it('TC11 - Footer links should be visible', () => {
  cy.visit('http://localhost:8080/shop/');

  // Check the footer container is visible
  cy.get('.footer-area').should('be.visible');

  // Verify some important footer links
  const footerLinks = [
    'Home',
    'Contact us',
    'French',
    'Beach bags',
    'Handbags',
    'Laptop Bags',
    'Bags'
  ];

  footerLinks.forEach((link) => {
    cy.get('.footer-area').contains(link).should('be.visible');
  });

  // Check social icons only if they exist
  cy.get('.footer-social').then(($social) => {
    if ($social.find('a.facebook').length > 0) {
      cy.wrap($social)
        .find('a.facebook')
        .should('have.attr', 'href', 'https://www.facebook.com/Shopizer/');
    } else {
      cy.log('Facebook link not present, skipping check');
    }
  });
});


// TC12 - Footer logo should be visible
it('TC12 - Footer logo should be visible', () => {
  cy.visit('http://localhost:8080/shop/');

  // Check footer container
  cy.get('.footer-area').should('be.visible');

  // Verify the footer logo exists and has an image
  cy.get('.footer-logo img')
    .should('be.visible')
    .and(($img) => {
      // Optional: check the src attribute is not empty
      expect($img.attr('src')).to.not.be.empty;
    });
});

it('TC13 - Cart promotion code input should be visible and editable', () => {

});















});


