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
  selector: '[appMagnetic]',
  host: { class: 'is-magnetic' },
})
export class MagneticDirective {
  readonly strength = input(0.32);
  readonly innerSelector = input('');
  readonly innerFactor = input(1.9);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly motion = inject(MotionService);

  constructor() {
    afterNextRender(() => {
      if (this.motion.isTouch()) return;

      const el = this.host.nativeElement;
      this.motion.context(el, this.destroyRef, ({ gsap }) => {
        const inner = this.innerSelector()
          ? el.querySelector<HTMLElement>(this.innerSelector())
          : null;
        let frame = 0;
        let pointer: PointerEvent | null = null;
        const apply = () => {
          frame = 0;
          if (!pointer) return;

          const rect = el.getBoundingClientRect();
          const dx = (pointer.clientX - (rect.left + rect.width / 2)) * this.strength();
          const dy = (pointer.clientY - (rect.top + rect.height / 2)) * this.strength();

          gsap.to(el, { x: dx, y: dy, duration: 0.5, ease: 'power3.out', overwrite: 'auto' });
          if (inner) {
            gsap.to(inner, {
              x: dx * this.innerFactor(),
              y: dy * this.innerFactor(),
              duration: 0.6,
              ease: 'power3.out',
              overwrite: 'auto',
            });
          }
        };
        const onMove = (event: PointerEvent) => {
          pointer = event;
          frame ||= requestAnimationFrame(apply);
        };
        const onLeave = () => {
          pointer = null;
          if (frame) {
            cancelAnimationFrame(frame);
            frame = 0;
          }
          const settle = {
            x: 0,
            y: 0,
            duration: 1,
            ease: 'elastic.out(1, 0.35)',
            overwrite: 'auto' as const,
          };
          gsap.to(el, settle);
          if (inner) gsap.to(inner, settle);
        };
        el.addEventListener('pointermove', onMove);
        el.addEventListener('pointerleave', onLeave);

        this.destroyRef.onDestroy(() => {
          el.removeEventListener('pointermove', onMove);
          el.removeEventListener('pointerleave', onLeave);
        });
      });
    });
  }
}
