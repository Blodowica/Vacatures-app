import { OverviewPage } from '../../support/pages';

/**
 * Vacancy overview — rendering & grouping.
 *
 * The fixture (`cypress/fixtures/vacancies.json`) contains 3 military and
 * 3 civilian vacancies, so the overview must render two collapsible sections
 * with the vacancies grouped by rank (military) and scale (civilian).
 */
describe('Vacancy overview – rendering', () => {
  beforeEach(() => {
    OverviewPage.visit();
  });

  // ---- Happy flow ---------------------------------------------------------

  it('loads the vacancies API exactly once and renders every card', () => {
    cy.get('@getVacancies.all').should('have.length', 1);
    OverviewPage.cards().should('have.length', 6);
  });

  it('shows the total result count in the toolbar', () => {
    OverviewPage.expectResultCount(6);
    cy.byCy('results-count').should('contain', 'resultaten');
  });

  it('groups vacancies into a Militair and a Burgerpersoneel section', () => {
    OverviewPage.sectionHeaders().should('have.length', 2);
    OverviewPage.sectionHeaders().eq(0).should('contain', 'Militair');
    OverviewPage.sectionHeaders().eq(1).should('contain', 'Burgerpersoneel');
  });

  it('renders the expected vacancy titles', () => {
    OverviewPage.cardTitles().then($titles => {
      const titles = [...$titles].map(el => el.textContent?.trim());
      expect(titles).to.include.members([
        'Software Engineer Defensie',
        'Security Analist',
        'DevOps Engineer',
        'Backend Developer',
        'Data Scientist',
        'Cloud Security Specialist',
      ]);
    });
  });

  it('collapses and expands a section when its header is clicked', () => {
    OverviewPage.cards().should('have.length', 6);

    // Collapse the Militair section -> its 3 cards disappear.
    OverviewPage.sectionHeaders().eq(0).click();
    OverviewPage.cards().should('have.length', 3);

    // Expand it again -> all 6 are back.
    OverviewPage.sectionHeaders().eq(0).click();
    OverviewPage.cards().should('have.length', 6);
  });

  it('does not show a "clear filters" affordance when no filter is active', () => {
    cy.byCy('clear-filters').should('not.exist');
  });

  it('shows a loading spinner while vacancies are being fetched', () => {
    // Re-stub with a delayed response so the loading state is observable.
    // Keycloak is already stubbed by the beforeEach's OverviewPage.visit().
    cy.intercept(
      { method: 'GET', pathname: '/api/vacancies/' },
      { fixture: 'vacancies.json', delay: 1000 },
    ).as('slowVacancies');
    cy.visit('/');

    cy.byCy('loading-state').should('be.visible');
    cy.byCy('vacancy-card').should('not.exist');

    cy.wait('@slowVacancies');
    cy.byCy('loading-state').should('not.exist');
    OverviewPage.cards().should('have.length', 6);
  });

  // ---- Bad flow -----------------------------------------------------------

  it('renders an empty overview gracefully when the API returns no vacancies', () => {
    cy.intercept(
      { method: 'GET', pathname: '/api/vacancies/' },
      { body: { page: 1, pageSize: 500, total: 0, items: [] } },
    ).as('getEmpty');
    cy.visit('/');
    cy.wait('@getEmpty');

    OverviewPage.emptyState().should('be.visible').and('contain', 'Geen vacatures gevonden');
    OverviewPage.expectResultCount(0);
  });
});
