import { defineConfig } from 'cypress';

/**
 * Cypress end-to-end configuration for the Vacancy Explorer app.
 *
 * The app is an Angular 21 SSR application served by `ng serve` on port 4200.
 * All external dependencies (the vacancies REST API on :8000 and Keycloak on
 * :8080) are stubbed with `cy.intercept` so the suite is fully deterministic and
 * can run without any backend — see `cypress/support/commands.ts`.
 */
export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',
    fixturesFolder: 'cypress/fixtures',
    // SSR + hydration + lazy chunk loading: give the first paint a little room.
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 60000,
    requestTimeout: 10000,
    responseTimeout: 15000,
    viewportWidth: 1280,
    viewportHeight: 800,
    // Flake resistance in CI without masking real failures locally.
    retries: { runMode: 2, openMode: 0 },
    // Record a video per spec (headless `cypress run` only) into cypress/videos,
    // and failure screenshots into cypress/screenshots. Both are git-ignored.
    video: true,
    videosFolder: 'cypress/videos',
    videoCompression: 32,
    screenshotsFolder: 'cypress/screenshots',
    screenshotOnRunFailure: true,
    experimentalRunAllSpecs: true,
    setupNodeEvents(_on, config) {
      return config;
    },
  },
});
