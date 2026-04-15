import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FaIconComponent, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { type IconProp } from '@fortawesome/fontawesome-svg-core';
import { faGithub, faInstagram, faLinkedinIn, faYoutube } from '@fortawesome/free-brands-svg-icons';

import { socialLinks } from '../../core/site-data';

@Component({
  selector: 'app-landing-social-links',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FaIconComponent],
  templateUrl: './landing-social-links.component.html',
  styleUrl: './landing-social-links.component.scss',
})
export class LandingSocialLinksComponent {
  protected readonly socialLinks = socialLinks.map((link) => ({
    ...link,
    icon: (
      link.label === 'YouTube'
        ? ['fab', 'youtube']
        : link.label === 'Instagram'
          ? ['fab', 'instagram']
          : link.label === 'LinkedIn'
            ? ['fab', 'linkedin-in']
            : ['fab', 'github']
    ) as IconProp,
  }));

  constructor(library: FaIconLibrary) {
    library.addIcons(faYoutube, faInstagram, faLinkedinIn, faGithub);
  }
}

