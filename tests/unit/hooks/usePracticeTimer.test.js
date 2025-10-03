import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, test, expect, beforeEach, vi, afterEach } from 'vitest';
import { usePracticeTimer } from '../../../src/hooks/usePracticeTimer';

// Mock useTestMode hook
vi.mock('../../../src/hooks/useTestMode', () => ({
  useTestMode: () => ({
    getEffectiveDuration: (duration) => duration, // Use real durations for testing
    isTestMode: false
  })
}));

describe('usePracticeTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  const mockSession = {
    id: 'test-session',
    name: 'Test Session',
    poses: [
      { id: 'pose1', name: 'Mountain Pose', duration: 30 },
      { id: 'pose2', name: 'Downward Dog', duration: 45 },
      { id: 'pose3', name: 'Warrior I', duration: 60 }
    ]
  };

  describe('Initial state', () => {
    test('should initialize with correct default values', () => {
      const { result } = renderHook(() =>
        usePracticeTimer({
          session: mockSession,
          restDuration: 5,
          onSessionComplete: vi.fn()
        })
      );

      expect(result.current.timeRemaining).toBe(30); // First pose duration
      expect(result.current.isPlaying).toBe(false);
      expect(result.current.sessionStarted).toBe(false);
      expect(result.current.isResting).toBe(false);
      expect(result.current.restTimeRemaining).toBe(0);
      expect(result.current.currentPoseIndex).toBe(0);
      expect(result.current.totalPracticeTime).toBe(0);
    });

    test('should handle null session gracefully', () => {
      const { result } = renderHook(() =>
        usePracticeTimer({
          session: null,
          restDuration: 5,
          onSessionComplete: vi.fn()
        })
      );

      expect(result.current.timeRemaining).toBe(0);
      expect(result.current.currentPoseIndex).toBe(0);
    });
  });

  describe('Timer control', () => {
    test('should start timer when handlePlayPause is called', () => {
      const { result } = renderHook(() =>
        usePracticeTimer({
          session: mockSession,
          restDuration: 0,
          onSessionComplete: vi.fn()
        })
      );

      act(() => {
        result.current.handlePlayPause();
      });

      expect(result.current.isPlaying).toBe(true);
      expect(result.current.sessionStarted).toBe(true);
    });

    test('should pause timer when handlePlayPause is called while playing', () => {
      const { result } = renderHook(() =>
        usePracticeTimer({
          session: mockSession,
          restDuration: 0,
          onSessionComplete: vi.fn()
        })
      );

      act(() => {
        result.current.handlePlayPause(); // Start
      });

      act(() => {
        result.current.handlePlayPause(); // Pause
      });

      expect(result.current.isPlaying).toBe(false);
      expect(result.current.sessionStarted).toBe(true);
    });

    test('should countdown timer when playing', async () => {
      const { result } = renderHook(() =>
        usePracticeTimer({
          session: mockSession,
          restDuration: 0,
          onSessionComplete: vi.fn()
        })
      );

      act(() => {
        result.current.handlePlayPause();
      });

      const initialTime = result.current.timeRemaining;

      act(() => {
        vi.advanceTimersByTime(1000); // Advance 1 second
      });

      await waitFor(() => {
        expect(result.current.timeRemaining).toBe(initialTime - 1);
      });
    });

    test('should not countdown when paused', async () => {
      const { result } = renderHook(() =>
        usePracticeTimer({
          session: mockSession,
          restDuration: 0,
          onSessionComplete: vi.fn()
        })
      );

      act(() => {
        result.current.handlePlayPause(); // Start
      });

      act(() => {
        result.current.handlePlayPause(); // Pause
      });

      const timeWhenPaused = result.current.timeRemaining;

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(result.current.timeRemaining).toBe(timeWhenPaused);
    });
  });

  describe('Pose navigation', () => {
    test('should advance to next pose when handleNextPose is called', () => {
      const { result } = renderHook(() =>
        usePracticeTimer({
          session: mockSession,
          restDuration: 0,
          onSessionComplete: vi.fn()
        })
      );

      expect(result.current.currentPoseIndex).toBe(0);

      act(() => {
        result.current.handleNextPose();
      });

      expect(result.current.currentPoseIndex).toBe(1);
      expect(result.current.timeRemaining).toBe(45); // Second pose duration
    });

    test('should go to previous pose when handlePreviousPose is called', () => {
      const { result } = renderHook(() =>
        usePracticeTimer({
          session: mockSession,
          restDuration: 0,
          onSessionComplete: vi.fn()
        })
      );

      // Move to second pose
      act(() => {
        result.current.handleNextPose();
      });

      expect(result.current.currentPoseIndex).toBe(1);

      // Go back
      act(() => {
        result.current.handlePreviousPose();
      });

      expect(result.current.currentPoseIndex).toBe(0);
      expect(result.current.timeRemaining).toBe(30); // Back to first pose duration
    });

    test('should not go below index 0 when handlePreviousPose is called', () => {
      const { result } = renderHook(() =>
        usePracticeTimer({
          session: mockSession,
          restDuration: 0,
          onSessionComplete: vi.fn()
        })
      );

      expect(result.current.currentPoseIndex).toBe(0);

      act(() => {
        result.current.handlePreviousPose();
      });

      expect(result.current.currentPoseIndex).toBe(0);
    });

    test('should complete session when handleNextPose is called on last pose', () => {
      const onComplete = vi.fn();
      const { result } = renderHook(() =>
        usePracticeTimer({
          session: mockSession,
          restDuration: 0,
          onSessionComplete: onComplete
        })
      );

      // Move to last pose (index 2)
      act(() => {
        result.current.handleNextPose();
        result.current.handleNextPose();
      });

      expect(result.current.currentPoseIndex).toBe(2);

      // Try to advance beyond last pose
      act(() => {
        result.current.handleNextPose();
      });

      expect(onComplete).toHaveBeenCalledTimes(1);
    });
  });

  describe('Rest periods', () => {
    test('should enter rest period after pose completes with restDuration > 0', async () => {
      const { result } = renderHook(() =>
        usePracticeTimer({
          session: mockSession,
          restDuration: 10,
          onSessionComplete: vi.fn()
        })
      );

      act(() => {
        result.current.handlePlayPause(); // Start
      });

      // Fast-forward through entire first pose
      act(() => {
        vi.advanceTimersByTime(30000);
      });

      await waitFor(() => {
        expect(result.current.isResting).toBe(true);
        expect(result.current.restTimeRemaining).toBe(10);
      });
    });

    test('should skip to next pose immediately with restDuration = 0', async () => {
      const { result } = renderHook(() =>
        usePracticeTimer({
          session: mockSession,
          restDuration: 0,
          onSessionComplete: vi.fn()
        })
      );

      act(() => {
        result.current.handlePlayPause();
      });

      const initialPoseIndex = result.current.currentPoseIndex;

      // Fast-forward through first pose
      act(() => {
        vi.advanceTimersByTime(30000);
      });

      await waitFor(() => {
        expect(result.current.currentPoseIndex).toBe(initialPoseIndex + 1);
        expect(result.current.isResting).toBe(false);
      });
    });

    test('should advance to next pose after rest period completes', async () => {
      const { result } = renderHook(() =>
        usePracticeTimer({
          session: mockSession,
          restDuration: 5,
          onSessionComplete: vi.fn()
        })
      );

      act(() => {
        result.current.handlePlayPause();
      });

      // Complete first pose
      act(() => {
        vi.advanceTimersByTime(30000);
      });

      await waitFor(() => {
        expect(result.current.isResting).toBe(true);
      });

      // Complete rest period
      act(() => {
        vi.advanceTimersByTime(5000);
      });

      await waitFor(() => {
        expect(result.current.currentPoseIndex).toBe(1);
        expect(result.current.isResting).toBe(false);
        expect(result.current.timeRemaining).toBe(45); // Second pose
      });
    });

    test('should skip rest period when handleNextPose is called during rest', () => {
      const { result } = renderHook(() =>
        usePracticeTimer({
          session: mockSession,
          restDuration: 10,
          onSessionComplete: vi.fn()
        })
      );

      act(() => {
        result.current.handlePlayPause();
      });

      // Complete first pose
      act(() => {
        vi.advanceTimersByTime(30000);
      });

      // Should be in rest period
      expect(result.current.isResting).toBe(true);

      // Skip rest
      act(() => {
        result.current.handleNextPose();
      });

      expect(result.current.isResting).toBe(false);
      expect(result.current.currentPoseIndex).toBe(1);
      expect(result.current.restTimeRemaining).toBe(0);
    });

    test('should cancel rest when handlePreviousPose is called during rest', () => {
      const { result } = renderHook(() =>
        usePracticeTimer({
          session: mockSession,
          restDuration: 10,
          onSessionComplete: vi.fn()
        })
      );

      act(() => {
        result.current.handlePlayPause();
      });

      // Move to second pose
      act(() => {
        result.current.handleNextPose();
      });

      // Complete second pose to enter rest
      act(() => {
        vi.advanceTimersByTime(45000);
      });

      expect(result.current.isResting).toBe(true);

      // Go back during rest
      act(() => {
        result.current.handlePreviousPose();
      });

      expect(result.current.isResting).toBe(false);
      expect(result.current.currentPoseIndex).toBe(1);
    });
  });

  describe('Session completion', () => {
    test('should call onSessionComplete when last pose timer reaches 0', async () => {
      const onComplete = vi.fn();
      const { result } = renderHook(() =>
        usePracticeTimer({
          session: mockSession,
          restDuration: 0,
          onSessionComplete: onComplete
        })
      );

      act(() => {
        result.current.handlePlayPause();
      });

      // Move to last pose
      act(() => {
        result.current.handleNextPose();
        result.current.handleNextPose();
      });

      // Complete last pose
      act(() => {
        vi.advanceTimersByTime(60000);
      });

      await waitFor(() => {
        expect(onComplete).toHaveBeenCalledTimes(1);
        expect(result.current.isPlaying).toBe(false);
      });
    });

    test('should not enter rest period after last pose', async () => {
      const { result } = renderHook(() =>
        usePracticeTimer({
          session: mockSession,
          restDuration: 10,
          onSessionComplete: vi.fn()
        })
      );

      act(() => {
        result.current.handlePlayPause();
      });

      // Move to last pose
      act(() => {
        result.current.handleNextPose();
        result.current.handleNextPose();
      });

      // Complete last pose
      act(() => {
        vi.advanceTimersByTime(60000);
      });

      await waitFor(() => {
        expect(result.current.isResting).toBe(false);
      });
    });
  });

  describe('Practice time tracking', () => {
    test('should track total practice time when playing', () => {
      const { result } = renderHook(() =>
        usePracticeTimer({
          session: mockSession,
          restDuration: 0,
          onSessionComplete: vi.fn()
        })
      );

      act(() => {
        result.current.startPractice();
      });

      act(() => {
        vi.advanceTimersByTime(5000); // 5 seconds
      });

      const finalTime = result.current.getFinalPracticeTime();
      expect(finalTime).toBeGreaterThan(4); // Account for timing precision
      expect(finalTime).toBeLessThan(6);
    });

    test('should handle pause/resume for practice time tracking', () => {
      const { result } = renderHook(() =>
        usePracticeTimer({
          session: mockSession,
          restDuration: 0,
          onSessionComplete: vi.fn()
        })
      );

      // Start
      act(() => {
        result.current.handlePlayPause();
        vi.advanceTimersByTime(3000); // 3 seconds
      });

      // Pause
      act(() => {
        result.current.handlePlayPause();
      });

      expect(result.current.totalPracticeTime).toBeGreaterThan(2);

      // Wait while paused
      act(() => {
        vi.advanceTimersByTime(5000); // 5 seconds paused (shouldn't count)
      });

      // Resume
      act(() => {
        result.current.handlePlayPause();
        vi.advanceTimersByTime(2000); // 2 more seconds
      });

      const finalTime = result.current.getFinalPracticeTime();
      expect(finalTime).toBeGreaterThan(4); // ~5 seconds total
      expect(finalTime).toBeLessThan(7);
    });

    test('startPractice should auto-start the timer', () => {
      const { result } = renderHook(() =>
        usePracticeTimer({
          session: mockSession,
          restDuration: 0,
          onSessionComplete: vi.fn()
        })
      );

      act(() => {
        result.current.startPractice();
      });

      expect(result.current.isPlaying).toBe(true);
      expect(result.current.sessionStarted).toBe(true);
    });
  });

  describe('Utility functions', () => {
    test('formatTime should format seconds as MM:SS', () => {
      const { result } = renderHook(() =>
        usePracticeTimer({
          session: mockSession,
          restDuration: 0,
          onSessionComplete: vi.fn()
        })
      );

      expect(result.current.formatTime(0)).toBe('0:00');
      expect(result.current.formatTime(5)).toBe('0:05');
      expect(result.current.formatTime(59)).toBe('0:59');
      expect(result.current.formatTime(60)).toBe('1:00');
      expect(result.current.formatTime(125)).toBe('2:05');
      expect(result.current.formatTime(3661)).toBe('61:01');
    });

    test('getProgressPercent should calculate correct percentage', () => {
      const { result } = renderHook(() =>
        usePracticeTimer({
          session: mockSession,
          restDuration: 0,
          onSessionComplete: vi.fn()
        })
      );

      // First pose is 30 seconds
      expect(result.current.getProgressPercent()).toBe(0);

      act(() => {
        result.current.handlePlayPause();
        vi.advanceTimersByTime(15000); // 15 seconds elapsed
      });

      // 15 seconds elapsed out of 30 = 50%
      expect(result.current.getProgressPercent()).toBeCloseTo(50, 0);
    });

    test('getProgressPercent should return 0 for invalid pose data', () => {
      const { result } = renderHook(() =>
        usePracticeTimer({
          session: null,
          restDuration: 0,
          onSessionComplete: vi.fn()
        })
      );

      expect(result.current.getProgressPercent()).toBe(0);
    });
  });
});
