# End-to-end tests (Cypress)

Full-journey E2E coverage for the Vacancy Explorer app — every route, every
filter, and both the **happy flow** and the **bad-weather** (error / empty /
not-found) paths. The suite is fully deterministic: it stubs the vacancies REST
API and Keycloak SSO, so it needs **no backend** to run.

## Running

```bash
# One command: boots the app (e2e config) and runs every spec headless.
npm run e2e

# Interactive runner (Test Runner UI).
npm run e2e:open

# Against an app you already have running on http://localhost:4200:
npm run cypress:run      # headless
npm run cypress:open     # interactive
```

`npm run e2e` uses [`start-server-and-test`](https://github.com/bahmutov/start-server-and-test)
to start `ng serve --configuration e2e`, wait for `http://localhost:4200`, run
the specs, then shut the server down.

## Why a dedicated `e2e` serve configuration?

`ng serve --configuration e2e` swaps in `src/environments/environment.e2e.ts`,
which sets `apiUrl: ''`. The app then calls the API on a **relative, same-origin
URL** (`/api/vacancies/`). Cypress intercepts same-origin requests
deterministically even when they fire immediately on bootstrap; a cross-origin
API (`:8000`) races the network-stub setup and lets the very first request slip
through to the real (absent) server.

## How external dependencies are stubbed

See [`support/commands.ts`](support/commands.ts):

| Dependency | Strategy |
|------------|----------|
| Vacancies API (`GET /api/vacancies/`) | `cy.intercept` → `fixtures/vacancies.json` (or a forced error for bad-weather specs). |
| Keycloak silent SSO | The hidden check-sso iframe's `/auth` request is redirected straight back to the app's `silent-check-sso.html` with `error=login_required`, so keycloak-js resolves as *unauthenticated* in <1s instead of waiting ~10s for its message timeout. |

Both matchers use `pathname` rather than a `**/...` URL glob — minimatch does not
reliably match a glob against a full cross-origin URL.

## Structure

```
cypress/
├─ e2e/
│  ├─ auth/             # unauthenticated state, login affordance
│  ├─ detail/           # detail page: military, civilian, apply link, not-found
│  ├─ error-handling/   # API connection/server errors + mock-data fallback
│  ├─ navigation/       # routing, deep links, 404 redirect, back/brand nav
│  ├─ overview/         # rendering, grouping, filtering, search
│  └─ responsive/       # mobile slide-in filter overlay
├─ fixtures/            # deterministic API response (3 military + 3 civilian)
└─ support/
   ├─ commands.ts       # cy.byCy, cy.visitOverview/Detail, stubbing commands
   ├─ e2e.ts            # global hooks + scoped uncaught-exception allow-list
   └─ pages/            # Page Objects (selectors + interactions)
```

## Conventions

- **Selectors:** target `data-cy="…"` attributes only (added to the app
  templates), never CSS classes or text that can change — the Cypress-recommended
  practice. The `cy.byCy('name')` helper wraps `cy.get('[data-cy="name"]')`.
- **Page Objects:** all selectors and interactions live in `support/pages/*`, so
  a markup change is fixed in one place and specs read as behaviour.
- **Determinism:** every spec stubs its data up front; no test depends on another.

## Note on code coverage

This suite gives **complete functional coverage** of the user-facing
application — all routes, components, filters and both happy/bad-weather flows.
To additionally collect Istanbul line-coverage numbers, instrument the build and
add [`@cypress/code-coverage`](https://github.com/cypress-io/code-coverage); that
requires build-time instrumentation, which is intentionally out of scope here.
