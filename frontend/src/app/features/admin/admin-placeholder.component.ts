import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-placeholder',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin-placeholder.component.html',
  styleUrl: './admin-placeholder.component.scss',
})
export class AdminPlaceholderComponent {}

