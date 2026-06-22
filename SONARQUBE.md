# SonarQube analysis

This repo can be analyzed two ways, both off the **same** configuration
([`vacature-app/sonar-project.properties`](vacature-app/sonar-project.properties)):

1. **SonarQube Cloud** (SonarCloud) — runs automatically in CI on every push to
   `main` and every pull request.
2. **Local self-hosted SonarQube** — a Docker server on your machine, scanned
   on demand, so results stay local. See [Local server](#local-self-hosted-server).

They're the same product; the local server is an *extra* target, not a
replacement. Pick whichever you need at the moment — CI keeps using SonarCloud.

| Piece | Location |
|-------|----------|
| Sonar configuration (shared) | [`vacature-app/sonar-project.properties`](vacature-app/sonar-project.properties) |
| Cloud CI workflow | [`.github/workflows/sonarcloud.yml`](.github/workflows/sonarcloud.yml) |
| Local server | [`docker-compose.sonarqube.yml`](docker-compose.sonarqube.yml) |
| Local scan runner | [`vacature-app/scripts/sonar-local.mjs`](vacature-app/scripts/sonar-local.mjs) |
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

[`.github/workflows/sonarcloud.yml`](.github/workflows/sonarcloud.yml) is one
workflow split into two clearly-named jobs, so the Actions run page shows at a
glance where a failure happened:

**Job 1 — `Unit tests & coverage`**

1. Checkout + set up Node 22.
2. `npm ci` in `vacature-app/` (skips the Cypress binary to stay fast).
3. `npm run test:coverage` → unit tests + an LCOV report.
4. Uploads the LCOV report as an artifact (`lcov-coverage`).

**Job 2 — `SonarQube Cloud analysis`** (runs only if Job 1 passes)

1. Checkout with full history (`fetch-depth: 0`) so Sonar can attribute new code.
2. Downloads the `lcov-coverage` artifact back into `coverage/vacature-app/`.
3. Runs `SonarSource/sonarqube-scan-action` with `projectBaseDir: vacature-app`,
   authenticating with `SONAR_TOKEN`.
4. `Check Quality Gate` — fails the run as its own step if the gate isn't passed.

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

## Local self-hosted server

Runs the same analysis on a SonarQube Community server on your machine. Requires
**Docker Desktop**.

**1. Start the server** (from the repo root):

```bash
docker compose -f docker-compose.sonarqube.yml up -d
```

Wait ~1–2 min, then open <http://localhost:9000>. First login is `admin` / `admin`;
you'll be asked to set a new password. Data persists in Docker volumes across
restarts.

**2. Create the project + a token.** In the UI create a project with key
`Blodowica_Vacatures-app` (matching `sonar.projectKey`), then generate a token at
*My Account → Security → Generate Tokens*.

**3. Run the scan** (from `vacature-app/`):

```bash
# PowerShell
$env:SONAR_TOKEN="sqp_xxx"; npm run sonar:local

# bash
SONAR_TOKEN=sqp_xxx npm run sonar:local
```

`sonar:local` runs the unit tests with coverage and then the
[SonarScanner CLI in Docker](vacature-app/scripts/sonar-local.mjs) against
`http://localhost:9000`. Results appear in the local web UI. Use
`npm run sonar:scan:local` to skip re-running the tests and just re-scan.

**Stop / wipe:**

```bash
docker compose -f docker-compose.sonarqube.yml down      # stop, keep data
docker compose -f docker-compose.sonarqube.yml down -v   # stop and delete all data
```

> The local server reuses `sonar-project.properties`; only the host URL, token,
> and the SonarCloud-only `sonar.organization` key are overridden at scan time.

## Troubleshooting

- **"You are running CI analysis while Automatic Analysis is enabled"** → disable
  Automatic Analysis (step 3 above).
- **Coverage shows 0%** → confirm `npm run test:coverage` produced
  `vacature-app/coverage/vacature-app/lcov.info` before the scan step, and that
  `sonar.javascript.lcov.reportPaths` points to it.
- **"Project not found" / org mismatch** → re-check `sonar.organization` and
  `sonar.projectKey` against your SonarCloud project.
- **Local server won't start / Elasticsearch "max virtual memory" error** →
  raise the host limit (WSL2/Linux): `sudo sysctl -w vm.max_map_count=262144`.
- **Local scan can't reach the server** → confirm the container is up
  (`docker compose -f docker-compose.sonarqube.yml ps`) and that
  `SONAR_HOST_URL` resolves; on Docker Desktop the scanner uses
  `http://host.docker.internal:9000`.
