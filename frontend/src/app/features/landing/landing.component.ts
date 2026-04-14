import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { brand, quickHighlights, socialLinks } from '../../core/site-data';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [NgOptimizedImage, RouterLink],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent {
  protected readonly brand = brand;
  protected readonly quickHighlights = quickHighlights;
  protected readonly socialLinks = socialLinks;
}

