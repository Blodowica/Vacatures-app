import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import Keycloak from 'keycloak-js';
import { environment } from '../../../environments/environment';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles: string[];
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly platformId = inject(PLATFORM_ID);
  private keycloak!: Keycloak;

  readonly isAuthenticated = signal(false);
  readonly userProfile = signal<UserProfile | null>(null);

  readonly displayName = computed(() => {
    const p = this.userProfile();
    return p ? (p.firstName ?? p.username) : null;
  });

  readonly initials = computed(() => {
    const p = this.userProfile();
    if (!p) return null;
    const first = p.firstName?.[0] ?? '';
    const last = p.lastName?.[0] ?? '';
    return (first + last).toUpperCase() || p.username.slice(0, 2).toUpperCase();
  });

  async init(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    this.keycloak = new Keycloak(environment.keycloak);

    try {
      const authenticated = await this.keycloak.init({
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
        pkceMethod: 'S256',
      });

      this.isAuthenticated.set(authenticated);

      if (authenticated) {
        await this.loadProfile();
      }
    } catch {
      // Keycloak unreachable — app still works unauthenticated
    }
  }

  private async loadProfile(): Promise<void> {
    try {
      const profile = await this.keycloak.loadUserProfile();
      this.userProfile.set({
        id: profile.id ?? '',
        username: profile.username ?? '',
        email: profile.email ?? '',
        firstName: profile.firstName,
        lastName: profile.lastName,
        roles: this.keycloak.realmAccess?.roles ?? [],
      });
    } catch {
      // /account endpoint unavailable — read name from the JWT token claims instead
      const token = this.keycloak.tokenParsed as Record<string, string | undefined> | undefined;
      this.userProfile.set({
        id: token?.['sub'] ?? '',
        username: token?.['preferred_username'] ?? '',
        email: token?.['email'] ?? '',
        firstName: token?.['given_name'],
        lastName: token?.['family_name'],
        roles: this.keycloak.realmAccess?.roles ?? [],
      });
    }
  }

  login(): void {
    this.keycloak?.login({ redirectUri: window.location.href });
  }

  logout(): void {
    this.keycloak?.logout({ redirectUri: window.location.origin });
  }

  async getToken(): Promise<string> {
    try {
      await this.keycloak.updateToken(30);
      return this.keycloak.token ?? '';
    } catch {
      this.login();
      return '';
    }
  }
}
