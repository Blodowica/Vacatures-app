import { DetailPage, Header, OverviewPage } from '../../support/pages';

/**
 * Cross-page navigation and routing.
 */
describe('Navigation & routing', () => {
  // ---- Happy flow ---------------------------------------------------------

  it('navigates from a vacancy card to its detail page', () => {
    OverviewPage.visit();
    OverviewPage.openCardByTitle('Security Analist');

    cy.location('pathname').should('eq', '/vacatures/mil-2');
    DetailPage.title().should('have.text', 'Security Analist');
  });

  it('returns to the overview via the "back" link', () => {
    DetailPage.visit('mil-1');
    DetailPage.back();

    cy.location('pathname').should('eq', '/');
    OverviewPage.cards().should('have.length', 6);
  });

  it('returns to the overview via the brand logo', () => {
    DetailPage.visit('mil-1');
    Header.brand().click();

    cy.location('pathname').should('eq', '/');
    OverviewPage.cards().should('exist');
  });

  it('deep-links straight to a detail page', () => {
    DetailPage.visit('civ-2');
    cy.location('pathname').should('eq', '/vacatures/civ-2');
    DetailPage.title().should('have.text', 'Data Scientist');
  });

  // ---- Bad flow -----------------------------------------------------------

  it('redirects an unknown route back to the overview', () => {
    cy.stubKeycloak();
    cy.mockVacancies();
    cy.visit('/this/route/does/not/exist', { failOnStatusCode: false });

    cy.location('pathname').should('eq', '/');
    OverviewPage.cards().should('have.length', 6);
  });
});
