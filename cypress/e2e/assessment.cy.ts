describe('Assessment View', () => {
  beforeEach(() => {
    const user = {
      id: "2",
      username: "user",
      email: "user@example.com",
      roles: ["ROLE_USER"],
      accessToken: "fake-jwt-token"
    };
    localStorage.setItem("user", JSON.stringify(user));
    cy.intercept('GET', '**/api/assessments/assessment1', {
      statusCode: 200,
      body: {
        id: "assessment1",
        team: {
          id: "team1",
          name: "Test Team",
          owner: { id: "2", email: "user@example.com" },
          members: []
        },
        maturityModel: {
          id: "model1",
          name: "Scrum Maturity Model",
          questions: [
            {
              id: "q1",
              text: "Do you do daily standups?",
              levels: [
                { value: 1, description: "Never" },
                { value: 2, description: "Rarely" },
                { value: 3, description: "Sometimes" },
                { value: 4, description: "Often" },
                { value: 5, description: "Always" }
              ]
            }
          ]
        },
        date: "2023-10-01",
        submissions: []
      }
    }).as('getAssessment');

    cy.visit('/assessments/assessment1');
  })

  it('should take assessment and submit', () => {
    cy.wait('@getAssessment');
    cy.contains('Scrum Maturity Model').should('be.visible');
    
    cy.contains('Do you do daily standups?').should('be.visible');
    
    cy.contains('Level 5').click();
    
    cy.intercept('PUT', '**/api/assessments/assessment1/submit', {
      statusCode: 200,
      body: {
        id: "assessment1",
        submissions: [
            {
                userId: "2",
                answers: [{ questionId: "q1", selectedLevel: 5 }]
            },
            {
                userId: "3",
                answers: [{ questionId: "q1", selectedLevel: 3 }]
            }
        ]
      }
    }).as('submitAssessment');

    cy.intercept('GET', '**/api/assessments/assessment1', {
      statusCode: 200,
      body: {
        id: "assessment1",
        team: {
          id: "team1",
          name: "Test Team",
          owner: { id: "2", email: "user@example.com" },
          members: []
        },
        maturityModel: {
          id: "model1",
          name: "Scrum Maturity Model",
          questions: [
            {
              id: "q1",
              text: "Do you do daily standups?",
              levels: [
                { value: 1, description: "Never" },
                { value: 2, description: "Rarely" },
                { value: 3, description: "Sometimes" },
                { value: 4, description: "Often" },
                { value: 5, description: "Always" }
              ]
            }
          ]
        },
        date: "2023-10-01",
        submissions: [
            {
                userId: "2",
                answers: [{ questionId: "q1", selectedLevel: 5 }]
            },
            {
                userId: "3",
                answers: [{ questionId: "q1", selectedLevel: 3 }]
            }
        ]
      }
    }).as('getAssessmentUpdated');

    cy.contains('Save Assessment').click();
    
    cy.wait('@submitAssessment');
    
    cy.get('.recharts-responsive-container').should('be.visible');
    
    cy.contains('Participant 1').should('be.visible');
    cy.contains('Participant 2').should('be.visible');
    cy.contains('Team Average').should('be.visible');
  });
});
