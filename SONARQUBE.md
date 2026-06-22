# SonarQube Cloud analysis

This repo is wired for **SonarQube Cloud** (SonarCloud) analysis on every push to
`main` and every pull request, via GitHub Actions.

| Piece | Location |
|-------|----------|
| Sonar configuration | [`vacature-app/sonar-project.properties`](vacature-app/sonar-project.properties) |
| CI workflow | [`.github/workflows/sonarcloud.yml`](.github/workflows/sonarcloud.yml) |
| Coverage report (generated) | `vacature-app/coverage/vacature-app/lcov.info` |

The Angular app lives in the `vacature-app/` subfolder, so the scan runs with
`projectBaseDir: vacature-app` and every Sonar path is relative to that folder.

## One-time setup (do this once on SonarQube Cloud)

1. **Create the project.** Sign in at <https://sonarcloud.io> with GitHub, import
   the `Blodowica/Vacatures-app` repository, and note the **Organization key** and
   **Project key** it assigns.
2. **Check the keys.** If they differ from the defaults, update them in
   [`vacature-app/sonar-project.properties`](vacature-app/sonar-project.properties):
   ```properties
   sonar.organization=blodowica
   sonar.projectKey=Blodowica_Vacatures-app
   ```
3. **Disable Automatic Analysis.** In the project: *Administration → Analysis
   Method → turn OFF "Automatic Analysis"*. This is required — CI-based analysis
   and Automatic Analysis cannot both run, and the scan fails if it's left on.
4. **Add the token to GitHub.** In SonarCloud: *My Account → Security → generate a
   token*. In GitHub: *Settings → Secrets and variables → Actions → New repository
   secret* named **`SONAR_TOKEN`** with that value.

That's it — push to `main` or open a PR and the **SonarQube Cloud** workflow runs.

## What the CI does

[`.github/workflows/sonarcloud.yml`](.github/workflows/sonarcloud.yml):

1. Checks out the repo with full history (`fetch-depth: 0`) so Sonar can attribute
   new code correctly.
2. `npm ci` in `vacature-app/` (skips the Cypress binary to stay fast).
3. `npm run test:coverage` → unit tests + an LCOV report.
4. Runs `SonarSource/sonarqube-scan-action` with `projectBaseDir: vacature-app`,
   authenticating with `SONAR_TOKEN`.

## What gets analyzed

- **Main code:** everything under `src/` except tests.
- **Test code:** `*.spec.ts`, `src/tests/**`, and the Cypress E2E specs
  (`cypress/**`) are reported to Sonar as tests, not product code.
- **Coverage:** taken from the LCOV report. Bootstrap/SSR/environment files
  (`main.ts`, `server.ts`, `src/environments/**`, …) are excluded from the
  coverage requirement since they aren't unit-testable.

## Running coverage locally

```bash
cd vacature-app
npm run test:coverage   # writes coverage/vacature-app/lcov.info + an HTML report
```

Open `vacature-app/coverage/vacature-app/index.html` to browse coverage locally.

## Troubleshooting

- **"You are running CI analysis while Automatic Analysis is enabled"** → disable
  Automatic Analysis (step 3 above).
- **Coverage shows 0%** → confirm `npm run test:coverage` produced
  `vacature-app/coverage/vacature-app/lcov.info` before the scan step, and that
  `sonar.javascript.lcov.reportPaths` points to it.
- **"Project not found" / org mismatch** → re-check `sonar.organization` and
  `sonar.projectKey` against your SonarCloud project.
