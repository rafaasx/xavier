import { Component, ChangeDetectionStrategy } from '@angular/core';

import { LandingAboutComponent } from './landing-about.component';
import { GallerySectionComponent } from './components/gallery/gallery-section.component';
import { LandingExperiencesComponent } from './landing-experiences.component';
import { LandingHeroComponent } from './landing-hero.component';
import { LandingSocialLinksComponent } from './landing-social-links.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LandingHeroComponent,
    LandingAboutComponent,
    GallerySectionComponent,
    LandingExperiencesComponent,
    LandingSocialLinksComponent,
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent {
}

