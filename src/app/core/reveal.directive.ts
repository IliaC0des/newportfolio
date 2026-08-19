import {
  DestroyRef,
  Directive,
  ElementRef,
  afterNextRender,
  inject,
  input,
} from '@angular/core';
import { MotionService } from './motion.service';

@Directive({
  selector: '[appReveal]',
  host: { '[attr.data-reveal]': '""' },
})
export class RevealDirective {
  readonly y = input(32);
  readonly delay = input(0);
  readonly stagger = input(0);
  readonly duration = input(1.05);
  readonly start = input('top 85%');
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly motion = inject(MotionService);

  constructor() {
    afterNextRender(() => {
      const el = this.host.nativeElement;
      void this.motion.ready().then((kit) => {
        if (!kit) el.style.opacity = '1';
      });
      this.motion.context(el, this.destroyRef, ({ gsap }) => {
        const items =
          this.stagger() > 0
            ? Array.from(el.querySelectorAll<HTMLElement>('[data-reveal-item]'))
            : [];
        if (items.length) gsap.set(el, { opacity: 1 });
        gsap.fromTo(
          items.length ? items : el,
          { opacity: 0, y: this.y() },
          {
            opacity: 1,
            y: 0,
            duration: this.duration(),
            delay: this.delay(),
            stagger: this.stagger(),
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: this.start(), once: true },
          },
        );
      });
    });
  }
}
