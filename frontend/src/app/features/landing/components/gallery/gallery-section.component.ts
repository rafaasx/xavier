import { ChangeDetectionStrategy, Component, HostListener, signal } from '@angular/core';

import { MediaRendererComponent } from '../../../../shared/components/media-renderer/media-renderer.component';
import { MediaType } from '../../../../shared/enums/media-type.enum';
import { Media } from '../../../../shared/models/media.model';
import { galleryMediaContent } from '../../../gallery/gallery-content';

@Component({
  selector: 'app-gallery-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MediaRendererComponent],
  templateUrl: './gallery-section.component.html',
  styleUrl: './gallery-section.component.scss',
})
export class GallerySectionComponent {
  protected readonly mediaType = MediaType;
  protected readonly medias: readonly Media[] = galleryMediaContent;
  protected readonly youtubeMedias = this.medias.filter((media) => media.type === MediaType.YOUTUBE);
  protected readonly instagramMedias = this.medias.filter((media) => media.type === MediaType.INSTAGRAM);

  protected readonly selectedMedia = signal<Media | null>(null);

  @HostListener('document:keydown.escape')
  protected closeOnEscape(): void {
    this.closePreview();
  }

  protected openPreview(media: Media): void {
    if (!this.isPreviewable(media)) {
      return;
    }

    this.selectedMedia.set(media);
  }

  protected closePreview(): void {
    this.selectedMedia.set(null);
  }

  protected isPreviewable(media: Media): boolean {
    return media.type === MediaType.IMAGE || media.type === MediaType.VIDEO || media.type === MediaType.YOUTUBE;
  }
}

