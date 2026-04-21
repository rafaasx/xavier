import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

export type AdminMenuItem = {
  label: string;
  route: string;
};

@Component({
  selector: 'app-admin-menu',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './admin-menu.component.html',
  styleUrl: './admin-menu.component.scss',
})
export class AdminMenuComponent {
  @Input({ required: true }) items: readonly AdminMenuItem[] = [];
}

