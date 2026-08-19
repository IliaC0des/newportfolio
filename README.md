# Portfolio — Angular 21 + WebGL

A dark, motion-led developer portfolio: a GPU grid-scan hero, scrubbed text
reveals, a pinned horizontal work gallery and a validated contact form.
Server-rendered, hydrated, and zero-asset (every "image" is a gradient).

```bash
npm start        # dev server on http://localhost:4200
npm run build    # production build + prerender
npm test         # vitest / jsdom
```

## Making it yours

Everything you'd want to change lives in one file:

**`src/app/data/portfolio-data.ts`** — name, headline, tagline, stats, socials,
nav, skills, timeline, projects, contact copy and section headings. Nothing else
needs editing to rebrand the site. Project artwork is a two-colour gradient
defined per project (`poster: { from, to, angle, glyph }`).

The design tokens — colours, type scale, spacing, easing — are CSS custom
properties at the top of **`src/styles.css`**.

To make the contact form real, point `Contact.deliver()` at your endpoint
(`src/app/components/contact/contact.ts`); it currently simulates the round trip.

## How it's put together

```
src/app/
  core/
    motion.service.ts      GSAP loader, ScrollSmoother, reduced-motion + touch state
    reveal.directive.ts    [appReveal] — scroll-triggered fade/slide, optional stagger
    magnetic.directive.ts  [appMagnetic] — elastic cursor magnet
    text-split.ts          word/char splitting for kinetic type
  components/
    cursor/                custom two-part pointer with contextual labels
    nav/                   fixed header, reading progress, active section
    hero/                  om-gridscan WebGL field + kinetic headline
    about/                 sticky heading, word-scrub narrative, skills, timeline
    projects/              pinned horizontal gallery with poster parallax
    contact/               reactive form, magnetic socials, footer
  data/portfolio-data.ts   ← all content
```

### Rendering and SSR

- **No WebGL on the server.** The grid-scan canvas sits in `@defer (on immediate)`,
  so the server renders a CSS-gradient placeholder and the GL context is created
  only in the browser.
- **No zero-size framebuffers.** `:host`, `.hero__bg` and `om-gridscan` are all
  explicitly `display: block` with real width/height, so the renderer is never
  initialised into a 0×0 box.
- **GSAP is browser-only and lazy.** `MotionService` dynamically imports gsap,
  ScrollTrigger and ScrollSmoother inside `afterNextRender`, keeping them out of
  the server bundle and the initial chunk. Every animation is built inside a
  `gsap.context()` that reverts on destroy.
- **Sections are lazy.** About, Work and Contact are `@defer (on idle; on viewport)`
  chunks; each calls `MotionService.refresh()` on mount so pinned trigger
  positions are recalculated against the new document height.

### Motion

- Masked line reveals on the hero and every section title.
- Word-by-word scrubbed opacity through the About narrative.
- Pinned section + horizontal track for Work, with poster counter-parallax
  (`containerAnimation`) and velocity-driven skew.
- Cursor parallax on the hero, magnetic buttons and social links.
- Scroll velocity feeds the shader: chromatic aberration and line jitter rise
  as you move, grid density shifts with depth.

### Accessibility and fallbacks

`prefers-reduced-motion` disables every GSAP build, restores the native cursor
and turns the pinned gallery into a native scroll-snap carousel. Touch devices
skip the custom cursor, magnets and smooth scrolling. If the GSAP chunk fails to
load, revealed content un-hides itself rather than staying invisible.
