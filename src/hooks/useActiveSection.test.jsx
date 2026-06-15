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
