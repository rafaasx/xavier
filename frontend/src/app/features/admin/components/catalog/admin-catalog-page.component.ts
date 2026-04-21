import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import {
  AdminAffiliateLink,
  AdminMediaAspectRatio,
  AdminMediaType,
  AdminProduct,
  AdminProductListItem,
  AdminProductMedia,
  AdminTag,
} from '../../models/admin-catalog.models';
import { AdminCatalogService } from '../../services/admin-catalog.service';

@Component({
  selector: 'app-admin-catalog-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  templateUrl: './admin-catalog-page.component.html',
  styleUrl: './admin-catalog-page.component.scss',
})
export class AdminCatalogPageComponent {
  private readonly service = inject(AdminCatalogService);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly products = signal<readonly AdminProductListItem[]>([]);
  protected readonly tags = signal<readonly AdminTag[]>([]);
  protected readonly selectedProduct = signal<AdminProduct | null>(null);
  protected readonly selectedProductId = signal<string | null>(null);
  protected readonly loading = signal(false);
  protected readonly saving = signal(false);
  protected readonly successMessage = signal<string | null>(null);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly mediaTypes: readonly AdminMediaType[] = ['IMAGE', 'YOUTUBE', 'INSTAGRAM', 'VIDEO'];
  protected readonly aspectRatios: readonly AdminMediaAspectRatio[] = ['RATIO_16_9', 'RATIO_9_16'];

  protected readonly productForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
    shortDescription: ['', [Validators.required, Validators.maxLength(240)]],
    longDescription: ['', [Validators.required]],
    tagIds: this.fb.nonNullable.control<string[]>([]),
  });

  protected readonly createTagForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(80)]],
  });

  protected readonly mediaForm = this.fb.nonNullable.group({
    url: ['', [Validators.required]],
    type: this.fb.nonNullable.control<AdminMediaType>('IMAGE'),
    aspectRatio: this.fb.nonNullable.control<AdminMediaAspectRatio>('RATIO_16_9'),
    order: this.fb.nonNullable.control(0, [Validators.min(0)]),
  });

  protected readonly affiliateForm = this.fb.nonNullable.group({
    platform: ['', [Validators.required, Validators.maxLength(80)]],
    url: ['', [Validators.required]],
  });

  constructor() {
    this.refreshTags();
    this.refreshProducts();
  }

  protected selectProduct(productId: string): void {
    this.selectedProductId.set(productId);
    this.clearMessages();
    this.loadProductDetail(productId);
  }

  protected prepareCreateProduct(): void {
    this.selectedProductId.set(null);
    this.selectedProduct.set(null);
    this.productForm.reset({
      name: '',
      shortDescription: '',
      longDescription: '',
      tagIds: [],
    });
    this.mediaForm.reset({
      url: '',
      type: 'IMAGE',
      aspectRatio: 'RATIO_16_9',
      order: 0,
    });
    this.affiliateForm.reset({
      platform: '',
      url: '',
    });
    this.clearMessages();
  }

  protected saveProduct(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.clearMessages();

    const payload = this.productForm.getRawValue();
    const selectedId = this.selectedProductId();

    if (selectedId) {
      this.service
        .updateProduct(selectedId, payload)
        .pipe(
          finalize(() => this.saving.set(false)),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe({
          next: () => {
            this.successMessage.set('Produto atualizado com sucesso.');
            this.refreshProducts(selectedId);
          },
          error: (error: unknown) => this.handleRequestError(error),
        });
      return;
    }

    this.service
      .createProduct(payload)
      .pipe(
        finalize(() => this.saving.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (response) => {
          this.successMessage.set('Produto criado com sucesso.');
          this.refreshProducts(response.id);
        },
        error: (error: unknown) => this.handleRequestError(error),
      });
  }

  protected deleteSelectedProduct(): void {
    const id = this.selectedProductId();
    if (!id) {
      return;
    }

    this.saving.set(true);
    this.clearMessages();

    this.service
      .deleteProduct(id)
      .pipe(
        finalize(() => this.saving.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.successMessage.set('Produto removido com sucesso.');
          this.prepareCreateProduct();
          this.refreshProducts();
        },
        error: (error: unknown) => this.handleRequestError(error),
      });
  }

  protected isSelectedTag(tagId: string): boolean {
    return this.productForm.controls.tagIds.value.includes(tagId);
  }

  protected toggleTag(tagId: string, checked: boolean): void {
    const current = this.productForm.controls.tagIds.value;
    if (checked) {
      if (!current.includes(tagId)) {
        this.productForm.controls.tagIds.setValue([...current, tagId]);
      }
      return;
    }

    this.productForm.controls.tagIds.setValue(current.filter((id) => id !== tagId));
  }

  protected onTagCheckboxChange(tagId: string, event: Event): void {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    this.toggleTag(tagId, target.checked);
  }

  protected createTag(): void {
    if (this.createTagForm.invalid) {
      this.createTagForm.markAllAsTouched();
      return;
    }

    const { name } = this.createTagForm.getRawValue();
    this.saving.set(true);
    this.clearMessages();
    this.service
      .createTag(name)
      .pipe(
        finalize(() => this.saving.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.createTagForm.reset({ name: '' });
          this.successMessage.set('Tag criada com sucesso.');
          this.refreshTags();
        },
        error: (error: unknown) => this.handleRequestError(error),
      });
  }

  protected deleteTag(tagId: string): void {
    this.saving.set(true);
    this.clearMessages();

    this.service
      .deleteTag(tagId)
      .pipe(
        finalize(() => this.saving.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.productForm.controls.tagIds.setValue(
            this.productForm.controls.tagIds.value.filter((id) => id !== tagId),
          );
          this.successMessage.set('Tag removida com sucesso.');
          this.refreshTags();
          const selectedId = this.selectedProductId();
          if (selectedId) {
            this.loadProductDetail(selectedId);
          }
        },
        error: (error: unknown) => this.handleRequestError(error),
      });
  }

  protected addMedia(): void {
    const productId = this.selectedProductId();
    if (!productId) {
      this.errorMessage.set('Salve ou selecione um produto antes de cadastrar mídias.');
      return;
    }

    if (this.mediaForm.invalid) {
      this.mediaForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.clearMessages();
    this.service
      .createMedia(productId, this.mediaForm.getRawValue())
      .pipe(
        finalize(() => this.saving.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.mediaForm.reset({
            url: '',
            type: 'IMAGE',
            aspectRatio: 'RATIO_16_9',
            order: 0,
          });
          this.successMessage.set('Mídia adicionada com sucesso.');
          this.loadProductDetail(productId);
        },
        error: (error: unknown) => this.handleRequestError(error),
      });
  }

  protected updateMedia(
    media: AdminProductMedia,
    url: string,
    type: string,
    aspectRatio: string,
    order: string,
  ): void {
    const parsedType = this.parseMediaType(type);
    const parsedAspectRatio = this.parseAspectRatio(aspectRatio);
    const parsedOrder = Number(order);
    if (!parsedType || !parsedAspectRatio || !Number.isInteger(parsedOrder) || parsedOrder < 0) {
      this.errorMessage.set('Dados de mídia inválidos.');
      return;
    }

    this.saving.set(true);
    this.clearMessages();
    this.service
      .updateMedia(media.id, {
        url: url.trim(),
        type: parsedType,
        aspectRatio: parsedAspectRatio,
        order: parsedOrder,
      })
      .pipe(
        finalize(() => this.saving.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.successMessage.set('Mídia atualizada com sucesso.');
          const selectedId = this.selectedProductId();
          if (selectedId) {
            this.loadProductDetail(selectedId);
          }
        },
        error: (error: unknown) => this.handleRequestError(error),
      });
  }

  protected deleteMedia(mediaId: string): void {
    this.saving.set(true);
    this.clearMessages();
    this.service
      .deleteMedia(mediaId)
      .pipe(
        finalize(() => this.saving.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.successMessage.set('Mídia removida com sucesso.');
          const selectedId = this.selectedProductId();
          if (selectedId) {
            this.loadProductDetail(selectedId);
          }
        },
        error: (error: unknown) => this.handleRequestError(error),
      });
  }

  protected reorderMedias(): void {
    const selected = this.selectedProduct();
    if (!selected) {
      return;
    }

    const items = [...selected.medias]
      .sort((a, b) => a.order - b.order)
      .map((media, index) => ({ mediaId: media.id, order: index }));

    this.saving.set(true);
    this.clearMessages();
    this.service
      .reorderMedias(selected.id, items)
      .pipe(
        finalize(() => this.saving.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.successMessage.set('Ordem das mídias atualizada.');
          this.loadProductDetail(selected.id);
        },
        error: (error: unknown) => this.handleRequestError(error),
      });
  }

  protected addAffiliateLink(): void {
    const productId = this.selectedProductId();
    if (!productId) {
      this.errorMessage.set('Salve ou selecione um produto antes de cadastrar links afiliados.');
      return;
    }

    if (this.affiliateForm.invalid) {
      this.affiliateForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.clearMessages();
    this.service
      .createAffiliateLink(productId, this.affiliateForm.getRawValue())
      .pipe(
        finalize(() => this.saving.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.affiliateForm.reset({ platform: '', url: '' });
          this.successMessage.set('Link afiliado adicionado com sucesso.');
          this.loadProductDetail(productId);
        },
        error: (error: unknown) => this.handleRequestError(error),
      });
  }

  protected updateAffiliateLink(link: AdminAffiliateLink, platform: string, url: string): void {
    this.saving.set(true);
    this.clearMessages();
    this.service
      .updateAffiliateLink(link.id, {
        platform: platform.trim(),
        url: url.trim(),
      })
      .pipe(
        finalize(() => this.saving.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.successMessage.set('Link afiliado atualizado com sucesso.');
          const selectedId = this.selectedProductId();
          if (selectedId) {
            this.loadProductDetail(selectedId);
          }
        },
        error: (error: unknown) => this.handleRequestError(error),
      });
  }

  protected deleteAffiliateLink(linkId: string): void {
    this.saving.set(true);
    this.clearMessages();
    this.service
      .deleteAffiliateLink(linkId)
      .pipe(
        finalize(() => this.saving.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.successMessage.set('Link afiliado removido com sucesso.');
          const selectedId = this.selectedProductId();
          if (selectedId) {
            this.loadProductDetail(selectedId);
          }
        },
        error: (error: unknown) => this.handleRequestError(error),
      });
  }

  private refreshProducts(selectProductId?: string): void {
    this.loading.set(true);
    this.service
      .getProducts()
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (response) => {
          this.products.set(response.items);
          if (selectProductId) {
            this.selectProduct(selectProductId);
            return;
          }

          const currentId = this.selectedProductId();
          if (currentId && response.items.some((item) => item.id === currentId)) {
            this.loadProductDetail(currentId);
          }
        },
        error: (error: unknown) => this.handleRequestError(error),
      });
  }

  private refreshTags(): void {
    this.service
      .getTags()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (tags) => this.tags.set(tags),
        error: (error: unknown) => this.handleRequestError(error),
      });
  }

  private loadProductDetail(productId: string): void {
    this.loading.set(true);
    this.service
      .getProductById(productId)
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (product) => {
          this.selectedProduct.set(product);
          this.productForm.reset({
            name: product.name,
            shortDescription: product.shortDescription,
            longDescription: product.longDescription,
            tagIds: product.tags.map((tag) => tag.id),
          });
        },
        error: (error: unknown) => this.handleRequestError(error),
      });
  }

  private parseMediaType(value: string): AdminMediaType | null {
    return this.mediaTypes.includes(value as AdminMediaType) ? (value as AdminMediaType) : null;
  }

  private parseAspectRatio(value: string): AdminMediaAspectRatio | null {
    return this.aspectRatios.includes(value as AdminMediaAspectRatio) ? (value as AdminMediaAspectRatio) : null;
  }

  private clearMessages(): void {
    this.successMessage.set(null);
    this.errorMessage.set(null);
  }

  private handleRequestError(error: unknown): void {
    console.error(error);
    if (error instanceof HttpErrorResponse && typeof error.error?.error === 'string') {
      this.errorMessage.set(error.error.error);
      return;
    }

    this.errorMessage.set('Não foi possível concluir a operação.');
  }
}

