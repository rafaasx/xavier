import { Routes } from '@angular/router';

export const LINKTREE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./linktree.component').then((m) => m.LinktreeComponent),
  },
];
