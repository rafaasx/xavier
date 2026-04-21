import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, finalize, map, of, shareReplay, switchMap, tap, throwError } from 'rxjs';

import { runtimeEnv } from '../../../core/runtime-env';

type AdminLoginResponse = {
  token: string;
  expiresAt: string;
};

export type AdminAuthenticatedUser = {
  id: string;
  email: string;
};

@Injectable({ providedIn: 'root' })
export class AdminAuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly apiBaseUrl = runtimeEnv.apiBaseUrl;
  private readonly accessTokenStorageKey = 'xavier_admin_access_token';

  private readonly accessTokenSignal = signal<string | null>(this.restoreAccessToken());
  private readonly userSignal = signal<AdminAuthenticatedUser | null>(null);
  private readonly checkingSessionSignal = signal(false);
  private activeSessionRequest$: Observable<AdminAuthenticatedUser | null> | null = null;

  readonly currentUser = this.userSignal.asReadonly();
  readonly isCheckingSession = this.checkingSessionSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.userSignal() !== null);

  accessToken(): string | null {
    return this.accessTokenSignal();
  }

  ensureAuthenticated(): Observable<boolean> {
    if (this.userSignal()) {
      return of(true);
    }

    return this.refreshSession().pipe(map((user) => user !== null));
  }

  login(email: string, password: string): Observable<AdminAuthenticatedUser> {
    return this.http
      .post<AdminLoginResponse>(`${this.apiBaseUrl}/auth/login`, { email, password })
      .pipe(
        tap((response) => this.persistAccessToken(response.token)),
        switchMap(() => this.me()),
      );
  }

  refreshSession(): Observable<AdminAuthenticatedUser | null> {
    if (this.activeSessionRequest$) {
      return this.activeSessionRequest$;
    }

    this.checkingSessionSignal.set(true);

    const request$ = this.http.get<AdminAuthenticatedUser>(`${this.apiBaseUrl}/auth/me`).pipe(
      tap((user) => this.userSignal.set(user)),
      map((user) => user),
      catchError((error: unknown) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          this.clearSession();
          return of(null);
        }

        return throwError(() => error);
      }),
      finalize(() => {
        this.checkingSessionSignal.set(false);
        this.activeSessionRequest$ = null;
      }),
      shareReplay(1),
    );

    this.activeSessionRequest$ = request$;
    return request$;
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiBaseUrl}/auth/logout`, {}).pipe(
      tap(() => this.clearSession()),
      catchError((error: unknown) => {
        this.clearSession();
        return throwError(() => error);
      }),
    );
  }

  handleUnauthorized(): void {
    this.clearSession();

    if (this.router.url !== '/admin/login') {
      void this.router.navigate(['/admin/login']);
    }
  }

  private me(): Observable<AdminAuthenticatedUser> {
    return this.http.get<AdminAuthenticatedUser>(`${this.apiBaseUrl}/auth/me`).pipe(
      tap((user) => this.userSignal.set(user)),
    );
  }

  private clearSession(): void {
    this.accessTokenSignal.set(null);
    this.userSignal.set(null);

    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem(this.accessTokenStorageKey);
    }
  }

  private persistAccessToken(token: string): void {
    this.accessTokenSignal.set(token);

    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(this.accessTokenStorageKey, token);
    }
  }

  private restoreAccessToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }

    return window.sessionStorage.getItem(this.accessTokenStorageKey);
  }
}

