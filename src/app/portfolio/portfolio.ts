import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { Project, PortfolioService } from '../service/portfolio.service';
import { SettingsService } from '../service/settings.service';
import { ContactForm } from '../contact-form/contact-form';
import { TechIllustrationComponent } from '../tech-illustration/tech-illustration';

interface GridItem {
  project: Project;
  colSpan: number;
  rowSpan: number;
}

@Component({
  selector: 'app-portfolio',
  imports: [RouterLink, Navbar, ContactForm, TechIllustrationComponent],
  templateUrl: './portfolio.html',
  styleUrls: ['./portfolio.scss'],
})
export class Portfolio implements OnInit {
  items = signal<GridItem[]>([]);
  loading = signal(true);
  hoveredId = signal<number | null>(null);
  contactFormOpen = signal(false);

  navItems = [
    {
      label: 'Home',
      linkOrElement: '/',
      external: true,
      svg: '<svg class="icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9.5L12 2l9 7.5V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9.5z"/><path d="M9 22V12h6v10"/></svg>',
    },
    {
      label: 'Blog',
      linkOrElement: '/blog',
      external: true,
      svg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 3.5 H20 A1.5 1.5 0 0 1 21.5 5 V15.5 A1.5 1.5 0 0 1 20 17 H9 L6 20 L6.5 17 H4 A1.5 1.5 0 0 1 2.5 15.5 V5 A1.5 1.5 0 0 1 4 3.5 Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><line x1="6.5" y1="8.5" x2="17.5" y2="8.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="6.5" y1="12" x2="14.5" y2="12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    },
    {
      label: 'Contact',
      linkOrElement: 'contactForm',
      external: false,
      svg: '<svg class="icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>',
    },
  ];

  constructor(private portfolioService: PortfolioService, public settingsService: SettingsService) {}

  ngOnInit(): void {
    this.portfolioService.getProjects().subscribe(projects => {
      const gridItems = projects.map((project, i) => {
        const sizes = this.getRandomSize(i);
        return { project, ...sizes };
      });
      this.items.set(gridItems);
      this.loading.set(false);
    });
  }

  private getRandomSize(index: number): { colSpan: number; rowSpan: number } {
    // Predetermined pattern that creates visual variety like a word cloud
    const patterns = [
      { colSpan: 2, rowSpan: 2 }, 
      { colSpan: 1, rowSpan: 1 }, 
      { colSpan: 1, rowSpan: 2 }, 
      { colSpan: 2, rowSpan: 1 }, 
      { colSpan: 1, rowSpan: 1 }, 
      { colSpan: 2, rowSpan: 2 }, 
      { colSpan: 1, rowSpan: 1 }, 
      { colSpan: 1, rowSpan: 2 }, 
      { colSpan: 2, rowSpan: 1 }, 
    ];
    return patterns[index % patterns.length];
  }

  onHover(id: number): void {
    this.hoveredId.set(id);
  }

  onLeave(): void {
    this.hoveredId.set(null);
  }

  toggleContactForm(): void {
    this.contactFormOpen.update(v => !v);
  }
}
