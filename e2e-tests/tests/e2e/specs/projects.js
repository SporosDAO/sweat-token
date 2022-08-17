describe('Project Management', () => {
  context('Sporos DAO App Projects Pages', () => {

    before(() => {
      cy.visit('/')
      cy.contains('Connect Wallet').click()
      cy.contains('MetaMask').click()
    })
    it(`Should show DAO PMTest projects for account 0xf952a72F39c5Fa22a443200AbE7835128bCb7439`, () => {
      cy.visit('/')
      cy.contains('PMTest').click()
      cy.contains('Projects')
    });
  })
})