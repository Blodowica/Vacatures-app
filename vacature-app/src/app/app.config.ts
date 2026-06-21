import { ApplicationConfig, APP_INITIALIZER, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { VACANCY_REPOSITORY } from './core/repositories/vacancy.repository';
import { VacancyApiRepository } from './core/repositories/vacancy-api.repository';
import { AuthService } from './core/auth/auth.service';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideClientHydration(withEventReplay()),
    provideAnimationsAsync(),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    { provide: VACANCY_REPOSITORY, useClass: VacancyApiRepository },
    {
      provide: APP_INITIALIZER,
      // Fire-and-forget: start the Keycloak SSO check but DON'T return its
      // promise, so app bootstrap (and the vacancy fetch) is not blocked.
      // keycloak-js' silent check-sso can take ~10s to time out when the SSO
      // server is unreachable; awaiting it here left the UI blank that whole
      // time. Vacancies are public, so the page renders immediately and the
      // header's auth state simply updates once init resolves in the background.
      useFactory: (auth: AuthService) => () => { void auth.init(); },
      deps: [AuthService],
      multi: true,
    },
  ]
};
