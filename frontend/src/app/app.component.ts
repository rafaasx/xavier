import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="shell">
      <header class="shell__header">
        <div>
          <p class="eyebrow">xavier</p>
          <h1>Static MVP foundation</h1>
          <p class="subtitle">Angular 17 standalone shell with lazy-loaded feature routes.</p>
        </div>

        <nav class="shell__nav" aria-label="Primary">
          <a routerLink="/landing" routerLinkActive="is-active">Landing</a>
          <a routerLink="/linktree" routerLinkActive="is-active">Linktree</a>
          <a routerLink="/store" routerLinkActive="is-active">Store</a>
          <a routerLink="/admin" routerLinkActive="is-active">Admin</a>
        </nav>
      </header>

      <main class="shell__content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }

    .shell {
      width: min(1120px, calc(100% - 2rem));
      margin: 0 auto;
      padding: 1.25rem 0 2rem;
    }

    .shell__header,
    .shell__content {
      backdrop-filter: blur(18px);
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 1.25rem;
      box-shadow: 0 30px 70px rgba(2, 6, 23, 0.28);
    }

    .shell__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 1.25rem 1.5rem;
      margin-bottom: 1rem;
    }

    .eyebrow {
      margin: 0 0 0.25rem;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      font-size: 0.72rem;
      color: var(--accent);
    }

    h1 {
      margin: 0;
      font-size: clamp(1.45rem, 2vw, 2rem);
    }

    .subtitle {
      margin: 0.4rem 0 0;
      color: var(--muted);
    }

    .shell__nav {
      display: flex;
      flex-wrap: wrap;
      gap: 0.6rem;
      justify-content: flex-end;
    }

    .shell__nav a {
      padding: 0.7rem 0.95rem;
      border-radius: 999px;
      text-decoration: none;
      color: var(--muted);
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid transparent;
      transition: 150ms ease;
    }

    .shell__nav a:hover,
    .shell__nav a.is-active {
      color: var(--text);
      border-color: rgba(103, 232, 249, 0.35);
      background: rgba(103, 232, 249, 0.08);
    }

    .shell__content {
      padding: 1.25rem;
    }

    @media (max-width: 720px) {
      .shell__header {
        flex-direction: column;
        align-items: flex-start;
      }

      .shell__nav {
        justify-content: flex-start;
      }
    }
  `]
})
export class AppComponent {}
