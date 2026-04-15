import { Component, ChangeDetectionStrategy, OnDestroy, OnInit, computed, signal } from '@angular/core';
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
  private readonly headlines = ['Engenheiro de Software Full Stack', 'Criador de Conteúdo', 'Video Maker'];
  private timerId?: number;
  private readonly index = signal(0);

  readonly currentHeadline = computed(() => this.headlines[this.index()]);

  ngOnInit(): void {
    this.timerId = window.setInterval(() => {
      this.index.update((value) => (value + 1) % this.headlines.length);
    }, 3000);
  }

  ngOnDestroy(): void {
    if (this.timerId) {
      window.clearInterval(this.timerId);
    }
  }
}

