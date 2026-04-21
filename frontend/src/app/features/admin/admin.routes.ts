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
          import('./components/catalog/admin-catalog-page.component').then((m) => m.AdminCatalogPageComponent),
      },
      {
        path: 'medias',
        loadComponent: () =>
          import('./components/catalog/admin-catalog-page.component').then((m) => m.AdminCatalogPageComponent),
      },
      {
        path: 'tags',
        loadComponent: () =>
          import('./components/catalog/admin-catalog-page.component').then((m) => m.AdminCatalogPageComponent),
      },
      {
        path: 'affiliate-links',
        loadComponent: () =>
          import('./components/catalog/admin-catalog-page.component').then((m) => m.AdminCatalogPageComponent),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
