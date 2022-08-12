describe('Puppeteer', () => {
  context('Sporos DAO App home page', () => {
    it.only(`Should connect to home page`, () => {
      cy.visit('/')
      cy.contains('The Launchpad of For-Profit DAOs123')
    })
    it.only(`Should connect to Metamask`, () => {
      cy.visit('/')
      cy.contains('The Launchpad of For-Profit DAOs')
    })
  })
})