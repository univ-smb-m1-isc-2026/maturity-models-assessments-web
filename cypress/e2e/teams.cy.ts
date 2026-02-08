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
          name: "Development Team",
          description: "Core dev team",
          owner: { id: "1", username: "testuser" },
          members: []
        }
      ]
    }).as('getTeams');

    cy.visit('/teams');
  })

  it('should display teams list', () => {
    cy.wait('@getTeams');
    cy.contains('Development Team').should('be.visible');
  });

  it('should create a new team', () => {
    cy.contains('Create New Team').click();
    
    cy.get('#teamName').should('be.visible').type('New QA Team');
    
    cy.intercept('POST', '**/api/teams', {
      statusCode: 200,
      body: {
        message: "Team created successfully!"
      }
    }).as('createTeam');

    cy.intercept('GET', '**/api/teams', {
      statusCode: 200,
      body: [
        {
          id: "team1",
          name: "Development Team",
          description: "Core dev team",
          owner: { id: "1", username: "testuser" },
          members: []
        },
        {
          id: "team2",
          name: "New QA Team",
          description: "",
          owner: { id: "1", username: "testuser" },
          members: []
        }
      ]
    }).as('getTeamsUpdated');

    cy.get('button[type="submit"]').click();
    cy.wait('@createTeam');
    
    cy.contains('New QA Team').should('be.visible');
  });

  it('should navigate to team details and invite member', () => {
    cy.intercept('GET', '**/api/teams', {
      statusCode: 200,
      body: [{
        id: "team1",
        name: "Development Team",
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

    cy.contains('View Details').click();
    cy.wait('@getTeamsDetail');
    
    cy.contains('Development Team').should('be.visible');
    
    // Check for team members in the list
    cy.contains('Test User').parents('li').within(() => {
      cy.contains('PMO').should('be.visible');
      cy.contains('Owner').should('be.visible');
    });

    cy.contains('Invite Member').click();
    cy.get('input[type="email"]').type('newuser@example.com');
    
    cy.intercept('POST', '**/api/teams/team1/invite', {
      statusCode: 200,
      body: { message: "User added to team successfully!" }
    }).as('inviteMember');

    cy.contains('Send Invitation').click();
    cy.wait('@inviteMember');
    cy.contains('User added to team successfully!').should('be.visible');
  });
});
