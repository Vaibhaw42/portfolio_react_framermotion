# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Big-bang rebuild of `portfolio_react_framermotion` into a senior full-stack developer portfolio: design tokens, dark/light theme toggle, hybrid nav, new sections (About, Stack, Experience, GitHub), upgraded Work schema, heavy motion, SEO/a11y baseline. Content-agnostic — every section reads from `src/data/*.js` so real content drops in cleanly afterwards.

**Architecture:** Single-page Vite + React app. CSS custom properties as tokens in `src/styles/tokens.scss`, two value sets keyed off `<html data-theme>`. Custom hooks for theme persistence, active-section observation, magnetic cursor. Static data in `src/data/`. Build-time GraphQL fetch for GitHub stats. Framer Motion for reveals + transitions, canvas for hero particle field. No state management library, no router.

**Tech Stack:** React 18, Vite 4, Sass, Framer Motion 10, EmailJS, simple-icons CDN, vitest + @testing-library/react (added in this plan).

**Spec:** `docs/superpowers/specs/2026-06-12-portfolio-redesign-design.md`

---

## Task 1: Add design tokens, mixins, globals

Replace the existing `app.scss` with a token-driven foundation.

**Files:**
- Create: `src/styles/tokens.scss`
- Create: `src/styles/mixins.scss`
- Create: `src/styles/globals.scss`
- Modify: `src/main.jsx` (swap import)
- Delete: `src/app.scss`

- [ ] **Step 1: Create `src/styles/tokens.scss`**

```scss
:root {
  --bg: #0a0a12;
  --bg-elev: #13131d;
  --bg-elev-2: #1a1a26;
  --fg: #f5f5f7;
  --fg-muted: #8b8b96;
  --border: rgba(255, 255, 255, 0.08);
  --accent: #22d3ee;
  --accent-hover: #67e8f9;
  --accent-fg: #0a0a12;

  --font-display: "Space Grotesk", system-ui, sans-serif;
  --font-body: "Inter", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;

  --fs-xs: 0.75rem;
  --fs-sm: 0.875rem;
  --fs-base: 1rem;
  --fs-md: 1.125rem;
  --fs-lg: 1.5rem;
  --fs-xl: 2.25rem;
  --fs-2xl: clamp(2.5rem, 5vw, 4.5rem);
  --fs-display: clamp(3.5rem, 8vw, 7rem);

  --sp-1: 0.25rem;
  --sp-2: 0.5rem;
  --sp-3: 0.75rem;
  --sp-4: 1rem;
  --sp-6: 1.5rem;
  --sp-8: 2rem;
  --sp-12: 3rem;
  --sp-16: 4rem;
  --sp-24: 6rem;

  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-pill: 999px;

  --ease: cubic-bezier(0.22, 1, 0.36, 1);
  --dur-fast: 150ms;
  --dur: 300ms;
  --dur-slow: 600ms;
}

[data-theme="light"] {
  --bg: #fafafa;
  --bg-elev: #ffffff;
  --bg-elev-2: #f3f4f6;
  --fg: #0a0a12;
  --fg-muted: #52525b;
  --border: rgba(0, 0, 0, 0.08);
  --accent: #0891b2;
  --accent-hover: #0e7490;
  --accent-fg: #ffffff;
}
```

- [ ] **Step 2: Create `src/styles/mixins.scss`**

```scss
@mixin mobile {
  @media (max-width: 738px) { @content; }
}
@mixin tablet {
  @media (max-width: 1024px) { @content; }
}
@mixin desktop {
  @media (min-width: 1025px) { @content; }
}
```

- [ ] **Step 3: Create `src/styles/globals.scss`**

```scss
@import "./tokens.scss";

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  background: var(--bg);
  color: var(--fg);
  font-family: var(--font-body);
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  transition: background var(--dur) var(--ease), color var(--dur) var(--ease);
}

body {
  background: var(--bg);
  color: var(--fg);
  overflow-x: hidden;
}

a {
  color: inherit;
  text-decoration: none;
}

button {
  font-family: inherit;
  color: inherit;
  background: none;
  border: none;
  cursor: pointer;
}

h1, h2, h3, h4 {
  font-family: var(--font-display);
  font-weight: 600;
  letter-spacing: -0.02em;
}

code, pre {
  font-family: var(--font-mono);
}

:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
  border-radius: 4px;
}

.skip-link {
  position: absolute;
  top: -100px;
  left: 1rem;
  background: var(--accent);
  color: var(--accent-fg);
  padding: 0.5rem 1rem;
  border-radius: var(--radius-sm);
  z-index: 10000;
}
.skip-link:focus { top: 1rem; }

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 4: Swap import in `src/main.jsx`**

Replace `import './index.css'` (if present) and any reference to `./app.scss` (via App import chain) — but `App.jsx` imports `./app.scss` directly. Update `App.jsx` to import the new globals instead.

Edit `src/App.jsx` top line:

```jsx
import "./styles/globals.scss";
```

- [ ] **Step 5: Delete `src/app.scss`**

```bash
rm src/app.scss
```

- [ ] **Step 6: Update every component `*.scss` that does `@import "../../app.scss"`**

Find and replace across components — they should now `@import "../../styles/mixins.scss";` instead.

```bash
grep -rl '@import "../../app.scss"' src/components/ | xargs sed -i '' 's|@import "../../app.scss"|@import "../../styles/mixins.scss"|g'
```

- [ ] **Step 7: Run dev server, verify nothing broke visually pre-refactor**

```bash
npm run dev
```

Open http://localhost:5173. Hero should render with new fonts undefined yet (system fallback OK). No console errors. Stop server.

- [ ] **Step 8: Commit**

```bash
git add src/styles src/App.jsx src/components
git rm src/app.scss
git commit -m "refactor(styles): introduce design tokens + globals"
```

---

## Task 2: Load new web fonts in `index.html`

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Update `<link>` tags inside `<head>`**

Replace the existing DM Sans `<link>` block with:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
  rel="stylesheet"
/>
```

- [ ] **Step 2: Run dev server, verify fonts load**

```bash
npm run dev
```

DevTools → Network → filter "font" → all 3 families load. Headlines visibly Space Grotesk. Stop server.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat(fonts): switch to Space Grotesk + Inter + JetBrains Mono"
```

---

## Task 3: Install vitest + testing library

**Files:**
- Modify: `package.json`
- Create: `vite.config.js` (if missing) or update existing
- Create: `src/test/setup.js`

- [ ] **Step 1: Install dev deps**

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

- [ ] **Step 2: Add `test` script to `package.json`**

Add inside `scripts`:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 3: Check for existing `vite.config.js`**

```bash
ls vite.config.js 2>/dev/null || echo MISSING
```

If MISSING, create `vite.config.js`:

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
    globals: true,
  },
});
```

If it exists, add a `test` block matching the above inside the `defineConfig` arg.

- [ ] **Step 4: Create `src/test/setup.js`**

```js
import "@testing-library/jest-dom";
```

- [ ] **Step 5: Run vitest sanity**

```bash
npx vitest run
```

Expected: "No test files found" — confirms vitest configured correctly.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json vite.config.js src/test
git commit -m "chore(test): add vitest + testing-library setup"
```

---

## Task 4: `useTheme` hook + tests

**Files:**
- Create: `src/hooks/useTheme.js`
- Test: `src/hooks/useTheme.test.jsx`

- [ ] **Step 1: Write failing test**

`src/hooks/useTheme.test.jsx`:

```jsx
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTheme } from "./useTheme";

describe("useTheme", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("defaults to dark when no preference and no storage", () => {
    vi.stubGlobal("matchMedia", () => ({ matches: false, addEventListener: () => {}, removeEventListener: () => {} }));
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("reads stored value when present", () => {
    localStorage.setItem("theme", "light");
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe("light");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });

  it("toggles and persists", () => {
    vi.stubGlobal("matchMedia", () => ({ matches: false, addEventListener: () => {}, removeEventListener: () => {} }));
    const { result } = renderHook(() => useTheme());
    act(() => result.current.toggle());
    expect(result.current.theme).toBe("light");
    expect(localStorage.getItem("theme")).toBe("light");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });
});
```

- [ ] **Step 2: Run test, expect failure**

```bash
npx vitest run src/hooks/useTheme.test.jsx
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement hook**

`src/hooks/useTheme.js`:

```js
import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "theme";

const resolveInitial = () => {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
};

export const useTheme = () => {
  const [theme, setTheme] = useState(resolveInitial);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  return { theme, toggle };
};
```

- [ ] **Step 4: Run test, expect pass**

```bash
npx vitest run src/hooks/useTheme.test.jsx
```

Expected: 3 passing.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useTheme.js src/hooks/useTheme.test.jsx
git commit -m "feat(theme): add useTheme hook"
```

---

## Task 5: `ThemeToggle` component

**Files:**
- Create: `src/components/themeToggle/ThemeToggle.jsx`
- Create: `src/components/themeToggle/themeToggle.scss`

- [ ] **Step 1: Implement component**

`src/components/themeToggle/ThemeToggle.jsx`:

```jsx
import { motion } from "framer-motion";
import { useTheme } from "../../hooks/useTheme";
import "./themeToggle.scss";

const ThemeToggle = () => {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className="themeToggle"
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={!isDark}
      data-cursor="hover"
    >
      <motion.svg
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
        animate={{ rotate: isDark ? 0 : 180 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.path
          d={
            isDark
              ? "M19 13.5A8 8 0 1 1 8.5 3a6 6 0 0 0 10.5 10.5Z"
              : "M11 4v2M11 16v2M4 11h2M16 11h2M5.6 5.6l1.4 1.4M15 15l1.4 1.4M5.6 16.4 7 15M15 7l1.4-1.4M11 7a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z"
          }
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.svg>
    </button>
  );
};

export default ThemeToggle;
```

- [ ] **Step 2: Style**

`src/components/themeToggle/themeToggle.scss`:

```scss
@import "../../styles/mixins.scss";

.themeToggle {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--border);
  color: var(--fg);
  display: grid;
  place-items: center;
  transition: border-color var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease);

  &:hover {
    border-color: var(--accent);
    color: var(--accent);
  }
}
```

- [ ] **Step 3: Smoke test render**

`src/components/themeToggle/themeToggle.test.jsx`:

```jsx
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ThemeToggle from "./ThemeToggle";

describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("toggles aria-pressed on click", async () => {
    render(<ThemeToggle />);
    const btn = screen.getByRole("button");
    const initial = btn.getAttribute("aria-pressed");
    await userEvent.click(btn);
    expect(btn.getAttribute("aria-pressed")).not.toBe(initial);
  });
});
```

- [ ] **Step 4: Run test, expect pass**

```bash
npx vitest run src/components/themeToggle
```

Expected: 1 passing.

- [ ] **Step 5: Commit**

```bash
git add src/components/themeToggle src/hooks
git commit -m "feat(theme): add ThemeToggle button component"
```

---

## Task 6: `useActiveSection` hook + tests

**Files:**
- Create: `src/hooks/useActiveSection.js`
- Test: `src/hooks/useActiveSection.test.jsx`

- [ ] **Step 1: Implement hook**

`src/hooks/useActiveSection.js`:

```js
import { useEffect, useState } from "react";

export const useActiveSection = (ids) => {
  const [active, setActive] = useState(ids[0] ?? null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [ids]);

  return active;
};
```

- [ ] **Step 2: Write test using a fake IntersectionObserver**

`src/hooks/useActiveSection.test.jsx`:

```jsx
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useActiveSection } from "./useActiveSection";

let triggerEntries;

beforeEach(() => {
  triggerEntries = null;
  class FakeIO {
    constructor(cb) { triggerEntries = cb; }
    observe() {}
    disconnect() {}
  }
  vi.stubGlobal("IntersectionObserver", FakeIO);

  document.body.innerHTML = '<section id="home"></section><section id="about"></section>';
});

describe("useActiveSection", () => {
  it("returns first id by default", () => {
    const { result } = renderHook(() => useActiveSection(["home", "about"]));
    expect(result.current).toBe("home");
  });

  it("switches active when an entry intersects", () => {
    const { result } = renderHook(() => useActiveSection(["home", "about"]));
    act(() => {
      triggerEntries([
        { isIntersecting: true, intersectionRatio: 0.8, target: document.getElementById("about") },
      ]);
    });
    expect(result.current).toBe("about");
  });
});
```

- [ ] **Step 3: Run test, expect pass**

```bash
npx vitest run src/hooks/useActiveSection
```

Expected: 2 passing.

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useActiveSection.js src/hooks/useActiveSection.test.jsx
git commit -m "feat(nav): add useActiveSection hook"
```

---

## Task 7: `useMagnetic` hook

**Files:**
- Create: `src/hooks/useMagnetic.js`

No unit test (DOM-physics — covered by manual QA).

- [ ] **Step 1: Implement hook**

`src/hooks/useMagnetic.js`:

```js
import { useEffect, useRef } from "react";

export const useMagnetic = (range = 40, strength = 0.3) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < range + Math.max(rect.width, rect.height) / 2) {
        el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
      } else {
        el.style.transform = "";
      }
    };
    const onLeave = () => { el.style.transform = ""; };

    window.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [range, strength]);

  return ref;
};
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useMagnetic.js
git commit -m "feat(motion): add useMagnetic hook"
```

---

## Task 8: New `Navbar` (top bar + hamburger drawer + active indicator)

Replaces `Navbar`, `Sidebar`, `Links`, `ToggleButton`.

**Files:**
- Modify: `src/components/navbar/Navbar.jsx`
- Modify: `src/components/navbar/navbar.scss`
- Create: `src/data/sections.js`
- Delete: `src/components/sidebar/*`

- [ ] **Step 1: Create sections data**

`src/data/sections.js`:

```js
export const sections = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "stack", label: "Stack" },
  { id: "experience", label: "Experience" },
  { id: "work", label: "Work" },
  { id: "github", label: "GitHub" },
  { id: "contact", label: "Contact" },
];
```

- [ ] **Step 2: Rewrite `src/components/navbar/Navbar.jsx`**

```jsx
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./navbar.scss";
import { sections } from "../../data/sections";
import { useActiveSection } from "../../hooks/useActiveSection";
import ThemeToggle from "../themeToggle/ThemeToggle";

const drawerVariants = {
  closed: { x: "100%" },
  open: { x: 0 },
};

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const active = useActiveSection(sections.map((s) => s.id));

  const close = () => setOpen(false);

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <a href="#home" className="navbar__logo" data-cursor="hover">VR</a>

        <nav className="navbar__links" aria-label="Primary">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`navbar__link${active === s.id ? " is-active" : ""}`}
              data-cursor="hover"
            >
              {s.label}
            </a>
          ))}
        </nav>

        <div className="navbar__actions">
          <a className="navbar__resume" href="/resume.pdf" download data-cursor="hover">Resume</a>
          <ThemeToggle />
          <button
            type="button"
            className="navbar__hamburger"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.aside
            className="navbar__drawer"
            initial="closed"
            animate="open"
            exit="closed"
            variants={drawerVariants}
            transition={{ type: "spring", stiffness: 240, damping: 28 }}
            aria-label="Mobile navigation"
          >
            {sections.map((s) => (
              <a key={s.id} href={`#${s.id}`} onClick={close}>{s.label}</a>
            ))}
            <a href="/resume.pdf" download onClick={close}>Resume</a>
          </motion.aside>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
```

- [ ] **Step 3: Rewrite `src/components/navbar/navbar.scss`**

```scss
@import "../../styles/mixins.scss";

.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: color-mix(in srgb, var(--bg) 80%, transparent);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
}

.navbar__inner {
  max-width: 1280px;
  margin: 0 auto;
  height: 72px;
  padding: 0 var(--sp-6);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-4);
}

.navbar__logo {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.25rem;
  letter-spacing: 0.5px;
}

.navbar__links {
  display: flex;
  gap: var(--sp-6);
  @include tablet { display: none; }
}

.navbar__link {
  font-size: var(--fs-sm);
  color: var(--fg-muted);
  transition: color var(--dur-fast) var(--ease);
  position: relative;

  &.is-active,
  &:hover { color: var(--fg); }
  &.is-active::after {
    content: "";
    position: absolute;
    left: 0; right: 0; bottom: -6px;
    height: 2px;
    background: var(--accent);
    border-radius: 2px;
  }
}

.navbar__actions {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
}

.navbar__resume {
  font-size: var(--fs-sm);
  padding: var(--sp-2) var(--sp-4);
  border-radius: var(--radius-pill);
  border: 1px solid var(--border);
  transition: all var(--dur-fast) var(--ease);
  &:hover { border-color: var(--accent); color: var(--accent); }

  @include mobile { display: none; }
}

.navbar__hamburger {
  display: none;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--border);
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;

  span {
    display: block;
    width: 16px;
    height: 2px;
    background: var(--fg);
    border-radius: 2px;
  }

  @include tablet { display: flex; }
}

.navbar__drawer {
  position: fixed;
  top: 72px;
  right: 0;
  bottom: 0;
  width: min(320px, 80vw);
  background: var(--bg-elev);
  border-left: 1px solid var(--border);
  padding: var(--sp-8);
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
  font-size: var(--fs-lg);
  font-family: var(--font-display);
}
```

- [ ] **Step 4: Remove old sidebar**

```bash
git rm -r src/components/sidebar
```

- [ ] **Step 5: Run dev server, verify navbar renders + section linking**

```bash
npm run dev
```

Visit http://localhost:5173, scroll between sections (will be broken before later tasks wire them, but the navbar itself should render and the hamburger drawer should slide on viewport < 1024 px). Stop server.

- [ ] **Step 6: Commit**

```bash
git add src/components/navbar src/data/sections.js
git commit -m "feat(nav): rewrite navbar with top bar + drawer + active indicator"
```

---

## Task 9: Hero refactor — drop sliding text, add particle canvas + magnetic CTAs

**Files:**
- Modify: `src/components/hero/Hero.jsx`
- Modify: `src/components/hero/hero.scss`
- Create: `src/components/hero/ParticleField.jsx`

- [ ] **Step 1: Create `ParticleField.jsx`**

```jsx
import { useEffect, useRef } from "react";

const COUNT = 80;
const LINK_DIST = 130;

const ParticleField = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let raf;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * canvas.clientWidth,
      y: Math.random() * canvas.clientHeight,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
    }));

    const accent = getComputedStyle(document.documentElement)
      .getPropertyValue("--accent").trim() || "#22d3ee";

    const tick = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }

      ctx.fillStyle = accent;
      ctx.globalAlpha = 0.6;
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.strokeStyle = accent;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.hypot(dx, dy);
          if (d < LINK_DIST) {
            ctx.globalAlpha = (1 - d / LINK_DIST) * 0.2;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero__particles" aria-hidden="true" />;
};

export default ParticleField;
```

- [ ] **Step 2: Rewrite `src/components/hero/Hero.jsx`**

```jsx
import { motion } from "framer-motion";
import { useMagnetic } from "../../hooks/useMagnetic";
import ParticleField from "./ParticleField";
import "./hero.scss";

const textVariants = {
  initial: { y: 24, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.1 },
  },
};

const Hero = () => {
  const workRef = useMagnetic();
  const contactRef = useMagnetic();

  return (
    <section id="home" className="hero">
      <ParticleField />
      <motion.div
        className="hero__inner"
        variants={textVariants}
        initial="initial"
        animate="animate"
      >
        <motion.span variants={textVariants} className="hero__eyebrow">
          Full-stack developer
        </motion.span>
        <motion.h1 variants={textVariants} className="hero__title">
          Building tools<br />that ship.
        </motion.h1>
        <motion.p variants={textVariants} className="hero__sub">
          I design, build, and ship modern web products end-to-end.
        </motion.p>
        <motion.div variants={textVariants} className="hero__ctas">
          <a ref={workRef} href="#work" className="btn btn--primary" data-cursor="hover">View work</a>
          <a ref={contactRef} href="#contact" className="btn btn--ghost" data-cursor="hover">Contact</a>
        </motion.div>
      </motion.div>
      <a className="hero__scroll" href="#about" aria-label="Scroll to about">
        <span />
      </a>
    </section>
  );
};

export default Hero;
```

- [ ] **Step 3: Rewrite `src/components/hero/hero.scss`**

```scss
@import "../../styles/mixins.scss";

.hero {
  position: relative;
  min-height: calc(100vh - 72px);
  display: grid;
  place-items: center;
  overflow: hidden;
  isolation: isolate;
}

.hero__particles {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  opacity: 0.5;
}

.hero__inner {
  text-align: center;
  max-width: 920px;
  padding: 0 var(--sp-6);
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
  align-items: center;
}

.hero__eyebrow {
  font-size: var(--fs-sm);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--accent);
  font-family: var(--font-mono);
}

.hero__title {
  font-size: var(--fs-display);
  line-height: 1;
  letter-spacing: -0.03em;
}

.hero__sub {
  font-size: var(--fs-md);
  color: var(--fg-muted);
  max-width: 600px;
}

.hero__ctas {
  display: flex;
  gap: var(--sp-3);
  margin-top: var(--sp-4);
}

.btn {
  display: inline-block;
  padding: var(--sp-3) var(--sp-6);
  border-radius: var(--radius-pill);
  font-size: var(--fs-sm);
  font-weight: 500;
  transition: transform var(--dur-fast) var(--ease), background var(--dur-fast) var(--ease);

  &--primary {
    background: var(--accent);
    color: var(--accent-fg);
    &:hover { background: var(--accent-hover); }
  }
  &--ghost {
    border: 1px solid var(--border);
    color: var(--fg);
    &:hover { border-color: var(--accent); color: var(--accent); }
  }
}

.hero__scroll {
  position: absolute;
  bottom: var(--sp-8);
  left: 50%;
  transform: translateX(-50%);
  width: 24px;
  height: 38px;
  border: 1px solid var(--fg-muted);
  border-radius: 14px;

  span {
    position: absolute;
    top: 8px;
    left: 50%;
    width: 4px;
    height: 4px;
    margin-left: -2px;
    border-radius: 50%;
    background: var(--accent);
    animation: scroll-hint 1.6s var(--ease) infinite;
  }
}

@keyframes scroll-hint {
  0% { opacity: 0; transform: translateY(0); }
  50% { opacity: 1; }
  100% { opacity: 0; transform: translateY(14px); }
}
```

- [ ] **Step 4: Run dev server, verify hero renders**

```bash
npm run dev
```

Particle canvas should drift behind text. Hover CTAs — cursor magnet pulls them. Stop server.

- [ ] **Step 5: Commit**

```bash
git add src/components/hero
git commit -m "feat(hero): redesign with particle field + magnetic CTAs"
```

---

## Task 10: About section + data

**Files:**
- Create: `src/components/about/About.jsx`
- Create: `src/components/about/about.scss`
- Create: `src/data/about.js`

- [ ] **Step 1: Placeholder data**

`src/data/about.js`:

```js
// TODO: replace with real content
export const about = {
  image: "/hero.png",
  paragraphs: [
    "Placeholder bio paragraph one. Describe yourself, your focus, and your current chapter.",
    "Placeholder bio paragraph two. Add philosophy, what you like to build, what excites you.",
  ],
  current: "Currently building things at Placeholder Co.",
  stats: [
    { label: "Years experience", value: "3+" },
    { label: "Projects shipped", value: "20+" },
    { label: "Repos", value: "40+" },
    { label: "Stars", value: "100+" },
  ],
};
```

- [ ] **Step 2: Component**

`src/components/about/About.jsx`:

```jsx
import { motion } from "framer-motion";
import { about } from "../../data/about";
import "./about.scss";

const About = () => (
  <section id="about" className="about" aria-labelledby="about-title">
    <motion.div
      className="about__inner"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="about__media">
        <img src={about.image} alt="" loading="lazy" />
      </div>
      <div className="about__body">
        <span className="about__label">About</span>
        <h2 id="about-title">A short intro.</h2>
        {about.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
        <p className="about__current">{about.current}</p>
        <div className="about__stats">
          {about.stats.map((s) => (
            <div key={s.label} className="about__stat">
              <div className="about__stat-value">{s.value}</div>
              <div className="about__stat-label">{s.label}</div>
            </div>
          ))}
        </div>
        <a href="/resume.pdf" download className="btn btn--primary" data-cursor="hover">Download résumé</a>
      </div>
    </motion.div>
  </section>
);

export default About;
```

- [ ] **Step 3: Style**

`src/components/about/about.scss`:

```scss
@import "../../styles/mixins.scss";

.about {
  padding: var(--sp-24) var(--sp-6);
}

.about__inner {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: var(--sp-16);
  align-items: start;

  @include tablet {
    grid-template-columns: 1fr;
    gap: var(--sp-8);
  }
}

.about__media img {
  width: 100%;
  border-radius: var(--radius-md);
  aspect-ratio: 1;
  object-fit: cover;
  border: 1px solid var(--border);
}

.about__body {
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
}

.about__label {
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--accent);
}

.about__body h2 {
  font-size: var(--fs-2xl);
  line-height: 1.05;
}

.about__body p {
  color: var(--fg-muted);
  line-height: 1.6;
  font-size: var(--fs-md);
}

.about__current {
  color: var(--fg);
  font-weight: 500;
}

.about__stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--sp-4);
  padding: var(--sp-6) 0;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  margin: var(--sp-4) 0;

  @include mobile {
    grid-template-columns: repeat(2, 1fr);
  }
}

.about__stat-value {
  font-family: var(--font-display);
  font-size: var(--fs-xl);
  font-weight: 600;
}

.about__stat-label {
  font-size: var(--fs-xs);
  color: var(--fg-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.about__body .btn {
  align-self: flex-start;
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/about src/data/about.js
git commit -m "feat(about): add About section + data"
```

---

## Task 11: Stack section + data + test

**Files:**
- Create: `src/components/stack/Stack.jsx`
- Create: `src/components/stack/stack.scss`
- Create: `src/data/stack.js`
- Test: `src/components/stack/stack.test.jsx`

- [ ] **Step 1: Placeholder data**

`src/data/stack.js`:

```js
// TODO: replace with real tech list
export const stack = [
  {
    group: "Frontend",
    items: [
      { name: "React", slug: "react" },
      { name: "TypeScript", slug: "typescript" },
      { name: "Next.js", slug: "nextdotjs" },
      { name: "Tailwind", slug: "tailwindcss" },
    ],
  },
  {
    group: "Backend",
    items: [
      { name: "Node.js", slug: "nodedotjs" },
      { name: "Python", slug: "python" },
      { name: "Express", slug: "express" },
    ],
  },
  {
    group: "Database",
    items: [
      { name: "PostgreSQL", slug: "postgresql" },
      { name: "MongoDB", slug: "mongodb" },
      { name: "Redis", slug: "redis" },
    ],
  },
  {
    group: "DevOps",
    items: [
      { name: "Docker", slug: "docker" },
      { name: "AWS", slug: "amazonaws" },
      { name: "GitHub Actions", slug: "githubactions" },
    ],
  },
  {
    group: "Tools",
    items: [
      { name: "Git", slug: "git" },
      { name: "Vite", slug: "vite" },
      { name: "Figma", slug: "figma" },
    ],
  },
];
```

- [ ] **Step 2: Failing test**

`src/components/stack/stack.test.jsx`:

```jsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Stack from "./Stack";
import { stack } from "../../data/stack";

describe("Stack", () => {
  it("renders every group heading and item name", () => {
    render(<Stack />);
    stack.forEach((g) => {
      expect(screen.getByText(g.group)).toBeInTheDocument();
      g.items.forEach((it) => {
        expect(screen.getByText(it.name)).toBeInTheDocument();
      });
    });
  });
});
```

- [ ] **Step 3: Run test, expect failure**

```bash
npx vitest run src/components/stack
```

Expected: FAIL — module not found.

- [ ] **Step 4: Component**

`src/components/stack/Stack.jsx`:

```jsx
import { motion } from "framer-motion";
import { stack } from "../../data/stack";
import "./stack.scss";

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};
const chipVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const Stack = () => (
  <section id="stack" className="stack" aria-labelledby="stack-title">
    <div className="stack__inner">
      <span className="stack__label">Stack</span>
      <h2 id="stack-title">Tools I reach for.</h2>
      {stack.map((group) => (
        <motion.div
          key={group.group}
          className="stack__group"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={containerVariants}
        >
          <h3>{group.group}</h3>
          <div className="stack__chips">
            {group.items.map((item) => (
              <motion.span key={item.slug} className="stack__chip" variants={chipVariants}>
                <img
                  src={`https://cdn.simpleicons.org/${item.slug}/8b8b96`}
                  alt=""
                  width="20"
                  height="20"
                  loading="lazy"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
                {item.name}
              </motion.span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);

export default Stack;
```

- [ ] **Step 5: Style**

`src/components/stack/stack.scss`:

```scss
@import "../../styles/mixins.scss";

.stack {
  padding: var(--sp-24) var(--sp-6);
  background: var(--bg-elev);
}

.stack__inner {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--sp-8);
}

.stack__label {
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--accent);
}

.stack h2 {
  font-size: var(--fs-2xl);
  line-height: 1.05;
}

.stack__group {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: var(--sp-6);
  padding: var(--sp-6) 0;
  border-top: 1px solid var(--border);

  @include mobile {
    grid-template-columns: 1fr;
  }

  h3 {
    font-size: var(--fs-md);
    color: var(--fg-muted);
    font-family: var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
}

.stack__chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-2);
}

.stack__chip {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  padding: var(--sp-2) var(--sp-4);
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
  font-size: var(--fs-sm);
  transition: all var(--dur-fast) var(--ease);

  &:hover {
    border-color: var(--accent);
    color: var(--accent);
    img { filter: brightness(0) saturate(100%) invert(78%) sepia(83%) saturate(394%) hue-rotate(143deg) brightness(96%) contrast(91%); }
  }
}
```

- [ ] **Step 6: Run test, expect pass**

```bash
npx vitest run src/components/stack
```

Expected: 1 passing.

- [ ] **Step 7: Commit**

```bash
git add src/components/stack src/data/stack.js
git commit -m "feat(stack): add Stack section + data + test"
```

---

## Task 12: Experience section + data

**Files:**
- Create: `src/components/experience/Experience.jsx`
- Create: `src/components/experience/experience.scss`
- Create: `src/data/experience.js`

- [ ] **Step 1: Placeholder data**

`src/data/experience.js`:

```js
// TODO: replace with real experience entries
export const experience = [
  {
    role: "Full-stack Developer",
    company: "Placeholder Co.",
    location: "Remote",
    start: "2024",
    end: "Present",
    highlights: [
      "Built and shipped X — describe scope + outcome.",
      "Led Y — describe impact with a metric where possible.",
      "Owned Z — describe ownership.",
    ],
    tags: ["React", "Node", "Postgres"],
  },
  {
    role: "Web Developer",
    company: "Earlier Place",
    location: "City, Country",
    start: "2022",
    end: "2024",
    highlights: [
      "Delivered A — describe what.",
      "Optimised B by N% — describe how.",
    ],
    tags: ["JavaScript", "Express"],
  },
];
```

- [ ] **Step 2: Component**

`src/components/experience/Experience.jsx`:

```jsx
import { motion } from "framer-motion";
import { experience } from "../../data/experience";
import "./experience.scss";

const Experience = () => (
  <section id="experience" className="experience" aria-labelledby="experience-title">
    <div className="experience__inner">
      <span className="experience__label">Experience</span>
      <h2 id="experience-title">Selected timeline.</h2>
      <ol className="experience__list">
        {experience.map((e, i) => (
          <motion.li
            key={i}
            className="experience__item"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <header>
              <h3>{e.role} · <span>{e.company}</span></h3>
              <span className="experience__meta">{e.start} — {e.end} · {e.location}</span>
            </header>
            <ul>
              {e.highlights.map((h, j) => <li key={j}>{h}</li>)}
            </ul>
            <div className="experience__tags">
              {e.tags.map((t) => <span key={t}>{t}</span>)}
            </div>
          </motion.li>
        ))}
      </ol>
    </div>
  </section>
);

export default Experience;
```

- [ ] **Step 3: Style**

`src/components/experience/experience.scss`:

```scss
@import "../../styles/mixins.scss";

.experience {
  padding: var(--sp-24) var(--sp-6);
}

.experience__inner {
  max-width: 880px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--sp-8);
}

.experience__label {
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--accent);
}

.experience h2 {
  font-size: var(--fs-2xl);
  line-height: 1.05;
}

.experience__list {
  list-style: none;
  padding-left: var(--sp-6);
  border-left: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: var(--sp-8);
}

.experience__item {
  position: relative;

  &::before {
    content: "";
    position: absolute;
    left: calc(-1 * var(--sp-6) - 4px);
    top: 8px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--accent);
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: var(--sp-4);
    margin-bottom: var(--sp-3);
    flex-wrap: wrap;
  }

  h3 {
    font-size: var(--fs-md);
    font-family: var(--font-body);
    font-weight: 500;
    span { color: var(--fg-muted); font-weight: 400; }
  }

  .experience__meta {
    font-family: var(--font-mono);
    font-size: var(--fs-xs);
    color: var(--fg-muted);
  }

  ul {
    padding-left: var(--sp-4);
    color: var(--fg-muted);
    font-size: var(--fs-base);
    line-height: 1.6;
    display: flex;
    flex-direction: column;
    gap: var(--sp-2);
  }
}

.experience__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-2);
  margin-top: var(--sp-3);

  span {
    font-size: var(--fs-xs);
    font-family: var(--font-mono);
    padding: 2px 8px;
    border: 1px solid var(--border);
    border-radius: var(--radius-pill);
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/experience src/data/experience.js
git commit -m "feat(experience): add Experience timeline + data"
```

---

## Task 13: Work section — schema upgrade, filters, links

Replaces old `Portfolio` component.

**Files:**
- Create: `src/components/work/Work.jsx`
- Create: `src/components/work/work.scss`
- Create: `src/data/projects.js`
- Delete: `src/components/portfolio/*`

- [ ] **Step 1: Project data with new schema**

`src/data/projects.js`:

```js
// TODO: replace with real projects
export const projects = [
  {
    id: "project-1",
    title: "Project One",
    summary: "One-line pitch describing what it is.",
    description: "Longer paragraph for hover/detail context if needed.",
    image: "https://images.pexels.com/photos/18073372/pexels-photo-18073372/free-photo-of-young-man-sitting-in-a-car-on-a-night-street.jpeg?auto=compress&cs=tinysrgb&w=1600",
    tags: ["React", "Node", "Stripe"],
    live: "https://example.com",
    repo: "https://github.com/example/repo",
    featured: true,
    year: 2025,
  },
  {
    id: "project-2",
    title: "Project Two",
    summary: "Short description goes here.",
    description: "",
    image: "https://images.pexels.com/photos/18023772/pexels-photo-18023772/free-photo-of-close-up-of-a-person-holding-a-wristwatch.jpeg?auto=compress&cs=tinysrgb&w=1600",
    tags: ["Next.js", "MongoDB"],
    live: "",
    repo: "https://github.com/example/repo-2",
    featured: false,
    year: 2024,
  },
  {
    id: "project-3",
    title: "Project Three",
    summary: "Another short pitch.",
    description: "",
    image: "https://images.pexels.com/photos/6894528/pexels-photo-6894528.jpeg?auto=compress&cs=tinysrgb&w=1600",
    tags: ["TypeScript", "Postgres"],
    live: "https://example.com",
    repo: "",
    featured: false,
    year: 2024,
  },
];
```

- [ ] **Step 2: Component**

`src/components/work/Work.jsx`:

```jsx
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { projects } from "../../data/projects";
import "./work.scss";

const Work = () => {
  const [filter, setFilter] = useState("All");

  const tags = useMemo(() => {
    const set = new Set();
    projects.forEach((p) => p.tags.forEach((t) => set.add(t)));
    return ["All", ...Array.from(set)];
  }, []);

  const visible = useMemo(() => {
    const filtered = filter === "All"
      ? projects
      : projects.filter((p) => p.tags.includes(filter));
    return [...filtered].sort((a, b) => Number(b.featured) - Number(a.featured));
  }, [filter]);

  return (
    <section id="work" className="work" aria-labelledby="work-title">
      <div className="work__inner">
        <header className="work__header">
          <span className="work__label">Work</span>
          <h2 id="work-title">Selected projects.</h2>
        </header>

        <div className="work__filters" role="tablist" aria-label="Filter by tag">
          {tags.map((tag) => (
            <button
              key={tag}
              role="tab"
              aria-selected={filter === tag}
              className={`work__filter${filter === tag ? " is-active" : ""}`}
              onClick={() => setFilter(tag)}
              data-cursor="hover"
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="work__grid">
          {visible.map((p) => (
            <motion.article
              key={p.id}
              className={`work__card${p.featured ? " is-featured" : ""}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -6 }}
            >
              <div className="work__image">
                <img src={p.image} alt={`${p.title} preview`} loading="lazy" />
              </div>
              <div className="work__body">
                <div className="work__title-row">
                  <h3>{p.title}</h3>
                  <span className="work__year">{p.year}</span>
                </div>
                <p>{p.summary}</p>
                <div className="work__tags">
                  {p.tags.map((t) => <span key={t}>{t}</span>)}
                </div>
                <div className="work__links">
                  {p.live && (
                    <a href={p.live} target="_blank" rel="noreferrer noopener" className="btn btn--ghost" data-cursor="hover">Live ↗</a>
                  )}
                  {p.repo && (
                    <a href={p.repo} target="_blank" rel="noreferrer noopener" className="btn btn--ghost" data-cursor="hover">Code ↗</a>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Work;
```

- [ ] **Step 3: Style**

`src/components/work/work.scss`:

```scss
@import "../../styles/mixins.scss";

.work {
  padding: var(--sp-24) var(--sp-6);
  background: var(--bg-elev);
}

.work__inner {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--sp-8);
}

.work__header {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
}

.work__label {
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--accent);
}

.work h2 {
  font-size: var(--fs-2xl);
  line-height: 1.05;
}

.work__filters {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-2);
}

.work__filter {
  padding: var(--sp-2) var(--sp-4);
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
  font-size: var(--fs-sm);
  color: var(--fg-muted);
  transition: all var(--dur-fast) var(--ease);

  &:hover { color: var(--fg); }
  &.is-active {
    border-color: var(--accent);
    color: var(--accent);
  }
}

.work__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--sp-6);

  @include tablet { grid-template-columns: repeat(2, 1fr); }
  @include mobile { grid-template-columns: 1fr; }
}

.work__card {
  background: var(--bg-elev-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: border-color var(--dur-fast) var(--ease);

  &:hover {
    border-color: var(--accent);
    img { transform: scale(1.03); }
  }

  &.is-featured {
    grid-column: span 2;
    @include tablet { grid-column: span 2; }
    @include mobile { grid-column: span 1; }
  }
}

.work__image {
  aspect-ratio: 16 / 10;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform var(--dur-slow) var(--ease);
  }
}

.work__body {
  padding: var(--sp-6);
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
  flex: 1;
}

.work__title-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;

  h3 { font-size: var(--fs-lg); }
}

.work__year {
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  color: var(--fg-muted);
}

.work__body p { color: var(--fg-muted); }

.work__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-2);

  span {
    font-family: var(--font-mono);
    font-size: var(--fs-xs);
    padding: 2px 8px;
    border: 1px solid var(--border);
    border-radius: var(--radius-pill);
  }
}

.work__links {
  display: flex;
  gap: var(--sp-3);
  margin-top: auto;
}
```

- [ ] **Step 4: Delete old Portfolio**

```bash
git rm -r src/components/portfolio
```

- [ ] **Step 5: Commit**

```bash
git add src/components/work src/data/projects.js
git commit -m "feat(work): replace portfolio with new Work section + schema"
```

---

## Task 14: GitHub fetch script + data + component

**Files:**
- Create: `scripts/fetch-github.mjs`
- Create: `src/data/github.json`
- Create: `src/components/github/Github.jsx`
- Create: `src/components/github/github.scss`
- Modify: `package.json` (add `prebuild` + `fetch:gh`)

- [ ] **Step 1: Fetch script**

`scripts/fetch-github.mjs`:

```js
import fs from "node:fs/promises";
import path from "node:path";

const USER = process.env.GITHUB_USER || "vaibhav-rai";
const TOKEN = process.env.GITHUB_TOKEN;
const OUT = path.resolve("src/data/github.json");

const QUERY = `
  query($login: String!) {
    user(login: $login) {
      login
      name
      bio
      avatarUrl
      followers { totalCount }
      pinnedItems(first: 6, types: [REPOSITORY]) {
        nodes {
          ... on Repository {
            name
            description
            url
            stargazerCount
            forkCount
            primaryLanguage { name color }
          }
        }
      }
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays { date contributionCount color }
          }
        }
      }
      repositories(ownerAffiliations: OWNER, isFork: false, first: 100) {
        nodes { stargazerCount }
      }
    }
  }
`;

const main = async () => {
  if (!TOKEN) {
    console.warn("[fetch-github] GITHUB_TOKEN not set — keeping existing JSON.");
    return;
  }

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
      "User-Agent": "portfolio-fetch",
    },
    body: JSON.stringify({ query: QUERY, variables: { login: USER } }),
  });

  if (!res.ok) {
    console.warn(`[fetch-github] HTTP ${res.status} — keeping existing JSON.`);
    return;
  }

  const { data, errors } = await res.json();
  if (errors || !data?.user) {
    console.warn("[fetch-github] GraphQL error — keeping existing JSON.", errors);
    return;
  }

  const u = data.user;
  const totalStars = u.repositories.nodes.reduce((s, r) => s + r.stargazerCount, 0);

  const normalized = {
    user: {
      login: u.login,
      name: u.name,
      bio: u.bio,
      avatar: u.avatarUrl,
      followers: u.followers.totalCount,
      totalStars,
    },
    pinned: u.pinnedItems.nodes.map((n) => ({
      name: n.name,
      description: n.description,
      url: n.url,
      stars: n.stargazerCount,
      forks: n.forkCount,
      language: n.primaryLanguage?.name ?? null,
      languageColor: n.primaryLanguage?.color ?? null,
    })),
    contributions: {
      total: u.contributionsCollection.contributionCalendar.totalContributions,
      weeks: u.contributionsCollection.contributionCalendar.weeks.map((w) => ({
        days: w.contributionDays.map((d) => ({
          date: d.date,
          count: d.contributionCount,
          color: d.color,
        })),
      })),
    },
  };

  await fs.writeFile(OUT, JSON.stringify(normalized, null, 2) + "\n");
  console.log(`[fetch-github] wrote ${OUT}`);
};

main().catch((err) => {
  console.warn("[fetch-github] unexpected error — keeping existing JSON.", err);
});
```

- [ ] **Step 2: Initial placeholder JSON (so build works without token)**

`src/data/github.json`:

```json
{
  "user": {
    "login": "placeholder",
    "name": "Placeholder User",
    "bio": "GitHub stats unavailable.",
    "avatar": "",
    "followers": 0,
    "totalStars": 0
  },
  "pinned": [],
  "contributions": { "total": 0, "weeks": [] }
}
```

- [ ] **Step 3: Update `package.json` scripts**

Inside `scripts` add:

```json
"fetch:gh": "node scripts/fetch-github.mjs",
"prebuild": "npm run fetch:gh"
```

- [ ] **Step 4: Component**

`src/components/github/Github.jsx`:

```jsx
import data from "../../data/github.json";
import "./github.scss";

const Github = () => {
  const { user, pinned, contributions } = data;
  const hasData = user.login !== "placeholder";

  return (
    <section id="github" className="github" aria-labelledby="github-title">
      <div className="github__inner">
        <span className="github__label">Open source</span>
        <h2 id="github-title">{hasData ? `@${user.login} on GitHub` : "GitHub"}</h2>
        {!hasData && <p className="github__empty">Stats refresh at deploy time. Set <code>GITHUB_TOKEN</code> + <code>GITHUB_USER</code> and run <code>npm run fetch:gh</code>.</p>}

        {hasData && (
          <>
            <div className="github__stats">
              <div><strong>{contributions.total}</strong><span>contributions / year</span></div>
              <div><strong>{user.totalStars}</strong><span>total stars</span></div>
              <div><strong>{user.followers}</strong><span>followers</span></div>
            </div>

            {contributions.weeks.length > 0 && (
              <div className="github__heatmap" aria-label="Contribution heatmap">
                <svg viewBox={`0 0 ${contributions.weeks.length * 14} 98`}>
                  {contributions.weeks.map((w, i) =>
                    w.days.map((d, j) => (
                      <rect
                        key={`${i}-${j}`}
                        x={i * 14}
                        y={j * 14}
                        width="12"
                        height="12"
                        rx="2"
                        fill={d.count === 0 ? "var(--bg-elev-2)" : d.color}
                      />
                    )),
                  )}
                </svg>
              </div>
            )}

            <div className="github__pinned">
              {pinned.map((r) => (
                <a key={r.name} className="github__repo" href={r.url} target="_blank" rel="noreferrer noopener" data-cursor="hover">
                  <h3>{r.name}</h3>
                  <p>{r.description}</p>
                  <div className="github__repo-meta">
                    {r.language && <span><i style={{ background: r.languageColor }} />{r.language}</span>}
                    <span>★ {r.stars}</span>
                    <span>⑂ {r.forks}</span>
                  </div>
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Github;
```

- [ ] **Step 5: Style**

`src/components/github/github.scss`:

```scss
@import "../../styles/mixins.scss";

.github {
  padding: var(--sp-24) var(--sp-6);
}

.github__inner {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--sp-6);
}

.github__label {
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--accent);
}

.github h2 { font-size: var(--fs-2xl); line-height: 1.05; }

.github__empty {
  color: var(--fg-muted);
  font-size: var(--fs-sm);
  code { padding: 0 4px; background: var(--bg-elev); border-radius: 4px; }
}

.github__stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--sp-4);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  padding: var(--sp-4) 0;

  div {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  strong { font-family: var(--font-display); font-size: var(--fs-xl); }
  span { color: var(--fg-muted); font-family: var(--font-mono); font-size: var(--fs-xs); text-transform: uppercase; letter-spacing: 0.1em; }
}

.github__heatmap svg {
  width: 100%;
  height: auto;
  max-height: 140px;
}

.github__pinned {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--sp-4);

  @include mobile { grid-template-columns: 1fr; }
}

.github__repo {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  padding: var(--sp-6);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  transition: border-color var(--dur-fast) var(--ease);

  &:hover { border-color: var(--accent); }

  h3 { font-size: var(--fs-md); }
  p { color: var(--fg-muted); font-size: var(--fs-sm); }
}

.github__repo-meta {
  display: flex;
  gap: var(--sp-4);
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  color: var(--fg-muted);
  margin-top: auto;

  i {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 6px;
    vertical-align: middle;
  }
}
```

- [ ] **Step 6: Commit**

```bash
git add scripts/fetch-github.mjs src/data/github.json src/components/github package.json
git commit -m "feat(github): add build-time GitHub fetch + Github section"
```

---

## Task 15: Contact rewrite — socials, honeypot, rate-limit + tests

**Files:**
- Modify: `src/components/contact/Contact.jsx`
- Modify: `src/components/contact/contact.scss`
- Create: `src/data/socials.js`
- Test: `src/components/contact/contact.test.jsx`

- [ ] **Step 1: Placeholder socials**

`src/data/socials.js`:

```js
// TODO: replace with real handles
export const socials = [
  { label: "GitHub", url: "https://github.com/your-handle" },
  { label: "LinkedIn", url: "https://linkedin.com/in/your-handle" },
  { label: "X", url: "https://x.com/your-handle" },
  { label: "Email", url: "mailto:you@example.com" },
];
```

- [ ] **Step 2: Failing test**

`src/components/contact/contact.test.jsx`:

```jsx
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Contact from "./Contact";

vi.mock("@emailjs/browser", () => ({
  default: { sendForm: vi.fn().mockResolvedValue({ status: 200 }) },
}));

beforeEach(() => {
  localStorage.clear();
});

describe("Contact", () => {
  it("blocks submission when honeypot is filled", async () => {
    const emailjs = (await import("@emailjs/browser")).default;
    render(<Contact />);
    await userEvent.type(screen.getByLabelText(/name/i), "Bot");
    await userEvent.type(screen.getByLabelText(/email/i), "bot@example.com");
    await userEvent.type(screen.getByLabelText(/message/i), "spam");
    const honey = document.querySelector('input[name="website"]');
    await userEvent.type(honey, "spam-content");
    await userEvent.click(screen.getByRole("button", { name: /submit/i }));
    expect(emailjs.sendForm).not.toHaveBeenCalled();
  });

  it("blocks submission within 60s rate limit", async () => {
    localStorage.setItem("contact:lastSent", String(Date.now()));
    const emailjs = (await import("@emailjs/browser")).default;
    render(<Contact />);
    await userEvent.type(screen.getByLabelText(/name/i), "Real");
    await userEvent.type(screen.getByLabelText(/email/i), "real@example.com");
    await userEvent.type(screen.getByLabelText(/message/i), "hi");
    await userEvent.click(screen.getByRole("button", { name: /submit/i }));
    expect(emailjs.sendForm).not.toHaveBeenCalled();
    expect(await screen.findByText(/wait/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run test, expect failure**

```bash
npx vitest run src/components/contact
```

Expected: FAIL — current Contact has no honeypot or rate limit.

- [ ] **Step 4: Rewrite component**

`src/components/contact/Contact.jsx`:

```jsx
import { useRef, useState } from "react";
import "./contact.scss";
import { motion, useInView } from "framer-motion";
import emailjs from "@emailjs/browser";
import { socials } from "../../data/socials";

const RATE_LIMIT_MS = 60_000;
const STORAGE_KEY = "contact:lastSent";

const Contact = () => {
  const ref = useRef(null);
  const formRef = useRef(null);
  const [status, setStatus] = useState("idle");
  const isInView = useInView(ref, { margin: "-100px" });

  const sendEmail = async (e) => {
    e.preventDefault();

    const honey = formRef.current.elements.website.value;
    if (honey) {
      setStatus("idle");
      return;
    }

    const last = Number(localStorage.getItem(STORAGE_KEY) || 0);
    if (Date.now() - last < RATE_LIMIT_MS) {
      setStatus("ratelimited");
      return;
    }

    setStatus("sending");
    try {
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      );
      setStatus("success");
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
      formRef.current.reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="contact" ref={ref} aria-labelledby="contact-title">
      <div className="contact__inner">
        <motion.div
          className="contact__intro"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="contact__label">Contact</span>
          <h2 id="contact-title">Let's work together.</h2>
          <ul className="contact__socials">
            {socials.map((s) => (
              <li key={s.label}>
                <a href={s.url} target="_blank" rel="noreferrer noopener" data-cursor="hover">{s.label} ↗</a>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.form
          ref={formRef}
          onSubmit={sendEmail}
          className="contact__form"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <label htmlFor="name">Name</label>
          <input id="name" type="text" required placeholder="Your name" name="name" autoComplete="name" />

          <label htmlFor="email">Email</label>
          <input id="email" type="email" required placeholder="you@example.com" name="email" autoComplete="email" />

          <label htmlFor="message">Message</label>
          <textarea id="message" rows={6} required placeholder="Tell me about your project" name="message" />

          <input
            type="text"
            name="website"
            tabIndex="-1"
            autoComplete="off"
            style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none" }}
            aria-hidden="true"
          />

          <button type="submit" disabled={status === "sending"} className="btn btn--primary" data-cursor="hover">
            {status === "sending" ? "Sending..." : "Submit"}
          </button>

          <p className={`contact__status contact__status--${status}`} role="status" aria-live="polite">
            {status === "ratelimited" && "Please wait a moment before sending again."}
            {status === "error" && "Could not send. Please email me directly."}
            {status === "success" && "Message sent. I'll be in touch."}
          </p>
        </motion.form>
      </div>
    </section>
  );
};

export default Contact;
```

- [ ] **Step 5: Restyle**

`src/components/contact/contact.scss`:

```scss
@import "../../styles/mixins.scss";

.contact {
  padding: var(--sp-24) var(--sp-6);
  background: var(--bg-elev);
}

.contact__inner {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--sp-16);

  @include tablet {
    grid-template-columns: 1fr;
    gap: var(--sp-8);
  }
}

.contact__label {
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--accent);
}

.contact h2 {
  font-size: var(--fs-2xl);
  line-height: 1.05;
  margin: var(--sp-2) 0 var(--sp-6);
}

.contact__socials {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  font-size: var(--fs-md);

  a:hover { color: var(--accent); }
}

.contact__form {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
  position: relative;

  label {
    font-family: var(--font-mono);
    font-size: var(--fs-xs);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--fg-muted);
  }

  input, textarea {
    background: var(--bg);
    border: 1px solid var(--border);
    color: var(--fg);
    padding: var(--sp-3) var(--sp-4);
    border-radius: var(--radius-sm);
    font: inherit;
    transition: border-color var(--dur-fast) var(--ease);

    &:focus-visible { border-color: var(--accent); outline: none; }
  }

  .btn { align-self: flex-start; }
}

.contact__status {
  min-height: 1.4em;
  font-size: var(--fs-sm);

  &--error { color: #ff8a8a; }
  &--success { color: #8dffb1; }
  &--ratelimited { color: var(--accent); }
}
```

- [ ] **Step 6: Run test, expect pass**

```bash
npx vitest run src/components/contact
```

Expected: 2 passing.

- [ ] **Step 7: Commit**

```bash
git add src/components/contact src/data/socials.js
git commit -m "feat(contact): add socials + honeypot + rate limit"
```

---

## Task 16: Cursor enhancement — invert on `[data-cursor=hover]`

**Files:**
- Modify: `src/components/cursor/Cursor.jsx`
- Modify: `src/components/cursor/cursor.scss`

- [ ] **Step 1: Track hover state via delegation**

`src/components/cursor/Cursor.jsx`:

```jsx
import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import "./cursor.scss";

const Cursor = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 500, damping: 40, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 500, damping: 40, mass: 0.5 });
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const onMove = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = e.target?.closest?.("[data-cursor='hover']");
      setHover(Boolean(el));
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [x, y]);

  return (
    <motion.div
      className={`cursor${hover ? " is-hover" : ""}`}
      style={{ x: springX, y: springY }}
      aria-hidden="true"
    />
  );
};

export default Cursor;
```

- [ ] **Step 2: Style update**

`src/components/cursor/cursor.scss`:

```scss
@import "../../styles/mixins.scss";

.cursor {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid var(--fg);
  position: fixed;
  top: 0;
  left: 0;
  margin-left: -16px;
  margin-top: -16px;
  z-index: 99999;
  pointer-events: none;
  transition: width var(--dur-fast) var(--ease),
              height var(--dur-fast) var(--ease),
              margin var(--dur-fast) var(--ease),
              background var(--dur-fast) var(--ease),
              border-color var(--dur-fast) var(--ease),
              mix-blend-mode var(--dur-fast) var(--ease);
  mix-blend-mode: difference;

  &.is-hover {
    width: 56px;
    height: 56px;
    margin-left: -28px;
    margin-top: -28px;
    background: var(--accent);
    border-color: var(--accent);
    mix-blend-mode: normal;
  }

  @include mobile { display: none; }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/cursor
git commit -m "feat(cursor): enlarge + tint on data-cursor hover targets"
```

---

## Task 17: Wire App.jsx

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Rewrite App.jsx**

```jsx
import "./styles/globals.scss";
import Cursor from "./components/cursor/Cursor";
import Navbar from "./components/navbar/Navbar";
import Hero from "./components/hero/Hero";
import About from "./components/about/About";
import Stack from "./components/stack/Stack";
import Experience from "./components/experience/Experience";
import Work from "./components/work/Work";
import Github from "./components/github/Github";
import Contact from "./components/contact/Contact";

const App = () => (
  <>
    <a href="#main" className="skip-link">Skip to content</a>
    <Cursor />
    <Navbar />
    <main id="main">
      <Hero />
      <About />
      <Stack />
      <Experience />
      <Work />
      <Github />
      <Contact />
    </main>
  </>
);

export default App;
```

- [ ] **Step 2: Run dev server, walk every section**

```bash
npm run dev
```

Click each navbar link. Verify:
- All 7 sections render.
- Theme toggle flips colors.
- Hamburger drawer opens < 1024 px.
- Section indicator dots highlight active link on scroll.
- Cursor enlarges over CTAs / cards.

Stop server.

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "feat(app): wire all redesigned sections"
```

---

## Task 18: SEO + OG meta in index.html

**Files:**
- Modify: `index.html`
- Create: `public/og.png` (placeholder, replaced later)

- [ ] **Step 1: Update `<head>`**

Replace the existing `<head>` content with:

```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#0a0a12" media="(prefers-color-scheme: dark)" />
  <meta name="theme-color" content="#fafafa" media="(prefers-color-scheme: light)" />

  <title>Vaibhav Rai — Full-stack Developer</title>
  <meta name="description" content="Vaibhav Rai's portfolio — full-stack developer building modern web products." />

  <meta property="og:type" content="website" />
  <meta property="og:title" content="Vaibhav Rai — Full-stack Developer" />
  <meta property="og:description" content="Portfolio · projects · contact" />
  <meta property="og:image" content="/og.png" />
  <meta property="og:url" content="https://example.com" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Vaibhav Rai — Full-stack Developer" />
  <meta name="twitter:description" content="Portfolio · projects · contact" />
  <meta name="twitter:image" content="/og.png" />

  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
    rel="stylesheet"
  />
</head>
```

- [ ] **Step 2: Drop placeholder OG image**

Create a 1200×630 placeholder PNG (any image editor; or use https://og-playground.vercel.app and download). Save to `public/og.png`. If you can't, use a solid-color PNG:

```bash
node -e "const fs=require('fs'); const b=Buffer.alloc(0); fs.writeFileSync('public/og.png', b);" 2>/dev/null
```

(Real OG image to come with content pass.)

- [ ] **Step 3: Add `<a href="#main">` skip link target check**

Already wired in Task 17 (App.jsx adds `id="main"` to `<main>`). Verify present.

- [ ] **Step 4: Commit**

```bash
git add index.html public/og.png
git commit -m "feat(seo): add meta tags + OG/Twitter cards"
```

---

## Task 19: Final manual mobile + Lighthouse pass

No code per se — verification.

- [ ] **Step 1: Build + preview**

```bash
npm run build
npm run preview -- --host 127.0.0.1 --port 4173
```

- [ ] **Step 2: Open Chrome → http://127.0.0.1:4173 → DevTools → device toolbar → iPhone 12 (390px)**

Scroll through every section. Check:
- No horizontal scroll.
- Type scales appropriately.
- Buttons reachable, links tappable.
- Drawer opens and closes.
- Theme toggle persists across reloads.

Fix any breakage in the corresponding component scss with `@include mobile { ... }` blocks. Commit incrementally as `fix(mobile): <component>`.

- [ ] **Step 3: Lighthouse**

DevTools → Lighthouse → Mobile + Desktop → Run.

Target ≥ 95 in all four. Common fixes:
- "Image elements do not have explicit width/height" → add to project images.
- "Avoid non-composited animations" → check particle canvas not blocking.
- "Color contrast" → check `--fg-muted` against `--bg-elev`.

Fix and re-run.

- [ ] **Step 4: Stop preview, commit any fixes**

```bash
git add -A
git commit -m "fix: mobile + lighthouse cleanup"
```

---

## Task 20: Cleanup + final smoke

- [ ] **Step 1: Run full test suite**

```bash
npm test
```

Expected: all green.

- [ ] **Step 2: Type-check (none — JS project) + build**

```bash
npm run build
```

Expected: builds cleanly. Warnings about Sass `@import` deprecation OK.

- [ ] **Step 3: Inspect git status — no stray files**

```bash
git status
```

Expected: clean working tree.

- [ ] **Step 4: Update README**

Replace contents of `README.md`:

```markdown
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
```

- [ ] **Step 5: Commit**

```bash
git add README.md
git commit -m "docs(readme): document setup, env, content editing"
```

- [ ] **Step 6: Confirm with user — ready for content pass**

User now drops real bio, photo, projects, experience into the `src/data/*.js` files. No code changes required.

---

## Self-review checklist

- Spec coverage:
  - §3 IA (7 sections) → Tasks 8–17 ✓
  - §5 tokens → Task 1 ✓
  - §6.1–6.10 components → Tasks 5, 8, 9, 10, 11, 12, 13, 14, 15, 16 ✓
  - §7 data flow → `src/data/*` across Tasks 8, 10, 11, 12, 13, 14, 15 ✓
  - §8 perf/SEO/a11y → Tasks 1 (focus-visible, skip-link), 17 (semantic), 18 (meta), 19 (Lighthouse) ✓
  - §9 error handling → fetch script fallback (14), form rate-limit + honeypot (15), simple-icons onError (11), Github component empty state (14) ✓
  - §10 testing → Tasks 3 (vitest setup), 4 (useTheme), 5 (ThemeToggle smoke), 6 (useActiveSection), 11 (Stack render), 15 (Contact) ✓
  - §11 migration plan order → matches Tasks 1–19 ✓
- Placeholder scan: no TBD/TODO inside steps; data files explicitly carry `// TODO` markers and that's intentional per §13 ✓
- Type consistency: `toggle()` named consistently across Task 4 + 5; `useActiveSection` returns string used identically in Task 6 + 8; `sections` array shape matches Task 8 producer and Task 6 consumer ✓
