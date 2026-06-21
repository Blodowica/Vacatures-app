// Environment used only for Cypress E2E (`ng serve --configuration e2e`).
//
// `apiUrl` is empty so the app calls the vacancies API on a RELATIVE, same-origin
// URL (`/api/vacancies/`). Cypress intercepts same-origin requests deterministically
// even when they fire immediately on bootstrap — a cross-origin API (:8000) races
// the network-stub setup and lets the very first request slip through to the real
// (absent) server. Keycloak is still stubbed by path in cypress/support/commands.ts.
export const environment = {
  production: false,
  apiUrl: '',
  keycloak: {
    url: 'http://localhost:8080',
    realm: 'myrealm',
    clientId: 'vacature-app-frontend',
  },
};
