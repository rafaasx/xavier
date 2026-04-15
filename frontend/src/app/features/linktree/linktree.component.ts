import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faGithub, faInstagram, faLinkedinIn, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { faHouse, faStore } from '@fortawesome/free-solid-svg-icons';
import { RouterLink } from '@angular/router';

import { ThemeService } from '../../core/theme.service';
import { brand, linktreeLinks } from '../../core/site-data';

@Component({
  selector: 'app-linktree',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FaIconComponent, NgOptimizedImage, RouterLink],
  templateUrl: './linktree.component.html',
  styleUrl: './linktree.component.scss',
})
export class LinktreeComponent {
  protected readonly theme = inject(ThemeService);
  protected readonly faSun = faSun;
  protected readonly faMoon = faMoon;
  protected readonly brand = brand;
  protected readonly links = linktreeLinks.map((link) => ({
    ...link,
    icon: (
      link.label === 'YouTube'
        ? faYoutube
        : link.label === 'Instagram'
          ? faInstagram
          : link.label === 'LinkedIn'
            ? faLinkedinIn
            : link.label === 'GitHub'
              ? faGithub
              : link.label === 'Loja'
            ? faStore
            : faHouse
    ) as IconProp,
  }));

  protected toggleTheme(): void {
    this.theme.toggle();
  }
}

