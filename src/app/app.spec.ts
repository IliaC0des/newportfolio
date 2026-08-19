import { DeferBlockBehavior, TestBed } from '@angular/core/testing';
import { App } from './app';
import { HERO_PROFILE } from './components/hero/hero';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      deferBlockBehavior: DeferBlockBehavior.Manual,
    }).compileComponents();
  });

  it('creates the shell', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the smooth-scroll wrapper and the hero headline', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelector('#smooth-wrapper')).toBeTruthy();
    expect(el.querySelector('#smooth-content')).toBeTruthy();
    expect(el.querySelector('h1')?.textContent).toContain(HERO_PROFILE.headline[0]);
  });
});
