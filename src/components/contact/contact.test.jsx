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
