export type StoreSort = 'recent' | 'name_asc' | 'name_desc';

export type StoreTag = Readonly<{
  id: string;
  name: string;
}>;

export type StoreProductCard = Readonly<{
  id: string;
  name: string;
  shortDescription: string;
  mainImage: string | null;
  tags: readonly StoreTag[];
}>;

export type StoreProductsResponse = Readonly<{
  items: readonly StoreProductCard[];
  totalCount: number;
  page: number;
  pageSize: number;
}>;

export type StoreProductsQuery = Readonly<{
  search?: string;
  tags?: readonly string[];
  sort?: StoreSort;
  page?: number;
  pageSize?: number;
}>;

export type StoreProductMedia = Readonly<{
  id: string;
  url: string;
  type: 'IMAGE' | 'YOUTUBE' | 'INSTAGRAM' | 'VIDEO';
  aspectRatio: 'RATIO_16_9' | 'RATIO_9_16';
  order: number;
}>;

export type StoreAffiliateLink = Readonly<{
  id: string;
  platform: string;
  url: string;
}>;

export type StoreProductDetail = Readonly<{
  id: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  medias: readonly StoreProductMedia[];
  tags: readonly StoreTag[];
  affiliateLinks: readonly StoreAffiliateLink[];
}>;
