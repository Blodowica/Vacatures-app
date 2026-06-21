/**
 * Component Object for the global header / toolbar (brand, search, auth area).
 */
export const Header = {
  brand() {
    return cy.byCy('brand-link');
  },
  searchInput() {
    return cy.byCy('search-input');
  },
  loginButton() {
    return cy.byCy('login-button');
  },
  userMenuButton() {
    return cy.byCy('user-menu-button');
  },
};
