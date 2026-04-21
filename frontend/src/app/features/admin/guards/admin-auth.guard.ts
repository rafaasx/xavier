import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';

import { AdminAuthService } from '../services/admin-auth.service';

export const adminAuthGuard: CanActivateFn = () => {
  const authService = inject(AdminAuthService);
  const router = inject(Router);

  return authService.ensureAuthenticated().pipe(
    map((isAuthenticated) => (isAuthenticated ? true : router.createUrlTree(['/admin/login']))),
  );
};

