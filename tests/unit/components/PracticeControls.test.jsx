import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PracticeControls } from "../../../src/components/practice/PracticeControls";

// Mock pose data
vi.mock("../../../src/data/poses", () => ({
  getPoseById: vi.fn((id) => {
    const poses = {
      "mountain-pose": { nameEnglish: "Mountain Pose" },
      "downward-dog": { nameEnglish: "Downward Dog" },
      "child-pose": { nameEnglish: "Child Pose" },
    };
    return poses[id];
  }),
}));

describe("PracticeControls", () => {
  const mockSession = {
    poses: [
      { poseId: "mountain-pose", duration: 30 },
      { poseId: "downward-dog", duration: 45 },
      { poseId: "child-pose", duration: 60 },
    ],
  };

  it("renders play/pause and navigation buttons", () => {
    const onPlayPause = vi.fn();
    const onPreviousPose = vi.fn();
    const onNextPose = vi.fn();

    render(
      <PracticeControls
        isPlaying={false}
        currentPoseIndex={1}
        session={mockSession}
        onPlayPause={onPlayPause}
        onPreviousPose={onPreviousPose}
        onNextPose={onNextPose}
      />,
    );

    expect(screen.getByLabelText("Play")).toBeInTheDocument();
    expect(screen.getByLabelText("Previous pose")).toBeInTheDocument();
    expect(screen.getByLabelText("Skip to next pose")).toBeInTheDocument();
  });

  it("shows pause icon when playing", () => {
    const onPlayPause = vi.fn();
    const onPreviousPose = vi.fn();
    const onNextPose = vi.fn();

    render(
      <PracticeControls
        isPlaying={true}
        currentPoseIndex={0}
        session={mockSession}
        onPlayPause={onPlayPause}
        onPreviousPose={onPreviousPose}
        onNextPose={onNextPose}
      />,
    );

    expect(screen.getByLabelText("Pause")).toBeInTheDocument();
  });

  it("disables previous button on first pose", () => {
    const onPlayPause = vi.fn();
    const onPreviousPose = vi.fn();
    const onNextPose = vi.fn();

    render(
      <PracticeControls
        isPlaying={false}
        currentPoseIndex={0}
        session={mockSession}
        onPlayPause={onPlayPause}
        onPreviousPose={onPreviousPose}
        onNextPose={onNextPose}
      />,
    );

    const previousButton = screen.getByLabelText("Previous pose");
    expect(previousButton).toBeDisabled();
  });

  it("disables next button on last pose", () => {
    const onPlayPause = vi.fn();
    const onPreviousPose = vi.fn();
    const onNextPose = vi.fn();

    render(
      <PracticeControls
        isPlaying={false}
        currentPoseIndex={2}
        session={mockSession}
        onPlayPause={onPlayPause}
        onPreviousPose={onPreviousPose}
        onNextPose={onNextPose}
      />,
    );

    const nextButton = screen.getByLabelText("Skip to next pose");
    expect(nextButton).toBeDisabled();
  });

  it("calls onPlayPause when play/pause button is clicked", async () => {
    const user = userEvent.setup();
    const onPlayPause = vi.fn();
    const onPreviousPose = vi.fn();
    const onNextPose = vi.fn();

    render(
      <PracticeControls
        isPlaying={false}
        currentPoseIndex={1}
        session={mockSession}
        onPlayPause={onPlayPause}
        onPreviousPose={onPreviousPose}
        onNextPose={onNextPose}
      />,
    );

    const playButton = screen.getByLabelText("Play");
    await user.click(playButton);

    expect(onPlayPause).toHaveBeenCalledTimes(1);
  });

  it("calls onPreviousPose when previous button is clicked", async () => {
    const user = userEvent.setup();
    const onPlayPause = vi.fn();
    const onPreviousPose = vi.fn();
    const onNextPose = vi.fn();

    render(
      <PracticeControls
        isPlaying={false}
        currentPoseIndex={1}
        session={mockSession}
        onPlayPause={onPlayPause}
        onPreviousPose={onPreviousPose}
        onNextPose={onNextPose}
      />,
    );

    const previousButton = screen.getByLabelText("Previous pose");
    await user.click(previousButton);

    expect(onPreviousPose).toHaveBeenCalledTimes(1);
  });

  it("calls onNextPose when next button is clicked", async () => {
    const user = userEvent.setup();
    const onPlayPause = vi.fn();
    const onPreviousPose = vi.fn();
    const onNextPose = vi.fn();

    render(
      <PracticeControls
        isPlaying={false}
        currentPoseIndex={0}
        session={mockSession}
        onPlayPause={onPlayPause}
        onPreviousPose={onPreviousPose}
        onNextPose={onNextPose}
      />,
    );

    const nextButton = screen.getByLabelText("Skip to next pose");
    await user.click(nextButton);

    expect(onNextPose).toHaveBeenCalledTimes(1);
  });

  // Note: The following tests were removed because the PracticeControls component
  // was simplified in the latest implementation to focus only on playback controls.
  // The next pose preview and end session button features were removed.
  // The component now only contains: play/pause, previous, and next buttons.

  it("returns null when session is not provided", () => {
    const onPlayPause = vi.fn();
    const onPreviousPose = vi.fn();
    const onNextPose = vi.fn();

    const { container } = render(
      <PracticeControls
        isPlaying={false}
        currentPoseIndex={0}
        session={null}
        onPlayPause={onPlayPause}
        onPreviousPose={onPreviousPose}
        onNextPose={onNextPose}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("has appropriate ARIA labels for accessibility", () => {
    const onPlayPause = vi.fn();
    const onPreviousPose = vi.fn();
    const onNextPose = vi.fn();

    render(
      <PracticeControls
        isPlaying={false}
        currentPoseIndex={1}
        session={mockSession}
        onPlayPause={onPlayPause}
        onPreviousPose={onPreviousPose}
        onNextPose={onNextPose}
      />,
    );

    expect(screen.getByLabelText("Play")).toHaveAccessibleName();
    expect(screen.getByLabelText("Previous pose")).toHaveAccessibleName();
    expect(screen.getByLabelText("Skip to next pose")).toHaveAccessibleName();
  });
});
