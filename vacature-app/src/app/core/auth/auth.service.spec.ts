import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should start unauthenticated', () => {
    expect(service.isAuthenticated()).toBeFalse();
    expect(service.userProfile()).toBeNull();
  });

  it('should return null displayName when unauthenticated', () => {
    expect(service.displayName()).toBeNull();
  });

  it('should return null initials when unauthenticated', () => {
    expect(service.initials()).toBeNull();
  });
});
