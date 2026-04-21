import { Routes } from '@angular/router';

export const STORE_ROUTES: Routes = [
  {
    path: 'catalog',
    pathMatch: 'full',
    redirectTo: '',
  },
  {
    path: 'orders',
    pathMatch: 'full',
    redirectTo: '',
  },
  {
    path: '',
    loadComponent: () =>
      import('./components/store-list-page.component').then((m) => m.StoreListPageComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./components/store-detail-page.component').then((m) => m.StoreDetailPageComponent),
  },
];
