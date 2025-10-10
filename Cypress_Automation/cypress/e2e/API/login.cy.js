// describe('Login API Tests', () => {
//   it('should login successfully with valid admin credentials', () => {
//     cy.fixture('apiData').then((data) => {
//       cy.request('POST', '/api/v1/private/login', data.admin).then((response) => {
//         expect(response.status).to.eq(200)
//         expect(response.body).to.have.property('token')  // Shopizer returns JWT
//       })
//     })
//   })

//   it('should fail login with invalid credentials', () => {
//     cy.request({
//       method: 'POST',
//       url: '/api/v1/private/login',
//       body: { email: 'wrong@shopizer.com', password: 'wrongpass' },
//       failOnStatusCode: false
//     }).then((response) => {
//       expect(response.status).to.be.oneOf([400, 401])
//     })
//   })
// })
