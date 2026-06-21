import { Header } from '../../support/pages';

/**
 * Authentication surface.
 *
 * Keycloak is stubbed so SSO resolves as "unauthenticated". The app must stay
 * fully usable in that state and present a login affordance (never a user menu).
 */
describe('Authentication (unauthenticated)', () => {
  beforeEach(() => {
    cy.visitOverview();
  });

  it('shows the login button and hides the user menu', () => {
    Header.loginButton().should('be.visible').and('contain', 'Inloggen');
    Header.userMenuButton().should('not.exist');
  });

  it('keeps the app fully usable without logging in', () => {
    // The vacancy data still loads and renders when unauthenticated.
    cy.byCy('vacancy-card').should('have.length', 6);
    Header.searchInput().should('be.visible');
  });
});
