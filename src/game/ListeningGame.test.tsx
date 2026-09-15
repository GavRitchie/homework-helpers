import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ListeningGame } from "./ListeningGame";

afterEach(() => {
  vi.useRealTimers();
  vi.clearAllMocks();
});

describe("ListeningGame", () => {
  it("starts a simplified session with ten choices and plays speech", async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><ListeningGame /></MemoryRouter>);

    expect(screen.getByRole("heading", { name: "Listening Match" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /start listening/i }));

    expect(screen.getByRole("heading", { name: "Which word did you hear?" })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /^Choose / })).toHaveLength(10);
    expect(window.speechSynthesis.speak).toHaveBeenCalledOnce();
  });

  it("switches to traditional and requests a Taiwanese Mandarin voice", async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><ListeningGame /></MemoryRouter>);

    await user.click(screen.getByText("Traditional"));
    await user.click(screen.getByRole("button", { name: /start listening/i }));

    const utterance = vi.mocked(window.speechSynthesis.speak).mock.calls[0][0];
    expect(utterance.lang).toBe("zh-TW");
  });

  it("times out, reveals the answer, and advances", async () => {
    vi.useFakeTimers();
    render(<MemoryRouter><ListeningGame /></MemoryRouter>);
    const start = screen.getByRole("button", { name: /start listening/i });
    act(() => start.click());

    expect(screen.getByText("1", { selector: ".progress-copy strong" })).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(8000));
    expect(screen.getByText(/Time's up/)).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(900));
    expect(screen.getByText("2", { selector: ".progress-copy strong" })).toBeInTheDocument();
  });

  it("lets the learner practice without a timer", () => {
    vi.useFakeTimers();
    render(<MemoryRouter><ListeningGame /></MemoryRouter>);

    fireEvent.click(screen.getByRole("checkbox", { name: /use a timer/i }));
    expect(screen.getByText(/No timer/)).toBeInTheDocument();
    act(() => screen.getByRole("button", { name: /start listening/i }).click());

    expect(screen.queryByLabelText(/seconds remaining/i)).not.toBeInTheDocument();
    act(() => vi.advanceTimersByTime(60_000));
    expect(screen.getByText("1", { selector: ".progress-copy strong" })).toBeInTheDocument();
    expect(screen.queryByText(/Time's up/)).not.toBeInTheDocument();
  });

  it("uses the configured number of seconds", () => {
    vi.useFakeTimers();
    render(<MemoryRouter><ListeningGame /></MemoryRouter>);

    fireEvent.change(screen.getByRole("spinbutton", { name: /seconds per word/i }), { target: { value: "12" } });
    act(() => screen.getByRole("button", { name: /start listening/i }).click());

    expect(screen.getByLabelText("12 seconds remaining")).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(11_999));
    expect(screen.queryByText(/Time's up/)).not.toBeInTheDocument();
    act(() => vi.advanceTimersByTime(1));
    expect(screen.getByText(/Time's up/)).toBeInTheDocument();
  });

  it("marks a selected answer only once", () => {
    vi.useFakeTimers();
    render(<MemoryRouter><ListeningGame /></MemoryRouter>);
    act(() => screen.getByRole("button", { name: /start listening/i }).click());
    const choices = screen.getAllByRole("button", { name: /^Choose / });
    act(() => {
      choices[0].click();
      choices[1].click();
    });
    expect(choices.every((choice) => choice.hasAttribute("disabled"))).toBe(true);
  });
});
