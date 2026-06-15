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
