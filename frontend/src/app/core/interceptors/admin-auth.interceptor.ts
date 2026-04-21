import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, finalize, throwError } from 'rxjs';

import { AdminAuthService } from '../../features/admin/services/admin-auth.service';
import { AdminRequestLoadingService } from '../../features/admin/services/admin-request-loading.service';
import { runtimeEnv } from '../runtime-env';

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, '');
}

function isApiRequest(url: string): boolean {
  if (url.startsWith('/api') || url.startsWith('api/')) {
    return true;
  }

  const normalizedApiBase = normalizeBaseUrl(runtimeEnv.apiBaseUrl);
  return url.startsWith(`${normalizedApiBase}/`);
}

export const adminAuthInterceptor: HttpInterceptorFn = (request, next) => {
  if (!isApiRequest(request.url)) {
    return next(request);
  }

  const authService = inject(AdminAuthService);
  const requestLoading = inject(AdminRequestLoadingService);
  const token = authService.accessToken();
  const authenticatedRequest = token
    ? request.clone({
        withCredentials: true,
        setHeaders: { Authorization: `Bearer ${token}` },
      })
    : request.clone({
        withCredentials: true,
      });

  requestLoading.beginRequest();
  return next(authenticatedRequest).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401 && !request.url.endsWith('/auth/login')) {
        authService.handleUnauthorized();
      }

      return throwError(() => error);
    }),
    finalize(() => requestLoading.endRequest()),
  );
};

