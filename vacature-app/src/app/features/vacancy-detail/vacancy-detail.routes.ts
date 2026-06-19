import { Routes } from '@angular/router';

export const VACANCY_DETAIL_ROUTES: Routes = [
  {
    path: ':id',
    loadComponent: () => import('./pages/vacancy-detail.page').then(m => m.VacancyDetailPage),
  }
];
