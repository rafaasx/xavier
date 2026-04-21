import { Routes } from '@angular/router';

import { adminAuthGuard } from './guards/admin-auth.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/admin-login.component').then((m) => m.AdminLoginComponent),
  },
  {
    path: '',
    canActivate: [adminAuthGuard],
    loadComponent: () =>
      import('./components/shell/admin-shell.component').then((m) => m.AdminShellComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'products',
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./components/section-placeholder/admin-section-placeholder.component').then(
            (m) => m.AdminSectionPlaceholderComponent,
          ),
        data: { title: 'Gestão de produtos' },
      },
      {
        path: 'medias',
        loadComponent: () =>
          import('./components/section-placeholder/admin-section-placeholder.component').then(
            (m) => m.AdminSectionPlaceholderComponent,
          ),
        data: { title: 'Gestão de mídias' },
      },
      {
        path: 'tags',
        loadComponent: () =>
          import('./components/section-placeholder/admin-section-placeholder.component').then(
            (m) => m.AdminSectionPlaceholderComponent,
          ),
        data: { title: 'Gestão de tags' },
      },
      {
        path: 'affiliate-links',
        loadComponent: () =>
          import('./components/section-placeholder/admin-section-placeholder.component').then(
            (m) => m.AdminSectionPlaceholderComponent,
          ),
        data: { title: 'Gestão de links afiliados' },
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
