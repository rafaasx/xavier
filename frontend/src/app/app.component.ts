import { Component } from '@angular/core';

import { MatrixRainComponent } from './core/matrix-rain.component';
import { AppLayoutComponent } from './layout/app-layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AppLayoutComponent, MatrixRainComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}

