import { OverviewPage } from '../../support/pages';

/**
 * Vacancy overview — filtering.
 *
 * Exercises every filter dimension (personnel type, rank, scale, function
 * domain, location), filter combinations, the reset behaviour, and the
 * bad-weather case where a filter combination yields no results.
 */
describe('Vacancy overview – filtering', () => {
  beforeEach(() => {
    OverviewPage.visit();
  });

  // ---- Happy flow: single filters ----------------------------------------

  it('filters to military personnel only', () => {
    OverviewPage.selectPersonnelType('military');

    OverviewPage.expectResultCount(3);
    OverviewPage.sectionHeaders().should('not.exist'); // single section, no header
    OverviewPage.cardTitles().should('contain', 'Security Analist');
    cy.contains('[data-cy="vacancy-card-title"]', 'Backend Developer').should('not.exist');
  });

  it('filters to civilian personnel only', () => {
    OverviewPage.selectPersonnelType('civilian');

    OverviewPage.expectResultCount(3);
    OverviewPage.cardTitles().should('contain', 'Backend Developer');
    cy.contains('[data-cy="vacancy-card-title"]', 'Security Analist').should('not.exist');
  });

  it('filters military vacancies by rank', () => {
    OverviewPage.selectPersonnelType('military').selectRank('Sergeant');

    OverviewPage.expectResultCount(2);
    OverviewPage.cardTitles().should('contain', 'Software Engineer Defensie');
    OverviewPage.cardTitles().should('contain', 'DevOps Engineer');
    cy.contains('[data-cy="vacancy-card-title"]', 'Security Analist').should('not.exist');
  });

  it('filters civilian vacancies by scale', () => {
    OverviewPage.selectPersonnelType('civilian').selectScale('Schaal 10');

    OverviewPage.expectResultCount(1);
    OverviewPage.cardTitles().should('contain', 'Backend Developer');
  });

  it('filters across both personnel types by function domain', () => {
    OverviewPage.toggleDomain('Software Development');

    // 1 military + 1 civilian share this domain.
    OverviewPage.expectResultCount(2);
    OverviewPage.cardTitles().should('contain', 'Software Engineer Defensie');
    OverviewPage.cardTitles().should('contain', 'Backend Developer');
  });

  it('filters by location', () => {
    OverviewPage.selectLocation('Den Haag');

    OverviewPage.expectResultCount(3); // mil-1, mil-3, civ-2
  });

  // ---- Happy flow: combinations & reset ----------------------------------

  it('combines a domain and a location filter', () => {
    OverviewPage.toggleDomain('Cyber Security').selectLocation('Amsterdam');

    OverviewPage.expectResultCount(2); // Security Analist + Cloud Security Specialist
    cy.byCy('clear-filters').should('contain', '(2)');
  });

  it('resets all filters with the "clear filters" button', () => {
    OverviewPage.toggleDomain('Software Development');
    OverviewPage.expectResultCount(2);

    OverviewPage.clearFilters();
    OverviewPage.expectResultCount(6);
    cy.byCy('clear-filters').should('not.exist');
  });

  it('clears rank/scale when the personnel type changes', () => {
    OverviewPage.selectPersonnelType('military').selectRank('Sergeant');
    OverviewPage.expectResultCount(2);

    // Switching personnel type must reset the previously chosen rank.
    OverviewPage.selectPersonnelType('civilian');
    OverviewPage.expectResultCount(3);
  });

  // ---- Bad flow -----------------------------------------------------------

  it('shows the empty state for a domain + location combo with no overlap', () => {
    // Data Science only exists in Den Haag, never in Amsterdam.
    OverviewPage.toggleDomain('Data Science').selectLocation('Amsterdam');

    OverviewPage.expectResultCount(0);
    OverviewPage.emptyState().should('be.visible').and('contain', 'Geen vacatures gevonden');
  });

  it('recovers from the empty state via its reset button', () => {
    OverviewPage.toggleDomain('Data Science').selectLocation('Amsterdam');
    OverviewPage.emptyState().should('be.visible');

    OverviewPage.resetFromEmptyState();
    OverviewPage.expectResultCount(6);
    OverviewPage.cards().should('have.length', 6);
  });
});
