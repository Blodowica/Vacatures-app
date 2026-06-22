// Runs a SonarQube analysis against the LOCAL self-hosted server
// (docker-compose.sonarqube.yml) using the official SonarScanner CLI in Docker,
// so nothing extra needs to be installed globally.
//
// It reuses vacature-app/sonar-project.properties (same config as SonarCloud);
// only the server URL, token, and the SonarCloud-only `organization` key are
// overridden here for the local server.
//
// Usage (from the vacature-app/ folder):
//   1. Start the server:  docker compose -f ../docker-compose.sonarqube.yml up -d
//   2. In SonarQube (http://localhost:9000) create a project token:
//        My Account > Security > Generate Tokens
//   3. Provide it and run:
//        PowerShell:  $env:SONAR_TOKEN="sqp_xxx"; npm run sonar:local
//        bash:        SONAR_TOKEN=sqp_xxx npm run sonar:local

import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const baseDir = resolve(dirname(fileURLToPath(import.meta.url)), '..'); // vacature-app/

const token = process.env.SONAR_TOKEN;
if (!token) {
  console.error(
    'SONAR_TOKEN is not set.\n' +
      'Generate one in your local SonarQube (http://localhost:9000 > My Account > Security),\n' +
      'then set it before running:\n' +
      '  PowerShell:  $env:SONAR_TOKEN="sqp_xxx"; npm run sonar:local\n' +
      '  bash:        SONAR_TOKEN=sqp_xxx npm run sonar:local',
  );
  process.exit(1);
}

// On Docker Desktop, the container reaches the host via host.docker.internal.
const hostUrl = process.env.SONAR_HOST_URL ?? 'http://host.docker.internal:9000';

const args = [
  'run',
  '--rm',
  '-e',
  `SONAR_HOST_URL=${hostUrl}`,
  '-e',
  `SONAR_TOKEN=${token}`,
  // `sonar.organization` is a SonarCloud-only concept; blank it for the local server.
  '-e',
  'SONAR_SCANNER_OPTS=-Dsonar.organization=',
  '-v',
  `${baseDir}:/usr/src`,
  'sonarsource/sonar-scanner-cli',
];

console.log(`Scanning ${baseDir}\n  -> ${hostUrl}\n`);
const res = spawnSync('docker', args, { stdio: 'inherit' });

if (res.error) {
  console.error('Failed to run docker. Is Docker Desktop running?');
  console.error(res.error.message);
  process.exit(1);
}
process.exit(res.status ?? 1);
