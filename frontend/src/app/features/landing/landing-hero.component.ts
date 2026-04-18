import { Component, ChangeDetectionStrategy, OnDestroy, OnInit, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing-hero',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage, RouterLink],
  templateUrl: './landing-hero.component.html',
  styleUrl: './landing-hero.component.scss',
})
export class LandingHeroComponent implements OnInit, OnDestroy {
  private readonly headlines = ['Engenheiro de Software', 'Criador de Conteúdo', 'Video Maker'];
  private readonly scrambleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*+-_=<>[]{}';
  private cycleTimerId?: number;
  private animationFrameId?: number;
  private readonly reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  private readonly activeIndex = signal(0);

  readonly currentHeadline = signal(this.headlines[0]);

  ngOnInit(): void {
    this.scheduleNextCycle();
  }

  ngOnDestroy(): void {
    if (this.cycleTimerId) {
      window.clearTimeout(this.cycleTimerId);
    }

    if (this.animationFrameId) {
      window.cancelAnimationFrame(this.animationFrameId);
    }
  }

  private scheduleNextCycle(): void {
    if (this.cycleTimerId) {
      window.clearTimeout(this.cycleTimerId);
    }

    this.cycleTimerId = window.setTimeout(() => {
      const nextIndex = (this.activeIndex() + 1) % this.headlines.length;

      if (this.reducedMotion) {
        this.activeIndex.set(nextIndex);
        this.currentHeadline.set(this.headlines[nextIndex]);
        this.scheduleNextCycle();
        return;
      }

      this.animateHeadline(this.headlines[nextIndex]);
    }, 2600);
  }

  private animateHeadline(target: string): void {
    if (this.animationFrameId) {
      window.cancelAnimationFrame(this.animationFrameId);
    }

    const startText = this.currentHeadline();
    const startTime = window.performance.now();
    const duration = 900;
    const totalLength = Math.max(startText.length, target.length);

    const tick = (time: number) => {
      const progress = Math.min((time - startTime) / duration, 1);
      this.currentHeadline.set(this.scrambleText(startText, target, progress, totalLength));

      if (progress < 1) {
        this.animationFrameId = window.requestAnimationFrame(tick);
        return;
      }

      this.activeIndex.set(this.headlines.indexOf(target));
      this.currentHeadline.set(target);
      this.scheduleNextCycle();
    };

    this.animationFrameId = window.requestAnimationFrame(tick);
  }

  private scrambleText(source: string, target: string, progress: number, totalLength: number): string {
    const revealCount = Math.floor(progress * totalLength);
    const leadLength = Math.max(source.length, target.length);

    return Array.from({ length: leadLength }, (_, index) => {
      const targetChar = target[index] ?? ' ';
      const sourceChar = source[index] ?? ' ';

      if (targetChar === ' ') {
        return ' ';
      }

      if (index < revealCount) {
        return targetChar;
      }

      if (progress > 0.8 && sourceChar === targetChar) {
        return targetChar;
      }

      return this.randomScrambleChar(targetChar);
    }).join('');
  }

  private randomScrambleChar(targetChar: string): string {
    if (targetChar === targetChar.toUpperCase() && targetChar !== targetChar.toLowerCase()) {
      const upper = this.scrambleChars;
      return upper[Math.floor(Math.random() * upper.length)];
    }

    return this.scrambleChars[Math.floor(Math.random() * this.scrambleChars.length)];
  }
}

