import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-store-placeholder',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './store-placeholder.component.html',
  styleUrl: './store-placeholder.component.scss',
})
export class StorePlaceholderComponent {}

