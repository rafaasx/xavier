import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { brand, navigationLinks, socialLinks } from '../../core/site-data';

@Component({
  selector: 'app-linktree',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './linktree.component.html',
  styleUrl: './linktree.component.scss',
})
export class LinktreeComponent {
  protected readonly brand = brand;
  protected readonly navigationLinks = navigationLinks;
  protected readonly socialLinks = socialLinks;
}

