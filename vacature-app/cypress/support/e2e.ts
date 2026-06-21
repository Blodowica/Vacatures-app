// Loaded automatically before every spec file (see cypress.config.ts).
import './commands';

/**
 * Some runtime noise is expected during E2E and must not fail otherwise-green
 * tests. We allow-list ONLY known third-party / browser noise and let every
 * other uncaught exception fail the test, so real app bugs are still caught.
 */
const IGNORED_ERRORS = [
  'keycloak',            // SSO adapter init against a stubbed/absent server
  'ResizeObserver loop', // benign Material/CDK layout notification
];

Cypress.on('uncaught:exception', err => {
  const message = `${err?.message ?? ''}`.toLowerCase();
  if (IGNORED_ERRORS.some(ignored => message.includes(ignored.toLowerCase()))) {
    return false; // prevent the error from failing the test
  }
  return undefined; // let everything else fail the test
});
