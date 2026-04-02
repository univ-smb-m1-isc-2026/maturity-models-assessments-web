describe('Teams Dashboard', () => {
  beforeEach(() => {
    const user = {
      id: "1",
      username: "testuser",
      email: "test@example.com",
      roles: ["ROLE_USER"],
      accessToken: "fake-jwt-token"
    };
    localStorage.setItem("user", JSON.stringify(user));

    cy.intercept('GET', '**/api/teams', {
      statusCode: 200,
      body: [
        {
          id: "team1",
          name: "Équipe de développement",
          description: "Équipe cœur produit",
          owner: { id: "1", username: "testuser" },
          members: []
        }
      ]
    }).as('getTeams');

    cy.visit('/teams');
  })

  it('should display teams list', () => {
    cy.wait('@getTeams');
    cy.contains('Équipe de développement').should('be.visible');
  });

  it('should create a new team', () => {
    cy.contains('Créer une équipe').click();

    cy.get('#teamName').should('be.visible').type('Nouvelle équipe QA');

    cy.intercept('POST', '**/api/teams', {
      statusCode: 200,
      body: {
        message: "Équipe créée avec succès !"
      }
    }).as('createTeam');

    cy.intercept('GET', '**/api/teams', {
      statusCode: 200,
      body: [
        {
          id: "team1",
          name: "Équipe de développement",
          description: "Équipe cœur produit",
          owner: { id: "1", username: "testuser" },
          members: []
        },
        {
          id: "team2",
          name: "Nouvelle équipe QA",
          description: "",
          owner: { id: "1", username: "testuser" },
          members: []
        }
      ]
    }).as('getTeamsUpdated');

    cy.get('button[type="submit"]').click();
    cy.wait('@createTeam');

    cy.contains('Nouvelle équipe QA').should('be.visible');
  });

  it('should navigate to team details and invite member', () => {
    cy.intercept('GET', '**/api/teams', {
      statusCode: 200,
      body: [{
        id: "team1",
        name: "Équipe de développement",
        owner: { id: "1", username: "testuser" },
        members: [
          { id: "1", firstName: "Test", lastName: "User", email: "test@example.com", roles: ["ROLE_PMO"] }
        ]
      }]
    }).as('getTeamsDetail');

    cy.intercept('GET', '**/api/models/team/team1', {
      statusCode: 200,
      body: []
    }).as('getTeamModels');

    cy.intercept('GET', '**/api/assessments/team/team1', {
      statusCode: 200,
      body: []
    }).as('getTeamAssessments');

    cy.contains('Voir les détails').click();
    cy.wait('@getTeamsDetail');

    cy.contains('Équipe de développement').should('be.visible');

    cy.contains('Test User').parents('li').within(() => {
      cy.contains('PMO').should('be.visible');
      cy.contains('Propriétaire').should('be.visible');
    });

    cy.contains('Inviter un membre').click();
    cy.get('input[type="email"]').type('newuser@example.com');

    cy.intercept('POST', '**/api/teams/team1/invite', {
      statusCode: 200,
      body: { message: "Membre ajouté à l'équipe avec succès !" }
    }).as('inviteMember');

    cy.contains("Envoyer l'invitation").click();
    cy.wait('@inviteMember');
    cy.contains("Membre ajouté à l'équipe avec succès !").should('be.visible');
  });
});
