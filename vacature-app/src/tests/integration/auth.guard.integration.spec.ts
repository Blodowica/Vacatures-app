import { vi } from 'vitest';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  provideRouter,
} from '@angular/router';
import { authGuard } from '../../app/core/auth/auth.guard';
import { AuthService } from '../../app/core/auth/auth.service';

/**
 * Integration test for the route guard against a stubbed AuthService, run inside
 * a real Angular injection context (as the router would invoke it).
 */
describe('authGuard (integration)', () => {
  const isAuthenticated = signal(false);
  const login = vi.fn();

  const runGuard = () =>
    TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );

  beforeEach(() => {
    isAuthenticated.set(false);
    login.mockClear();

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: { isAuthenticated, login } },
      ],
    });
  });

  // ---- Happy flow ---------------------------------------------------------

  it('allows activation when the user is authenticated', () => {
    isAuthenticated.set(true);

    expect(runGuard()).toBe(true);
    expect(login).not.toHaveBeenCalled();
  });

  // ---- Bad flow -----------------------------------------------------------

  it('blocks activation and triggers login when unauthenticated', () => {
    isAuthenticated.set(false);

    expect(runGuard()).toBe(false);
    expect(login).toHaveBeenCalledTimes(1);
  });
});
