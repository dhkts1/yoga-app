import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MoodTracker from "../../../src/components/MoodTracker";

// Mock framer-motion to avoid animation issues
vi.mock("framer-motion", () => ({
  motion: {
    button: ({ children, onClick, className, whileTap, ...props }) => (
      <button onClick={onClick} className={className} {...props}>
        {children}
      </button>
    ),
    div: ({ children, className, ...props }) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
  },
}));

// Mock focus trap hook
vi.mock("../../../src/hooks/useFocusTrap", () => ({
  useFocusTrap: () => ({ current: null }),
}));

describe("MoodTracker", () => {
  it("renders mood selection interface", () => {
    const onComplete = vi.fn();
    const onSkip = vi.fn();

    render(<MoodTracker onComplete={onComplete} onSkip={onSkip} />);

    expect(screen.getByText(/How are you feeling/i)).toBeInTheDocument();
    expect(
      screen.getByText(/This helps us understand your starting point/i),
    ).toBeInTheDocument();
  });

  it("displays all 5 mood options", () => {
    const onComplete = vi.fn();
    const onSkip = vi.fn();

    render(<MoodTracker onComplete={onComplete} onSkip={onSkip} />);

    expect(screen.getByLabelText("Mood: Down")).toBeInTheDocument();
    expect(screen.getByLabelText("Mood: Okay")).toBeInTheDocument();
    expect(screen.getByLabelText("Mood: Good")).toBeInTheDocument();
    expect(screen.getByLabelText("Mood: Happy")).toBeInTheDocument();
    expect(screen.getByLabelText("Mood: Great")).toBeInTheDocument();
  });

  it("advances to energy step after selecting mood", async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    const onSkip = vi.fn();

    render(<MoodTracker onComplete={onComplete} onSkip={onSkip} />);

    // Select mood level 4
    const moodButton = screen.getByLabelText("Mood: Happy");
    await user.click(moodButton);

    // Wait for energy step to appear
    await waitFor(
      () => {
        expect(
          screen.getByText(/What's your energy level/i),
        ).toBeInTheDocument();
      },
      { timeout: 500 },
    );
  });

  it("allows selecting mood and energy levels", async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    const onSkip = vi.fn();

    render(<MoodTracker onComplete={onComplete} onSkip={onSkip} />);

    // Select mood level 4 (Happy)
    const moodButton = screen.getByLabelText("Mood: Happy");
    await user.click(moodButton);

    // Wait for energy step
    await waitFor(() => {
      expect(screen.getByText(/What's your energy level/i)).toBeInTheDocument();
    });

    // Select energy level 3 (Moderate)
    const energyButton = screen.getByLabelText("Energy level: Moderate");
    await user.click(energyButton);

    // Wait for completion callback
    await waitFor(
      () => {
        expect(onComplete).toHaveBeenCalledWith({
          mood: expect.any(Object),
          energy: expect.any(Object),
        });
      },
      { timeout: 500 },
    );
  });

  it("can be skipped", async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    const onSkip = vi.fn();

    render(<MoodTracker onComplete={onComplete} onSkip={onSkip} />);

    const skipButton = screen.getByRole("button", { name: /skip/i });
    await user.click(skipButton);

    expect(onSkip).toHaveBeenCalled();
  });

  it("shows post-practice messaging when isPostPractice is true", () => {
    const onComplete = vi.fn();
    const onSkip = vi.fn();

    render(
      <MoodTracker
        onComplete={onComplete}
        onSkip={onSkip}
        isPostPractice={true}
      />,
    );

    expect(
      screen.getByText(/Let's see how your practice went/i),
    ).toBeInTheDocument();
  });

  it('handles "don\'t show again" checkbox', async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    const onSkip = vi.fn();
    const onDontShowAgain = vi.fn();

    render(
      <MoodTracker
        onComplete={onComplete}
        onSkip={onSkip}
        onDontShowAgain={onDontShowAgain}
      />,
    );

    // Check the "don't show again" checkbox
    const checkbox = screen.getByRole("checkbox");
    await user.click(checkbox);

    // Skip to trigger the callback
    const skipButton = screen.getByRole("button", { name: /skip/i });
    await user.click(skipButton);

    expect(onDontShowAgain).toHaveBeenCalled();
  });

  it("shows progress indicators", () => {
    const onComplete = vi.fn();
    const onSkip = vi.fn();

    render(<MoodTracker onComplete={onComplete} onSkip={onSkip} />);

    // Should have progress dots
    const progressDots = screen
      .getByRole("dialog")
      .querySelectorAll(".size-2.rounded-full");
    expect(progressDots.length).toBeGreaterThanOrEqual(2);
  });

  it("has accessible dialog role and labels", () => {
    const onComplete = vi.fn();
    const onSkip = vi.fn();

    render(<MoodTracker onComplete={onComplete} onSkip={onSkip} />);

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby", "mood-tracker-title");
  });
});
