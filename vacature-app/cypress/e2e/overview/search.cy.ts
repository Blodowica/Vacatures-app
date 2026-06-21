import { OverviewPage } from '../../support/pages';

/**
 * Vacancy overview — search.
 *
 * The search box (in the header) is debounced; assertions rely on Cypress'
 * built-in retry so the 300ms debounce never causes flake. Search matches
 * across title, department, function domain and location.
 */
describe('Vacancy overview – search', () => {
  beforeEach(() => {
    OverviewPage.visit();
  });

  // ---- Happy flow ---------------------------------------------------------

  it('finds a vacancy by its title', () => {
    OverviewPage.search('Data Scientist');

    OverviewPage.expectResultCount(1);
    OverviewPage.cardTitles().should('contain', 'Data Scientist');
  });

  it('finds vacancies by location', () => {
    OverviewPage.search('Den Haag');

    OverviewPage.expectResultCount(3); // mil-1, mil-3, civ-2
  });

  it('is case-insensitive', () => {
    OverviewPage.search('backend developer');

    OverviewPage.expectResultCount(1);
    OverviewPage.cardTitles().should('contain', 'Backend Developer');
  });

  it('restores all results when the search is cleared', () => {
    OverviewPage.search('Data Scientist');
    OverviewPage.expectResultCount(1);

    OverviewPage.clearSearch();
    OverviewPage.expectResultCount(6);
  });

  // ---- Bad flow -----------------------------------------------------------

  it('shows the empty state when nothing matches', () => {
    OverviewPage.search('zzz-nonexistent-query');

    OverviewPage.expectResultCount(0);
    OverviewPage.emptyState().should('be.visible').and('contain', 'Geen vacatures gevonden');
  });

  it('recovers after a no-match search is corrected', () => {
    OverviewPage.search('zzz-nonexistent-query');
    OverviewPage.emptyState().should('be.visible');

    OverviewPage.search('Security');
    OverviewPage.expectResultCount(2); // Security Analist + Cloud Security Specialist
  });
});
