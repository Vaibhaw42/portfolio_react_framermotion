# Portfolio Redesign — Design Spec

**Date:** 2026-06-12
**Author:** Vaibhav Rai
**Status:** Approved (brainstorm)
**Repo:** `portfolio_react_framermotion`

## 1. Goal

Rebuild the existing single-page React portfolio into a senior full-stack developer site. Same Vite + React + Sass + Framer Motion stack, restructured information architecture, refreshed visual system, new sections, upgraded project schema, theming, and a perf / SEO / a11y baseline.

Content (copy, photos, project entries, experience, links) will be filled in after the structural rebuild lands. The redesign must be content-agnostic — every section reads data from `src/data/*.js` so content edits are cheap.

## 2. Locked decisions

| Topic | Choice |
|---|---|
| Scope buckets | New sections, project upgrade, visual polish, functional features, mobile refinement. Perf / SEO / a11y folded in as baseline. |
| Approach | Big-bang redesign (one focused pass) |
| Visual direction | Minimal monochrome — dark navy refined, cyan accent, generous whitespace |
| Theme | Dark default + persisted light toggle. Initial value reads `prefers-color-scheme`, user override stored in `localStorage` |
| Accent | Cyan `#22d3ee` |
| Type system | Space Grotesk (display) · Inter (body) · JetBrains Mono (code) |
| Nav | Hybrid — sticky top bar on desktop, hamburger drawer on mobile, section-aware active indicator |
| Motion | Heavy — particle hero, magnetic buttons, scroll-driven reveals, theme morph |
| Resume | Single PDF at `/public/resume.pdf`, download button in Navbar + About |
| Stack icons | `simple-icons` via CDN (no npm dep) |
| GitHub stats | Build-time fetch via `scripts/fetch-github.mjs`, cached to `src/data/github.json` |
| Form backend | Keep EmailJS (already wired with env vars) |

## 3. Information architecture

Single-page anchor scroll. Top → bottom:

1. **Home** — Hero
2. **About**
3. **Stack**
4. **Experience**
5. **Work** (replaces Portfolio)
6. **GitHub**
7. **Contact**

(Writing / blog section explicitly deferred — empty blog signals neglect; revisit only when content is committed.)

## 4. File / folder layout

```
src/
├── App.jsx
├── main.jsx
├── styles/
│   ├── tokens.scss          # CSS custom properties (light + dark)
│   ├── mixins.scss          # breakpoints + helpers
│   └── globals.scss         # resets, base, focus, prefers-reduced-motion
├── data/
│   ├── stack.js             # tech list grouped by category
│   ├── experience.js        # timeline entries
│   ├── projects.js          # work entries
│   ├── socials.js           # link map
│   └── github.json          # generated at build time
├── hooks/
│   ├── useTheme.js          # toggle + persistence
│   ├── useActiveSection.js  # IntersectionObserver for nav indicator
│   └── useMagnetic.js       # cursor magnetic hover
├── components/
│   ├── cursor/Cursor.jsx
│   ├── navbar/Navbar.jsx
│   ├── themeToggle/ThemeToggle.jsx
│   ├── hero/Hero.jsx
│   ├── about/About.jsx
│   ├── stack/Stack.jsx
│   ├── experience/Experience.jsx
│   ├── work/Work.jsx
│   ├── github/Github.jsx
│   └── contact/Contact.jsx
└── scripts/
    └── fetch-github.mjs     # prebuild data pull
```

Removed: `parallax/`, `sidebar/`, `services/`, `portfolio/`. Their existing files become the basis for `hero/` (kept), `work/` (renamed from portfolio, schema upgraded), and `navbar/` (absorbs sidebar drawer).

## 5. Design tokens

`src/styles/tokens.scss` exports CSS custom properties. Components read these via `var(--token-name)`. Two sets — root (dark) and `[data-theme="light"]` (light) — with the same variable names, different values.

### 5.1 Colors

| Token | Dark | Light |
|---|---|---|
| `--bg` | `#0a0a12` | `#fafafa` |
| `--bg-elev` | `#13131d` | `#ffffff` |
| `--bg-elev-2` | `#1a1a26` | `#f3f4f6` |
| `--fg` | `#f5f5f7` | `#0a0a12` |
| `--fg-muted` | `#8b8b96` | `#52525b` |
| `--border` | `rgba(255,255,255,0.08)` | `rgba(0,0,0,0.08)` |
| `--accent` | `#22d3ee` | `#0891b2` |
| `--accent-hover` | `#67e8f9` | `#0e7490` |
| `--accent-fg` | `#0a0a12` | `#ffffff` |

### 5.2 Typography

- `--font-display`: `"Space Grotesk", system-ui, sans-serif`
- `--font-body`: `"Inter", system-ui, sans-serif`
- `--font-mono`: `"JetBrains Mono", ui-monospace, monospace`
- Scale (clamped): `--fs-xs` 12, `--fs-sm` 14, `--fs-base` 16, `--fs-md` 18, `--fs-lg` 24, `--fs-xl` 36, `--fs-2xl` clamp(40,5vw,72), `--fs-display` clamp(56,8vw,112).

### 5.3 Spacing

`--sp-1` 4 · `--sp-2` 8 · `--sp-3` 12 · `--sp-4` 16 · `--sp-6` 24 · `--sp-8` 32 · `--sp-12` 48 · `--sp-16` 64 · `--sp-24` 96.

### 5.4 Radii / motion

- `--radius-sm` 6 · `--radius-md` 12 · `--radius-pill` 999.
- `--ease` `cubic-bezier(0.22, 1, 0.36, 1)`.
- `--dur-fast` 150 ms · `--dur` 300 ms · `--dur-slow` 600 ms.

## 6. Component specs

### 6.1 Navbar

- Desktop (≥ 1024 px): full-width sticky bar at top, height 72 px. Logo (left), section links (center), theme toggle + resume download button (right). Background `--bg-elev` with bottom border `--border`. Backdrop blur on scroll.
- Mobile (< 1024 px): logo + hamburger button. Drawer slides in from right, contains links + theme toggle + resume button.
- Section-active highlight driven by `useActiveSection` (IntersectionObserver on each `<section id>`).
- Resume button = `<a href="/resume.pdf" download>`.
- Drawer animation via Framer Motion `clipPath` (existing pattern).

### 6.2 Hero

- Full viewport height minus navbar.
- Background: canvas particle field (lightweight — ~80 particles, drifting + connecting lines on proximity). Cyan tint. Drops to static gradient under `prefers-reduced-motion`.
- Foreground: name (h2), role headline (h1), 1–2 line tagline, two CTAs (`#work`, `#contact`), scroll hint chevron.
- Magnetic hover on CTAs via `useMagnetic` (cursor drag + translate within 40 px range).
- Drop the sliding background text from current Hero.
- Headshot moved to About section.

### 6.3 About

- Two-column layout. Left: portrait image (round, 320 px). Right: 2–3 paragraph bio, key stats row (Years exp · Projects · Repos · Stars), resume download button, current-role line.
- Stats values from `src/data/about.js`.
- Bio paragraphs from same file.
- Mobile: stacks vertically, image first.

### 6.4 Stack

- Grouped grid. Categories: Frontend · Backend · Database · DevOps · Tools. Data source `src/data/stack.js`:
  ```js
  export const stack = [
    { group: "Frontend", items: [{ name: "React", slug: "react" }, ...] },
    ...
  ];
  ```
- Each item renders a chip: simple-icons SVG (loaded via CDN `https://cdn.simpleicons.org/<slug>/<hex>`) + name.
- Hover: chip border switches to `--accent`, icon tinted.
- Stagger reveal on scroll via `whileInView` + `staggerChildren`.

### 6.5 Experience

- Vertical timeline. Left rail with dots. Each entry:
  - Header: role · company · `start — end | location`.
  - Body: 2–3 bullet highlights (impact metrics where possible).
  - Tech chips row (subset of Stack icons).
- Data from `src/data/experience.js` (array, newest first).
- Reveal entries on scroll.

### 6.6 Work (replaces Portfolio)

- Schema (`src/data/projects.js`):
  ```js
  {
    id: "react-commerce",
    title: "React Commerce",
    summary: "One-line pitch.",
    description: "Longer paragraph.",
    image: "/projects/react-commerce.png",
    tags: ["React", "Node", "Stripe"],
    live: "https://...",
    repo: "https://github.com/...",
    featured: true,
    year: 2025,
  }
  ```
- Header: section title + filter chips (top tags). Active filter = `--accent` outline.
- Card grid (1 col mobile, 2 col tablet, 3 col desktop).
- Card: image (lazy, 16/10 aspect), title, summary, tags row, two link buttons (Live · Repo).
- Featured cards rendered first, span 2 cols on desktop.
- Hover: image scale 1.03, card lift, magnetic on link buttons.

### 6.7 GitHub

- Reads `src/data/github.json`. Renders:
  - Username + avatar + bio + follower count.
  - Total stars across owned repos.
  - Contribution heatmap (52 × 7 grid, SVG, color-stepped by intensity).
  - Pinned repos (top 6) — repo card with name, description, language, stars, forks.
- Data refresh: `npm run fetch:gh` runs `scripts/fetch-github.mjs`. Single GraphQL query to `https://api.github.com/graphql` (requires `GITHUB_TOKEN` with `public_repo` + `read:user` scopes) pulling user profile, pinned repos, and `contributionsCollection.contributionCalendar`. Writes normalized JSON.
- `prebuild` script in `package.json` runs fetch automatically before `vite build`.
- Fail-safe: if fetch fails (rate limit, offline), keep last committed JSON.

### 6.8 Contact

- Layout: left = heading "Let's Work Together" + social row + email link. Right = form (existing fields, env-var keys).
- Drop the existing Phone + Address blocks. Social row replaces them.
- Form: rate-limit guard via `localStorage` (1 submission / 60 s).
- Honeypot hidden field `website` — reject on non-empty.
- Status messages and validation kept from current fix.

### 6.9 ThemeToggle

- Sun / moon icon button.
- On mount: read `localStorage.theme`; else `window.matchMedia('(prefers-color-scheme: dark)')`. Set `<html data-theme="...">`.
- On click: flip + persist.
- Icon morphs across themes (Framer Motion path interpolation).
- Cross-fade body bg / fg during transition (300 ms).

### 6.10 Cursor

- Keep current `useMotionValue` + spring version.
- New: enlarge + invert on hover of any `[data-cursor="hover"]` element. Set attribute on every CTA, project card, link.

## 7. Data flow

```
prebuild (npm run fetch:gh)  →  src/data/github.json
                                       │
                                       ▼
src/data/{stack,experience,projects,socials,about}.js
                                       │
                                       ▼
       Components import their data directly. No state mgmt.
                                       │
ThemeToggle  →  document.documentElement[data-theme]  →  CSS vars cascade
useActiveSection (IO)  →  Navbar active class
Contact form  →  EmailJS via VITE_EMAILJS_*
```

No client-side state library. React `useState` + custom hooks suffice.

## 8. Perf / SEO / a11y baseline

- `index.html`: title, description (per-section overrides skipped — single-page), OG tags (title, description, image `/og.png`), Twitter card meta, theme-color meta matching dark/light.
- `/public/og.png` — 1200 × 630 generated externally (placeholder until content ships).
- Lazy load all non-hero images (`loading="lazy"`).
- Preload hero image + critical font files (`<link rel="preload">`).
- Semantic landmarks: `<header>`, `<main>`, `<section>` with `aria-labelledby`, `<footer>` (new — copyright + theme toggle echo).
- Skip-link `<a href="#main">Skip to content</a>`.
- All interactive elements: focus-visible outline (already added), proper roles, key handlers.
- Run Lighthouse against preview build. Target: ≥ 95 on all four.
- Reduced motion: existing media query catches all framer-motion + canvas animations.

## 9. Error handling

| Surface | Failure | Handling |
|---|---|---|
| GitHub fetch | Network/rate-limit at build | Keep prior `github.json`, log warning, build continues |
| GitHub section | Missing JSON | Render skeleton + "Stats unavailable" message |
| Form | EmailJS error | Existing `status === "error"` branch shows fallback email link |
| Form | Rate-limit hit | Inline message "Please wait before sending again" |
| Image broken | onError | Replaced with `--bg-elev-2` block + alt text |
| simple-icons CDN | Network error | `onError` swap to neutral chip without icon |

## 10. Testing

Minimal additions — no full coverage push.

- `vitest` + `@testing-library/react` + `jsdom`.
- Tests:
  - `useTheme` — initial value resolution, persistence.
  - `Stack` — renders all groups + items from data.
  - `Contact` — required validation, status state transitions, honeypot rejection.
  - `useActiveSection` — emits correct id on IntersectionObserver entry.
- Lighthouse CI — optional, manual run before merge.

## 11. Migration plan

Stage in feature branch `feat/redesign`. Steps:

1. Add `tokens.scss`, `mixins.scss`, `globals.scss`. Wire into `main.jsx`. Replace `app.scss`.
2. Build `themeToggle` + `useTheme`. Verify theme switching against `<body>`.
3. Build new `Navbar` (top bar + drawer + active section). Remove old `Sidebar`, `Links`, `ToggleButton`.
4. Refactor `Hero`. Drop sliding text. Add particle canvas. Apply magnetic CTAs.
5. Add `About` component + `data/about.js`.
6. Add `Stack` component + `data/stack.js`.
7. Add `Experience` component + `data/experience.js`.
8. Refactor `Portfolio` → `Work` with new schema + filter + buttons.
9. Add `Github` component + `scripts/fetch-github.mjs` + `prebuild` hook.
10. Refactor `Contact` — social row, honeypot, rate-limit.
11. Wire all into `App.jsx` with new section IDs.
12. Add SEO + OG meta to `index.html`. Add `/public/og.png` placeholder.
13. Add tests (vitest).
14. Run Lighthouse, fix regressions.
15. Manual mobile pass < 738 px breakpoint.

## 12. Out of scope (this rebuild)

- Blog / Writing section.
- i18n.
- CMS integration (Contentful, Sanity, etc.).
- Server-side rendering / static export beyond Vite build.
- E2E tests (Playwright).
- Analytics integration (deferred until launched).
- Custom backend for contact form.

## 13. Content placeholders

The rebuild lands with placeholder data in every `src/data/*.js` file. User will provide real content (bio, experience entries, project list, photo) after rebuild. Placeholders are clearly marked `// TODO: replace with real content`.
