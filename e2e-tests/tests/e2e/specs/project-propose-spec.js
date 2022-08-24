describe('Project Management', () => {
  before(() => {
    cy.visit('/')
    cy.contains('Connect Wallet').click()
    cy.contains('MetaMask').click()
    cy.acceptMetamaskAccess().then(connected => {
      expect(connected).to.be.true;
    })
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
    it(`Should navigate to Propose Project page`, () => {
      cy.get('[data-testid="cta-button"]').contains("Propose Project").click({ force: true })
      cy.contains('Propose a new project for DAO')
      cy.contains('PMTest (PMT)')
      cy.contains('Manager')
      cy.contains('Budget')
      cy.contains('Deadline')
      cy.contains('Goal')
      cy.contains('Goal Tracking Link')
      cy.contains('Submit')
    })
    it(`Should pre-populate manager field with current user address`, () => {
      cy.get('[data-testid="manager"]').get('input').invoke('val').then(($manager) => {
        cy.expect($manager).equal('0xf952a72F39c5Fa22a443200AbE7835128bCb7439')
      })
    })
    it(`Should require Budget`, () => {
      cy.get('[data-testid="submit-button"]').click()
      cy.contains('Budget must be a positive number.')
    })
    it(`Should require Goal`, () => {
      cy.contains('Goal title is required.')
    })
    it(`Should allow a positive number for Budget`, () => {
      cy.get('input[name="budget"]').type(12)
      cy.get('[data-testid="submit-button"]').click()
      cy.contains('Budget must be a positive number.').should('not.be.true')
    })
    it(`Should not allow a deadline in the past`, () => {
      cy.get('input[name="deadline"]').type('1999-12-31')
      cy.get('[data-testid="submit-button"]').click()
      cy.contains('Deadline must be in the future.')
    })
    // it(`Should proceed to contract write via wallet`, () => {
    //   cy.get('input[name="budget"]').type(12)
    //   cy.get('input[name="goalTitle"]').type('Complete Milestone 10')
    //   cy.get('input[name="deadline"]').type('2222-12-31')
      // https://github.com/Synthetixio/synpress/issues/472
      // cy.get('[data-testid="submit-button"]').click() <<<<<< Synpress/Cypress hangs up here
      // cy.switchToMetamaskWindow()
      // // cy.rejectMetamaskTransaction()
      // cy.switchToCypressWindow()
    //   // cy.contains('Submitting On-chain Transaction!')
    // })
    // it(`Should reject contract write transaction`, () => {
    //   cy.rejectMetamaskTransaction()
    //   cy.contains('User rejected request')
    // })
  })
})
