describe('联系销售页面', () => {
  it('contactus submit ', () => {
    cy.visit('https://flashcat.cloud/contact/')
    // cy.get('input[id=name]').type('daily check')
    // cy.get('input[id=company]').type('contact-us page is available')
    // cy.get('input[id=phone]').type('00000000')
    // cy.get('button[type=submit]').click()
    cy.get('div#contactResultModal').should('be.visible').should('have.css', 'display', 'block')
  })
})
