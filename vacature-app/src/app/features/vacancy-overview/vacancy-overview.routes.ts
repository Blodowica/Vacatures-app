import { Routes } from '@angular/router';

export const VACANCY_OVERVIEW_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/vacancy-overview.page').then(m => m.VacancyOverviewPage),
  }
];
