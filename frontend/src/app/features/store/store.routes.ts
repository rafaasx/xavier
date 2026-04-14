import { Routes } from '@angular/router';

export const STORE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./store-placeholder.component').then((m) => m.StorePlaceholderComponent),
  },
  {
    path: 'catalog',
    loadComponent: () =>
      import('./store-placeholder.component').then((m) => m.StorePlaceholderComponent),
  },
  {
    path: 'orders',
    loadComponent: () =>
      import('./store-placeholder.component').then((m) => m.StorePlaceholderComponent),
  },
];
