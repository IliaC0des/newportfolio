import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  viewChild,
} from '@angular/core';
import { Cursor } from './components/cursor/cursor';
import { Nav } from './components/nav/nav';
import { Hero } from './components/hero/hero';
import { About } from './components/about/about';
import { Projects } from './components/projects/projects';
import { Contact } from './components/contact/contact';
import { MotionService } from './core/motion.service';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Cursor, Nav, Hero, About, Projects, Contact],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly wrapper = viewChild.required<ElementRef<HTMLElement>>('wrapper');
  private readonly content = viewChild.required<ElementRef<HTMLElement>>('content');
  private readonly destroyRef = inject(DestroyRef);
  private readonly motion = inject(MotionService);

  constructor() {
    afterNextRender(() => {
      this.motion.initSmoothScroll(
        this.wrapper().nativeElement,
        this.content().nativeElement,
        this.destroyRef,
      );
    });
  }
}
