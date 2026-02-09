describe('Navigation and Permissions', () => {
  
  context('As PMO User', () => {
      beforeEach(() => {
        const pmoUser = {
          id: "1",
          username: "pmo",
          email: "pmo@example.com",
          roles: ["ROLE_PMO"],
          accessToken: "fake-jwt-token"
        };
        localStorage.setItem("user", JSON.stringify(pmoUser));
        
        cy.intercept('GET', '**/api/models', {
          statusCode: 200,
          body: [
            { id: "model1", name: "DevOps Maturity", questions: [] },
            { id: "model2", name: "Agile Maturity", questions: [] }
          ]
        }).as('getModels');

        cy.visit('/');
      });

      it('should see Admin Models link', () => {
        cy.get('nav').contains('Admin Models').should('be.visible');
      });

      it('should be able to navigate to Admin Models', () => {
        cy.get('nav').contains('Admin Models').click();
        cy.url().should('include', '/admin/models');
        cy.contains('Maturity Models').should('be.visible');
      });
  });

  context('As Regular Team Member', () => {
    beforeEach(() => {
      const memberUser = {
        id: "2",
        username: "member",
        email: "member@example.com",
        roles: ["ROLE_TEAM_MEMBER"],
        accessToken: "fake-jwt-token"
      };
      localStorage.setItem("user", JSON.stringify(memberUser));
      cy.visit('/');
    });

    it('should NOT see Admin Models link', () => {
      cy.get('nav').contains('Admin Models').should('not.exist');
    });

    it('should see Teams link', () => {
      cy.get('nav').contains('Teams').should('be.visible');
    });
  });

  context('As Guest (Not Logged In)', () => {
    beforeEach(() => {
        localStorage.clear();
        cy.visit('/');
    });

    it('should verify protected routes redirect to login', () => {
       cy.get('nav').contains('Teams').should('not.exist');
       cy.get('nav').contains('Admin Models').should('not.exist');
       cy.get('nav').contains('Login').should('be.visible');
    });
  });

});
