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

const sectionIds = sections.map((s) => s.id);

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const active = useActiveSection(sectionIds);

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
