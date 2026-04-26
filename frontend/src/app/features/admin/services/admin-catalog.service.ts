import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { runtimeEnv } from '../../../core/runtime-env';
import {
  AdminAffiliateLink,
  AdminMediaAspectRatio,
  AdminMediaType,
  AdminProduct,
  AdminProductListResponse,
  AdminTag,
} from '../models/admin-catalog.models';

type ProductUpsertPayload = Readonly<{
  name: string;
  shortDescription: string;
  longDescription: string;
  tagIds: readonly string[];
}>;

type MediaPayload = Readonly<{
  url: string;
  type: AdminMediaType;
  aspectRatio: AdminMediaAspectRatio;
  order: number;
}>;

type AffiliatePayload = Readonly<{
  platform: string;
  url: string;
}>;

type ProductsQuery = Readonly<{
  search?: string;
  page: number;
  pageSize: number;
}>;

type ProductCommand =
  | (ProductUpsertPayload & Readonly<{ action: 'create_product' }>)
  | (ProductUpsertPayload & Readonly<{ action: 'update_product'; productId: string }>)
  | Readonly<{ action: 'delete_product'; productId: string }>
  | Readonly<{ action: 'create_tag'; name: string }>
  | Readonly<{ action: 'delete_tag'; tagId: string }>
  | (MediaPayload & Readonly<{ action: 'create_media'; productId: string }>)
  | (MediaPayload & Readonly<{ action: 'update_media'; mediaId: string }>)
  | Readonly<{ action: 'delete_media'; mediaId: string }>
  | Readonly<{
      action: 'reorder_medias';
      productId: string;
      items: ReadonlyArray<{ mediaId: string; order: number }>;
    }>
  | (AffiliatePayload & Readonly<{ action: 'create_affiliate_link'; productId: string }>)
  | (AffiliatePayload & Readonly<{ action: 'update_affiliate_link'; affiliateLinkId: string }>)
  | Readonly<{ action: 'delete_affiliate_link'; affiliateLinkId: string }>;

@Injectable({ providedIn: 'root' })
export class AdminCatalogService {
  private readonly http = inject(HttpClient);
  private readonly apiBase = runtimeEnv.apiBaseUrl;

  private executeCommand<TResponse = void>(command: ProductCommand): Observable<TResponse> {
    return this.http.post<TResponse>(`${this.apiBase}/products`, command);
  }

  getProducts(query: ProductsQuery): Observable<AdminProductListResponse> {
    const params: Record<string, string> = {
      page: String(query.page),
      pageSize: String(query.pageSize),
      sort: 'recent',
    };

    if (query.search && query.search.trim().length > 0) {
      params['search'] = query.search.trim();
    }

    return this.http.get<AdminProductListResponse>(`${this.apiBase}/products`, {
      params,
    });
  }

  getProductById(id: string): Observable<AdminProduct> {
    return this.http.get<AdminProduct>(`${this.apiBase}/products/${id}`);
  }

  createProduct(payload: ProductUpsertPayload): Observable<{ id: string }> {
    return this.executeCommand<{ id: string }>({
      action: 'create_product',
      ...payload,
    });
  }

  updateProduct(id: string, payload: ProductUpsertPayload): Observable<void> {
    return this.executeCommand<void>({
      action: 'update_product',
      productId: id,
      ...payload,
    });
  }

  deleteProduct(id: string): Observable<void> {
    return this.executeCommand<void>({
      action: 'delete_product',
      productId: id,
    });
  }

  getTags(): Observable<readonly AdminTag[]> {
    return this.http.get<readonly AdminTag[]>(`${this.apiBase}/tags`);
  }

  createTag(name: string): Observable<AdminTag> {
    return this.executeCommand<AdminTag>({
      action: 'create_tag',
      name,
    });
  }

  deleteTag(id: string): Observable<void> {
    return this.executeCommand<void>({
      action: 'delete_tag',
      tagId: id,
    });
  }

  createMedia(productId: string, payload: MediaPayload): Observable<unknown> {
    return this.executeCommand({
      action: 'create_media',
      productId,
      ...payload,
    });
  }

  updateMedia(mediaId: string, payload: MediaPayload): Observable<void> {
    return this.executeCommand<void>({
      action: 'update_media',
      mediaId,
      ...payload,
    });
  }

  deleteMedia(mediaId: string): Observable<void> {
    return this.executeCommand<void>({
      action: 'delete_media',
      mediaId,
    });
  }

  reorderMedias(productId: string, items: ReadonlyArray<{ mediaId: string; order: number }>): Observable<void> {
    return this.executeCommand<void>({
      action: 'reorder_medias',
      productId,
      items,
    });
  }

  createAffiliateLink(productId: string, payload: AffiliatePayload): Observable<AdminAffiliateLink> {
    return this.executeCommand<AdminAffiliateLink>({
      action: 'create_affiliate_link',
      productId,
      ...payload,
    });
  }

  updateAffiliateLink(id: string, payload: AffiliatePayload): Observable<void> {
    return this.executeCommand<void>({
      action: 'update_affiliate_link',
      affiliateLinkId: id,
      ...payload,
    });
  }

  deleteAffiliateLink(id: string): Observable<void> {
    return this.executeCommand<void>({
      action: 'delete_affiliate_link',
      affiliateLinkId: id,
    });
  }
}

