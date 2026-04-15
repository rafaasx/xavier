import { Component, ChangeDetectionStrategy } from '@angular/core';

import { landingContent } from './landing-data';

@Component({
  selector: 'app-landing-experiences',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './landing-experiences.component.html',
  styleUrl: './landing-experiences.component.scss',
})
export class LandingExperiencesComponent {
  protected readonly experiences = landingContent.experienceCards;
  protected readonly stats = landingContent.landingStats;
}

