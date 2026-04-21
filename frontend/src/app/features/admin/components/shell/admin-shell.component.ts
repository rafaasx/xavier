import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { AdminLoadingOverlayComponent } from '../loading-overlay/admin-loading-overlay.component';
import { AdminMenuComponent, AdminMenuItem } from '../menu/admin-menu.component';
import { AdminAuthService } from '../../services/admin-auth.service';
import { AdminRequestLoadingService } from '../../services/admin-request-loading.service';

@Component({
  selector: 'app-admin-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AdminLoadingOverlayComponent, AdminMenuComponent, RouterOutlet],
  templateUrl: './admin-shell.component.html',
  styleUrl: './admin-shell.component.scss',
})
export class AdminShellComponent {
  private readonly authService = inject(AdminAuthService);
  private readonly router = inject(Router);

  protected readonly requestLoading = inject(AdminRequestLoadingService);
  protected readonly menuItems: readonly AdminMenuItem[] = [
    { label: 'Produtos', route: '/admin/products' },
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

