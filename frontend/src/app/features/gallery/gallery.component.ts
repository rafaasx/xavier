import { ChangeDetectionStrategy, Component } from '@angular/core';

import { GallerySectionComponent } from '../landing/components/gallery/gallery-section.component';

@Component({
  selector: 'app-gallery-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GallerySectionComponent],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
})
export class GalleryComponent {}

