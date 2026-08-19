import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { MotionService } from '../../core/motion.service';
import { MagneticDirective } from '../../core/magnetic.directive';

export const NAV_PROFILE = {
  name: 'Ilia Iliadi',
  logo: {
    src: '/assets/images/logo-72.webp',
    srcset: '/assets/images/logo-72.webp 72w, /assets/images/logo-144.webp 144w',
    alt: 'Ilia Iliadi monogram',
  },
  role: 'Web Developer',
  cv: {
    label: 'Download CV',
    url: 'assets/CV.pdf',
    filename: 'Ilia-Iliadi-CV.pdf',
  },
};

export const NAV_LINKS = [
  { label: 'Home', target: 'hero' },
  { label: 'About', target: 'about' },
  { label: 'Work', target: 'work' },
  { label: 'Contact', target: 'contact' },
];

@Component({
  selector: 'app-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MagneticDirective],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav {
  protected readonly profile = NAV_PROFILE;
  protected readonly links = NAV_LINKS;

  protected readonly active = signal(NAV_LINKS[0].target);
  protected readonly scrolled = signal(false);
  protected readonly hidden = signal(false);
  protected readonly menuOpen = signal(false);

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly motion = inject(MotionService);

  constructor() {
    afterNextRender(() => {
      const root = this.host.nativeElement;

      this.motion.context(root, this.destroyRef, ({ gsap, ScrollTrigger }) => {
        const bar = root.querySelector<HTMLElement>('.progress__fill');

        ScrollTrigger.create({
          start: 0,
          end: 'max',
          onUpdate: (self) => {
            if (bar) gsap.set(bar, { scaleX: self.progress });
            this.scrolled.set(self.scroll() > 40);
            this.hidden.set(self.direction === 1 && self.scroll() > 320 && !this.menuOpen());
          },
        });

        for (const link of this.links) {
          const section = document.getElementById(link.target);
          if (!section) continue;
          ScrollTrigger.create({
            trigger: section,
            start: 'top 45%',
            end: 'bottom 45%',
            onToggle: (self) => self.isActive && this.active.set(link.target),
          });
        }
      });
    });
  }

  protected go(event: Event, target: string): void {
    event.preventDefault();
    this.menuOpen.set(false);
    this.hidden.set(false);
    this.motion.scrollTo(target);
  }

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }
}
