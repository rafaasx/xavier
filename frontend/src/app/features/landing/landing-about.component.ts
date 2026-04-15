import { Component, ChangeDetectionStrategy } from '@angular/core';

import { landingContent } from './landing-data';

@Component({
  selector: 'app-landing-about',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './landing-about.component.html',
  styleUrl: './landing-about.component.scss',
})
export class LandingAboutComponent {
  protected readonly paragraphs = landingContent.aboutParagraphs;
}

