import { renderHook, act } from '@testing-library/react';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { useMoodTracking } from '../../../src/hooks/useMoodTracking';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate
}));

// Mock preferences store
const mockPreferencesStore = {
  yoga: {
    showMoodCheck: true
  }
};

const mockSetYogaMoodCheck = vi.fn();

vi.mock('../../../src/stores/preferences', () => ({
  default: () => mockPreferencesStore,
  __esModule: true
}));

describe('useMoodTracking', () => {
  const mockGetFinalPracticeTime = vi.fn(() => 600); // 10 minutes in seconds
  const defaultProps = {
    sessionId: 'test-session',
    getFinalPracticeTime: mockGetFinalPracticeTime,
    programContext: null
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockPreferencesStore.yoga.showMoodCheck = true;

    // Mock the store's getState method
    vi.mock('../../../src/stores/preferences', () => ({
      default: () => mockPreferencesStore,
      __esModule: true
    }));

    // Reset the mock implementation for setYogaMoodCheck
    vi.spyOn(require('../../../src/stores/preferences').default, 'getState').mockReturnValue({
      setYogaMoodCheck: mockSetYogaMoodCheck
    });
  });

  describe('Initial state', () => {
    test('should initialize with pre-mood tracker visible when preference is true', () => {
      const { result } = renderHook(() => useMoodTracking(defaultProps));

      expect(result.current.showPreMoodTracker).toBe(true);
      expect(result.current.showPostMoodTracker).toBe(false);
      expect(result.current.preMoodData).toBeNull();
    });

    test('should initialize with pre-mood tracker hidden when preference is false', () => {
      mockPreferencesStore.yoga.showMoodCheck = false;

      const { result } = renderHook(() => useMoodTracking(defaultProps));

      expect(result.current.showPreMoodTracker).toBe(false);
    });

    test('should default to showing pre-mood tracker when preference is undefined', () => {
      mockPreferencesStore.yoga = {};

      const { result } = renderHook(() => useMoodTracking(defaultProps));

      expect(result.current.showPreMoodTracker).toBe(true);
    });
  });

  describe('Pre-practice mood tracking', () => {
    test('handlePreMoodComplete should store mood data and hide tracker', () => {
      const { result } = renderHook(() => useMoodTracking(defaultProps));

      const moodData = {
        mood: { value: 4, label: 'Happy' },
        energy: { value: 3, label: 'Moderate' }
      };

      act(() => {
        result.current.handlePreMoodComplete(moodData);
      });

      expect(result.current.preMoodData).toEqual(moodData);
      expect(result.current.showPreMoodTracker).toBe(false);
    });

    test('handlePreMoodSkip should hide tracker without storing data', () => {
      const { result } = renderHook(() => useMoodTracking(defaultProps));

      act(() => {
        result.current.handlePreMoodSkip();
      });

      expect(result.current.preMoodData).toBeNull();
      expect(result.current.showPreMoodTracker).toBe(false);
    });

    test('handleDontShowMoodAgain should update preferences', () => {
      const { result } = renderHook(() => useMoodTracking(defaultProps));

      // Create a mock for the store's getState
      const mockGetState = vi.fn(() => ({
        setYogaMoodCheck: mockSetYogaMoodCheck
      }));

      // Mock the preferences store
      const usePreferencesStore = require('../../../src/stores/preferences').default;
      usePreferencesStore.getState = mockGetState;

      act(() => {
        result.current.handleDontShowMoodAgain();
      });

      expect(mockGetState).toHaveBeenCalled();
      expect(mockSetYogaMoodCheck).toHaveBeenCalledWith(false);
    });
  });

  describe('Post-practice mood tracking', () => {
    test('showPostMood should display post-mood tracker', () => {
      const { result } = renderHook(() => useMoodTracking(defaultProps));

      expect(result.current.showPostMoodTracker).toBe(false);

      act(() => {
        result.current.showPostMood();
      });

      expect(result.current.showPostMoodTracker).toBe(true);
    });

    test('handlePostMoodComplete should navigate with full mood data', () => {
      const { result } = renderHook(() => useMoodTracking(defaultProps));

      const preMoodData = {
        mood: { value: 3, label: 'Neutral' },
        energy: { value: 2, label: 'Low' }
      };

      const postMoodData = {
        mood: { value: 5, label: 'Joyful' },
        energy: { value: 4, label: 'High' }
      };

      // Set pre-mood data first
      act(() => {
        result.current.handlePreMoodComplete(preMoodData);
      });

      // Show post-mood tracker
      act(() => {
        result.current.showPostMood();
      });

      // Complete post-mood
      act(() => {
        result.current.handlePostMoodComplete(postMoodData);
      });

      expect(mockNavigate).toHaveBeenCalledWith(
        '/complete?session=test-session&duration=10',
        {
          state: {
            preMoodData,
            postMoodData,
            sessionMoodData: {
              preMood: 3,
              preEnergy: 2,
              postMood: 5,
              postEnergy: 4
            }
          }
        }
      );
    });

    test('handlePostMoodComplete should hide tracker after navigation', () => {
      const { result } = renderHook(() => useMoodTracking(defaultProps));

      act(() => {
        result.current.showPostMood();
      });

      expect(result.current.showPostMoodTracker).toBe(true);

      act(() => {
        result.current.handlePostMoodComplete({
          mood: { value: 4, label: 'Happy' },
          energy: { value: 3, label: 'Moderate' }
        });
      });

      expect(result.current.showPostMoodTracker).toBe(false);
    });

    test('handlePostMoodSkip should navigate without mood data', () => {
      const { result } = renderHook(() => useMoodTracking(defaultProps));

      act(() => {
        result.current.showPostMood();
        result.current.handlePostMoodSkip();
      });

      expect(mockNavigate).toHaveBeenCalledWith(
        '/complete?session=test-session&duration=10',
        {}
      );
    });
  });

  describe('Program context integration', () => {
    test('should include program context in navigation state when provided', () => {
      const programContext = {
        programId: 'prog-123',
        weekNumber: 2,
        dayNumber: 3
      };

      const { result } = renderHook(() =>
        useMoodTracking({
          ...defaultProps,
          programContext
        })
      );

      const postMoodData = {
        mood: { value: 4, label: 'Happy' },
        energy: { value: 3, label: 'Moderate' }
      };

      act(() => {
        result.current.showPostMood();
        result.current.handlePostMoodComplete(postMoodData);
      });

      expect(mockNavigate).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          state: expect.objectContaining({
            programContext
          })
        })
      );
    });

    test('should include program context when skipping post-mood', () => {
      const programContext = {
        programId: 'prog-456',
        weekNumber: 1,
        dayNumber: 1
      };

      const { result } = renderHook(() =>
        useMoodTracking({
          ...defaultProps,
          programContext
        })
      );

      act(() => {
        result.current.showPostMood();
        result.current.handlePostMoodSkip();
      });

      expect(mockNavigate).toHaveBeenCalledWith(
        expect.any(String),
        {
          state: { programContext }
        }
      );
    });
  });

  describe('Practice time calculation', () => {
    test('should use getFinalPracticeTime for duration in navigation', () => {
      const customGetTime = vi.fn(() => 1234); // 20.56 minutes
      const { result } = renderHook(() =>
        useMoodTracking({
          ...defaultProps,
          getFinalPracticeTime: customGetTime
        })
      );

      act(() => {
        result.current.showPostMood();
        result.current.handlePostMoodComplete({
          mood: { value: 4, label: 'Happy' },
          energy: { value: 3, label: 'Moderate' }
        });
      });

      expect(customGetTime).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith(
        '/complete?session=test-session&duration=21', // Rounded
        expect.any(Object)
      );
    });

    test('should round practice time to nearest minute', () => {
      const testCases = [
        { seconds: 599, expected: 10 },  // 9.98 minutes → 10
        { seconds: 600, expected: 10 },  // 10.00 minutes → 10
        { seconds: 630, expected: 11 },  // 10.5 minutes → 11
        { seconds: 659, expected: 11 },  // 10.98 minutes → 11
        { seconds: 60, expected: 1 }     // 1.00 minutes → 1
      ];

      testCases.forEach(({ seconds, expected }) => {
        mockNavigate.mockClear();
        const getFinalTime = vi.fn(() => seconds);

        const { result } = renderHook(() =>
          useMoodTracking({
            ...defaultProps,
            getFinalPracticeTime: getFinalTime
          })
        );

        act(() => {
          result.current.showPostMood();
          result.current.handlePostMoodSkip();
        });

        expect(mockNavigate).toHaveBeenCalledWith(
          `/complete?session=test-session&duration=${expected}`,
          expect.any(Object)
        );
      });
    });
  });

  describe('Edge cases', () => {
    test('should handle missing getFinalPracticeTime gracefully', () => {
      const { result } = renderHook(() =>
        useMoodTracking({
          sessionId: 'test',
          getFinalPracticeTime: undefined,
          programContext: null
        })
      );

      // Should not throw when calling methods
      expect(() => {
        act(() => {
          result.current.showPostMood();
        });
      }).not.toThrow();
    });

    test('should handle null mood data values', () => {
      const { result } = renderHook(() => useMoodTracking(defaultProps));

      const nullMoodData = {
        mood: null,
        energy: null
      };

      act(() => {
        result.current.handlePreMoodComplete(nullMoodData);
        result.current.showPostMood();
        result.current.handlePostMoodComplete(nullMoodData);
      });

      expect(mockNavigate).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          state: expect.objectContaining({
            sessionMoodData: {
              preMood: undefined,
              preEnergy: undefined,
              postMood: undefined,
              postEnergy: undefined
            }
          })
        })
      );
    });

    test('should handle completing post-mood without pre-mood data', () => {
      const { result } = renderHook(() => useMoodTracking(defaultProps));

      const postMoodData = {
        mood: { value: 4, label: 'Happy' },
        energy: { value: 3, label: 'Moderate' }
      };

      act(() => {
        result.current.showPostMood();
        result.current.handlePostMoodComplete(postMoodData);
      });

      expect(mockNavigate).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          state: expect.objectContaining({
            preMoodData: null,
            postMoodData,
            sessionMoodData: {
              preMood: undefined,
              preEnergy: undefined,
              postMood: 4,
              postEnergy: 3
            }
          })
        })
      );
    });
  });
});
