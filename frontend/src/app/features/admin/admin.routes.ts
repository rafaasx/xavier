import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./admin-placeholder.component').then((m) => m.AdminPlaceholderComponent),
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./admin-placeholder.component').then((m) => m.AdminPlaceholderComponent),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./admin-placeholder.component').then((m) => m.AdminPlaceholderComponent),
  },
];
