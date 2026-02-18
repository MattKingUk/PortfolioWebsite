import { Component, Output, EventEmitter, AfterViewInit, OnDestroy, signal, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-contact-form',
  imports: [],
  templateUrl: './contact-form.html',
  styleUrls: ['./contact-form.scss'],
})
export class ContactForm implements AfterViewInit, OnDestroy {
  @Output() closed = new EventEmitter<void>();
  @ViewChild('sidebarEl') sidebarEl!: ElementRef<HTMLDivElement>;
  @ViewChild('stickyEl') stickyEl!: ElementRef<HTMLDivElement>;

  sidebarHeight = signal(0);
  private resizeObserver?: ResizeObserver;

  ngAfterViewInit(): void {
    this.calculateSidebarHeight();
    this.setupResizeObserver();

    setTimeout(() => {
      this.stickyEl?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }, 500);
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  calculateSidebarHeight(): void {
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      const sections = mainContent.querySelectorAll('section');
      let totalHeight = 0;
      sections.forEach(section => {
        totalHeight += (section as HTMLElement).offsetHeight;
      });
      this.sidebarHeight.set(totalHeight);
    }
  }

  private setupResizeObserver(): void {
    this.resizeObserver?.disconnect();
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) return;

    this.resizeObserver = new ResizeObserver(() => {
      this.calculateSidebarHeight();
    });

    const sections = mainContent.querySelectorAll('section');
    sections.forEach(section => this.resizeObserver!.observe(section));
  }

  submitContactForm(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const name = (form.querySelector('#contact-name') as HTMLInputElement).value;
    const email = (form.querySelector('#contact-email') as HTMLInputElement).value;
    const subject = (form.querySelector('#contact-subject') as HTMLInputElement).value;
    const message = (form.querySelector('#contact-message') as HTMLTextAreaElement).value;

    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    const mailtoLink = `mailto:matt@mattking.uk?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  }
}
