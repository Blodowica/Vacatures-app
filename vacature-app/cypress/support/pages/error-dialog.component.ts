/**
 * Component Object for the API connection-error dialog and its mock-data
 * fallback (shown when the vacancies API is unreachable).
 */
export const ErrorDialog = {
  dialog() {
    return cy.byCy('api-error-dialog');
  },
  loadMockData() {
    cy.byCy('load-mock-data').click();
    return this;
  },
  dismiss() {
    cy.byCy('dismiss-error').click();
    return this;
  },
};
