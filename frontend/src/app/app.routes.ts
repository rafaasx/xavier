import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () =>
      import('./features/landing/landing.routes').then((m) => m.LANDING_ROUTES),
  },
  {
    path: 'landing',
    pathMatch: 'full',
    redirectTo: '',
  },
  {
    path: 'links',
    loadChildren: () =>
      import('./features/linktree/linktree.routes').then((m) => m.LINKTREE_ROUTES),
  },
  {
    path: 'linktree',
    pathMatch: 'full',
    redirectTo: 'links',
  },
  {
    path: 'store',
    loadChildren: () =>
      import('./features/store/store.routes').then((m) => m.STORE_ROUTES),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  {
    path: '404',
    loadComponent: () =>
      import('./features/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];
