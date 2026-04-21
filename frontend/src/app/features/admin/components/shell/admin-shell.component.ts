import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { AdminMenuComponent, AdminMenuItem } from '../menu/admin-menu.component';
import { AdminAuthService } from '../../services/admin-auth.service';

@Component({
  selector: 'app-admin-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AdminMenuComponent, RouterOutlet],
  templateUrl: './admin-shell.component.html',
  styleUrl: './admin-shell.component.scss',
})
export class AdminShellComponent {
  private readonly authService = inject(AdminAuthService);
  private readonly router = inject(Router);

  protected readonly menuItems: readonly AdminMenuItem[] = [
    { label: 'Produtos', route: '/admin/products' },
    { label: 'Mídias', route: '/admin/medias' },
    { label: 'Tags', route: '/admin/tags' },
    { label: 'Links afiliados', route: '/admin/affiliate-links' },
  ];

  protected logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        void this.router.navigate(['/admin/login']);
      },
      error: () => {
        this.authService.handleUnauthorized();
      },
    });
  }
}

