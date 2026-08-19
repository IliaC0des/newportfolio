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
import { splitWords } from '../../core/text-split';

export interface Skill {
  name: string;
  level: 'core' | 'strong' | 'working';
  note: string;
}

export interface SkillGroup {
  title: string;
  skills: Skill[];
}

export interface TimelineEntry {
  period: string;
  role: string;
  company: string;
  summary: string;
  stack: string[];
}

export const ABOUT_COPY = {
  eyebrow: 'About',
};

export const ABOUT_PROFILE = {
  location: 'Tbilisi, Georgia',
  availability: 'Open for remote work',
  about: [
    'I build interactive web applications that run fast and feel solid. Stacked around Angular, TypeScript, WebGL, and GSAP, I combine backend utility with frontend motion.',
    'Whether it’s client web applications or custom tool development, I focus on performance, algorithm logic, and practical visual feedback.'  ],
};

export const SKILL_GROUPS: SkillGroup[] = [
  {
    title: 'Frontend & UI',
    skills: [
      { name: 'Angular', level: 'core', note: 'Standalone components, signals' },
      { name: 'TypeScript', level: 'core', note: 'Strict typing & clean logic' },
      { name: 'HTML5 / CSS3', level: 'core', note: 'Responsive layouts & SCSS' },
      { name: 'Tailwind CSS', level: 'strong', note: 'Utility-first UI design' },
      { name: 'RxJS', level: 'strong', note: 'Reactive data streams' },
    ],
  },
  {
    title: 'Graphics & Motion',
    skills: [
      { name: 'GSAP', level: 'core', note: 'ScrollTrigger & custom timelines' },
      { name: 'Lenis Scroll', level: 'core', note: 'Smooth scroll integration' },
      { name: 'WebGL', level: 'working', note: 'Interactive canvas effects' },
      { name: 'Canvas 2D', level: 'strong', note: '2D animations & rendering' },
    ],
  },
  {
    title: 'Backend & Tools',
    skills: [
      { name: 'C# / ASP.NET', level: 'strong', note: 'Web API development' },
      { name: 'Node.js', level: 'strong', note: 'Scrapers & backend tools' },
      { name: 'Python', level: 'working', note: 'Scripts & problem solving' },
      { name: 'Git & Netlify', level: 'strong', note: 'Version control & deployment' },
    ],
  },
];

export const TIMELINE: TimelineEntry[] = [
  {
    period: '2024 — Present',
    role: 'Freelance Web Developer',
    company: 'Self-Employed',
    summary:
      'Designing and engineering custom web applications for local businesses and individual clients. Focusing on responsive design, smooth scroll motion, and performance.',
    stack: ['Angular', 'TypeScript', 'GSAP', 'Lenis'],
  },
  {
    period: '2023 — Present',
    role: 'Competitive Programmer & Hackathon Competitor',
    company: 'Olympiads & Hackathons',
    summary:
      'Competing in local hackathons and computer science olympiads. Secured 1st place finishes in team programming challenges by building working prototypes under tight deadlines.',
    stack: ['C#', 'ASP.NET Web API', 'Python', 'Algorithms'],
  },
  {
    period: '2022 — 2025',
    role: 'Software Development Student',
    company: 'IT STEP Academy Georgia',
    summary:
      'Completing a comprehensive 3-year program in full-stack software development. Covered core computer science, database architectures, modern web frameworks, and OOP.',
    stack: ['Angular', 'TypeScript', 'C#', 'SQL', 'HTML/CSS'],
  },
];

@Component({
  selector: 'app-about',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
  protected readonly profile = ABOUT_PROFILE;
  protected readonly copy = ABOUT_COPY;
  protected readonly groups = SKILL_GROUPS;
  protected readonly timeline = TIMELINE;


  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly motion = inject(MotionService);

  constructor() {
    afterNextRender(() => {
      this.motion.refresh();

      const root = this.host.nativeElement;

      this.motion.context(root, this.destroyRef, ({ gsap }) => {
        const q = gsap.utils.selector(root);

        const lines = q('.about__title .line-inner');
        gsap.from(lines, {
          yPercent: 115,
          rotate: 2.5,
          duration: 1.25,
          stagger: 0.08,
          ease: 'expo.out',
          scrollTrigger: { trigger: q('.about__title'), start: 'top 82%', once: true },
        });

        const body = root.querySelector<HTMLElement>('.about__body');
        if (body) {
          const words = Array.from(body.querySelectorAll<HTMLElement>('p')).flatMap((p) =>
            splitWords(p),
          );
          gsap.fromTo(
            words,
            { opacity: 0.16 },
            {
              opacity: 1,
              ease: 'none',
              stagger: 0.35,
              scrollTrigger: {
                trigger: body,
                start: 'top 78%',
                end: 'bottom 58%',
                scrub: 0.4,
              },
            },
          );
        }

        const rail = root.querySelector<HTMLElement>('.rail__progress');
        const list = root.querySelector<HTMLElement>('.rail');
        if (rail && list) {
          gsap.fromTo(
            rail,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: list,
                start: 'top 70%',
                end: 'bottom 75%',
                scrub: 0.5,
              },
            },
          );
        }
      });
    });
  }
}
