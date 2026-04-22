import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

type SeoPayload = Readonly<{
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  type?: 'website' | 'article';
  canonicalPath?: string;
}>;

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  setPageMeta(payload: SeoPayload): void {
    this.title.setTitle(payload.title);
    this.updateMetaTag('name', 'description', payload.description);
    this.updateMetaTag('name', 'keywords', payload.keywords ?? '');
    this.updateMetaTag('property', 'og:title', payload.title);
    this.updateMetaTag('property', 'og:description', payload.description);
    this.updateMetaTag('property', 'og:type', payload.type ?? 'website');
    this.updateMetaTag('property', 'og:url', this.resolveUrl(payload.canonicalPath));
    this.updateMetaTag('property', 'og:image', payload.image ?? '/assets/portrait-rafael-no-bg.png');
    this.updateMetaTag('name', 'twitter:card', 'summary_large_image');
    this.updateMetaTag('name', 'twitter:title', payload.title);
    this.updateMetaTag('name', 'twitter:description', payload.description);
    this.updateCanonical(payload.canonicalPath);
  }

  private updateMetaTag(attribute: 'name' | 'property', key: string, content: string): void {
    if (!content) {
      this.meta.removeTag(`${attribute}="${key}"`);
      return;
    }

    this.meta.updateTag({ [attribute]: key, content });
  }

  private updateCanonical(path?: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const href = this.resolveUrl(path);
    let link = this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }

    link.setAttribute('href', href);
  }

  private resolveUrl(path?: string): string {
    if (!isPlatformBrowser(this.platformId)) {
      return path ?? '';
    }

    const origin = this.document.location?.origin ?? '';
    const currentPath = this.document.location?.pathname ?? '';
    const normalizedPath = path ?? currentPath;
    return `${origin}${normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`}`;
  }
}

