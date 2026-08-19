import { ComponentFixture, DeferBlockBehavior, TestBed } from '@angular/core/testing';
import { HERO_PROFILE, HERO_SOCIALS, Hero } from './hero';

describe('Hero', () => {
  let fixture: ComponentFixture<Hero>;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Hero],
      deferBlockBehavior: DeferBlockBehavior.Manual,
    }).compileComponents();

    fixture = TestBed.createComponent(Hero);
    el = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  it('creates', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders one masked line per headline entry', () => {
    expect(el.querySelectorAll('.hero__title .line-mask').length).toBe(HERO_PROFILE.headline.length);
  });

  it('keeps real spaces between headline words', () => {
    expect(el.querySelector('.hero__title')?.textContent).toContain(HERO_PROFILE.headline[1]);
  });

  it('flags the accent word', () => {
    const accent = el.querySelector('.hero__title .word.is-accent');
    expect(accent?.textContent?.trim()).toBe(HERO_PROFILE.accentWord);
  });

  it('renders every stat and a doubled marquee for seamless looping', () => {
    expect(el.querySelectorAll('.stat').length).toBe(HERO_PROFILE.stats.length);
    expect(el.querySelectorAll('.marquee__item').length).toBe(HERO_SOCIALS.length * 3);
  });
});
