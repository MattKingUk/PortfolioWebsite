import { Component, OnInit, signal } from '@angular/core';
import { Navbar } from "../navbar/navbar";
import { BlogPreview } from '../blog/blog-preview/blog-preview';
import { BlogService, BlogPost } from '../service/blog.service';
import { SettingsService } from '../service/settings.service';
import { ContactForm } from '../contact-form/contact-form';
import { TechIllustrationComponent } from '../tech-illustration/tech-illustration';

@Component({
  selector: 'app-home',
  imports: [Navbar, BlogPreview, ContactForm, TechIllustrationComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class Home implements OnInit {
  latestPost = signal<BlogPost | null>(null);
  contactFormOpen = signal(false);

  navItems = [
    {
      label: 'Calendar',
      linkOrElement: 'calendar',
      external: false,
      svg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="4.5" width="18" height="16" rx="2" stroke="currentColor" stroke-width="1.5"/><line x1="3" y1="9" x2="21" y2="9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="8" y1="2.5" x2="8" y2="6.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="16" y1="2.5" x2="16" y2="6.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><rect x="7" y="12" width="3" height="3" rx="0.5" fill="currentColor"/></svg>',
    },
    {
      label: 'Blog',
      linkOrElement: 'blog-preview',
      external: false,
      svg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 3.5 H20 A1.5 1.5 0 0 1 21.5 5 V15.5 A1.5 1.5 0 0 1 20 17 H9 L6 20 L6.5 17 H4 A1.5 1.5 0 0 1 2.5 15.5 V5 A1.5 1.5 0 0 1 4 3.5 Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><line x1="6.5" y1="8.5" x2="17.5" y2="8.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="6.5" y1="12" x2="14.5" y2="12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    },
    {
      label: 'Portfolio',
      linkOrElement: '/portfolio',
      external: true,
      svg: '<svg class="icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>',
    },
    {
      label: 'Contact',
      linkOrElement: 'contactForm',
      external: false,
      svg: '<svg class="icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>',
    },
  ];

  constructor(private blogService: BlogService, public settingsService: SettingsService) {}

  ngOnInit(): void {
    this.blogService.getLatestPost().subscribe(post => {
      this.latestPost.set(post);
    });
  }

  toggleContactForm(): void {
    this.contactFormOpen.update(v => !v);
  }
}
