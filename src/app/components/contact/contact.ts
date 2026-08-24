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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MotionService } from '../../core/motion.service';
import { MagneticDirective } from '../../core/magnetic.directive';
import { RevealDirective } from '../../core/reveal.directive';
import {
  EMAILJS_CONFIG,
  EMAILJS_ENDPOINT,
  EMAILJS_TIMEOUT_MS,
} from '../../core/emailjs.config';

type SendState = 'idle' | 'sending' | 'sent' | 'error';

export interface SocialLink {
  label: string;
  url: string;
}

export const CONTACT_PROFILE = {
  name: 'Ilia Iliadi',
  email: 'iliailiadi9@gmail.com',
  location: 'Tbilisi, Georgia',
  timezone: 'Asia/Tbilisi',
};

export const CONTACT_COPY = {
  eyebrow: 'Contact',
  headline: ['Let’s build', 'something', 'that moves.'],
  blurb:
    'Available for select freelance engagements, studio collaborations and long-form product work. Tell me what you are making.',
  budgets: ['< 1k', '1k — 3k', '5k', '5k +', 'Not sure yet'],
  responseTime: 'Usually replies within 24 hours',
};

export const CONTACT_SOCIALS: SocialLink[] = [
  { label: 'GitHub', url: 'https://github.com/IliaC0des' },
  { label: 'LinkedIn', url: 'https://linkedin.com/in/iliailiadi' },
  { label: 'Instagram', url: 'https://instagram.com/ilarionaaa7' },
  { label: 'Facebook', url: 'https://www.facebook.com/profile.php?id=61584621844348' },
  { label: 'Email', url: 'mailto:iliailiadi@gmail.com' },
];

@Component({
  selector: 'app-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MagneticDirective, RevealDirective],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  protected readonly profile = CONTACT_PROFILE;
  protected readonly copy = CONTACT_COPY;
  protected readonly socials = CONTACT_SOCIALS;
  protected readonly year = new Date().getFullYear();

  protected readonly state = signal<SendState>('idle');
  protected readonly submitted = signal(false);
  protected readonly localTime = signal('');

  protected readonly sending = computed(() => this.state() === 'sending');

  private readonly fb = inject(FormBuilder);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    budget: [this.copy.budgets[1]],
    message: ['', [Validators.required, Validators.minLength(20)]],
  });

  protected readonly messageLength = signal(0);

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly motion = inject(MotionService);

  constructor() {
    this.form.controls.message.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((value) => this.messageLength.set(value.length));

    afterNextRender(() => {
      this.motion.refresh();
      this.startClock();

      const root = this.host.nativeElement;

      this.motion.context(root, this.destroyRef, ({ gsap }) => {
        gsap.from(root.querySelectorAll('.contact__title .line-inner'), {
          yPercent: 118,
          rotate: 3,
          duration: 1.3,
          stagger: 0.08,
          ease: 'expo.out',
          scrollTrigger: { trigger: root.querySelector('.contact__head'), start: 'top 80%', once: true },
        });

        gsap.fromTo(
          root.querySelector('.footer__mark'),
          { yPercent: 18, opacity: 0.35 },
          {
            yPercent: 0,
            opacity: 1,
            ease: 'none',
            scrollTrigger: { trigger: root.querySelector('.footer'), start: 'top 90%', end: 'bottom bottom', scrub: 0.6 },
          },
        );
      });
    });
  }

  protected showError(field: 'name' | 'email' | 'message'): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.touched || this.submitted());
  }

  protected async submit(): Promise<void> {
    this.submitted.set(true);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.shake();
      return;
    }

    this.state.set('sending');
    try {
      await this.deliver();
      this.state.set('sent');
    } catch (error) {
      // The visible message stays generic; the reason goes to the console so a failing
      // template id or origin restriction is diagnosable without guessing.
      console.error('[contact] EmailJS delivery failed', error);
      this.state.set('error');
    }
  }

  protected reset(): void {
    this.form.reset({ budget: this.copy.budgets[1] });
    this.submitted.set(false);
    this.messageLength.set(0);
    this.state.set('idle');
  }

  protected scrollTo(target: string): void {
    this.motion.scrollTo(target);
  }

  private async deliver(): Promise<void> {
    const { serviceId, templateId, publicKey } = EMAILJS_CONFIG;

    if (!serviceId || !templateId || !publicKey) {
      throw new Error(
        'EmailJS is not configured - fill in serviceId, templateId and publicKey in src/app/core/emailjs.config.ts',
      );
    }

    const { name, email, budget, message } = this.form.getRawValue();

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), EMAILJS_TIMEOUT_MS);

    try {
      const response = await fetch(EMAILJS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: {
            name,
            email,
            budget,
            message,
            from_name: name,
            reply_to: email,
            to_name: this.profile.name,
          },
        }),
      });

      if (!response.ok) {
        // EmailJS returns the reason as plain text, e.g. "The user_id parameter is required".
        throw new Error(`EmailJS returned ${response.status}: ${await response.text()}`);
      }
    } finally {
      clearTimeout(timeout);
    }
  }

  private shake(): void {
    void this.motion.ready().then((kit) => {
      if (!kit || this.motion.reducedMotion()) return;
      kit.gsap.fromTo(
        this.host.nativeElement.querySelector('.form'),
        { x: -9 },
        { x: 0, duration: 0.6, ease: 'elastic.out(1, 0.32)' },
      );
    });
  }

  private startClock(): void {
    const formatter = new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: this.profile.timezone,
    });

    const tick = () => this.localTime.set(formatter.format(new Date()));
    tick();

    const handle = setInterval(tick, 20_000);
    this.destroyRef.onDestroy(() => clearInterval(handle));
  }
}
