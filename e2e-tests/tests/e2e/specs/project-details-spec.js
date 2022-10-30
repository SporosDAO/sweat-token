describe("Project Management", () => {
  before(() => {
    cy.visit("/");
    cy.contains("Connect Wallet").click();
    cy.contains("MetaMask").click();
    cy.acceptMetamaskAccess().then((connected) => {
      expect(connected).to.be.true;
    });
    cy.switchMetamaskAccount("0xf952a72F39c5Fa22a443200AbE7835128bCb7439").then(
      (accountChanged) => {
        expect(accountChanged).to.be.true;
      }
    );
  });
  after(() => {
    cy.disconnectMetamaskWalletFromDapp();
  });
  context("Sporos DAO App Projects Pages", () => {
    it.only(`Should be able to see tributes for a specific project`, () => {
      cy.visit(
        "dao/chain/5/address/0xe237747055b12f4da323bc559ac8d5eb66aac2f7/projects"
      );

      cy.get('[data-testid="106"]').click();
      cy.get('[data-testid="tribute-table"]').within(() => {
        cy.contains("testing tributes");
        cy.contains("0xcc53685363E14914d28f2D37f226618451D4EF4C");
        cy.contains("100.0");
      });
    });
  });
});
