import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-admin-section-placeholder',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './admin-section-placeholder.component.html',
  styleUrl: './admin-section-placeholder.component.scss',
})
export class AdminSectionPlaceholderComponent {
  private readonly route = inject(ActivatedRoute);

  protected readonly title = toSignal(
    this.route.data.pipe(map((data) => String(data['title'] ?? 'Módulo administrativo'))),
    { initialValue: 'Módulo administrativo' },
  );
}

