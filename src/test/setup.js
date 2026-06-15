import "@testing-library/jest-dom";

// jsdom lacks IntersectionObserver, which framer-motion's `whileInView` needs.
// Tests that need to drive entries (e.g. useActiveSection) stub their own.
if (typeof globalThis.IntersectionObserver === "undefined") {
  class NoopIntersectionObserver {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() { return []; }
  }
  globalThis.IntersectionObserver = NoopIntersectionObserver;
}
