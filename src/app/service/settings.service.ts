import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SiteSettings {
  [key: string]: string;
}

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private settings: SiteSettings = {};
  private loaded = false;

  constructor(private http: HttpClient) {}

  load(): Observable<SiteSettings> {
    return new Observable((observer) => {
      this.http.get<SiteSettings>('/api/settings/public').subscribe({
        next: (settings) => {
          this.settings = settings;
          this.loaded = true;
          observer.next(settings);
          observer.complete();
        },
        error: (err) => {
          // Fallback to defaults if API isn't available
          this.settings = {
            site_title: 'Matt King',
            site_subtitle: 'Software Engineer',
            blog_title: 'Blog',
            blog_subtitle: 'Thoughts on software engineering, design, and the things I learn along the way.',
            portfolio_title: 'Portfolio',
            portfolio_subtitle: 'A collection of solo projects I have worked on.',
            contact_email: 'matt@mattking.uk',
            contact_phone: '+44 7765 016924',
            footer_copyright: '© 2026 Matt King. All rights reserved.',
          };
          this.loaded = true;
          observer.next(this.settings);
          observer.complete();
        },
      });
    });
  }

  get(key: string, fallback: string = ''): string {
    return this.settings[key] || fallback;
  }

  isLoaded(): boolean {
    return this.loaded;
  }
}
