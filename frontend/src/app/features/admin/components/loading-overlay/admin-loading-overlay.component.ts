import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'app-admin-loading-overlay',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './admin-loading-overlay.component.html',
  styleUrl: './admin-loading-overlay.component.scss',
})
export class AdminLoadingOverlayComponent {
  private readonly funnyMessages = [
    'Aguarde: estamos subornando o bug com café.',
    'Compilando paciência... quase lá.',
    'Nosso duende DevOps foi buscar mais RAM.',
    'A API está alongando antes da próxima resposta.',
    'Polindo bytes com pano de microfibra.',
    'Rodando testes de vibe em produção controlada.',
    'A consulta SQL caiu no modo contemplativo.',
    'Sincronizando com o multiverso das requisições.',
    'Treinando o hamster backend para sprint final.',
    'Carregando... porque velocidade sem charme é só pressa.',
  ] as const;

  protected readonly randomMessage = signal(this.pickRandomMessage());

  private pickRandomMessage(): string {
    const index = Math.floor(Math.random() * this.funnyMessages.length);
    return this.funnyMessages[index]!;
  }
}

