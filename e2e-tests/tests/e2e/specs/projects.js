describe('Project Management', () => {
  context('Sporos DAO App Projects Pages', () => {
    it(`Should connect to Metamask`, () => {
      cy.visit('/')
      cy.contains('Connect Wallet').click()
      cy.contains('MetaMask').click()
      cy.acceptMetamaskAccess().then(connected => {
        expect(connected).to.be.true;
      });
    })
    it(`Should show DAO PMTest projects for account 0xf952a72F39c5Fa22a443200AbE7835128bCb7439`, () => {
      cy.visit('/')
      cy.contains('PMTest').click()
      cy.contains('Projects')
    });
  })
})