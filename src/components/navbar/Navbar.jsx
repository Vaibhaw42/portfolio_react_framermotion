import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import "./navbar.scss";
import { sections } from "../../data/sections";
import { useActiveSection } from "../../hooks/useActiveSection";
import { useMagnetic } from "../../hooks/useMagnetic";
import ThemeToggle from "../themeToggle/ThemeToggle";

const sectionIds = sections.map((s) => s.id);

const drawerVariants = {
  closed: { x: "100%" },
  open: { x: 0 },
};

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection(sectionIds);
  const resumeRef = useMagnetic();
  const drawerRef = useRef(null);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 8));

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key === "Tab" && drawerRef.current) {
        const focusable = drawerRef.current.querySelectorAll("a, button");
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          last.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    };
    drawerRef.current?.querySelector("a, button")?.focus();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className={`navbar${scrolled ? " is-scrolled" : ""}`}>
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
          <a
            ref={resumeRef}
            className="navbar__resume"
            href="/resume.pdf"
            download
            data-cursor="hover"
          >
            Resume
          </a>
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
            ref={drawerRef}
            className="navbar__drawer"
            initial="closed"
            animate="open"
            exit="closed"
            variants={drawerVariants}
            transition={{ type: "spring", stiffness: 240, damping: 28 }}
            aria-label="Mobile navigation"
          >
            {sections.map((s) => (
              <a key={s.id} href={`#${s.id}`} onClick={close} data-cursor="hover">{s.label}</a>
            ))}
            <a href="/resume.pdf" download onClick={close} data-cursor="hover">Resume</a>
          </motion.aside>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
