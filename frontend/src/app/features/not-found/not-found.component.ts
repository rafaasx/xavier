import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SeoService } from '../../core/seo.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent {
  private readonly seo = inject(SeoService);
  protected readonly funnyMessage = this.pickRandomMessage();

  constructor() {
    this.seo.setPageMeta({
      title: 'Página não encontrada | Rafael Xavier',
      description: 'A página solicitada não existe ou foi movida.',
      canonicalPath: '/404',
    });
  }

  private pickRandomMessage(): string {
    const messages: readonly string[] = [
      'Ops! Essa página saiu para tomar um café e ainda não voltou.',
      'Erro 404: procuramos até debaixo do sofá e nada.',
      'Essa URL pegou o ônibus errado.',
      'A página foi de arrasta para cima.',
      'Nada aqui... só o vento e um 404.',
      'A rota fugiu do GPS.',
      'Você encontrou um portal para o absoluto nada.',
      'Essa página está em reunião infinita.',
      '404: conteúdo não encontrado, mas a esperança sim.',
      'Parece que essa página foi promovida a lenda urbana.',
    ];
    const index = Math.floor(Math.random() * messages.length);
    return messages[index] ?? messages[0];
  }
}

