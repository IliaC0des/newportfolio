import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';
import { NgxGridscanComponent } from '@omnedia/ngx-gridscan';
import { MotionService } from '../../core/motion.service';
import { MagneticDirective } from '../../core/magnetic.directive';

export interface Stat {
  value: string;
  label: string;
}

export interface HeroSocial {
  label: string;
  url: string;
  path: string;
}

export const HERO_PROFILE = {
  role: 'Front-End Developer',
  location: 'Tbilisi, Georgia',
  headline: ['Crafting web', 'experiences', 'that feel natural'],
  accentWord: 'natural',
  tagline:
    'I design and engineer high-fidelity web experiences where motion, typography and real-time graphics behave as one system.',
stats: [
    { value: '03+', label: 'Years coding' },
    { value: '1st', label: 'Hackathon winner' },
    { value: '100%', label: 'Real & fluff-free' },
    { value: '60', label: 'FPS, non-negotiable' },
  ] as Stat[],
};

export const HERO_SOCIALS: HeroSocial[] = [
  {
    label: 'GitHub',
    url: 'https://github.com/IliaC0des',
    path: 'M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z',
  },
  {
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/iliailiadi/',
    path: 'M3.5 3.5h17a.5.5 0 0 1 .5.5v17a.5.5 0 0 1-.5.5h-17a.5.5 0 0 1-.5-.5V4a.5.5 0 0 1 .5-.5ZM7 9.5H9.2v8H7v-8Zm1.1-3.6a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6ZM11 9.5h2.1v1.1a2.3 2.3 0 0 1 2.1-1.2c2 0 2.8 1.3 2.8 3.3v4.8h-2.2v-4.3c0-1.1-.4-1.7-1.3-1.7s-1.4.6-1.4 1.7v4.3H11v-8Z',
  },
  {
    label: 'Instagram',
    url: 'https://www.instagram.com/ilarionaaa7/',
    path: 'M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8Zm4 3a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm4.6-2.9a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z',
  },
  {
    label: 'Email',
    url: 'mailto:iliailiadi9@gmail.com',
    path: 'M3 5.5h18a.5.5 0 0 1 .5.5v12a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V6a.5.5 0 0 1 .5-.5Zm1.6 2L12 12.8l7.4-5.3H4.6Zm14.9 1.6-6.9 4.9a1 1 0 0 1-1.2 0L4.5 9.1v7.4h15V9.1Z',
  },
  {
    label: 'YouTube',
    url: 'https://www.youtube.com/@ilushayoutubze',
    path: 'M21.6 7.2a2.6 2.6 0 0 0-1.8-1.8C18.1 5 12 5 12 5s-6.1 0-7.8.4a2.6 2.6 0 0 0-1.8 1.8A27 27 0 0 0 2 12a27 27 0 0 0 .4 4.8 2.6 2.6 0 0 0 1.8 1.8c1.7.4 7.8.4 7.8.4s6.1 0 7.8-.4a2.6 2.6 0 0 0 1.8-1.8A27 27 0 0 0 22 12a27 27 0 0 0-.4-4.8ZM10 15.2V8.8l5.2 3.2L10 15.2Z',
  },
  {
    label: 'Discord',
    url: 'https://discord.com/users/1147854984323543140',
    path: 'M19.3 6.4A16 16 0 0 0 15.4 5l-.3.6a12 12 0 0 1 3.2 1.6 14.6 14.6 0 0 0-12.6 0A12 12 0 0 1 8.9 5.6L8.6 5a16 16 0 0 0-3.9 1.4C2.3 10 1.6 13.5 2 17a16 16 0 0 0 4.9 2.5l1-1.5a10.5 10.5 0 0 1-1.7-.8l.4-.3a11.4 11.4 0 0 0 9.7 0l.4.3a10.5 10.5 0 0 1-1.7.8l1 1.5A16 16 0 0 0 22 17c.5-4.1-.6-7.6-2.7-10.6ZM9.2 15c-1 0-1.7-.9-1.7-1.9s.8-1.9 1.7-1.9 1.8.9 1.8 1.9-.8 1.9-1.8 1.9Zm5.6 0c-1 0-1.7-.9-1.7-1.9s.8-1.9 1.7-1.9 1.8.9 1.8 1.9-.8 1.9-1.8 1.9Z',
  },
  {
    label: 'Facebook',
    url: 'https://www.facebook.com/profile.php?id=61584621844348',
    path: 'M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V3.9c-.3 0-1.3-.1-2.5-.1-2.4 0-4.1 1.5-4.1 4.1V10H7.5v3h2.7v8h3.3Z',
  },
];

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgxGridscanComponent, MagneticDirective],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {
  protected readonly profile = HERO_PROFILE;

  protected readonly marqueeSocials = [...HERO_SOCIALS, ...HERO_SOCIALS, ...HERO_SOCIALS];
  protected readonly socialCount = HERO_SOCIALS.length;

  protected readonly lines = HERO_PROFILE.headline.map((line) =>
    line.split(' ').map((word) => ({
      text: word,
      accent: word.toLowerCase() === HERO_PROFILE.accentWord.toLowerCase(),
    })),
  );

  protected readonly heavyFx = signal(false);

  private readonly velocity = signal(0);
  private readonly depth = signal(0);

  protected readonly aberration = computed(() => 0.0025 + this.velocity() * 0.012);
  protected readonly jitter = computed(() => 0.08 + this.velocity() * 0.4);
  protected readonly gridScale = computed(() => 0.085 + this.depth() * 0.05);
  protected readonly scanOpacity = computed(() => 0.45 + this.velocity() * 0.25);

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly motion = inject(MotionService);

  constructor() {
    afterNextRender(() => {
      this.scheduleHeavyFx();

      const root = this.host.nativeElement;
      const section = root.querySelector<HTMLElement>('.hero');

      void this.motion.ready().then((kit) => {
        if (!kit || this.motion.reducedMotion()) section?.removeAttribute('data-anim');
      });

      this.motion.context(root, this.destroyRef, ({ gsap, ScrollTrigger }) => {
        const q = gsap.utils.selector(root);

        section?.removeAttribute('data-anim');

        gsap.set(q('.hero__glow'), { xPercent: -50, yPercent: -50, margin: 0 });

        gsap.set([q('.hero__eyebrow'), q('.hero__cta > *'), q('.hero__foot > *')], {
          opacity: 0,
          y: 24,
        });
        gsap
          .timeline({ defaults: { ease: 'expo.out' } })
          .to(q('.hero__eyebrow'), { opacity: 1, y: 0, duration: 1 })
          .to(q('.hero__cta > *'), { opacity: 1, y: 0, duration: 1, stagger: 0.09 }, '-=0.55')
          .to(q('.hero__foot > *'), { opacity: 1, y: 0, duration: 1, stagger: 0.07 }, '-=0.9');

        if (!this.motion.isTouch()) {
          const layers = [
            { el: q('.hero__copy'), amount: 14 },
            { el: q('.hero__glow'), amount: 60 },
          ];
          const setters = layers.map(({ el, amount }) => ({
            amount,
            x: gsap.quickTo(el, 'x', { duration: 0.9, ease: 'power3.out' }),
            y: gsap.quickTo(el, 'y', { duration: 0.9, ease: 'power3.out' }),
          }));

          const onMove = (event: PointerEvent) => {
            const nx = event.clientX / window.innerWidth - 0.5;
            const ny = event.clientY / window.innerHeight - 0.5;
            for (const s of setters) {
              s.x(-nx * s.amount);
              s.y(-ny * s.amount);
            }
          };

          window.addEventListener('pointermove', onMove, { passive: true });
          this.destroyRef.onDestroy(() => window.removeEventListener('pointermove', onMove));
        }

        gsap.to(q('.hero__copy'), {
          yPercent: -18,
          opacity: 0,
          ease: 'none',
          scrollTrigger: { trigger: section, start: 'top top', end: 'bottom 35%', scrub: 0.6 },
        });

        gsap.to(q('.hero__bg'), {
          yPercent: 12,
          scale: 1.08,
          ease: 'none',
          scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: 0.8 },
        });

        ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          onUpdate: (self) => {
            this.depth.set(Number(self.progress.toFixed(2)));
            const v = Math.min(1, Math.abs(self.getVelocity()) / 2400);
            this.velocity.set(Number(v.toFixed(2)));
          },
        });
      });
    });
  }

  protected scrollTo(target: string): void {
    this.motion.scrollTo(target);
  }

  private scheduleHeavyFx(): void {
    if (this.motion.isTouch() || this.motion.reducedMotion()) return;
    if (window.innerWidth < 900 || window.matchMedia('(pointer: coarse)').matches) return;

    const nav = navigator as Navigator & {
      deviceMemory?: number;
      hardwareConcurrency?: number;
      connection?: { saveData?: boolean; effectiveType?: string };
    };

    if (nav.connection?.saveData) return;
    if (['slow-2g', '2g'].includes(nav.connection?.effectiveType ?? '')) return;
    if ((nav.deviceMemory ?? 8) < 4) return;
    if ((nav.hardwareConcurrency ?? 8) < 4) return;

    const events = ['pointermove', 'pointerdown', 'wheel', 'keydown', 'scroll'] as const;
    const idle = window.requestIdleCallback as typeof window.requestIdleCallback | undefined;
    let handle: number | undefined;

    const detach = () => {
      for (const event of events) window.removeEventListener(event, onIntent);
    };

    const onIntent = () => {
      detach();
      handle = idle
        ? idle(() => this.heavyFx.set(true), { timeout: 2000 })
        : window.setTimeout(() => this.heavyFx.set(true), 200);
    };

    for (const event of events) {
      window.addEventListener(event, onIntent, { once: true, passive: true });
    }

    this.destroyRef.onDestroy(() => {
      detach();
      if (handle === undefined) return;
      if (idle) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
    });
  }
}
