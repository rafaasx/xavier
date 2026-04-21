import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgxMaskDirective } from 'ngx-mask';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { StoreProductCard, StoreSort, StoreTag } from '../models/store.models';
import { StoreApiService } from '../services/store-api.service';

type SortOption = Readonly<{ value: StoreSort; label: string }>;

@Component({
  selector: 'app-store-list-page',
  standalone: true,
  imports: [FormsModule, NgxMaskDirective, RouterLink],
  templateUrl: './store-list-page.component.html',
  styleUrl: './store-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreListPageComponent {
  private readonly storeApi = inject(StoreApiService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly sortOptions: readonly SortOption[] = [
    { value: 'recent', label: 'Mais recentes' },
    { value: 'name_asc', label: 'Nome (A-Z)' },
    { value: 'name_desc', label: 'Nome (Z-A)' },
  ];

  protected readonly searchInput = signal('');
  protected readonly selectedSort = signal<StoreSort>('recent');
  protected readonly selectedTagIds = signal<ReadonlySet<string>>(new Set<string>());
  protected readonly tags = signal<readonly StoreTag[]>([]);
  protected readonly products = signal<readonly StoreProductCard[]>([]);
  protected readonly isLoadingProducts = signal(false);
  protected readonly isLoadingTags = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly totalCount = signal(0);
  protected readonly currentPage = signal(1);
  protected readonly pageSize = signal(12);
  protected readonly pageInput = signal('1');
  protected readonly pageSizeInput = signal('12');

  protected readonly totalPages = computed(() => {
    const total = Math.ceil(this.totalCount() / this.pageSize());
    return Math.max(1, total);
  });

  constructor() {
    this.loadTags();
    this.loadProducts();
  }

  protected applyFilters(): void {
    this.currentPage.set(1);
    this.pageInput.set('1');
    this.loadProducts();
  }

  protected clearFilters(): void {
    this.searchInput.set('');
    this.selectedSort.set('recent');
    this.selectedTagIds.set(new Set<string>());
    this.currentPage.set(1);
    this.pageInput.set('1');
    this.pageSize.set(12);
    this.pageSizeInput.set('12');
    this.loadProducts();
  }

  protected toggleTagSelection(tagId: string, checked: boolean): void {
    const next = new Set(this.selectedTagIds());
    if (checked) {
      next.add(tagId);
    } else {
      next.delete(tagId);
    }

    this.selectedTagIds.set(next);
    this.currentPage.set(1);
    this.pageInput.set('1');
    this.loadProducts();
  }

  protected isTagSelected(tagId: string): boolean {
    return this.selectedTagIds().has(tagId);
  }

  protected goToPreviousPage(): void {
    if (this.currentPage() <= 1) {
      return;
    }

    this.currentPage.update((value) => value - 1);
    this.pageInput.set(String(this.currentPage()));
    this.loadProducts();
  }

  protected goToNextPage(): void {
    if (this.currentPage() >= this.totalPages()) {
      return;
    }

    this.currentPage.update((value) => value + 1);
    this.pageInput.set(String(this.currentPage()));
    this.loadProducts();
  }

  protected applyPageInput(): void {
    const parsed = this.parsePositiveInteger(this.pageInput(), this.currentPage());
    const clamped = Math.min(Math.max(parsed, 1), this.totalPages());
    this.currentPage.set(clamped);
    this.pageInput.set(String(clamped));
    this.loadProducts();
  }

  protected applyPageSizeInput(): void {
    const parsed = this.parsePositiveInteger(this.pageSizeInput(), this.pageSize());
    const clamped = Math.min(Math.max(parsed, 1), 50);
    this.pageSize.set(clamped);
    this.pageSizeInput.set(String(clamped));
    this.currentPage.set(1);
    this.pageInput.set('1');
    this.loadProducts();
  }

  protected trackByProductId(_index: number, item: StoreProductCard): string {
    return item.id;
  }

  protected trackByTagId(_index: number, item: StoreTag): string {
    return item.id;
  }

  private parsePositiveInteger(rawValue: string, fallback: number): number {
    const numericOnly = rawValue.replace(/[^\d]/g, '');
    const parsed = Number.parseInt(numericOnly, 10);

    if (!Number.isFinite(parsed) || parsed <= 0) {
      return fallback;
    }

    return parsed;
  }

  private loadTags(): void {
    this.isLoadingTags.set(true);

    this.storeApi
      .getTags()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (tags) => {
          this.tags.set(tags);
          this.isLoadingTags.set(false);
        },
        error: () => {
          this.isLoadingTags.set(false);
        },
      });
  }

  private loadProducts(): void {
    this.isLoadingProducts.set(true);
    this.errorMessage.set(null);

    this.storeApi
      .getProducts({
        search: this.searchInput().trim() || undefined,
        tags: Array.from(this.selectedTagIds()),
        sort: this.selectedSort(),
        page: this.currentPage(),
        pageSize: this.pageSize(),
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.products.set(response.items);
          this.totalCount.set(response.totalCount);
          this.currentPage.set(response.page);
          this.pageInput.set(String(response.page));
          this.pageSize.set(response.pageSize);
          this.pageSizeInput.set(String(response.pageSize));
          this.isLoadingProducts.set(false);
        },
        error: (error: unknown) => {
          const fallback = 'Nao foi possivel carregar os produtos no momento.';
          if (error instanceof HttpErrorResponse && typeof error.error?.error === 'string') {
            this.errorMessage.set(error.error.error);
          } else {
            this.errorMessage.set(fallback);
          }

          this.products.set([]);
          this.totalCount.set(0);
          this.isLoadingProducts.set(false);
        },
      });
  }
}
