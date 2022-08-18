describe('Project Management', () => {
  context('Sporos DAO App Projects Pages', () => {
    it(`Should show DAO PMTest projects for account 0xf952a72F39c5Fa22a443200AbE7835128bCb7439`, () => {
      cy.visit('/')
      cy.contains('Connect Wallet').click()
      cy.contains('MetaMask').click()
      cy.get('[data-cy="0xa9b81dbca829594aac0dcae766bb12543eb7b079"]').within(($daoCard) => {
        cy.contains('PMTest2').click()
      })
      cy.contains('Projects')
    });
    it(`Should show Project #112 as Active`, () => {
      cy.get('[data-cy="112"]').within(($projectCard) => {
        cy.contains('#112')
        cy.contains('PM testing')
        cy.contains('Tracking Link')
        cy.contains('Budget: 10000')
        cy.contains('Deadline: Sun, 18 Aug 2222')
        cy.contains('Manager Address: 0x8791f1612453a817919697ffA4895b17F6C77929')
        cy.contains('Active')
      })
    })
    it(`Should show DAO PMTest2 projects for account 0xf952a72F39c5Fa22a443200AbE7835128bCb7439`, () => {
      cy.get('[data-cy="home-button"]').click()
      cy.get('[data-cy="0xe237747055b12f4da323bc559ac8d5eb66aac2f7"]').within(($daoCard) => {
        cy.contains('PMTest2').should('not.exist')
        cy.contains('PMTest').click()
      })
      cy.contains('Projects')
    });
    it(`Should show Project #109 as Expired`, () => {
      cy.get('[data-cy="109"]').within(($projectCard) => {
        cy.contains('#109')
        cy.contains('Record a video')
        cy.contains('Tracking Link')
        cy.contains('Budget: 2872.0')
        cy.contains('Deadline: Thu, 11 Aug 2022')
        cy.contains('Manager Address: 0xf952a72F39c5Fa22a443200AbE7835128bCb7439')
        cy.contains('Expired')
      })
    })
    it(`Should show Project #108 with Tribute button`, () => {
      // set the app clock to a deterministic date
      const now = new Date(2022, 6, 10) // month is 0-indexed
      cy.clock(now)
      cy.get('[data-cy="108"]').within(($projectCard) => {
        cy.contains('#108')
        cy.contains('Demo of PM MVP')
        cy.contains('Tracking Link')
        cy.contains('Budget: 4098.0')
        cy.contains('Deadline: Sat, 20 Aug 2022')
        cy.contains('Manager Address: 0xf952a72F39c5Fa22a443200AbE7835128bCb7439')
        cy.contains('Expired').should('not.exist')
        cy.contains('Tribute')
      })
    })
  })
})