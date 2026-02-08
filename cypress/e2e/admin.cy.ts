describe('Maturity Models Admin', () => {
  beforeEach(() => {
    const user = {
      id: "1",
      username: "pmouser",
      email: "pmo@example.com",
      roles: ["ROLE_USER", "ROLE_PMO"],
      accessToken: "fake-jwt-token"
    };
    localStorage.setItem("user", JSON.stringify(user));

    cy.intercept('GET', '**/api/models', {
      statusCode: 200,
      body: []
    }).as('getModels');

    cy.visit('/admin/models');
  })

  it('should create a new model with 5-level questions', () => {
    cy.wait('@getModels');
    cy.contains('Create New Model').click();
    
    cy.get('#modelName').type('DevOps Maturity Model');
    
    cy.contains('Add Question').click();
    cy.get('input[placeholder="e.g. How do you handle deployments?"]').type('How often do you deploy?');
    
    cy.get('input[placeholder^="Description for level"]').should('have.length', 5);

    cy.get('input[placeholder="Description for level 1"]').type('Once a year');
    cy.get('input[placeholder="Description for level 2"]').type('Once a month');
    cy.get('input[placeholder="Description for level 3"]').type('Once a week');
    cy.get('input[placeholder="Description for level 4"]').type('Once a day');
    cy.get('input[placeholder="Description for level 5"]').type('On every commit');
    
    cy.intercept('POST', '**/api/models', {
      statusCode: 200,
      body: {
        id: "model1",
        name: "DevOps Maturity Model",
        questions: [
          {
            id: "q1",
            text: "How often do you deploy?",
            level1: "Once a year",
            level2: "Once a month",
            level3: "Once a week",
            level4: "Once a day",
            level5: "On every commit"
          }
        ]
      }
    }).as('createModel');
    
    cy.contains('Save Model').click();
    
    cy.wait('@createModel');
    cy.contains('Model created successfully!').should('be.visible');
  });
});
