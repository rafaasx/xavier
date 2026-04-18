import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { filter, map, startWith } from 'rxjs';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';

import { brand, headerLinks } from '../core/site-data';
import { ThemeService } from '../core/theme.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FaIconComponent, RouterLink, RouterOutlet],
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.scss',
})
export class AppLayoutComponent {
  private readonly router = inject(Router);

  protected readonly brand = brand;
  protected readonly headerLinks = headerLinks;
  protected readonly currentYear = new Date().getFullYear();
  protected readonly faSun = faSun;
  protected readonly faMoon = faMoon;
  protected readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );
  protected readonly showHeader = computed(
    () => !this.currentUrl().startsWith('/links') && !this.currentUrl().startsWith('/linktree'),
  );

  constructor(protected readonly theme: ThemeService) {}

  protected toggleTheme(): void {
    this.theme.toggle();
  }
}

