export type AdminTag = Readonly<{
  id: string;
  name: string;
}>;

export type AdminMediaType = 'IMAGE' | 'YOUTUBE' | 'INSTAGRAM' | 'VIDEO';
export type AdminMediaAspectRatio = 'RATIO_16_9' | 'RATIO_9_16';

export type AdminProductMedia = Readonly<{
  id: string;
  url: string;
  type: AdminMediaType;
  aspectRatio: AdminMediaAspectRatio;
  order: number;
}>;

export type AdminAffiliateLink = Readonly<{
  id: string;
  platform: string;
  url: string;
}>;

export type AdminProduct = Readonly<{
  id: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  tags: readonly AdminTag[];
  medias: readonly AdminProductMedia[];
  affiliateLinks: readonly AdminAffiliateLink[];
}>;

export type AdminProductListItem = Readonly<{
  id: string;
  name: string;
  shortDescription: string;
}>;

export type AdminProductListResponse = Readonly<{
  items: readonly AdminProductListItem[];
  totalCount: number;
  page: number;
  pageSize: number;
}>;

