import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
import { BlogService, BlogPost } from '../service/blog.service';
import { SettingsService } from '../service/settings.service';
import { BlogPreview } from './blog-preview/blog-preview';
import { Navbar } from '../navbar/navbar';
import { ContactForm } from '../contact-form/contact-form';
import { TechIllustrationComponent } from '../tech-illustration/tech-illustration';

@Component({
  selector: 'app-blog',
  imports: [BlogPreview, Navbar, ContactForm, TechIllustrationComponent],
  templateUrl: './blog.html',
  styleUrl: './blog.scss',
})
export class Blog implements OnInit, OnDestroy {
  posts = signal<BlogPost[]>([]);
  loading = signal(true);
  searchQuery = signal('');
  contactFormOpen = signal(false);

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  navItems = [
    {
      label: 'Home',
      linkOrElement: '/',
      external: true, 
      svg: '<svg class="icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9.5L12 2l9 7.5V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9.5z"/><path d="M9 22V12h6v10"/></svg>',
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
    this.blogService.getPosts().subscribe(posts => {
      this.posts.set(posts);
      this.loading.set(false);
    });

    this.searchSubject
      .pipe(
        debounceTime(250),
        distinctUntilChanged(),
        switchMap(query => this.blogService.searchPosts(query)),
        takeUntil(this.destroy$)
      )
      .subscribe(posts => {
        this.posts.set(posts);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
    this.searchSubject.next(value);
  }

  toggleContactForm(): void {
    this.contactFormOpen.update(v => !v);
  }
}
