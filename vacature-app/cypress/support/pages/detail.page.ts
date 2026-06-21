/**
 * Page Object for the vacancy detail page (`/vacatures/:id`).
 */
export const DetailPage = {
  visit(id: string, fixture?: string) {
    cy.visitDetail(id, fixture);
    return this;
  },

  page() {
    return cy.byCy('detail-page');
  },
  title() {
    return cy.byCy('detail-title');
  },
  department() {
    return cy.byCy('detail-department');
  },
  applyButton() {
    return cy.byCy('apply-button');
  },
  notFound() {
    return cy.byCy('not-found');
  },
  back() {
    cy.byCy('back-link').first().click();
    return this;
  },
};
