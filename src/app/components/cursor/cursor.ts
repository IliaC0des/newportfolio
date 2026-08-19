import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, signal } from '@angular/core';
import { MotionService } from '../../core/motion.service';

@Component({
  selector: 'app-cursor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ring" #ring [class.is-active]="active()" [class.is-labelled]="!!label()">
      <span class="ring__label">{{ label() }}</span>
    </div>
    <div class="dot" #dot [class.is-active]="active()"></div>
  `,
  styleUrl: './cursor.css',
})
export class Cursor {
  protected readonly label = signal('');
  protected readonly active = signal(false);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly motion = inject(MotionService);

  constructor() {
    afterNextRender(() => {
      if (this.motion.isTouch()) return;
      const root = this.host.nativeElement;
      document.documentElement.classList.add('has-custom-cursor');
      this.destroyRef.onDestroy(() =>
        document.documentElement.classList.remove('has-custom-cursor'),
      );
      this.motion.context(root, this.destroyRef, ({ gsap }) => {
        const dot = root.querySelector<HTMLElement>('.dot');
        const ring = root.querySelector<HTMLElement>('.ring');
        if (!dot || !ring) return;
        gsap.set([dot, ring], { xPercent: -50, yPercent: -50, opacity: 0 });

        const dotX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3.out' });
        const dotY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3.out' });
        const ringX = gsap.quickTo(ring, 'x', { duration: 0.55, ease: 'power3.out' });
        const ringY = gsap.quickTo(ring, 'y', { duration: 0.55, ease: 'power3.out' });

        let revealed = false;

        const onMove = (event: PointerEvent) => {
          if (!revealed) {
            revealed = true;
            gsap.to([dot, ring], { opacity: 1, duration: 0.3 });
          }
          dotX(event.clientX);
          dotY(event.clientY);
          ringX(event.clientX);
          ringY(event.clientY);
        };
        const onOver = (event: PointerEvent) => {
          const target = (event.target as HTMLElement | null)?.closest<HTMLElement>(
            '[data-cursor], a, button',
          );
          if (!target) {
            this.active.set(false);
            this.label.set('');
            return;
          }
          this.active.set(true);
          this.label.set(target.dataset['cursor'] ?? '');
        };
        const onLeave = () => gsap.to([dot, ring], { opacity: 0, duration: 0.25 });
        const onEnter = () => gsap.to([dot, ring], { opacity: 1, duration: 0.25 });
        window.addEventListener('pointermove', onMove, { passive: true });
        window.addEventListener('pointerover', onOver, { passive: true });
        document.addEventListener('pointerleave', onLeave);
        document.addEventListener('pointerenter', onEnter);
        this.destroyRef.onDestroy(() => {
          window.removeEventListener('pointermove', onMove);
          window.removeEventListener('pointerover', onOver);
          document.removeEventListener('pointerleave', onLeave);
          document.removeEventListener('pointerenter', onEnter);
        });
      });
    });
  }
}
