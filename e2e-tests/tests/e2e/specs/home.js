describe.only('Puppeteer', () => {
  context.only('Sporos DAO App home page', () => {
    it(`Should connect to home page`, () => {
      cy.visit('/')
      cy.contains('The Launchpad of For-Profit DAOs')
    })
    it(`Should connect to Metamask`, () => {
      cy.visit('/')
      cy.contains('The Launchpad of For-Profit DAOs')
    })
    it.only(`Should show DAOs on Goerli for account 0xf952a72F39c5Fa22a443200AbE7835128bCb7439`, () => {
      cy.visit('/')
      cy.contains('Connect Wallet').click()
      cy.contains('MetaMask').click()
      cy.acceptMetamaskAccess().then(connected => {
        expect(connected).to.be.true;
      });
      cy.allowMetamaskToSwitchNetwork()
      cy.changeMetamaskNetwork('goerli').then(networkChanged => {
        expect(networkChanged).to.be.true;
      });
      cy.switchMetamaskAccount('0xf952a72F39c5Fa22a443200AbE7835128bCb7439').then(accountChanged => {
        expect(accountChanged).to.be.true;
      });
      cy.contains('Your DAOs')
      cy.contains('PMTest')
      cy.contains('Symbol: PMT')
      cy.contains('Chain: Goerli')
      cy.contains('Address: 0xe237747055b12f4da323bc559ac8d5eb66aac2f7')
    });
  })
})