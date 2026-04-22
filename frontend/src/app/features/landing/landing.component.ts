import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { LandingAboutComponent } from './landing-about.component';
import { GallerySectionComponent } from './components/gallery/gallery-section.component';
import { LandingExperiencesComponent } from './landing-experiences.component';
import { LandingHeroComponent } from './landing-hero.component';
import { LandingSocialLinksComponent } from './landing-social-links.component';
import { SeoService } from '../../core/seo.service';

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
  private readonly seo = inject(SeoService);

  constructor() {
    this.seo.setPageMeta({
      title: 'Rafael Xavier | Engenheiro de Software e Criador de Conteúdo',
      description:
        'Portfólio e hub pessoal de Rafael Xavier com experiências, galeria, redes sociais e acesso à loja de recomendações.',
      keywords:
        'Rafael Xavier, engenheiro de software, angular, dotnet, criador de conteúdo, video maker, portfólio',
      canonicalPath: '/',
    });
  }
}

