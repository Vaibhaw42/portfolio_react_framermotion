import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ThemeToggle from "./ThemeToggle";

describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
    vi.stubGlobal("matchMedia", () => ({
      matches: false,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
    }));
  });

  it("toggles aria-pressed on click", async () => {
    render(<ThemeToggle />);
    const btn = screen.getByRole("button");
    const initial = btn.getAttribute("aria-pressed");
    await userEvent.click(btn);
    expect(btn.getAttribute("aria-pressed")).not.toBe(initial);
  });
});
