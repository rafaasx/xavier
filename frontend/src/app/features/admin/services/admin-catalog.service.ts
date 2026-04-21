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

@Injectable({ providedIn: 'root' })
export class AdminCatalogService {
  private readonly http = inject(HttpClient);
  private readonly apiBase = runtimeEnv.apiBaseUrl;

  getProducts(): Observable<AdminProductListResponse> {
    return this.http.get<AdminProductListResponse>(`${this.apiBase}/products`, {
      params: {
        page: '1',
        pageSize: '50',
        sort: 'recent',
      },
    });
  }

  getProductById(id: string): Observable<AdminProduct> {
    return this.http.get<AdminProduct>(`${this.apiBase}/products/${id}`);
  }

  createProduct(payload: ProductUpsertPayload): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(`${this.apiBase}/products`, payload);
  }

  updateProduct(id: string, payload: ProductUpsertPayload): Observable<void> {
    return this.http.put<void>(`${this.apiBase}/products/${id}`, payload);
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBase}/products/${id}`);
  }

  getTags(): Observable<readonly AdminTag[]> {
    return this.http.get<readonly AdminTag[]>(`${this.apiBase}/tags`);
  }

  createTag(name: string): Observable<AdminTag> {
    return this.http.post<AdminTag>(`${this.apiBase}/tags`, { name });
  }

  deleteTag(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBase}/tags/${id}`);
  }

  createMedia(productId: string, payload: MediaPayload): Observable<unknown> {
    return this.http.post(`${this.apiBase}/products/${productId}/medias`, payload);
  }

  updateMedia(mediaId: string, payload: MediaPayload): Observable<void> {
    return this.http.put<void>(`${this.apiBase}/medias/${mediaId}`, payload);
  }

  deleteMedia(mediaId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBase}/medias/${mediaId}`);
  }

  reorderMedias(productId: string, items: ReadonlyArray<{ mediaId: string; order: number }>): Observable<void> {
    return this.http.put<void>(`${this.apiBase}/products/${productId}/medias/reorder`, { items });
  }

  createAffiliateLink(productId: string, payload: AffiliatePayload): Observable<AdminAffiliateLink> {
    return this.http.post<AdminAffiliateLink>(`${this.apiBase}/products/${productId}/affiliate-links`, payload);
  }

  updateAffiliateLink(id: string, payload: AffiliatePayload): Observable<void> {
    return this.http.put<void>(`${this.apiBase}/affiliate-links/${id}`, payload);
  }

  deleteAffiliateLink(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBase}/affiliate-links/${id}`);
  }
}

