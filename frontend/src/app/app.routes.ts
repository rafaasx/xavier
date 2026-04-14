import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'landing',
  },
  {
    path: 'landing',
    loadChildren: () =>
      import('./features/landing/landing.routes').then((m) => m.LANDING_ROUTES),
  },
  {
    path: 'linktree',
    loadChildren: () =>
      import('./features/linktree/linktree.routes').then((m) => m.LINKTREE_ROUTES),
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
    path: '**',
    redirectTo: 'landing',
  },
];
