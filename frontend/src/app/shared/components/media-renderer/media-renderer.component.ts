import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { MediaType } from '../../enums/media-type.enum';
import { Media } from '../../models/media.model';

declare global {
  interface Window {
    instgrm?: {
      Embeds?: {
        process: () => void;
      };
    };
  }
}

@Component({
  selector: 'app-media-renderer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './media-renderer.component.html',
  styleUrl: './media-renderer.component.scss',
})
export class MediaRendererComponent implements AfterViewInit, OnDestroy {
  private static instagramScriptPromise: Promise<void> | null = null;

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private destroyed = false;
  private observer?: IntersectionObserver;

  protected readonly mediaType = MediaType;
  readonly media = input.required<Media>();
  readonly prioritize = input(false);
  protected readonly isVisible = signal(!this.isBrowser);
  protected readonly canRenderRichMedia = computed(() => this.prioritize() || this.isVisible());
  protected readonly instagramBlockquoteStyle =
    'background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin:1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:calc(100% - 2px);';
  protected readonly youtubeEmbedUrl = computed<SafeResourceUrl | null>(() => {
    if (this.media().type !== MediaType.YOUTUBE) {
      return null;
    }

    const embedUrl = this.toYoutubeEmbedUrl(this.media().url);
    return embedUrl ? this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl) : null;
  });
  protected readonly isInstagramReel = computed(
    () => this.media().type === MediaType.INSTAGRAM && /\/reel\//i.test(this.media().url),
  );
  protected readonly isInstagramPost = computed(
    () => this.media().type === MediaType.INSTAGRAM && /\/p\//i.test(this.media().url),
  );
  protected readonly instagramPermalink = computed(() => {
    if (this.media().type !== MediaType.INSTAGRAM) {
      return null;
    }

    return this.toInstagramPermalink(this.media().url);
  });

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.destroyed = true;
    });

    if (!this.isBrowser) {
      return;
    }

    effect(() => {
      if (this.media().type !== MediaType.INSTAGRAM || !this.canRenderRichMedia()) {
        return;
      }

      this.requestInstagramProcessing();
    });
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) {
      return;
    }

    if (this.media().type === MediaType.INSTAGRAM && this.prioritize()) {
      this.requestInstagramProcessing();
      return;
    }

    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          return;
        }

        this.isVisible.set(true);

        if (this.media().type === MediaType.INSTAGRAM) {
          this.requestInstagramProcessing();
        }

        this.observer?.disconnect();
      },
      {
        rootMargin: '220px 0px',
        threshold: 0.01,
      },
    );

    this.observer.observe(this.host.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private requestInstagramProcessing(): void {
    if (!this.isBrowser) {
      return;
    }

    window.requestAnimationFrame(() => {
      void this.processInstagramEmbed();
    });
  }

  private async processInstagramEmbed(): Promise<void> {
    await this.loadInstagramScript();

    if (!this.destroyed) {
      window.instgrm?.Embeds?.process?.();
    }
  }

  private loadInstagramScript(): Promise<void> {
    if (!this.isBrowser) {
      return Promise.resolve();
    }

    if (window.instgrm?.Embeds?.process) {
      return Promise.resolve();
    }

    if (MediaRendererComponent.instagramScriptPromise) {
      return MediaRendererComponent.instagramScriptPromise;
    }

    const existing = document.querySelector<HTMLScriptElement>('script[data-instgrm-script="true"]');
    if (existing) {
      MediaRendererComponent.instagramScriptPromise = new Promise((resolve) => {
        existing.addEventListener('load', () => resolve(), { once: true });
        if (window.instgrm?.Embeds?.process) {
          resolve();
        }
      });

      return MediaRendererComponent.instagramScriptPromise;
    }

    MediaRendererComponent.instagramScriptPromise = new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://www.instagram.com/embed.js';
      script.async = true;
      script.dataset['instgrmScript'] = 'true';
      script.onload = () => resolve();
      script.onerror = () => resolve();
      document.body.appendChild(script);
    });

    return MediaRendererComponent.instagramScriptPromise;
  }

  private toYoutubeEmbedUrl(rawUrl: string): string | null {
    const patterns = [
      /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?(?:.*&)?v=([^&#/]+)/i,
      /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?#/]+)/i,
      /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([^?#/]+)/i,
      /^(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?#/]+)/i,
    ];

    for (const pattern of patterns) {
      const match = rawUrl.match(pattern);
      const videoId = match?.[1];
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    return null;
  }

  private toInstagramPermalink(rawUrl: string): string {
    if (!URL.canParse(rawUrl)) {
      return rawUrl;
    }

    const url = new URL(rawUrl);
    const pathname = url.pathname;
    const match = pathname.match(/\/(p|reel)\/([^/?#]+)/i);

    if (!match) {
      return rawUrl;
    }

    const type = match[1].toLowerCase();
    const shortcode = match[2];
    return `https://www.instagram.com/${type}/${shortcode}/?utm_source=ig_embed&utm_campaign=loading`;
  }
}

