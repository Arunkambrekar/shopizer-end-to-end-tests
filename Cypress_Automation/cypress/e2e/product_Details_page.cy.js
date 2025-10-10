describe('Product Details Page - Details Tab', () => {

  it('TC01- should display product description and specifications', () => {

    // 1️⃣ Visit product details page (example URL)
    cy.visit('http://localhost:8080/shop/product/chic-vintage-deville.html')

    // 2️⃣ Verify product description
    cy.get('.product-info-tab-content p', { timeout: 10000 })
      .should('be.visible')
      .and('contain.text', 'Chic vintage DeVille')

    // 3️⃣ Verify specifications: Weight, Height, Width, Length
    cy.get('dl.dl-horizontal').within(() => {
      cy.get('dt').eq(0).should('contain.text', 'Weight')
      cy.get('dd').eq(0).should('contain.text', '1')

      cy.get('dt').eq(1).should('contain.text', 'Height')
      cy.get('dd').eq(1).should('contain.text', '17')

      cy.get('dt').eq(2).should('contain.text', 'Width')
      cy.get('dd').eq(2).should('contain.text', '28')

      cy.get('dt').eq(3).should('contain.text', 'Length')
      cy.get('dd').eq(3).should('contain.text', '4')
    })
  })

   it('TC02-should display product details correctly', () => {

    // 1️⃣ Visit product details page
    cy.visit('http://localhost:8080/shop/product/chic-vintage-deville.html')

    // 2️⃣ Verify product name
    cy.get('h1').should('be.visible').and('contain.text', 'Chic vintage DeVille')

    // 3️⃣ Verify product price
    cy.get('#productPrice').should('be.visible')
      .and('contain.text', 'USD60.00')
    cy.get('#productPrice del').should('contain.text', 'USD88.00')

    // 4️⃣ Verify availability
    cy.get('span[itemprop="availability"]').should('be.visible')
      .and('contain.text', '12')

    // 5️⃣ Verify product description
    cy.get('.product-info-tab-content p').should('be.visible')
      .and('contain.text', 'Chic vintage DeVille')

    // 6️⃣ Optional: verify dimensions
    cy.get('dl dt').eq(0).should('contain.text', 'Weight')
    cy.get('dl dd').eq(0).should('contain.text', '1')
  })

  it('TC03 - should add product to cart successfully', () => {
  // Visit the product details page
  cy.visit('http://localhost:8080/shop/product/chic-vintage-deville.html')

  // 1️⃣ Ensure Add to Cart button is visible and click it
  cy.get('button.addToCartButton', { timeout: 10000 })
    .scrollIntoView()
    .should('be.visible')
    .click()

  // 2️⃣ Verify mini cart updated
  cy.get('#miniCartSummary', { timeout: 10000 })
    .should('be.visible')
    .and('contain.text', '1')
})

it('TC04 - should display correct product description and details', () => {
  // Visit the product details page
  cy.visit('http://localhost:8080/shop/product/chic-vintage-deville.html')

  // 1️⃣ Verify product title
  cy.get('.product-simple-content h1', { timeout: 10000 })
    .should('be.visible')
    .and('contain.text', 'Chic vintage DeVille')

  // 2️⃣ Verify product description
  cy.get('.product-info-tab-content p', { timeout: 10000 })
    .should('be.visible')
    .and('contain.text', 'Chic vintage DeVille')

  // 3️⃣ Verify product specifications (Weight, Height, Width, Length)
  cy.get('.product-info-tab-content dl', { timeout: 10000 })
    .should('be.visible')
    .within(() => {
      cy.get('dt').eq(0).should('contain.text', 'Weight')
      cy.get('dd').eq(0).should('contain.text', '1')
      cy.get('dt').eq(1).should('contain.text', 'Height')
      cy.get('dd').eq(1).should('contain.text', '17')
      cy.get('dt').eq(2).should('contain.text', 'Width')
      cy.get('dd').eq(2).should('contain.text', '28')
      cy.get('dt').eq(3).should('contain.text', 'Length')
      cy.get('dd').eq(3).should('contain.text', '4')
    })
})

it('TC05 - should display correct product price and special price', () => {
  // Visit the product details page
  cy.visit('http://localhost:8080/shop/product/chic-vintage-deville.html')

  // 1️⃣ Verify the original price (del)
  cy.get('.product-simple-content h4 del', { timeout: 10000 })
    .should('be.visible')
    .and('contain.text', 'USD88.00')

  // 2️⃣ Verify the special price
  cy.get('.product-simple-content h4 .specialPrice', { timeout: 10000 })
    .should('be.visible')
    .and('contain.text', 'USD60.00')

  // Optional: Verify itemprop price
  cy.get('.specialPrice [itemprop="price"]')
    .should('contain.text', '60.00')
})

it('TC06 - should update mini cart count when product is added', () => {
  // Visit the product details page
  cy.visit('http://localhost:8080/shop/product/chic-vintage-deville.html')

  // 1️⃣ Click Add to Cart button
  cy.get('.addToCartButton', { timeout: 10000 })
    .should('be.visible')
    .click()

  // 2️⃣ Verify mini cart count is updated
  cy.get('#miniCartSummary', { timeout: 10000 })
    .should('be.visible')
    .and(($span) => {
      const text = $span.text().trim()
      expect(text).to.match(/\d+/) // Should contain a number
      expect(parseInt(text)).to.be.greaterThan(0) // At least 1 item
    })
})

it('TC07 - should display product description correctly', () => {
  // Visit the product details page
  cy.visit('http://localhost:8080/shop/product/chic-vintage-deville.html')

  // 1️⃣ Scroll to the first Product Description section
  cy.get('.product-info-detailed', { timeout: 10000 })
    .first()              // only take the first element
    .scrollIntoView()
    .should('be.visible')

  // 2️⃣ Verify Product Description text
  cy.get('.product-info-detailed .tab-pane.active .product-info-tab-content p', { timeout: 10000 })
    .should('be.visible')
    .and('contain.text', 'Chic vintage DeVille')

  // 3️⃣ Verify product dimensions exist (Weight, Height, Width, Length)
  cy.get('.product-info-detailed .tab-pane.active dl', { timeout: 10000 }).within(() => {
    cy.get('dt').should('contain.text', 'Weight')
    cy.get('dt').should('contain.text', 'Height')
    cy.get('dt').should('contain.text', 'Width')
    cy.get('dt').should('contain.text', 'Length')
  })
})

it('TC08 - should display product price correctly', () => {
  // Visit the product details page
  cy.visit('http://localhost:8080/shop/product/chic-vintage-deville.html')

  // 1️⃣ Scroll to the price section
  cy.get('#productPrice', { timeout: 10000 })
    .scrollIntoView()
    .should('be.visible')

  // 2️⃣ Verify regular price (del tag)
  cy.get('#productPrice del')
    .should('be.visible')
    .and('contain.text', 'USD88.00')

  // 3️⃣ Verify special price (span.specialPrice)
  cy.get('#productPrice .specialPrice')
    .should('be.visible')
    .and('contain.text', 'USD60.00')
})

it('TC09 - should display product availability correctly', () => {
  // Visit the product details page
  cy.visit('http://localhost:8080/shop/product/chic-vintage-deville.html')

  // 1️⃣ Scroll to the availability section
  cy.get('.checkbox', { timeout: 10000 })
    .first()
    .scrollIntoView()
    .should('be.visible')

  // 2️⃣ Verify "Available" text is present
  cy.get('.checkbox')
    .first()
    .should('contain.text', 'Available')

  // 3️⃣ Verify stock quantity exists
  cy.get('.checkbox span[itemprop="availability"]')
    .should('exist')
    .and('contain.text', '12')
})

it('TC10 - should display product price correctly', () => {
  // Visit the product details page
  cy.visit('http://localhost:8080/shop/product/chic-vintage-deville.html')

  // 1️⃣ Scroll to the price section
  cy.get('#productPrice', { timeout: 10000 })
    .scrollIntoView()
    .should('be.visible')

  // 2️⃣ Verify original price is shown (strikethrough)
  cy.get('#productPrice del')
    .should('contain.text', 'USD88.00')

  // 3️⃣ Verify discounted price is shown correctly
  cy.get('#productPrice .specialPrice span[itemprop="price"]')
    .should('contain.text', 'USD60.00')
})

it('TC11 - should add product to wishlist successfully', () => {
  // Visit the product details page
  cy.visit('http://localhost:8080/shop/product/chic-vintage-deville.html')

  // 1️⃣ Click on "Add to Wishlist" button
  cy.get('.addToWishlistButton', { timeout: 10000 })
    .should('be.visible')
    .click()

  // 2️⃣ Verify success message or wishlist count update
  cy.get('.wishlist-notification', { timeout: 10000 })
    .should('be.visible')
    .and('contain.text', 'Product added to your wishlist')
})


})
