import { Injectable, signal } from '@angular/core';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  roles: string[];
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly isAuthenticated = signal(false);
  readonly userProfile = signal<UserProfile | null>(null);

  login(): void {
    // Keycloak login will be wired here
  }

  logout(): void {
    this.isAuthenticated.set(false);
    this.userProfile.set(null);
  }
}
