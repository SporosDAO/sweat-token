describe('Project Management', () => {
  before(() => {
    // cy.window.localStorage.debug = 'cypress*'
    cy.visit('/')
    cy.contains('Connect Wallet').click()
    cy.contains('MetaMask').click()
    cy.acceptMetamaskAccess().then(connected => {
      expect(connected).to.be.true;
    })
    cy.switchMetamaskAccount('0xf952a72F39c5Fa22a443200AbE7835128bCb7439').then(accountChanged => {
      expect(accountChanged).to.be.true;
    });
  })
  after(() => {
    cy.disconnectMetamaskWalletFromDapp()
  })
  context('Sporos DAO App Projects Pages', () => {
    it(`Should show DAO PMTest2 projects for account 0xf952a72F39c5Fa22a443200AbE7835128bCb7439`, () => {
      cy.get('[data-testid="0xe237747055b12f4da323bc559ac8d5eb66aac2f7"]').within(($daoCard) => {
        cy.contains('PMTest2').should('not.exist')
        cy.contains('PMTest').click()
      })
      cy.contains('Projects')
    });
    it(`Should proceed to Tribute page for Project #113`, () => {
      cy.get('[data-testid="113"]').within(($projectCard) => {
        cy.contains('#113')
        cy.contains('e2e test aug 20 2022')
        cy.contains('Tracking Link')
        cy.contains('Budget: 2222.0')
        cy.contains('Deadline: Wed, 12 Dec 2323')
        cy.contains('Manager Address: 0xf952a72F39c5Fa22a443200AbE7835128bCb7439')
        cy.get('[data-testid="tribute-button"]').click({force: true})
      })
      cy.contains('Submit tribute for project #113')
    })
    it(`Should require Contributor address, Mint Amount and Tribute Title`, () => {
      cy.get('[data-testid="submit-button"]').click()
      cy.contains('Contributor address is required.')
      cy.contains('Mint amount is required.')
      cy.contains('Tribute title is required.')
    })
  //   it(`Should require open wallet for Tribute contract write`, () => {
  //     cy.get('[data-testid="submit-button"]').click()
  //     cy.get('input[name="contributorAddress"]').type('0xf952a72F39c5Fa22a443200AbE7835128bCb7439')
  //     cy.get('input[name="mintAmount"]').type('12')
  //     cy.get('input[name="tributeTitle"]').type('Add e2e test')
  //     cy.get('input[name="tributeLink"]').type('https://github.com/SporosDAO/sweat-token/issues/116')
  //     cy.get('[data-testid="submit-button"]').click()
  //     cy.rejectMetamaskTransaction()
  //     // https://github.com/Synthetixio/synpress/issues/472
  //     // ERROR: All steps pass to this point however metamask does not seem to communicate with wagmi any further and
  //     // after awhile the browser tab with the app crashes with SIGTERM and core dump
  //  })
  })
})
