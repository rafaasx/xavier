import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { runtimeEnv } from '../../../core/runtime-env';
import {
  StoreProductDetail,
  StoreProductsQuery,
  StoreProductsResponse,
  StoreTag,
} from '../models/store.models';

@Injectable({ providedIn: 'root' })
export class StoreApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBase = runtimeEnv.apiBaseUrl;

  getProducts(query: StoreProductsQuery): Observable<StoreProductsResponse> {
    let params = new HttpParams();

    if (query.search) {
      params = params.set('search', query.search);
    }

    if (query.tags?.length) {
      params = params.set('tags', query.tags.join(','));
    }

    if (query.sort) {
      params = params.set('sort', query.sort);
    }

    if (query.page) {
      params = params.set('page', String(query.page));
    }

    if (query.pageSize) {
      params = params.set('pageSize', String(query.pageSize));
    }

    return this.http.get<StoreProductsResponse>(`${this.apiBase}/products`, { params });
  }

  getProductById(id: string): Observable<StoreProductDetail> {
    return this.http.get<StoreProductDetail>(`${this.apiBase}/products/${id}`);
  }

  getTags(): Observable<readonly StoreTag[]> {
    return this.http.get<readonly StoreTag[]>(`${this.apiBase}/tags`);
  }
}
