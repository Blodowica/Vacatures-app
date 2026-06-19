import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { VACANCY_REPOSITORY } from './core/repositories/vacancy.repository';
import { VacancyMockRepository } from './core/repositories/vacancy-mock.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideClientHydration(withEventReplay()),
    provideAnimationsAsync(),
    { provide: VACANCY_REPOSITORY, useClass: VacancyMockRepository },
  ]
};
