import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  effect,
  inject,
  signal,
} from '@angular/core';
import { ThemeService } from './theme.service';

type Raindrop = {
  x: number;
  y: number;
  speed: number;
  length: number;
  char: string;
};

@Component({
  selector: 'app-matrix-rain',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <canvas #canvas class="matrix" aria-hidden="true"></canvas>
  `,
  styles: `
    :host {
      position: fixed;
      inset: 0;
      z-index: 0;
      pointer-events: none;
      display: block;
    }

    .matrix {
      width: 100%;
      height: 100%;
      display: block;
      opacity: 0;
      transition: opacity 240ms ease;
      filter: blur(0.4px) saturate(1.2);
    }

    :host(.is-dark) .matrix {
      opacity: 0.22;
    }
  `,
})
export class MatrixRainComponent {
  private readonly theme = inject(ThemeService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly viewReady = signal(false);

  @ViewChild('canvas', { static: true }) private readonly canvasRef!: ElementRef<HTMLCanvasElement>;

  private readonly characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*+-_=<>[]{}';
  private readonly drops: Raindrop[] = [];
  private ctx: CanvasRenderingContext2D | null = null;
  private animationFrameId?: number;
  private resizeHandler?: () => void;
  private active = false;
  private lastFrame = 0;
  private readonly fontSize = 16;
  private logicalWidth = 0;
  private logicalHeight = 0;

  constructor() {
    effect(() => {
      if (!this.viewReady()) {
        return;
      }

      if (!this.isBrowser) {
        return;
      }

      const host = this.getHost();
      if (!host) {
        return;
      }

      host.classList.toggle('is-dark', this.theme.mode() === 'dark');

      if (this.theme.mode() === 'dark') {
        this.start();
      } else {
        this.stop();
      }
    });
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) {
      return;
    }

    this.ctx = this.canvasRef.nativeElement.getContext('2d');
    this.resizeCanvas();
    this.resizeHandler = () => this.resizeCanvas();
    window.addEventListener('resize', this.resizeHandler, { passive: true });
    this.viewReady.set(true);

    if (this.theme.mode() === 'dark') {
      this.start();
    }
  }

  ngOnDestroy(): void {
    this.stop();

    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
    }
  }

  private start(): void {
    if (this.active || !this.ctx) {
      return;
    }

    this.active = true;
    this.lastFrame = 0;
    this.animate(0);
  }

  private stop(): void {
    this.active = false;

    if (this.animationFrameId) {
      window.cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = undefined;
    }

    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.logicalWidth, this.logicalHeight);
    }
  }

  private animate = (timestamp: number): void => {
    if (!this.active || !this.ctx) {
      return;
    }

    if (timestamp - this.lastFrame < 42) {
      this.animationFrameId = window.requestAnimationFrame(this.animate);
      return;
    }

    this.lastFrame = timestamp;
    this.drawFrame();
    this.animationFrameId = window.requestAnimationFrame(this.animate);
  };

  private drawFrame(): void {
    if (!this.ctx) {
      return;
    }

    const canvas = this.canvasRef.nativeElement;
    const ctx = this.ctx;
    const width = this.logicalWidth;
    const height = this.logicalHeight;

    ctx.fillStyle = 'rgba(7, 21, 13, 0.055)';
    ctx.fillRect(0, 0, width, height);

    ctx.font = `${this.fontSize}px SFMono-Regular, Consolas, Liberation Mono, monospace`;
    ctx.textBaseline = 'top';
    ctx.shadowColor = 'rgba(127, 214, 139, 0.25)';
    ctx.shadowBlur = 6;

    for (const drop of this.drops) {
      ctx.fillStyle = 'rgba(127, 214, 139, 0.18)';
      ctx.fillText(drop.char, drop.x, drop.y);

      if (Math.random() > 0.94) {
        drop.char = this.randomChar();
      }

      drop.y += drop.speed;

      if (drop.y > height + drop.length * this.fontSize) {
        drop.y = -drop.length * this.fontSize * (0.25 + Math.random());
        drop.speed = 0.45 + Math.random() * 0.9;
        drop.length = 8 + Math.floor(Math.random() * 14);
        drop.char = this.randomChar();
      }
    }
  }

  private resizeCanvas(): void {
    if (!this.ctx) {
      return;
    }

    const canvas = this.canvasRef.nativeElement;
    const ratio = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.logicalWidth = width;
    this.logicalHeight = height;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    this.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    this.seedDrops(width, height);
  }

  private seedDrops(width: number, height: number): void {
    const columns = Math.max(Math.floor(width / 22), 16);
    this.drops.length = 0;

    for (let index = 0; index < columns; index += 1) {
      this.drops.push({
        x: index * 22,
        y: Math.random() * height,
        speed: 0.45 + Math.random() * 0.9,
        length: 8 + Math.floor(Math.random() * 16),
        char: this.randomChar(),
      });
    }
  }

  private randomChar(): string {
    return this.characters[Math.floor(Math.random() * this.characters.length)];
  }

  private getHost(): HTMLElement | null {
    return this.canvasRef?.nativeElement?.parentElement ?? null;
  }
}
