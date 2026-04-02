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
            { id: "model1", name: "Maturité DevOps", questions: [] },
            { id: "model2", name: "Maturité Agile", questions: [] }
          ]
        }).as('getModels');

        cy.visit('/');
      });

      it('should see Admin Models link', () => {
        cy.get('nav').contains('Modèles d\'évaluation').should('be.visible');
      });

      it('should be able to navigate to Admin Models', () => {
        cy.get('nav').contains('Modèles d\'évaluation').click();
        cy.url().should('include', '/admin/models');
        cy.contains('Modèles de maturité').should('be.visible');
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
      cy.get('nav').contains('Modèles d\'évaluation').should('not.exist');
    });

    it('should see Teams link', () => {
      cy.get('nav').contains('Équipes').should('be.visible');
    });
  });

  context('As Guest (Not Logged In)', () => {
    beforeEach(() => {
        localStorage.clear();
        cy.visit('/');
    });

     it('should verify protected routes redirect to login', () => {
       cy.get('nav').contains('Équipes').should('not.exist');
       cy.get('nav').contains('Modèles d\'évaluation').should('not.exist');
       cy.get('nav').contains('Connexion').should('be.visible');
    });
  });

});
