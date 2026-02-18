import { Component, signal, OnInit, OnDestroy, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SettingsService } from './service/settings.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('portfolio-try-3');
  private themeInterval: ReturnType<typeof setInterval> | null = null;

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    public settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    this.settingsService.load().subscribe();
    
    this.applyThemeByTime();
    this.themeInterval = setInterval(() => this.applyThemeByTime(), 60_000);
  }

  ngOnDestroy(): void {
    if (this.themeInterval) {
      clearInterval(this.themeInterval);
    }
  }

  private applyThemeByTime(): void {
    const hour = new Date().getHours();
    const isNight = hour >= 20 || hour < 7;
    const html = this.document.documentElement;

    if (isNight) {
      this.renderer.addClass(html, 'dark');
    } else {
      this.renderer.removeClass(html, 'dark');
    }
  }

  formatPhoneLink(phone: string): string {
    return `tel:${(phone || '').replace(/\s+/g, '')}`;
  }
}
