/**
 * Page Object for the vacancy overview page (`/`).
 *
 * Encapsulates every selector and user interaction so specs read as behaviour,
 * not DOM plumbing, and a markup change only needs fixing in one place.
 */
export const OverviewPage = {
  visit(fixture?: string) {
    cy.visitOverview(fixture);
    return this;
  },

  // --- Queries -------------------------------------------------------------
  cards() {
    return cy.byCy('vacancy-card');
  },
  cardTitles() {
    return cy.byCy('vacancy-card-title');
  },
  resultsCount() {
    return cy.byCy('results-count-value');
  },
  sectionHeaders() {
    return cy.byCy('section-header');
  },
  emptyState() {
    return cy.byCy('empty-state');
  },

  // --- Assertions helpers --------------------------------------------------
  expectResultCount(n: number) {
    cy.byCy('results-count-value').should('have.text', String(n));
    return this;
  },

  // --- Search --------------------------------------------------------------
  search(term: string) {
    cy.byCy('search-input').clear().type(term);
    return this;
  },
  clearSearch() {
    cy.byCy('search-clear').click();
    return this;
  },

  // --- Filters -------------------------------------------------------------
  selectPersonnelType(type: 'all' | 'military' | 'civilian') {
    cy.byCy(`personnel-type-${type}`).click();
    return this;
  },
  selectRank(rank: string) {
    cy.byCy('rank-filter').contains('mat-chip-option', rank).click();
    return this;
  },
  selectScale(scale: string) {
    cy.byCy('scale-filter').contains('mat-chip-option', scale).click();
    return this;
  },
  toggleDomain(domain: string) {
    cy.byCy('domain-filter').contains('mat-chip-option', domain).click();
    return this;
  },
  selectLocation(location: string) {
    cy.byCy('location-select').click();
    cy.get('[data-cy="location-option"]').contains(location).click();
    cy.get('body').type('{esc}'); // close the multi-select overlay
    return this;
  },
  clearFilters() {
    cy.byCy('clear-filters').click();
    return this;
  },
  resetFromEmptyState() {
    cy.byCy('empty-reset').click();
    return this;
  },

  // --- Navigation ----------------------------------------------------------
  openCardByTitle(title: string) {
    cy.byCy('vacancy-card-title').contains(title).click();
    return this;
  },
};
