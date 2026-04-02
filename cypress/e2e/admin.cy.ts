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
    cy.contains('Créer un modèle').click();

    cy.get('#modelName').type('Modèle de maturité DevOps');

    cy.contains('Ajouter une question').click();
    cy.get('input[placeholder="Par exemple : comment gérez-vous les déploiements ?"]').type('À quelle fréquence déployez-vous ?');

    cy.get('input[placeholder^="Description du niveau"]').should('have.length', 5);

    cy.get('input[placeholder="Description du niveau 1"]').type('Une fois par an');
    cy.get('input[placeholder="Description du niveau 2"]').type('Une fois par mois');
    cy.get('input[placeholder="Description du niveau 3"]').type('Une fois par semaine');
    cy.get('input[placeholder="Description du niveau 4"]').type('Une fois par jour');
    cy.get('input[placeholder="Description du niveau 5"]').type('À chaque commit');

    cy.intercept('POST', '**/api/models', {
      statusCode: 200,
      body: {
        id: "model1",
        name: "Modèle de maturité DevOps",
        questions: [
          {
            id: "q1",
            text: "À quelle fréquence déployez-vous ?",
            level1: "Une fois par an",
            level2: "Une fois par mois",
            level3: "Une fois par semaine",
            level4: "Une fois par jour",
            level5: "À chaque commit"
          }
        ]
      }
    }).as('createModel');

    cy.contains('Enregistrer le modèle').click();

    cy.wait('@createModel');
    cy.contains('Modèle créé avec succès !').should('be.visible');
  });
});
