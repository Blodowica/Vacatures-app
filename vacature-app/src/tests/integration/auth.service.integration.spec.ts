import { vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import type Keycloak from 'keycloak-js';
import { AuthService, KEYCLOAK_FACTORY } from '../../app/core/auth/auth.service';

/**
 * Integration test for the authentication flow. Instead of mocking the
 * `keycloak-js` module (unreliable under the bundled test runner), we inject a
 * deterministic fake adapter via the KEYCLOAK_FACTORY seam and drive the full
 * AuthService lifecycle for both the happy path (logged in) and the bad paths
 * (Keycloak unreachable / profile load fails).
 */
interface FakeConfig {
  authenticated: boolean;
  initThrows: boolean;
  profile?: Record<string, string>;
  profileThrows: boolean;
  tokenParsed?: Record<string, string>;
  realmRoles: string[];
}

function createFakeKeycloak(cfg: FakeConfig) {
  const login = vi.fn();
  const logout = vi.fn();

  const adapter = {
    token: 'mock-token',
    tokenParsed: undefined as Record<string, string> | undefined,
    realmAccess: { roles: cfg.realmRoles },
    async init(): Promise<boolean> {
      if (cfg.initThrows) throw new Error('Keycloak unreachable');
      adapter.tokenParsed = cfg.tokenParsed;
      return cfg.authenticated;
    },
    async loadUserProfile(): Promise<Record<string, string>> {
      if (cfg.profileThrows) throw new Error('profile endpoint failed');
      return cfg.profile ?? {};
    },
    login,
    logout,
    async updateToken(): Promise<boolean> {
      return true;
    },
  };

  return { adapter, login, logout };
}

function provideFake(cfg: Partial<FakeConfig>) {
  const full: FakeConfig = {
    authenticated: false,
    initThrows: false,
    profileThrows: false,
    realmRoles: [],
    ...cfg,
  };
  const fake = createFakeKeycloak(full);

  TestBed.configureTestingModule({
    providers: [
      { provide: KEYCLOAK_FACTORY, useValue: () => fake.adapter as unknown as Keycloak },
    ],
  });

  return fake;
}

describe('AuthService (integration)', () => {
  // ---- Happy flow ---------------------------------------------------------

  it('loads the user profile and exposes name/initials when authenticated', async () => {
    provideFake({
      authenticated: true,
      profile: { username: 'mvries', email: 'm.vries@mindef.nl', firstName: 'Mark', lastName: 'Vries' },
      realmRoles: ['user'],
    });

    const service = TestBed.inject(AuthService);
    await service.init();

    expect(service.isAuthenticated()).toBe(true);
    expect(service.userProfile()?.email).toBe('m.vries@mindef.nl');
    expect(service.userProfile()?.roles).toEqual(['user']);
    expect(service.displayName()).toBe('Mark');
    expect(service.initials()).toBe('MV');
  });

  it('delegates login and logout to the Keycloak adapter', async () => {
    const fake = provideFake({});

    const service = TestBed.inject(AuthService);
    await service.init();

    service.login();
    service.logout();

    expect(fake.login).toHaveBeenCalledTimes(1);
    expect(fake.logout).toHaveBeenCalledTimes(1);
  });

  // ---- Bad flow -----------------------------------------------------------

  it('stays unauthenticated when Keycloak is unreachable', async () => {
    provideFake({ initThrows: true });

    const service = TestBed.inject(AuthService);
    await service.init();

    expect(service.isAuthenticated()).toBe(false);
    expect(service.userProfile()).toBeNull();
    expect(service.displayName()).toBeNull();
    expect(service.initials()).toBeNull();
  });

  it('falls back to JWT token claims when the profile endpoint fails', async () => {
    provideFake({
      authenticated: true,
      profileThrows: true,
      tokenParsed: {
        sub: 'abc-123',
        preferred_username: 'sbakker',
        email: 'sara.bakker@mindef.nl',
        given_name: 'Sara',
        family_name: 'Bakker',
      },
    });

    const service = TestBed.inject(AuthService);
    await service.init();

    expect(service.isAuthenticated()).toBe(true);
    expect(service.userProfile()?.username).toBe('sbakker');
    expect(service.userProfile()?.email).toBe('sara.bakker@mindef.nl');
    expect(service.displayName()).toBe('Sara');
    expect(service.initials()).toBe('SB');
  });
});
