import { OverviewPage } from '../../support/pages';

/**
 * Responsive behaviour — the mobile slide-in filter panel.
 *
 * On small viewports the filter sidebar is hidden behind a "Filters" toggle and
 * a dismissible backdrop. Verifies the open/close interactions on a phone-sized
 * viewport.
 */
describe('Mobile filter overlay', () => {
  beforeEach(() => {
    cy.viewport('iphone-x');
    OverviewPage.visit();
  });

  it('opens the filter panel via the toggle button', () => {
    cy.byCy('filter-sidebar').should('not.have.class', 'sidebar-open');

    cy.byCy('mobile-filter-toggle').click();

    cy.byCy('filter-sidebar').should('have.class', 'sidebar-open');
    cy.byCy('filter-backdrop').should('be.visible');
  });

  it('closes the filter panel when the backdrop is clicked', () => {
    cy.byCy('mobile-filter-toggle').click();
    cy.byCy('filter-sidebar').should('have.class', 'sidebar-open');

    cy.byCy('filter-backdrop').click();

    cy.byCy('filter-sidebar').should('not.have.class', 'sidebar-open');
    cy.byCy('filter-backdrop').should('not.exist');
  });

  it('still lets the user filter from the mobile panel', () => {
    cy.byCy('mobile-filter-toggle').click();
    OverviewPage.selectPersonnelType('military');

    OverviewPage.expectResultCount(3);
  });
});
