/**
 * Reads .env → writes both environment files so they never drift apart.
 *
 * Run:  node scripts/generate-env.js
 *       npm run generate-env
 *
 * Required .env keys:
 *   KEYCLOAK_URL
 *   KEYCLOAK_REALM
 *   KEYCLOAK_CLIENT_ID
 */
const fs = require('fs');
const path = require('path');

const envPath  = path.resolve(__dirname, '../.env');
const devOut   = path.resolve(__dirname, '../src/environments/environment.ts');
const prodOut  = path.resolve(__dirname, '../src/environments/environment.prod.ts');

// ── 1. Parse .env ────────────────────────────────────────────────────────────
if (!fs.existsSync(envPath)) {
  console.error('[generate-env] .env not found. Copy .env.example → .env and fill in values.');
  process.exit(1);
}

const vars = {};
for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const [key, ...rest] = trimmed.split('=');
  vars[key.trim()] = rest.join('=').trim().replace(/^["']|["']$/g, '');
}

const required = ['KEYCLOAK_URL', 'KEYCLOAK_REALM', 'KEYCLOAK_CLIENT_ID'];
const missing  = required.filter(k => !vars[k]);
if (missing.length) {
  console.error('[generate-env] Missing .env keys:', missing.join(', '));
  process.exit(1);
}

const { KEYCLOAK_URL: url, KEYCLOAK_REALM: realm, KEYCLOAK_CLIENT_ID: clientId } = vars;

// ── 2. Write environment.ts (dev) ────────────────────────────────────────────
fs.writeFileSync(devOut, `// AUTO-GENERATED from .env — run: npm run generate-env
export const environment = {
  production: false,
  keycloak: {
    url: '${url}',
    realm: '${realm}',
    clientId: '${clientId}',
  },
};
`, 'utf8');
console.log('[generate-env] Updated:', devOut);

// ── 3. Write environment.prod.ts ─────────────────────────────────────────────
fs.writeFileSync(prodOut, `// AUTO-GENERATED from .env — run: npm run generate-env
// This file is NOT committed to git (see .gitignore).
export const environment = {
  production: true,
  keycloak: {
    url: '${url}',
    realm: '${realm}',
    clientId: '${clientId}',
  },
};
`, 'utf8');
console.log('[generate-env] Updated:', prodOut);
