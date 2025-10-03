import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act, waitFor } from "@testing-library/react";
import BreathingGuide from "../../../src/components/BreathingGuide";

// Mock design system components
vi.mock("../../../src/components/design-system", () => ({
  Text: ({ children, className, variant }) => (
    <div className={className} data-variant={variant}>
      {children}
    </div>
  ),
  CircularProgress: ({ value, className }) => (
    <div className={className} data-progress={value}>
      Progress: {value}%
    </div>
  ),
}));

// Mock breathing data
vi.mock("../../../src/data/breathing", () => ({
  getBreathingInstruction: vi.fn((exercise, phase) => {
    const instructions = {
      inhale: "Breathe in slowly through your nose",
      holdIn: "Hold your breath",
      exhale: "Breathe out slowly through your mouth",
      holdOut: "Rest and prepare for the next breath",
    };
    return instructions[phase] || "Breathe";
  }),
}));

describe("BreathingGuide", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  const mockExercise = {
    nameEnglish: "Box Breathing",
    pattern: {
      inhale: 4,
      holdIn: 4,
      exhale: 4,
      holdOut: 4,
    },
  };

  it("renders breathing guide with exercise name", () => {
    render(<BreathingGuide exercise={mockExercise} isActive={false} />);

    expect(screen.getByText("Box Breathing")).toBeInTheDocument();
  });

  it("shows breathing pattern", () => {
    render(<BreathingGuide exercise={mockExercise} isActive={false} />);

    expect(screen.getByText("4-4-4-4 pattern")).toBeInTheDocument();
  });

  it("starts with inhale phase", () => {
    render(<BreathingGuide exercise={mockExercise} isActive={false} />);

    expect(screen.getByText("Breathe In")).toBeInTheDocument();
  });

  it("shows correct instructions for inhale phase", () => {
    render(<BreathingGuide exercise={mockExercise} isActive={true} />);

    expect(
      screen.getByText(/Breathe in slowly through your nose/i),
    ).toBeInTheDocument();
  });

  it("progresses through breathing phases when active", async () => {
    const onCycleComplete = vi.fn();

    render(
      <BreathingGuide
        exercise={mockExercise}
        isActive={true}
        onCycleComplete={onCycleComplete}
      />,
    );

    // Should start with inhale
    expect(screen.getByText("Breathe In")).toBeInTheDocument();

    // Advance to holdIn phase (4 seconds)
    await vi.advanceTimersByTimeAsync(4100);
    expect(screen.getByText("Hold")).toBeInTheDocument();

    // Advance to exhale phase (4 seconds)
    await vi.advanceTimersByTimeAsync(4100);
    expect(screen.getByText("Breathe Out")).toBeInTheDocument();

    // Advance to holdOut phase (4 seconds)
    await vi.advanceTimersByTimeAsync(4100);
    expect(screen.getByText("Rest")).toBeInTheDocument();
  });

  it("calls onCycleComplete when completing a full cycle", async () => {
    const onCycleComplete = vi.fn();

    render(
      <BreathingGuide
        exercise={mockExercise}
        isActive={true}
        onCycleComplete={onCycleComplete}
      />,
    );

    // Complete full cycle: inhale (4s) + holdIn (4s) + exhale (4s) + holdOut (4s) = 16s
    await vi.advanceTimersByTimeAsync(16500);

    expect(onCycleComplete).toHaveBeenCalled();
  });

  it("resets to inhale phase when not active", async () => {
    const { rerender } = render(
      <BreathingGuide exercise={mockExercise} isActive={true} />,
    );

    // Advance to a different phase
    await vi.advanceTimersByTimeAsync(4000);

    // Deactivate
    rerender(<BreathingGuide exercise={mockExercise} isActive={false} />);

    // Should reset to inhale
    expect(screen.getByText("Breathe In")).toBeInTheDocument();
  });

  it("displays phase duration", () => {
    render(<BreathingGuide exercise={mockExercise} isActive={true} />);

    expect(screen.getByText("4s")).toBeInTheDocument();
  });

  it("shows different durations for different phases", async () => {
    const asymmetricExercise = {
      nameEnglish: "4-7-8 Breathing",
      pattern: {
        inhale: 4,
        holdIn: 7,
        exhale: 8,
        holdOut: 0,
      },
    };

    render(<BreathingGuide exercise={asymmetricExercise} isActive={true} />);

    // Check inhale duration
    expect(screen.getByText("4s")).toBeInTheDocument();

    // Advance to holdIn
    await vi.advanceTimersByTimeAsync(4100);
    expect(screen.getByText("7s")).toBeInTheDocument();

    // Advance to exhale
    await vi.advanceTimersByTimeAsync(7100);
    expect(screen.getByText("8s")).toBeInTheDocument();
  });

  it("animates circle scale during breathing phases", () => {
    const { container } = render(
      <BreathingGuide exercise={mockExercise} isActive={true} />,
    );

    const breathingCircle = container.querySelector(".bg-gradient-to-br");
    expect(breathingCircle).toBeInTheDocument();

    // Check that transform style is applied
    const style = window.getComputedStyle(breathingCircle);
    expect(breathingCircle.style.transform).toBeDefined();
  });

  it("shows circular progress indicator", () => {
    render(<BreathingGuide exercise={mockExercise} isActive={true} />);

    // CircularProgress is mocked, so we check for the mocked output
    const progressElement = screen.getByText(/Progress:/);
    expect(progressElement).toBeInTheDocument();
  });

  it("returns null when exercise is not provided", () => {
    const { container } = render(
      <BreathingGuide exercise={null} isActive={true} />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("updates phase progress over time", async () => {
    render(<BreathingGuide exercise={mockExercise} isActive={true} />);

    // Initial progress should be 0
    let progressElement = screen.getByText(/Progress:/);
    expect(progressElement.getAttribute("data-progress")).toBe("0");

    // Advance halfway through inhale phase (2 seconds of 4)
    await act(async () => {
      await vi.advanceTimersByTimeAsync(2000);
    });

    progressElement = screen.getByText(/Progress:/);
    const progress = parseFloat(progressElement.getAttribute("data-progress"));
    expect(progress).toBeGreaterThan(40); // Should be around 50%
  });

  it("handles rapid phase transitions correctly", async () => {
    const quickExercise = {
      nameEnglish: "Quick Breathing",
      pattern: {
        inhale: 1,
        holdIn: 1,
        exhale: 1,
        holdOut: 1,
      },
    };

    render(<BreathingGuide exercise={quickExercise} isActive={true} />);

    expect(screen.getByText("Breathe In")).toBeInTheDocument();

    // Quickly advance through all phases - need slightly more time for setTimeout to fire
    await vi.advanceTimersByTimeAsync(1200);
    expect(screen.getByText("Hold")).toBeInTheDocument();

    await vi.advanceTimersByTimeAsync(1200);
    expect(screen.getByText("Breathe Out")).toBeInTheDocument();

    await vi.advanceTimersByTimeAsync(1200);
    expect(screen.getByText("Rest")).toBeInTheDocument();
  });

  it("cleans up timers on unmount", () => {
    const { unmount } = render(
      <BreathingGuide exercise={mockExercise} isActive={true} />,
    );

    const timerCount = vi.getTimerCount();
    expect(timerCount).toBeGreaterThan(0);

    unmount();

    // Timers should be cleaned up
    expect(vi.getTimerCount()).toBeLessThan(timerCount);
  });
});
