import { Injectable, computed, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AdminRequestLoadingService {
  private readonly activeRequestsSignal = signal(0);

  readonly isBusy = computed(() => this.activeRequestsSignal() > 0);

  beginRequest(): void {
    this.activeRequestsSignal.update((current) => current + 1);
  }

  endRequest(): void {
    this.activeRequestsSignal.update((current) => Math.max(0, current - 1));
  }
}

