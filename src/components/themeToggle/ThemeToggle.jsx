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
