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
          name: "Équipe de test",
          owner: { id: "2", email: "user@example.com" },
          members: []
        },
        maturityModel: {
          id: "model1",
          name: "Modèle de maturité Scrum",
          questions: [
            {
              id: "q1",
              text: "Faites-vous des réunions quotidiennes ?",
              levels: [
                { value: 1, description: "Jamais" },
                { value: 2, description: "Rarement" },
                { value: 3, description: "Parfois" },
                { value: 4, description: "Souvent" },
                { value: 5, description: "Toujours" }
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
    cy.contains('Modèle de maturité Scrum').should('be.visible');

    cy.contains('Faites-vous des réunions quotidiennes ?').should('be.visible');

    cy.contains('Niveau 5').click();

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
          name: "Équipe de test",
          owner: { id: "2", email: "user@example.com" },
          members: []
        },
        maturityModel: {
          id: "model1",
          name: "Modèle de maturité Scrum",
          questions: [
            {
              id: "q1",
              text: "Faites-vous des réunions quotidiennes ?",
              levels: [
                { value: 1, description: "Jamais" },
                { value: 2, description: "Rarement" },
                { value: 3, description: "Parfois" },
                { value: 4, description: "Souvent" },
                { value: 5, description: "Toujours" }
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

    cy.get('button[type="submit"]').click();
    cy.wait('@submitAssessment');
    cy.wait('@getAssessmentUpdated');

    cy.contains('Évaluation envoyée avec succès !').should('be.visible');
    cy.get('.recharts-responsive-container').should('exist');
  })
})
