import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell/shell.component';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./features/vacancy-overview/vacancy-overview.routes').then(m => m.VACANCY_OVERVIEW_ROUTES),
      },
      {
        path: 'vacatures',
        loadChildren: () => import('./features/vacancy-detail/vacancy-detail.routes').then(m => m.VACANCY_DETAIL_ROUTES),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
