import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, signal, ViewChildren, QueryList, ElementRef, AfterViewInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss'],
})
export class Navbar implements OnInit, OnDestroy, AfterViewInit {

  @ViewChildren('navItem') navItemEls!: QueryList<ElementRef<HTMLLIElement>>;

  @Input() items: { svg: string, label: string, linkOrElement:  string, external?: boolean }[] = [];
  @Output() contactFormToggle = new EventEmitter<void>();
  itemDisplay: any[] = [];
  isInJourney = signal(false);
  isSidebar = signal(false);
  isMobile = signal(false);
  labelOpacity = signal(1);
  
  backgroundBounds = signal({ left: 0, top: 0, width: 0, height: 0 });

  constructor(private sanitizer: DomSanitizer) {}

  readonly spacing = 9;        
  readonly topStart = 90;      
  readonly leftStart = 12;    
  readonly leftEnd = 96;        
  readonly topEnd = 12;         
  readonly endSpacing = 9;      
  readonly horizontalPhase = 0.6;

  readonly mobileBreakpoint = 768;

  readonly padding = 12; // background padding

  private scrollHandler = this.recalculatePositions.bind(this);
  private resizeHandler = this.onResize.bind(this);
  private finalBoundsTimer: any;
  private mediaQuery?: MediaQueryList;
  private mediaHandler = (e: MediaQueryListEvent) => this.isMobile.set(e.matches);

  ngOnInit() {
    this.items.forEach((item, index) => {
      this.itemDisplay.push({
        ...item,
        svg: this.sanitizer.bypassSecurityTrustHtml(item.svg),
        left: this.leftStart + index * this.spacing,
        top: this.topStart,
      });
    });

    // Detect mobile
    this.mediaQuery = window.matchMedia(`(max-width: ${this.mobileBreakpoint}px)`);
    this.isMobile.set(this.mediaQuery.matches);
    this.mediaQuery.addEventListener('change', this.mediaHandler);

    window.addEventListener('scroll', this.scrollHandler, { passive: true });
    window.addEventListener('resize', this.resizeHandler, { passive: true });
    this.recalculatePositions();
  }

  ngAfterViewInit() {
    this.updateBackgroundBounds();
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.scrollHandler);
    window.removeEventListener('resize', this.resizeHandler);
    this.mediaQuery?.removeEventListener('change', this.mediaHandler);
    if (this.finalBoundsTimer) clearTimeout(this.finalBoundsTimer);
  }

  onResize() {
    this.recalculatePositions();
  }

  recalculatePositions() {
    const progress = Math.min(Math.max(window.scrollY / (0.9 * window.innerHeight), 0), 1);

    if (this.isMobile()) {
      this.isInJourney.set(false);
      this.isSidebar.set(false);
      this.labelOpacity.set(0);
      return;
    }

    this.isInJourney.set(progress > 0 && progress < 1);
    this.isSidebar.set(progress >= 1);
    this.labelOpacity.set(Math.max(0, 1 - progress * 10));

    const maxDist = this.leftEnd - this.leftStart;

    this.itemDisplay.forEach((item, index) => {
      const startLeft = this.leftStart + index * this.spacing;
      const itemDist = this.leftEnd - startLeft;
      const endTop = this.topEnd + index * this.endSpacing;

      const arrivalProgress = this.horizontalPhase * (itemDist / maxDist);

      if (progress >= 1) {
        item.left = this.leftEnd;
        item.top = endTop;
      } else if (progress <= 0) {
        item.left = startLeft;
        item.top = this.topStart;
      } else if (progress <= arrivalProgress) {
        const hFraction = progress / arrivalProgress;
        item.left = startLeft + itemDist * hFraction;
        item.top = this.topStart - (progress * 100);
      } else {
        const topAtArrival = this.topStart - (arrivalProgress * 100);
        const vFraction = Math.min((progress - arrivalProgress) / (1 - arrivalProgress), 1);
        item.left = this.leftEnd;
        item.top = topAtArrival + (endTop - topAtArrival) * vFraction;
      }
    });

    requestAnimationFrame(() => this.updateBackgroundBounds());

    if (progress >= 1 || progress <= 0) {
      if (this.finalBoundsTimer) clearTimeout(this.finalBoundsTimer);
      this.finalBoundsTimer = setTimeout(() => {
        this.updateBackgroundBounds();
      }, 100);
    }
  }

  updateBackgroundBounds() {
    if (this.isMobile()) return;
    if (!this.navItemEls || this.navItemEls.length === 0) return;

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    this.navItemEls.forEach(el => {
      let rect: DOMRect;
      if (this.isInJourney()) {
        const iconEl = el.nativeElement.querySelector('.icon-wrapper');
        rect = iconEl ? iconEl.getBoundingClientRect() : el.nativeElement.getBoundingClientRect();
      } else {
        rect = el.nativeElement.getBoundingClientRect();
      }
      minX = Math.min(minX, rect.left);
      minY = Math.min(minY, rect.top);
      maxX = Math.max(maxX, rect.right);
      maxY = Math.max(maxY, rect.bottom);
    });

    this.backgroundBounds.set({
      left: minX - this.padding,
      top: minY - this.padding,
      width: (maxX - minX) + this.padding * 2,
      height: (maxY - minY) + this.padding * 2,
    });
  }

  openExternal(url: string) {
    window.open(url, '_self');
  }

  navigate(element: string) {
    if(element === 'contactForm') {
      this.contactFormToggle.emit();
    }else{
      const target = document.getElementById(element);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

}
