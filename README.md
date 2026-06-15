# Vaibhav Rai — Portfolio

Animated single-page portfolio. React + Vite + Sass + Framer Motion.

## Local development

```bash
npm install
npm run dev
```

## Build + preview

```bash
npm run build
npm run preview
```

## Environment

Copy `.env.example` to `.env.local` and fill:

- `VITE_EMAILJS_SERVICE_ID`
- `VITE_EMAILJS_TEMPLATE_ID`
- `VITE_EMAILJS_PUBLIC_KEY`

Optional for GitHub stats:

- `GITHUB_USER`
- `GITHUB_TOKEN` (scopes: `public_repo`, `read:user`)

Run `npm run fetch:gh` to refresh `src/data/github.json` before deploy. The `prebuild` script does this automatically.

## Editing content

All content lives in `src/data/`:

- `about.js` — bio, stats, current role
- `stack.js` — tech grouped by category
- `experience.js` — timeline entries
- `projects.js` — Work cards
- `socials.js` — contact links
- `sections.js` — navbar sections

## Tests

```bash
npm test
```

Vitest + @testing-library/react. Covers `useTheme`, `useActiveSection`, `ThemeToggle`, `Stack`, `Contact`.
