/// <reference types="cypress" />

/**
 * Custom commands that make every spec deterministic.
 *
 * The app talks to two external systems at runtime:
 *   1. the vacancies REST API   (GET http://localhost:8000/api/vacancies/)
 *   2. Keycloak single sign-on   (http://localhost:8080/realms/myrealm/...)
 *
 * Neither runs during E2E, so we stub both at the network layer. Stubbing keeps
 * the suite fast, isolated and reproducible — the Cypress-recommended approach
 * for testing the front-end in isolation.
 */

export type VacancyApiResponse = {
  page: number;
  pageSize: number;
  total: number;
  items: unknown[];
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /** Shorthand for `cy.get('[data-cy="<name>"]')`. */
      byCy(name: string, options?: Parameters<Chainable['get']>[1]): Chainable<JQuery<HTMLElement>>;

      /** Stub the vacancies list endpoint with a fixture (defaults to `vacancies.json`). Alias: `@getVacancies`. */
      mockVacancies(fixture?: string): Chainable<void>;

      /** Stub the vacancies list endpoint with a failure. `status: 0` simulates a network/connection error. Alias: `@getVacanciesError`. */
      mockVacanciesError(status?: number): Chainable<void>;

      /** Stub Keycloak so app initialisation resolves immediately as "unauthenticated". */
      stubKeycloak(): Chainable<void>;

      /** Stub Keycloak + the vacancies API, then visit the overview page and wait for data. */
      visitOverview(fixture?: string): Chainable<void>;

      /** Stub Keycloak + the vacancies API, then visit a vacancy detail page and wait for data. */
      visitDetail(id: string, fixture?: string): Chainable<void>;
    }
  }
}

const VACANCIES_MATCHER = { method: 'GET', pathname: '/api/vacancies/' } as const;
const KEYCLOAK_PATH = '/realms/myrealm/protocol/openid-connect';

Cypress.Commands.add('byCy', (name: string, options?) =>
  cy.get(`[data-cy="${name}"]`, options),
);

Cypress.Commands.add('mockVacancies', (fixture = 'vacancies.json') => {
  cy.intercept(VACANCIES_MATCHER, { fixture }).as('getVacancies');
});

Cypress.Commands.add('mockVacanciesError', (status = 0) => {
  if (status === 0) {
    // status 0 → the app shows "Kan geen verbinding maken met de API-server".
    cy.intercept(VACANCIES_MATCHER, { forceNetworkError: true }).as('getVacanciesError');
  } else {
    cy.intercept(VACANCIES_MATCHER, {
      statusCode: status,
      body: { detail: 'error' },
    }).as('getVacanciesError');
  }
});

Cypress.Commands.add('stubKeycloak', () => {
  // keycloak-js runs a hidden-iframe "silent check-sso" during APP_INITIALIZER,
  // which blocks app bootstrap. We redirect that iframe straight back to the
  // app's own silent-check-sso.html with `error=login_required`, so keycloak-js
  // resolves as "not authenticated" in <1s instead of waiting ~10s for its
  // message timeout against an absent SSO server.
  //
  // Two things are essential here:
  //   * Match by `pathname`, never a `**/...` URL glob — minimatch does not
  //     reliably match a glob against a full cross-origin URL (the `://` breaks
  //     segment matching), so a glob silently misses.
  //   * Stub ONLY the `/auth` endpoint. Do not stub the `3p-cookies` probe
  //     iframes: returning an (empty) body makes keycloak wait for a postMessage
  //     that never arrives, re-introducing the ~10s delay. Letting them fail by
  //     connection-refusal is instant.
  cy.intercept({ method: 'GET', pathname: `${KEYCLOAK_PATH}/auth` }, req => {
    const url = new URL(req.url);
    const redirectUri = url.searchParams.get('redirect_uri');
    const state = url.searchParams.get('state') ?? '';
    if (redirectUri) {
      const sep = redirectUri.includes('?') ? '&' : '?';
      req.reply({
        statusCode: 302,
        headers: { location: `${redirectUri}${sep}error=login_required&state=${encodeURIComponent(state)}` },
      });
    } else {
      req.reply({ statusCode: 200, body: '' });
    }
  });
});

Cypress.Commands.add('visitOverview', (fixture = 'vacancies.json') => {
  cy.stubKeycloak();
  cy.mockVacancies(fixture);
  cy.visit('/');
  cy.wait('@getVacancies');
  cy.byCy('vacancy-card').should('exist');
});

Cypress.Commands.add('visitDetail', (id: string, fixture = 'vacancies.json') => {
  cy.stubKeycloak();
  cy.mockVacancies(fixture);
  cy.visit(`/vacatures/${id}`);
  cy.wait('@getVacancies');
});

// Required by TS to treat this file as a module when using `declare global`.
export {};
