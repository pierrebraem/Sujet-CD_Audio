describe('test e2e CD', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('Ajout d\'un CD', () => {
    // Vérifie que le message s'affiche bien quand aucune données est présente
    cy.contains("Aucun CD disponible");

    cy.get('[placeholder="Titre du CD"]').type("Test title Cypress");
    cy.get('[placeholder="Artiste"]').type("Test Artiste Cypress");
    cy.get('[placeholder="Année"]').type("2023");

    cy.get('form > button').click();

    cy.contains('Aucun CD disponible').should('not.exist');
    cy.contains('Test title Cypress - Test Artiste Cypress (2023)');

    cy.get('[placeholder="Titre du CD"]').should('have.value', '');
    cy.get('[placeholder="Artiste"]').should('have.value', '');
    cy.get('[placeholder="Année"]').should('have.value', '');
  });

  it('Tenter d\'ajouter un cd sans l\'attribue "title"', () => {
    cy.get('[placeholder="Artiste"]').type("Test Artiste Cypress2");
    cy.get('[placeholder="Année"]').type("2024");

    cy.get('form > button').click();

    cy.get('[placeholder="Titre du CD"]:invalid').should('have.length', 1);

    cy.contains('- Test Artiste Cypress2 (2024)').should('not.exist');
  });

  it('Affichage de plusieurs CD', () => {
    cy.get('[placeholder="Titre du CD"]').type("Test title Cypress2");
    cy.get('[placeholder="Artiste"]').type("Test Artiste Cypress2");
    cy.get('[placeholder="Année"]').type("2024");

    cy.get('form > button').click();

    cy.contains('Test title Cypress - Test Artiste Cypress (2023)');
    cy.contains('Test title Cypress2 - Test Artiste Cypress2 (2024)');

    cy.get('[placeholder="Titre du CD"]').should('have.value', '');
    cy.get('[placeholder="Artiste"]').should('have.value', '');
    cy.get('[placeholder="Année"]').should('have.value', '');
  });

  it('Supprimer un CD', () => {
    cy.get(':nth-child(2) > .delete-btn').click();

    cy.contains('Test title Cypress - Test Artiste Cypress (2023)');
    cy.contains('Test title Cypress2 - Test Artiste Cypress2 (2024)').should('not.exist');
  });
})