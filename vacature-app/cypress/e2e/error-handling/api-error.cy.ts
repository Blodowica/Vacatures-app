import { ErrorDialog, OverviewPage } from '../../support/pages';

/**
 * API failure handling.
 *
 * When the vacancies API is unreachable or errors, the app must surface a
 * connection-error dialog and offer a local "mock data" fallback so the user
 * can keep browsing. These are the application's core bad-weather paths.
 */
describe('API error handling', () => {
  // ---- Connection failure (status 0) -------------------------------------

  describe('when the API is unreachable', () => {
    beforeEach(() => {
      cy.stubKeycloak();
      cy.mockVacanciesError(0);
      cy.visit('/');
      cy.wait('@getVacanciesError');
    });

    it('shows the connection-error dialog', () => {
      ErrorDialog.dialog()
        .should('be.visible')
        .and('contain', 'Verbinding mislukt')
        .and('contain', 'Kan geen verbinding maken met de API-server');
    });

    it('loads local mock data as a fallback', () => {
      ErrorDialog.loadMockData();

      ErrorDialog.dialog().should('not.exist');
      OverviewPage.cards().should('exist');
      // The mock repository tags every title with a "<<mock>>" marker.
      cy.contains('[data-cy="vacancy-card-title"]', '<<mock>>').should('exist');
    });

    it('falls back to an empty overview when the dialog is dismissed', () => {
      ErrorDialog.dismiss();

      ErrorDialog.dialog().should('not.exist');
      OverviewPage.emptyState().should('be.visible');
    });
  });

  // ---- Server error (status 500) -----------------------------------------

  describe('when the API returns a server error', () => {
    beforeEach(() => {
      cy.stubKeycloak();
      cy.mockVacanciesError(500);
      cy.visit('/');
      cy.wait('@getVacanciesError');
    });

    it('shows the dialog with the returned status code', () => {
      ErrorDialog.dialog().should('be.visible').and('contain', '500');
    });
  });
});
