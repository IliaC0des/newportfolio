import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
} from '@angular/core';
import { MotionService } from '../../core/motion.service';
import { RevealDirective } from '../../core/reveal.directive';

export interface Project {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  year: string;
  role: string;
  description: string;
  stack: string[];
  url: string;
  poster: string;
}

export const WORK_COPY = {
  eyebrow: 'Selected Work',
  title: ['Things I', 'have built'],
};

export const PROJECTS: Project[] = [
  {
    id: 'Pulp',
    index: '01',
    title: 'Pulp Tbilisi',
    subtitle: 'Pulp Website',
    year: '2026',
    role: 'Web Developer',
    description:
      'Custom web application built for Pulp, a local specialty coffee house and wine bar in Vera, Tbilisi. Features a modern UI, fully responsive design, custom menu layouts, and smooth navigation tailored for local business outreach.',
    stack: ['Angular', 'REST API', 'TypeScript', 'GSAP', 'Database Design'],
    url: 'https://pulptbilisi.netlify.app/',
    poster: '/assets/images/pulp.webp',
  },
];

@Component({
  selector: 'app-projects',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects {
  protected readonly projects = PROJECTS;
  protected readonly copy = WORK_COPY;

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly motion = inject(MotionService);

  constructor() {
    afterNextRender(() => {
      this.motion.refresh();

      const root = this.host.nativeElement;

      this.motion.context(root, this.destroyRef, ({ gsap }) => {
        gsap.from(root.querySelectorAll('.work__title .line-inner'), {
          yPercent: 115,
          duration: 1.2,
          stagger: 0.08,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: root.querySelector('.work__intro'),
            start: 'top 80%',
            once: true,
          },
        });

        if (this.motion.isTouch()) return;

        const turbulence = root.querySelector('.distort-turbulence');
        const displacement = root.querySelector('.distort-displacement');

        for (const card of Array.from(root.querySelectorAll<HTMLElement>('.card'))) {
          const poster = card.querySelector<HTMLElement>('.card__poster');
          if (!poster) continue;

          const enter = () => {
            poster.classList.add('is-distorting');
            gsap.to(displacement, { attr: { scale: 26 }, duration: 0.7, ease: 'power2.out' });
            gsap.to(turbulence, {
              attr: { baseFrequency: 0.014 },
              duration: 0.9,
              ease: 'power2.out',
            });
          };

          const leave = () => {
            gsap.to(displacement, {
              attr: { scale: 0 },
              duration: 0.6,
              ease: 'power2.inOut',
              onComplete: () => poster.classList.remove('is-distorting'),
            });
            gsap.to(turbulence, { attr: { baseFrequency: 0.004 }, duration: 0.6 });
          };

          card.addEventListener('pointerenter', enter);
          card.addEventListener('pointerleave', leave);
          this.destroyRef.onDestroy(() => {
            card.removeEventListener('pointerenter', enter);
            card.removeEventListener('pointerleave', leave);
          });
        }
      });
    });
  }

  protected goToContact(event: Event): void {
    event.preventDefault();
    this.motion.scrollTo('contact');
  }
}
