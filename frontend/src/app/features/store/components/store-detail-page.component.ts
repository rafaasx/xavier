import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { MediaType } from '../../../shared/enums/media-type.enum';
import { Media } from '../../../shared/models/media.model';
import { MediaRendererComponent } from '../../../shared/components/media-renderer/media-renderer.component';
import { StoreProductDetail, StoreProductMedia } from '../models/store.models';
import { StoreApiService } from '../services/store-api.service';
import { SeoService } from '../../../core/seo.service';

@Component({
  selector: 'app-store-detail-page',
  standalone: true,
  imports: [RouterLink, MediaRendererComponent],
  templateUrl: './store-detail-page.component.html',
  styleUrl: './store-detail-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly storeApi = inject(StoreApiService);
  private readonly seo = inject(SeoService);

  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly product = signal<StoreProductDetail | null>(null);

  protected readonly medias = computed<readonly Media[]>(() => {
    const current = this.product();
    if (!current) {
      return [];
    }

    return current.medias.map((media) => this.mapMedia(media));
  });

  constructor() {
    this.seo.setPageMeta({
      title: 'Produto | Loja Rafael Xavier',
      description: 'Detalhes do produto recomendado por Rafael Xavier.',
      canonicalPath: '/store',
    });

    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const id = params.get('id');
      if (!id) {
        this.errorMessage.set('Produto invalido.');
        this.product.set(null);
        this.isLoading.set(false);
        return;
      }

      this.loadProduct(id);
    });
  }

  protected trackByMediaId(_index: number, media: Media): string {
    return media.id;
  }

  protected trackByTagId(_index: number, tag: { id: string }): string {
    return tag.id;
  }

  protected trackByLinkId(_index: number, link: { id: string }): string {
    return link.id;
  }

  private mapMedia(media: StoreProductMedia): Media {
    const aspectRatio = media.aspectRatio === 'RATIO_9_16' ? '9:16' : '16:9';
    const mappedType =
      media.type === 'IMAGE'
        ? MediaType.IMAGE
        : media.type === 'YOUTUBE'
          ? MediaType.YOUTUBE
          : media.type === 'INSTAGRAM'
            ? MediaType.INSTAGRAM
            : MediaType.VIDEO;

    return {
      id: media.id,
      url: media.url,
      type: mappedType,
      aspectRatio,
      alt: 'Midia do produto',
    };
  }

  private loadProduct(id: string): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.storeApi
      .getProductById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (product) => {
          this.product.set(product);
          this.seo.setPageMeta({
            title: `${product.name} | Loja Rafael Xavier`,
            description: product.shortDescription,
            keywords: `produto, loja, ${product.name}, Rafael Xavier`,
            canonicalPath: `/store/${product.id}`,
            type: 'article',
          });
          this.isLoading.set(false);
        },
        error: (error: unknown) => {
          const fallback = 'Nao foi possivel carregar os detalhes do produto.';
          if (error instanceof HttpErrorResponse && typeof error.error?.error === 'string') {
            this.errorMessage.set(error.error.error);
          } else {
            this.errorMessage.set(fallback);
          }

          this.product.set(null);
          this.isLoading.set(false);
        },
      });
  }
}
