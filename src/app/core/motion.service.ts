import { isPlatformBrowser } from '@angular/common';
import { DestroyRef, Injectable, PLATFORM_ID, inject, signal } from '@angular/core';

async function loadKit() {
  const [core, st, ss] = await Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger'),
    import('gsap/ScrollSmoother'),
  ]);
  core.gsap.registerPlugin(st.ScrollTrigger, ss.ScrollSmoother);
  return { gsap: core.gsap, ScrollTrigger: st.ScrollTrigger, ScrollSmoother: ss.ScrollSmoother };
}

export type MotionKit = Awaited<ReturnType<typeof loadKit>>;

interface Revertible {
  revert(): void;
}
@Injectable({ providedIn: 'root' })
export class MotionService {
  private readonly platformId = inject(PLATFORM_ID);

  readonly isBrowser = isPlatformBrowser(this.platformId);
  readonly reducedMotion = signal(false);

  readonly isTouch = signal(false);
  private kit: Promise<MotionKit | null> | null = null;
  private smoother: { scrollTo: (t: unknown, s?: boolean, p?: string) => void; kill: () => void } | null =
    null;
  private refreshHandle: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    if (!this.isBrowser || typeof window.matchMedia !== 'function') return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const touchQuery = window.matchMedia('(hover: none), (pointer: coarse)');
    const sync = () => {
      this.reducedMotion.set(motionQuery.matches);
      this.isTouch.set(touchQuery.matches);
      document.documentElement.classList.toggle('no-motion', motionQuery.matches);
      document.documentElement.classList.toggle('is-touch', touchQuery.matches);
    };
    sync();
    motionQuery.addEventListener?.('change', sync);
    touchQuery.addEventListener?.('change', sync);
  }

  ready(): Promise<MotionKit | null> {
    if (!this.isBrowser) return Promise.resolve(null);
    this.kit ??= loadKit().catch((err: unknown) => {
      console.warn('[motion] GSAP failed to load — falling back to static layout.', err);
      return null;
    });
    return this.kit;
  }
  context(
    scope: HTMLElement,
    destroyRef: DestroyRef,
    build: (kit: MotionKit, scope: HTMLElement) => void,
  ): void {
    if (!this.isBrowser || this.reducedMotion()) return;
    let ctx: Revertible | undefined;
    let destroyed = false;
    destroyRef.onDestroy(() => {
      destroyed = true;
      ctx?.revert();
    });

    void this.ready().then((kit) => {
      if (!kit || destroyed) return;
      ctx = kit.gsap.context(() => build(kit, scope), scope) as Revertible;
    });
  }

  initSmoothScroll(wrapper: HTMLElement, content: HTMLElement, destroyRef: DestroyRef): void {
    if (!this.isBrowser || this.reducedMotion() || this.isTouch()) return;
    destroyRef.onDestroy(() => {
      this.smoother?.kill();
      this.smoother = null;
    });
    void this.ready().then((kit) => {
      if (!kit) return;
      try {
        this.smoother = kit.ScrollSmoother.create({
          wrapper,
          content,
          smooth: 1.15,
          effects: true,
          normalizeScroll: true,
          ignoreMobileResize: true,
        }) as unknown as typeof this.smoother;
      } catch (err: unknown) {
        console.warn('[motion] ScrollSmoother unavailable — native scrolling stays on.', err);
      }
    });
  }

  scrollTo(target: string): void {
    if (!this.isBrowser) return;
    const el = document.getElementById(target);
    if (!el) return;
    if (this.smoother) {
      this.smoother.scrollTo(el, true, 'top top');
      return;
    }
    el.scrollIntoView({ behavior: this.reducedMotion() ? 'auto' : 'smooth', block: 'start' });
  }

  refresh(delay = 120): void {
    if (!this.isBrowser) return;
    if (this.refreshHandle) clearTimeout(this.refreshHandle);
    this.refreshHandle = setTimeout(() => {
      void this.ready().then((kit) => kit?.ScrollTrigger.refresh());
    }, delay);
  }
}
